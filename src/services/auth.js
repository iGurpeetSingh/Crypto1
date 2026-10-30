const SESSION_KEY='crypto1_session';
const USER_KEY='crypto1_demo_user';

async function post(path,payload){
 const response=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
 const result=await response.json().catch(()=>({}));
 if(!response.ok)throw new Error(result.error||'Request failed ('+response.status+')');
 return result;
}
export async function requestEmailOtp(payload){return post('/api/auth/request-otp',payload);}
export async function verifyEmailOtp(payload){
 const result=await post('/api/auth/verify-otp',payload);
 localStorage.setItem(SESSION_KEY,result.token);
 localStorage.setItem(USER_KEY,JSON.stringify(result.profile));
 return result;
}
export function getSessionToken(){return localStorage.getItem(SESSION_KEY)||'';}
export function getStoredProfile(){
 try{return JSON.parse(localStorage.getItem(USER_KEY)||'null')}catch{return null;}
}
export function saveStoredProfile(profile){localStorage.setItem(USER_KEY,JSON.stringify(profile));}
export function logout(){localStorage.removeItem(SESSION_KEY);localStorage.removeItem(USER_KEY);}
export {SESSION_KEY,USER_KEY};
