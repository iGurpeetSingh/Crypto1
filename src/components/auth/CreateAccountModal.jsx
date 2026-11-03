import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {createDemoSession,loginDemoSession} from '../../services/auth';
import './CreateAccountModal.css';
import {playWelcomeVoice} from '../../services/welcomeVoice';

function hasSavedAccounts(){
 try { return Object.keys(JSON.parse(localStorage.getItem('crypto1_demo_users')||'{}')).length>0; }
 catch { return false; }
}

export default function CreateAccountModal(){
 const [mode,setMode]=useState(()=>hasSavedAccounts()?'login':'create');
 const [name,setName]=useState('');
 const [email,setEmail]=useState('');
 const [accountId,setAccountId]=useState('');
 const [pin,setPin]=useState('');
 const [confirmPin,setConfirmPin]=useState('');
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const navigate=useNavigate();

 const submit=event=>{
  event.preventDefault();setError('');
  if(name.trim().length<2){setError('Please enter your full name.');return;}
  if(!/^[^\\s@]+@gmail\\.com$/i.test(email.trim())){setError('Please enter a valid Gmail address ending in @gmail.com.');return;}
  if(!/^\\d{8}$/.test(accountId.trim())){setError('Demo Account ID must contain exactly 8 digits.');return;}
  if(!/^\\d{8}$/.test(pin)){setError('Account PIN must contain exactly 8 digits.');return;}
  if(mode==='create'&&pin!==confirmPin){setError('PIN and Confirm PIN do not match.');return;}
  setBusy(true);
  try{
   if(mode==='create') createDemoSession({name,email,accountId,pin});
   else loginDemoSession({name,email,accountId,pin});
   if(mode==='create') playWelcomeVoice();
   navigate('/dashboard',{replace:true});
  }catch(err){setError(err.message||'Could not open your demo account.');}
  finally{setBusy(false);}
 };

 const switchMode=next=>{setMode(next);setError('');setPin('');setConfirmPin('');};
 return <div className="create-account-overlay" role="dialog" aria-modal="true" aria-labelledby="create-account-title">
  <section className="create-account-modal">
   <div className="create-account-brand"><span>₿</span> Crypto<span>Dash</span></div>
   <div className="create-account-symbol">✦</div>
   <p className="create-account-eyebrow">{mode==='create'?'CREATE YOUR DEMO ACCOUNT':'WELCOME BACK'}</p>
   <h1 id="create-account-title">{mode==='create'?'Create Demo Account':'Login to Your Account'}</h1>
   <p className="create-account-description">{mode==='create'?'Create your account details and set an 8-digit PIN. Keep the PIN safe for your next login.':'Enter the same details and your 8-digit PIN to reopen your saved demo account.'}</p>
   {mode==='create'&&<div className="create-account-fund"><small>STARTING DEMO BALANCE</small><strong>$500.00 <span>USD</span></strong><p>Virtual funds · No real money involved</p></div>}
   <div className="create-account-mode-switch">
    <button type="button" className={mode==='create'?'active':''} onClick={()=>switchMode('create')}>Create account</button>
    <button type="button" className={mode==='login'?'active':''} onClick={()=>switchMode('login')}>Login</button>
   </div>
   <form onSubmit={submit} className="create-account-form">
    <label>Full name<input autoComplete="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your full name" minLength="2" maxLength="80" required/></label>
    <label>Gmail address<input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@gmail.com" required/></label>
    <label>Demo Account ID (8 digits)<input type="text" inputMode="numeric" autoComplete="off" value={accountId} onChange={e=>setAccountId(e.target.value.replace(/\\D/g,'').slice(0,8))} placeholder="Enter 8-digit account ID" maxLength="8" pattern="\\d{8}" required/></label>
    <label>Account PIN (8 digits)<input type="password" inputMode="numeric" autoComplete={mode==='login'?'current-password':'new-password'} value={pin} onChange={e=>setPin(e.target.value.replace(/\\D/g,'').slice(0,8))} placeholder="Enter your 8-digit PIN" maxLength="8" pattern="\\d{8}" required/></label>
    {mode==='create'&&<label>Confirm Account PIN<input type="password" inputMode="numeric" autoComplete="new-password" value={confirmPin} onChange={e=>setConfirmPin(e.target.value.replace(/\\D/g,'').slice(0,8))} placeholder="Re-enter your 8-digit PIN" maxLength="8" pattern="\\d{8}" required/></label>}
    <button className="create-account-submit" type="submit" disabled={busy}>{busy?'Please wait…':mode==='create'?'Create Demo Account':'Login to Demo Account'}</button>
   </form>
   {error&&<p className="create-account-error" role="alert">{error}</p>}
   <p className="create-account-foot">Demo-only authentication · Saved in this browser · Logging out does not delete your account</p>
  </section>
 </div>;
}
