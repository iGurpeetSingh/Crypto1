import { createHmac, randomInt, randomUUID } from 'node:crypto';

const sendLimits = new Map();
const challengeState = new Map();
const respond = (res, status, data) => res.status(status).setHeader('Content-Type','application/json').send(JSON.stringify(data));
const sign = (value, secret) => createHmac('sha256', secret).update(value).digest('base64url');
const digest = (email, otp, secret) => createHmac('sha256', secret).update(email + ':' + otp).digest('hex');
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export default async function handler(req, res) {
  if (req.method !== 'POST') return respond(res,405,{error:'Method not allowed.'});
  const { BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME, OTP_SIGNING_SECRET } = process.env;
  if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL || !OTP_SIGNING_SECRET || OTP_SIGNING_SECRET.length < 32)
    return respond(res,503,{error:'Email OTP is not configured. Add Brevo and OTP environment variables in Vercel.'});
  const email = String(req.body?.email || '').trim().toLowerCase();
  const name = String(req.body?.name || '').trim().slice(0,80);
  if (!/^[^\s@]+@gmail\.com$/.test(email)) return respond(res,400,{error:'Enter a valid Gmail address.'});
  if (name.length < 2) return respond(res,400,{error:'Enter your full name.'});

  const now = Date.now();
  for (const [key,value] of sendLimits) if (now-value.startedAt > 3600000) sendLimits.delete(key);
  for (const [key,value] of challengeState) if (now-value.createdAt > 600000) challengeState.delete(key);
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const rateKey = ip + ':' + email;
  const limit = sendLimits.get(rateKey) || {startedAt:now,count:0,lastSentAt:0};
  if (limit.count >= 5) return respond(res,429,{error:'Too many OTP requests. Try again in one hour.'});
  if (now-limit.lastSentAt < 60000) return respond(res,429,{error:'Wait 60 seconds before requesting another OTP.'});

  const otp = String(randomInt(100000,1000000));
  const id = randomUUID();
  const exp = now + 300000;
  const payload = {id,email,digest:digest(email,otp,OTP_SIGNING_SECRET),exp};
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const challengeToken = encoded + '.' + sign(encoded,OTP_SIGNING_SECRET);
  const firstName = escapeHtml(name.split(/\s+/)[0]);
  const htmlContent = '<!doctype html><html><body style="margin:0;background:#0b1422;color:#eaf2ff;font-family:Arial,sans-serif;padding:32px"><div style="max-width:520px;margin:auto;background:#142238;border:1px solid #29415c;border-radius:16px;padding:28px"><h2 style="color:#48dfbd">CryptoDash verification</h2><p>Hello '+firstName+',</p><p>Your one-time verification code is:</p><div style="font-size:34px;letter-spacing:9px;font-weight:800;color:#fff;background:#0a1525;padding:18px;border-radius:10px;text-align:center">'+otp+'</div><p>This code expires in 5 minutes. Do not share it.</p><p style="color:#91a4bb;font-size:12px">If you did not request this code, ignore this email.</p></div></body></html>';
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email',{method:'POST',headers:{accept:'application/json','content-type':'application/json','api-key':BREVO_API_KEY},body:JSON.stringify({sender:{name:BREVO_SENDER_NAME||'CryptoDash',email:BREVO_SENDER_EMAIL},to:[{email,name}],subject:'Your CryptoDash verification code',htmlContent,textContent:'Your CryptoDash OTP is '+otp+'. It expires in 5 minutes. Do not share it.'})});
    if (!response.ok) { console.error('Brevo send failed:',response.status,(await response.text()).slice(0,400)); return respond(res,502,{error:'Brevo could not send the email. Check the verified sender and Brevo account.'}); }
    const result = await response.json();
    sendLimits.set(rateKey,{startedAt:limit.startedAt,count:limit.count+1,lastSentAt:now});
    challengeState.set(id,{createdAt:now,attempts:0,used:false});
    return respond(res,200,{challengeToken,expiresIn:300,resendAfter:60,messageId:result.messageId||null});
  } catch (error) { console.error('Brevo request error:',error); return respond(res,502,{error:'Could not connect to the email service.'}); }
}
