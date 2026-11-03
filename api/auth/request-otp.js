import { randomInt } from 'node:crypto';
import { json, method, config, db, otpHash } from '../_lib.js';

export default async function handler(req,res){
 if(!method(req,res)||!config(res))return;
 if(!process.env.BREVO_API_KEY||!process.env.BREVO_SENDER_EMAIL){json(res,503,{error:'Brevo OTP is not configured. Add BREVO_API_KEY and BREVO_SENDER_EMAIL in Vercel.'});return;}
 try{
  const {email,fullName=''}=req.body||{};
  const normalized=String(email||'').trim().toLowerCase();
  const name=String(fullName||'').trim().slice(0,80);
  if(!/^[^\s@]+@gmail\.com$/.test(normalized)){json(res,400,{error:'Enter a valid Gmail address ending in @gmail.com.'});return;}
  if(name.length<2){json(res,400,{error:'Enter your full name.'});return;}
  const purpose='login';
  const previous=await db('auth_otps?email=eq.'+encodeURIComponent(normalized)+'&purpose=eq.'+purpose+'&select=created_at&limit=1');
  if(previous.length&&Date.now()-new Date(previous[0].created_at).getTime()<60000){json(res,429,{error:'Please wait 60 seconds before requesting another OTP.'});return;}
  const otp=String(randomInt(100000,1000000));
  const expiresAt=new Date(Date.now()+5*60*1000).toISOString();
  await db('auth_otps?on_conflict=email,purpose',{
   method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},
   body:JSON.stringify({email:normalized,purpose,otp_hash:otpHash(normalized,purpose,otp),expires_at:expiresAt,full_name:name,attempts:0,created_at:new Date().toISOString()})
  });
  const html='<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;color:#172033"><h2>CryptoDash verification</h2><p>Hello '+name.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))+',</p><p>Your one-time verification code is:</p><div style="font-size:32px;font-weight:700;letter-spacing:8px;padding:18px;background:#eef4ff;border-radius:12px">'+otp+'</div><p>This code expires in 5 minutes. Never share it with anyone.</p></div>';
  const sent=await fetch('https://api.brevo.com/v3/smtp/email',{
   method:'POST',headers:{'api-key':process.env.BREVO_API_KEY,'Content-Type':'application/json',accept:'application/json'},
   body:JSON.stringify({sender:{name:process.env.BREVO_SENDER_NAME||'CryptoDash',email:process.env.BREVO_SENDER_EMAIL},to:[{email:normalized,name}],subject:'Your CryptoDash verification code',htmlContent:html,textContent:'Your CryptoDash OTP is '+otp+'. It expires in 5 minutes. Do not share it.'})
  });
  if(!sent.ok){const detail=await sent.text();console.error('Brevo send error:',sent.status,detail.slice(0,300));json(res,502,{error:'Brevo could not send the OTP. Check your verified sender/domain and account status.'});return;}
  const result=await sent.json();
  json(res,200,{success:true,message:'Verification code sent. It expires in 5 minutes.',messageId:result.messageId||null});
 }catch(error){json(res,500,{error:error.message||'Could not send verification code.'});}
}
