import { createHmac, timingSafeEqual } from 'node:crypto';
import { json, method, config, verifySession, db } from '../_lib.js';

export default async function handler(req,res){
 if(!method(req,res)||!config(res))return;
 const user=verifySession(req);
 if(!user){json(res,401,{error:'Authentication required.'});return;}
 if(!process.env.RAZORPAY_KEY_SECRET){json(res,503,{error:'Razorpay is not configured.'});return;}
 try{
  const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body||{};
  if(!razorpay_order_id||!razorpay_payment_id||!razorpay_signature){json(res,400,{error:'Missing payment verification fields.'});return;}
  const rows=await db('payment_orders?provider_order_id=eq.'+encodeURIComponent(razorpay_order_id)+'&user_id=eq.'+encodeURIComponent(user.sub)+'&select=id,status,amount_inr&limit=1');
  const order=rows[0];
  if(!order){json(res,404,{error:'Payment order not found for this account.'});return;}
  if(order.status==='captured'){json(res,200,{success:true,message:'Payment was already verified.'});return;}
  const expected=createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(razorpay_order_id+'|'+razorpay_payment_id).digest('hex');
  const a=Buffer.from(expected),b=Buffer.from(String(razorpay_signature));
  if(a.length!==b.length||!timingSafeEqual(a,b)){json(res,400,{error:'Payment signature verification failed.'});return;}
  const paymentResponse=await fetch('https://api.razorpay.com/v1/payments/'+encodeURIComponent(razorpay_payment_id),{headers:{Authorization:'Basic '+Buffer.from(process.env.RAZORPAY_KEY_ID+':'+process.env.RAZORPAY_KEY_SECRET).toString('base64')}});
  const payment=await paymentResponse.json();
  if(!paymentResponse.ok||payment.order_id!==razorpay_order_id||payment.status!=='captured'){json(res,400,{error:'Payment is not captured by Razorpay.'});return;}
  await db('payment_orders?provider_order_id=eq.'+encodeURIComponent(razorpay_order_id),{method:'PATCH',body:JSON.stringify({status:'captured',provider_payment_id:razorpay_payment_id,captured_at:new Date().toISOString()})});
  const result=await db('rpc/credit_crypto1_wallet',{method:'POST',body:JSON.stringify({p_user_id:user.sub,p_payment_order_id:order.id,p_amount_inr:order.amount_inr})});
  json(res,200,{success:true,message:'Payment verified and wallet balance credited.',wallet:result});
 }catch(error){json(res,500,{error:error.message||'Payment verification failed.'});}
}
