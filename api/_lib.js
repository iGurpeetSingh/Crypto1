import { createHmac, timingSafeEqual } from 'node:crypto';

export function json(res, status, data) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}
export function method(req, res, allowed='POST') {
  if (req.method !== allowed) { json(res, 405, { error: 'Method not allowed' }); return false; }
  return true;
}
export function config(res) {
  const required=['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','APP_SESSION_SECRET'];
  const missing=required.filter(key=>!process.env[key]);
  if(missing.length){json(res,503,{error:'Server authentication is not configured. Missing Vercel environment variables: '+missing.join(', ')});return false;}
  return true;
}
export async function db(path, options={}) {
  const base=process.env.SUPABASE_URL.replace(/\/$/,'');
  const response=await fetch(base+'/rest/v1/'+path,{
    ...options,
    headers:{
      apikey:process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization:'Bearer '+process.env.SUPABASE_SERVICE_ROLE_KEY,
      'Content-Type':'application/json',
      ...options.headers
    }
  });
  const text=await response.text();
  if(!response.ok) throw new Error('Database request failed ('+response.status+'): '+text.slice(0,240));
  return text?JSON.parse(text):null;
}
export function otpHash(email,purpose,otp){
 return createHmac('sha256',process.env.APP_SESSION_SECRET).update(email.toLowerCase()+':'+purpose+':'+otp).digest('hex');
}
export function safeEqual(a,b){
 const left=Buffer.from(String(a));const right=Buffer.from(String(b));
 return left.length===right.length&&timingSafeEqual(left,right);
}
export function createSession(profile){
 const payload=Buffer.from(JSON.stringify({sub:profile.id,email:profile.email,exp:Date.now()+7*24*60*60*1000})).toString('base64url');
 const signature=createHmac('sha256',process.env.APP_SESSION_SECRET).update(payload).digest('base64url');
 return payload+'.'+signature;
}
export function verifySession(req){
 const token=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');
 const [payload,signature]=token.split('.');
 if(!payload||!signature) return null;
 const expected=createHmac('sha256',process.env.APP_SESSION_SECRET||'').update(payload).digest('base64url');
 if(!safeEqual(signature,expected)) return null;
 try{const user=JSON.parse(Buffer.from(payload,'base64url').toString());return user.exp>Date.now()?user:null;}catch{return null;}
}
