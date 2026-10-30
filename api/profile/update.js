import { json, method, config, verifySession, db } from '../_lib.js';
export default async function handler(req,res){
 if(!method(req,res)||!config(res))return;
 const user=verifySession(req);if(!user){json(res,401,{error:'Sign in required.'});return;}
 try{const fullName=String(req.body?.fullName||'').trim();if(fullName.length<2||fullName.length>80){json(res,400,{error:'Name must be between 2 and 80 characters.'});return;}const rows=await db('profiles?id=eq.'+encodeURIComponent(user.sub),{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({full_name:fullName})});if(!rows.length){json(res,404,{error:'Profile not found.'});return;}const p=rows[0];json(res,200,{success:true,profile:{id:p.id,email:p.email,name:p.full_name,createdAt:p.created_at,balanceInr:Number(p.balance_inr||0)}});}catch(e){json(res,500,{error:e.message||'Could not update profile.'});}
}
