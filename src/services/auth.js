const SESSION_KEY='crypto1_session';
const USER_KEY='crypto1_demo_user';
const USERS_KEY='crypto1_demo_users';
const walletKey=email=>'crypto1_demo_exchange_v1:'+String(email||'').trim().toLowerCase();
function readUsers(){try{const v=JSON.parse(localStorage.getItem(USERS_KEY)||'{}');return v&&typeof v==='object'?v:{}}catch{return {}}}
function readWallet(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
function randomDigits(length){
 const values=new Uint32Array(length);
 if(globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(values);
 else for(let i=0;i<length;i++) values[i]=Math.floor(Math.random()*0xffffffff);
 return Array.from(values,v=>String(v%10)).join('');
}
function uniqueAccountId(users){
 let id; do{id=randomDigits(10)}while(Object.values(users).some(u=>String(u.accountId)===id));
 return id;
}
function openProfile(profile){
 const key=walletKey(profile.email);
 let wallet=readWallet(key);
 if(!wallet){
  const createdAt=new Date().toISOString();
  wallet={cash:500,funding:0,holdings:[],orders:[],pendingOrders:[],transactions:[{id:'TX-'+Date.now(),type:'DEPOSIT',description:'Welcome $500 demo funds',amount:500,createdAt}],settings:{theme:'pink-glass',accent:'#FF5CA8',currency:'USD',locale:'en-US',tableDensity:'normal'},walletVersion:2,fundingClaimedAt:createdAt};
  localStorage.setItem(key,JSON.stringify(wallet));
 }
 localStorage.setItem('crypto1_active_wallet_key',key);
 localStorage.setItem(USER_KEY,JSON.stringify(profile));
 localStorage.setItem(SESSION_KEY,'demo-session-'+profile.id);
 window.dispatchEvent(new CustomEvent('crypto1:account-ready',{detail:{walletKey:key,wallet,profile}}));
 return profile;
}
function validateIdentity(name,email){
 const n=String(name||'').trim(),e=String(email||'').trim().toLowerCase();
 if(n.length<2) throw new Error('Please enter your full name.');
 if(!/^[^\s@]+@gmail\.com$/.test(e)) throw new Error('Please enter a valid Gmail address ending in @gmail.com.');
 return {name:n,email:e};
}
// First visit: name + Gmail creates account and generates Account ID + PIN.
// Returning visit: the generated Account ID and PIN are required to reopen the saved account.
export function enterDemoAccount({name,email,accountId='',pin=''}){
 const identity=validateIdentity(name,email);
 const id=String(accountId||'').trim(),secret=String(pin||'').trim();
 const users=readUsers(),existing=users[identity.email];
 if(existing){
  // Existing records from the earlier broken onboarding may never have reached
  // the dashboard where the generated credentials are shown. Grant one first
  // access without credentials, then require ID + PIN on every later login.
  if(existing.firstAccessCompleted!==true){
   if(String(existing.name||'').trim().toLowerCase()!==identity.name.toLowerCase()) throw new Error('Name does not match this account.');
   const firstAccessProfile={...existing,firstAccessCompleted:true};
   users[identity.email]=firstAccessProfile;
   localStorage.setItem(USERS_KEY,JSON.stringify(users));
   return {profile:openProfile(firstAccessProfile),created:false,firstAccess:true};
  }
  if(!id&&!secret) throw new Error('Welcome back. Enter your saved Demo Account ID and 8-digit PIN to reopen your account.');
  if(!/^\d{10}$/.test(id)) throw new Error('Enter your saved 10-digit Demo Account ID.');
  if(!/^\d{8}$/.test(secret)) throw new Error('Enter your saved 8-digit Account PIN.');
  if(String(existing.name||'').trim().toLowerCase()!==identity.name.toLowerCase()) throw new Error('Name does not match this account.');
  if(String(existing.accountId)!==id) throw new Error('Demo Account ID is incorrect.');
  if(String(existing.pin)!==secret) throw new Error('Incorrect Account PIN. Please try again.');
  return {profile:openProfile(existing),created:false};
 }
 if(id||secret) throw new Error('No account was found for this Gmail. Leave Account ID and PIN empty to create a new demo account.');
 const profile={id:'demo_'+Date.now()+'_'+Math.random().toString(36).slice(2,8),name:identity.name,fullName:identity.name,email:identity.email,accountId:uniqueAccountId(users),pin:randomDigits(8),firstAccessCompleted:true,role:'USER',accountType:'DEMO',createdAt:new Date().toISOString()};
 users[identity.email]=profile;
 localStorage.setItem(USERS_KEY,JSON.stringify(users));
 return {profile:openProfile(profile),created:true};
}
export function createDemoSession({name,email}){return enterDemoAccount({name,email}).profile}
export function loginDemoSession(details){return enterDemoAccount(details).profile}
export function getSessionToken(){return localStorage.getItem(SESSION_KEY)||''}
export function hasDemoSession(){try{const token=getSessionToken(),p=getStoredProfile();return Boolean(token&&token.startsWith('demo-session-')&&p?.email&&p?.name&&readUsers()[p.email])}catch{return false}}
export function getStoredProfile(){try{return JSON.parse(localStorage.getItem(USER_KEY)||'null')}catch{return null}}
export function saveStoredProfile(profile){localStorage.setItem(USER_KEY,JSON.stringify(profile));if(profile?.email){const users=readUsers();users[String(profile.email).trim().toLowerCase()]=profile;localStorage.setItem(USERS_KEY,JSON.stringify(users))}}
export function logout(){localStorage.removeItem(SESSION_KEY);localStorage.removeItem(USER_KEY)}
export {SESSION_KEY,USER_KEY};
