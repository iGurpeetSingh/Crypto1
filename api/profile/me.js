import { json, method, config, verifySession, db } from '../_lib.js';
export default async function handler(req,res){
 if(!method(req,res,'GET')||!config(res))return;
 const user=verifySession(req);if(!user){json(res,401,{error:'Sign in required.'});return;}
 try{const rows=await db('profiles?id=eq.'+encodeURIComponent(user.sub)+'&select=id,email,full_name,created_at,balance_inr&limit=1');if(!rows.length){json(res,404,{error:'Profile not found.'});return;}const p=rows[0];json(res,200,{profile:{id:p.id,email:p.email,name:p.full_name,createdAt:p.created_at,balanceInr:Number(p.balance_inr||0)}});}catch(e){json(res,500,{error:e.message||'Could not load profile.'});}
}
