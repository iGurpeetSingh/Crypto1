const SESSION_KEY='crypto1_session';
const USER_KEY='crypto1_demo_user';
const USERS_KEY='crypto1_demo_users';

export function createDemoSession({name,email,phone}){
 const cleanEmail=String(email||'').trim().toLowerCase();
 const users=JSON.parse(localStorage.getItem(USERS_KEY)||'{}');
 const existing=users[cleanEmail];
 const profile=existing||{
  id:'demo_'+Date.now(),
  name:String(name||'').trim(),
  fullName:String(name||'').trim(),
  email:cleanEmail,
  phone:String(phone||'').trim(),
  accountType:'DEMO',
  balance:500,
  createdAt:new Date().toISOString()
 };
 if(existing){
  profile.name=String(name||existing.name||'').trim();
  profile.fullName=profile.name;
  profile.phone=String(phone||existing.phone||'').trim();
 } 
 users[cleanEmail]=profile;
 localStorage.setItem(USERS_KEY,JSON.stringify(users));
 localStorage.setItem(USER_KEY,JSON.stringify(profile));
 localStorage.setItem(SESSION_KEY,'demo-session-'+profile.id);
 return profile;
}
export function getSessionToken(){return localStorage.getItem(SESSION_KEY)||'';}
export function hasDemoSession(){
 try {
  const token=getSessionToken();
  const profile=getStoredProfile();
  return Boolean(token && token.startsWith('demo-session-') && profile && profile.email && profile.name);
 } catch { return false; }
}
export function getStoredProfile(){
 try{return JSON.parse(localStorage.getItem(USER_KEY)||'null')}catch{return null;}
}
export function saveStoredProfile(profile){
 localStorage.setItem(USER_KEY,JSON.stringify(profile));
 if(profile?.email){
  const users=JSON.parse(localStorage.getItem(USERS_KEY)||'{}');
  users[String(profile.email).toLowerCase()]=profile;
  localStorage.setItem(USERS_KEY,JSON.stringify(users));
 }
}
export function logout(){
 localStorage.removeItem(SESSION_KEY);
 localStorage.removeItem(USER_KEY);
}
export {SESSION_KEY,USER_KEY};
