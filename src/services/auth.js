const SESSION_KEY='crypto1_session';
const USER_KEY='crypto1_demo_user';
const USERS_KEY='crypto1_demo_users';
const walletKey=email=>'crypto1_demo_exchange_v1:'+String(email||'').trim().toLowerCase();

function readUsers(){
 try { const value=JSON.parse(localStorage.getItem(USERS_KEY)||'{}'); return value&&typeof value==='object'?value:{}; }
 catch { return {}; }
}
function readWallet(key){
 try { return JSON.parse(localStorage.getItem(key)||'null'); } catch { return null; }
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

export function createDemoSession({name,email,phone='',accountId,pin}){
 const cleanEmail=String(email||'').trim().toLowerCase();
 const cleanName=String(name||'').trim();
 const cleanAccountId=String(accountId||'').trim();
 const cleanPin=String(pin||'').trim();
 if(cleanName.length<2) throw new Error('Please enter your full name.');
 if(!/^[^\\s@]+@gmail\\.com$/.test(cleanEmail)) throw new Error('Please enter a valid Gmail address ending in @gmail.com.');
 if(!/^\\d{8}$/.test(cleanAccountId)) throw new Error('Demo Account ID must be exactly 8 digits.');
 if(!/^\\d{8}$/.test(cleanPin)) throw new Error('Account PIN must be exactly 8 digits.');
 const users=readUsers();
 if(users[cleanEmail]) throw new Error('An account already exists with this Gmail. Choose Login to open it.');
 if(Object.values(users).some(user=>String(user.accountId)===cleanAccountId)) throw new Error('This Demo Account ID is already in use. Choose another one.');
 const profile={id:'demo_'+Date.now()+'_'+Math.random().toString(36).slice(2,8),name:cleanName,fullName:cleanName,email:cleanEmail,phone:String(phone||'').trim(),accountId:cleanAccountId,pin:cleanPin,role:'USER',accountType:'DEMO',createdAt:new Date().toISOString()};
 users[cleanEmail]=profile;
 localStorage.setItem(USERS_KEY,JSON.stringify(users));
 return openProfile(profile);
}

export function loginDemoSession({name,email,accountId,pin}){
 const cleanEmail=String(email||'').trim().toLowerCase();
 const cleanName=String(name||'').trim().toLowerCase();
 const cleanAccountId=String(accountId||'').trim();
 const cleanPin=String(pin||'').trim();
 const profile=readUsers()[cleanEmail];
 if(!profile) throw new Error('Account not found in this browser. Please check your Gmail or create an account.');
 if(String(profile.name||'').trim().toLowerCase()!==cleanName) throw new Error('Name does not match this account.');
 if(String(profile.accountId||'')!==cleanAccountId) throw new Error('Demo Account ID is incorrect.');
 if(String(profile.pin||'')!==cleanPin) throw new Error('Incorrect Account PIN. Please try again.');
 return openProfile(profile);
}

export function getSessionToken(){return localStorage.getItem(SESSION_KEY)||'';}
export function hasDemoSession(){
 try { const token=getSessionToken(); const profile=getStoredProfile(); return Boolean(token&&token.startsWith('demo-session-')&&profile?.email&&profile?.name&&readUsers()[profile.email]); }
 catch { return false; }
}
export function getStoredProfile(){try{return JSON.parse(localStorage.getItem(USER_KEY)||'null')}catch{return null;}}
export function saveStoredProfile(profile){
 localStorage.setItem(USER_KEY,JSON.stringify(profile));
 if(profile?.email){const users=readUsers();users[String(profile.email).trim().toLowerCase()]=profile;localStorage.setItem(USERS_KEY,JSON.stringify(users));}
}
export function logout(){localStorage.removeItem(SESSION_KEY);localStorage.removeItem(USER_KEY);}
export {SESSION_KEY,USER_KEY};
