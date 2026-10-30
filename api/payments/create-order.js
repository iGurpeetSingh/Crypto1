import { json, method, config, verifySession, db } from '../_lib.js';

export default async function handler(req,res){
 if(!method(req,res)||!config(res))return;
 const user=verifySession(req);
 if(!user){json(res,401,{error:'Sign in with email OTP before making a payment.'});return;}
 if(!process.env.RAZORPAY_KEY_ID||!process.env.RAZORPAY_KEY_SECRET){json(res,503,{error:'Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to Vercel environment variables.'});return;}
 try{
  const amount=Number(req.body?.amountInr);
  if(!Number.isInteger(amount)||amount<100||amount>500000){json(res,400,{error:'Enter a whole INR amount between ₹100 and ₹5,00,000.'});return;}
  const response=await fetch('https://api.razorpay.com/v1/orders',{
   method:'POST',headers:{Authorization:'Basic '+Buffer.from(process.env.RAZORPAY_KEY_ID+':'+process.env.RAZORPAY_KEY_SECRET).toString('base64'),'Content-Type':'application/json'},
   body:JSON.stringify({amount:amount*100,currency:'INR',receipt:'crypto1_'+Date.now(),notes:{user_id:user.sub,email:user.email}})
  });
  const order=await response.json();
  if(!response.ok){json(res,502,{error:order.error?.description||'Payment provider failed to create an order.'});return;}
  await db('payment_orders',{method:'POST',body:JSON.stringify({provider:'razorpay',provider_order_id:order.id,user_id:user.sub,email:user.email,amount_inr:amount,status:'created',created_at:new Date().toISOString()})});
  json(res,200,{keyId:process.env.RAZORPAY_KEY_ID,orderId:order.id,amount:order.amount,currency:order.currency});
 }catch(error){json(res,500,{error:error.message||'Could not create payment order.'});}
}
