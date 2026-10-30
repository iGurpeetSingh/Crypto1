import { randomInt } from 'node:crypto';
import { json, method, config, db, otpHash } from '../_lib.js';

export default async function handler(req,res){
 if(!method(req,res)||!config(res))return;
 if(!process.env.RESEND_API_KEY||!process.env.EMAIL_FROM){json(res,503,{error:'Email OTP is not configured. Add RESEND_API_KEY and EMAIL_FROM in Vercel environment variables.'});return;}
 try{
  const {email,fullName='',purpose='login'}=req.body||{};
  const normalized=String(email||'').trim().toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)){json(res,400,{error:'Enter a valid email address.'});return;}
  if(!['login','register'].includes(purpose)){json(res,400,{error:'Invalid OTP purpose.'});return;}
  const existing=await db('profiles?email=eq.'+encodeURIComponent(normalized)+'&select=id,email,full_name&limit=1');
  if(purpose==='register'&&existing.length){json(res,409,{error:'An account with this email already exists. Please sign in.'});return;}
  if(purpose==='login'&&!existing.length){json(res,404,{error:'No account found with this email. Please create an account first.'});return;}
  if(purpose==='register'&&String(fullName).trim().length<2){json(res,400,{error:'Enter your full name.'});return;}
  const otp=String(randomInt(100000,1000000));
  const expiresAt=new Date(Date.now()+5*60*1000).toISOString();
  await db('auth_otps?on_conflict=email,purpose',{
   method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},
   body:JSON.stringify({email:normalized,purpose,otp_hash:otpHash(normalized,purpose,otp),expires_at:expiresAt,full_name:String(fullName).trim(),attempts:0,created_at:new Date().toISOString()})
  });
  const sent=await fetch('https://api.resend.com/emails',{
   method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},
   body:JSON.stringify({from:process.env.EMAIL_FROM,to:[normalized],subject:'Your CryptoDash verification code',text:'Your CryptoDash verification code is '+otp+'. It expires in 5 minutes. Do not share this code with anyone.',html:'<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;color:#172033"><h2>CryptoDash verification</h2><p>Your one-time verification code is:</p><div style="font-size:32px;font-weight:700;letter-spacing:8px;padding:18px;background:#eef4ff;border-radius:12px">'+otp+'</div><p>This code expires in 5 minutes. Never share it with anyone.</p></div>'})
  });
  if(!sent.ok){const detail=await sent.text();json(res,502,{error:'Email provider could not send the OTP. Check verified sender/domain configuration.',detail:detail.slice(0,240)});return;}
  json(res,200,{success:true,message:'Verification code sent to your email. It expires in 5 minutes.'});
 }catch(error){json(res,500,{error:error.message||'Could not send verification code.'});}
}
