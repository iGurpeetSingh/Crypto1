import { json, method, config, db, otpHash, safeEqual, createSession } from '../_lib.js';

export default async function handler(req,res){
 if(!method(req,res)||!config(res))return;
 try{
  const normalized=String(req.body?.email||'').trim().toLowerCase();
  const purpose=String(req.body?.purpose||'login');
  const otp=String(req.body?.otp||'').trim();
  if(!normalized||!['login','register'].includes(purpose)||!/^\d{6}$/.test(otp)){json(res,400,{error:'Enter your email and 6-digit verification code.'});return;}
  const rows=await db('auth_otps?email=eq.'+encodeURIComponent(normalized)+'&purpose=eq.'+purpose+'&select=email,purpose,otp_hash,expires_at,full_name,attempts&limit=1');
  const record=rows[0];
  if(!record||new Date(record.expires_at).getTime()<Date.now()){json(res,400,{error:'Code is missing or expired. Request a new one.'});return;}
  if(Number(record.attempts||0)>=5){json(res,429,{error:'Too many incorrect attempts. Request a new code.'});return;}
  const valid=safeEqual(record.otp_hash,otpHash(normalized,purpose,otp));
  if(!valid){
   await db('auth_otps?email=eq.'+encodeURIComponent(normalized)+'&purpose=eq.'+purpose,{method:'PATCH',body:JSON.stringify({attempts:Number(record.attempts||0)+1})});
   json(res,400,{error:'Incorrect verification code.'});return;
  }
  let profile;
  if(purpose==='register'){
   const created=await db('profiles',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({email:normalized,full_name:record.full_name,email_verified_at:new Date().toISOString(),created_at:new Date().toISOString(),balance_inr:0})});
   profile=created[0];
  }else{
   const existing=await db('profiles?email=eq.'+encodeURIComponent(normalized)+'&select=id,email,full_name,created_at,balance_inr&limit=1');
   profile=existing[0];
   if(!profile){json(res,404,{error:'Account not found.'});return;}
   await db('profiles?id=eq.'+encodeURIComponent(profile.id),{method:'PATCH',body:JSON.stringify({last_login_at:new Date().toISOString()})});
  }
  await db('auth_otps?email=eq.'+encodeURIComponent(normalized)+'&purpose=eq.'+purpose,{method:'DELETE'});
  json(res,200,{success:true,token:createSession(profile),profile:{id:profile.id,email:profile.email,name:profile.full_name,createdAt:profile.created_at,balanceInr:Number(profile.balance_inr||0)}});
 }catch(error){json(res,500,{error:error.message||'Could not verify code.'});}
}
