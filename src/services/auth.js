const SESSION_KEY='crypto1_session';
const USER_KEY='crypto1_demo_user';
const USERS_KEY='crypto1_demo_users';
const walletKey=email=>'crypto1_demo_exchange_v1:'+String(email||'').toLowerCase();

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
 const key=walletKey(cleanEmail);
 let wallet; try { wallet=JSON.parse(localStorage.getItem(key)||'null'); } catch { wallet=null; }
 if(!wallet){ const createdAt=new Date().toISOString(); wallet={cash:500,funding:0,holdings:[],orders:[],pendingOrders:[],transactions:[{id:'TX-'+Date.now(),type:'DEPOSIT',description:'Welcome $500 demo funds',amount:500,createdAt}],settings:{theme:'pink-glass',accent:'#FF5CA8',currency:'USD',locale:'en-US',tableDensity:'normal'},walletVersion:2,fundingClaimedAt:createdAt}; localStorage.setItem(key,JSON.stringify(wallet)); }
 localStorage.setItem('crypto1_active_wallet_key',key);
 localStorage.setItem(USERS_KEY,JSON.stringify(users));
 localStorage.setItem(USER_KEY,JSON.stringify(profile));
 localStorage.setItem(SESSION_KEY,'demo-session-'+profile.id);
 window.dispatchEvent(new CustomEvent('crypto1:account-ready',{detail:{walletKey:key,wallet}}));
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
