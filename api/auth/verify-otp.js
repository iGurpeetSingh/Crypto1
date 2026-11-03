import { json, method, config, db, otpHash, safeEqual } from '../_lib.js';

export default async function handler(req,res){
 if(!method(req,res)||!config(res))return;
 try{
  const email=String(req.body?.email||'').trim().toLowerCase();
  const otp=String(req.body?.otp||'').trim();
  if(!/^[^\s@]+@gmail\.com$/.test(email)||!/^\d{6}$/.test(otp)){json(res,400,{error:'Enter your Gmail and the 6-digit OTP.'});return;}
  const purpose='login';
  const rows=await db('auth_otps?email=eq.'+encodeURIComponent(email)+'&purpose=eq.'+purpose+'&select=email,purpose,otp_hash,expires_at,attempts&limit=1');
  const record=rows[0];
  if(!record||new Date(record.expires_at).getTime()<Date.now()){json(res,410,{error:'OTP is missing or expired. Request a new code.'});return;}
  if(Number(record.attempts||0)>=5){json(res,429,{error:'Too many incorrect attempts. Request a new OTP.'});return;}
  const valid=safeEqual(record.otp_hash,otpHash(email,purpose,otp));
  if(!valid){
   await db('auth_otps?email=eq.'+encodeURIComponent(email)+'&purpose=eq.'+purpose,{method:'PATCH',body:JSON.stringify({attempts:Number(record.attempts||0)+1})});
   json(res,400,{error:'Incorrect OTP. Please check your Gmail and try again.'});return;
  }
  await db('auth_otps?email=eq.'+encodeURIComponent(email)+'&purpose=eq.'+purpose,{method:'DELETE'});
  json(res,200,{verified:true,email});
 }catch(error){json(res,500,{error:error.message||'Could not verify OTP.'});}
}
