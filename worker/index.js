const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type,Authorization'}});
const emailValid=e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const randomCode=()=>String(crypto.getRandomValues(new Uint32Array(1))[0]%900000+100000);
const hex=b=>Array.from(new Uint8Array(b),x=>x.toString(16).padStart(2,'0')).join('');
async function digest(value){return hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)));}
async function sign(value,secret){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return hex(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(value)));}
async function body(req){try{return await req.json()}catch{return {}}}
function userFromToken(req){return req.headers.get('authorization')?.replace(/^Bearer\s+/i,'')||'';}
async function currentUser(req,env){const token=userFromToken(req);if(!token)return null;const row=await env.DB.prepare('SELECT u.id,u.email,u.full_name,u.created_at FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?').bind(await digest(token),Date.now()).first();return row||null;}
async function issueSession(user,env){const token=crypto.randomUUID()+'.'+crypto.randomUUID();await env.DB.prepare('INSERT INTO sessions(token_hash,user_id,expires_at,created_at) VALUES(?,?,?,?)').bind(await digest(token),user.id,Date.now()+7*86400000,Date.now()).run();return token;}
async function route(req,env){
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':req.headers.get('Origin')||'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type,Authorization','Access-Control-Max-Age':'86400'}});
 const url=new URL(req.url),path=url.pathname,method=req.method;
 if(path==='/api/health'&&method==='GET')return json({ok:true,service:'crypto1-worker',database:'D1'});
 if(path==='/api/auth/request-otp'&&method==='POST'){
  const b=await body(req),email=String(b.email||'').trim().toLowerCase(),purpose=String(b.purpose||'login'),fullName=String(b.fullName||'').trim();
  if(!emailValid(email)||!['login','register'].includes(purpose))return json({error:'Enter a valid email and OTP purpose.'},400);
  if(purpose==='register'&&fullName.length<2)return json({error:'Enter your full name.'},400);
  const user=await env.DB.prepare('SELECT id FROM users WHERE email=?').bind(email).first();
  if(purpose==='register'&&user)return json({error:'Account already exists. Please sign in.'},409);
  if(purpose==='login'&&!user)return json({error:'Account not found. Please register first.'},404);
  const previous=await env.DB.prepare('SELECT created_at FROM email_otps WHERE email=? AND purpose=?').bind(email,purpose).first();
  if(previous&&Date.now()-previous.created_at<60000)return json({error:'Wait 60 seconds before requesting another code.'},429);
  const code=randomCode(),salt=crypto.randomUUID(),codeHash=await digest(email+':'+purpose+':'+salt+':'+code);
  await env.DB.prepare('INSERT INTO email_otps(email,purpose,code_hash,salt,full_name,expires_at,created_at,attempts) VALUES(?,?,?,?,?,?,?,0) ON CONFLICT(email,purpose) DO UPDATE SET code_hash=excluded.code_hash,salt=excluded.salt,full_name=excluded.full_name,expires_at=excluded.expires_at,created_at=excluded.created_at,attempts=0').bind(email,purpose,codeHash,salt,fullName,Date.now()+300000,Date.now()).run();
  if(env.ENVIRONMENT==='production'||env.ALLOW_DEV_OTP!=='true')return json({error:'Email delivery is not configured. OTP sending requires an email provider. No code was sent.'},503);
  return json({success:true,devOtp:code,message:'Development-only OTP. This code is never returned in production.'});
 }
 if(path==='/api/auth/verify-otp'&&method==='POST'){
  const b=await body(req),email=String(b.email||'').trim().toLowerCase(),purpose=String(b.purpose||'login'),code=String(b.otp||'').trim();
  if(!emailValid(email)||!['login','register'].includes(purpose)||!/^\d{6}$/.test(code))return json({error:'Enter email and 6-digit code.'},400);
  const row=await env.DB.prepare('SELECT * FROM email_otps WHERE email=? AND purpose=?').bind(email,purpose).first();
  if(!row||row.expires_at<Date.now())return json({error:'Code expired. Request another code.'},400);
  if(row.attempts>=5)return json({error:'Too many attempts. Request another code.'},429);
  const valid=(await digest(email+':'+purpose+':'+row.salt+':'+code))===row.code_hash;
  if(!valid){await env.DB.prepare('UPDATE email_otps SET attempts=attempts+1 WHERE email=? AND purpose=?').bind(email,purpose).run();return json({error:'Incorrect verification code.'},400);}
  let user=await env.DB.prepare('SELECT id,email,full_name,created_at FROM users WHERE email=?').bind(email).first();
  if(purpose==='register'){
   if(user)return json({error:'Account already exists.'},409);
   const id=crypto.randomUUID(),now=Date.now();
   await env.DB.prepare('INSERT INTO users(id,email,full_name,created_at,email_verified_at) VALUES(?,?,?,?,?)').bind(id,email,row.full_name,now,now).run();
   await env.DB.prepare('INSERT INTO demo_wallets(user_id,usd_balance,inr_balance,updated_at) VALUES(?,500,0,?)').bind(id,now).run();
   user={id,email,full_name:row.full_name,created_at:now};
  }else if(!user)return json({error:'Account not found.'},404);
  await env.DB.prepare('DELETE FROM email_otps WHERE email=? AND purpose=?').bind(email,purpose).run();
  const token=await issueSession(user,env),wallet=await env.DB.prepare('SELECT usd_balance,inr_balance FROM demo_wallets WHERE user_id=?').bind(user.id).first();
  return json({success:true,token,profile:{id:user.id,email:user.email,name:user.full_name,createdAt:user.created_at,balanceInr:wallet?.inr_balance||0,balanceUsd:wallet?.usd_balance||0}});
 }
 if(path==='/api/profile/me'&&method==='GET'){
  const user=await currentUser(req,env);if(!user)return json({error:'Sign in required.'},401);
  const wallet=await env.DB.prepare('SELECT usd_balance,inr_balance FROM demo_wallets WHERE user_id=?').bind(user.id).first();
  return json({profile:{id:user.id,email:user.email,name:user.full_name,createdAt:user.created_at,balanceInr:wallet?.inr_balance||0,balanceUsd:wallet?.usd_balance||0}});
 }
 if(path==='/api/profile/update'&&method==='POST'){
  const user=await currentUser(req,env);if(!user)return json({error:'Sign in required.'},401);
  const name=String((await body(req)).fullName||'').trim();if(name.length<2||name.length>80)return json({error:'Name must be 2–80 characters.'},400);
  await env.DB.prepare('UPDATE users SET full_name=? WHERE id=?').bind(name,user.id).run();return json({success:true,profile:{id:user.id,email:user.email,name,createdAt:user.created_at,balanceInr:0}});
 }
 if(path==='/api/payments/create-order'&&method==='POST')return json({error:'Real payments are disabled: no payment gateway or merchant credentials are configured. Use the simulated demo wallet.'},501);
 if(path==='/api/payments/verify'&&method==='POST')return json({error:'Payment verification is unavailable until a payment provider is configured.'},501);
 if(path==='/api/auth/logout'&&method==='POST'){
  const token=userFromToken(req);if(token)await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await digest(token)).run();return json({success:true});
 }
 if(path==='/api/demo/wallet'&&method==='GET'){
  const user=await currentUser(req,env);if(!user)return json({error:'Sign in required.'},401);
  const wallet=await env.DB.prepare('SELECT usd_balance,inr_balance FROM demo_wallets WHERE user_id=?').bind(user.id).first();return json({wallet});
 }
 if(path==='/api/trading/wallet'&&method==='GET'){
  const user=await currentUser(req,env);if(!user)return json({error:'Sign in required.'},401);
  const wallet=await env.DB.prepare('SELECT usd_balance,inr_balance FROM demo_wallets WHERE user_id=?').bind(user.id).first();
  return json({wallet:{usdBalance:wallet?.usd_balance||0,inrBalance:wallet?.inr_balance||0}});
 }
 if(path==='/api/trading/positions'&&method==='GET'){
  const user=await currentUser(req,env);if(!user)return json({error:'Sign in required.'},401);
  const rows=await env.DB.prepare('SELECT symbol,quantity,avg_price AS avgPrice FROM demo_positions WHERE user_id=? AND quantity>0 ORDER BY symbol').bind(user.id).all();
  return json({positions:rows.results||[]});
 }
 if(path==='/api/trading/orders'&&method==='GET'){
  const user=await currentUser(req,env);if(!user)return json({error:'Sign in required.'},401);
  const rows=await env.DB.prepare('SELECT id,symbol,side,quantity,price,fee,created_at AS createdAt FROM demo_trades WHERE user_id=? ORDER BY created_at DESC LIMIT 100').bind(user.id).all();
  return json({orders:rows.results||[]});
 }
 if(path==='/api/trading/orders'&&method==='POST'){
  const user=await currentUser(req,env);if(!user)return json({error:'Sign in required.'},401);
  const b=await body(req),side=String(b.side||'').toUpperCase(),symbol=String(b.symbol||'').toUpperCase(),quantity=Number(b.quantity),price=Number(b.price);
  if(!['BUY','SELL'].includes(side)||!/^[A-Z0-9]{2,12}$/.test(symbol)||!Number.isFinite(quantity)||quantity<=0||!Number.isFinite(price)||price<=0)return json({error:'Enter a valid market, side, quantity and execution price.'},400);
  const fee=quantity*price*.001,total=quantity*price+(side==='BUY'?fee:-fee);
  const wallet=await env.DB.prepare('SELECT usd_balance FROM demo_wallets WHERE user_id=?').bind(user.id).first();
  const position=await env.DB.prepare('SELECT quantity,avg_price FROM demo_positions WHERE user_id=? AND symbol=?').bind(user.id,symbol).first();
  if(side==='BUY'&&(!wallet||wallet.usd_balance<total))return json({error:'Insufficient demo USD balance.'},400);
  if(side==='SELL'&&(!position||position.quantity+1e-10<quantity))return json({error:'Insufficient crypto quantity to sell.'},400);
  const id=crypto.randomUUID(),createdAt=Date.now();
  const statements=[
   env.DB.prepare('INSERT INTO demo_trades(id,user_id,symbol,side,quantity,price,fee,created_at) VALUES(?,?,?,?,?,?,?,?)').bind(id,user.id,symbol,side,quantity,price,fee,createdAt),
   side==='BUY'
    ?env.DB.prepare('UPDATE demo_wallets SET usd_balance=usd_balance-?,updated_at=? WHERE user_id=?').bind(total,createdAt,user.id)
    :env.DB.prepare('UPDATE demo_wallets SET usd_balance=usd_balance+?,updated_at=? WHERE user_id=?').bind(quantity*price-fee,createdAt,user.id),
   side==='BUY'
    ?env.DB.prepare('INSERT INTO demo_positions(user_id,symbol,quantity,avg_price) VALUES(?,?,?,?) ON CONFLICT(user_id,symbol) DO UPDATE SET avg_price=((demo_positions.quantity*demo_positions.avg_price)+(excluded.quantity*excluded.avg_price))/(demo_positions.quantity+excluded.quantity),quantity=demo_positions.quantity+excluded.quantity').bind(user.id,symbol,quantity,price)
    :env.DB.prepare('UPDATE demo_positions SET quantity=MAX(0,quantity-?) WHERE user_id=? AND symbol=?').bind(quantity,user.id,symbol)
  ];
  await env.DB.batch(statements);
  return json({success:true,order:{id,symbol,side,quantity,price,fee,status:'FILLED',createdAt}},201);
 }
 return json({error:'Not found'},404);
}
export default {async fetch(request,env){try{return await route(request,env);}catch(error){return json({error:'Worker request failed',detail:env.ENVIRONMENT==='development'?String(error):undefined},500);}}};
