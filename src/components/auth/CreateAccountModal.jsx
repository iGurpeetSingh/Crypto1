import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {enterDemoAccount} from '../../services/auth';
import './CreateAccountModal.css';

export default function CreateAccountModal(){
 const [name,setName]=useState('');
 const [email,setEmail]=useState('');
 const [accountId,setAccountId]=useState('');
 const [pin,setPin]=useState('');
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const [created,setCreated]=useState(null);
 const navigate=useNavigate();
 const submit=event=>{
  event.preventDefault();setError('');
  if(name.trim().length<2){setError('Please enter your full name.');return;}
  if(!/^[^\\s@]+@gmail\\.com$/i.test(email.trim())){setError('Please enter a valid Gmail address ending in @gmail.com.');return;}
  setBusy(true);
  try{
   const result=enterDemoAccount({name,email,accountId,pin});
   if(result.created){setCreated(result.profile);return;}
   navigate('/dashboard',{replace:true});
  }catch(err){setError(err.message||'Could not open your demo account.');}
  finally{setBusy(false);}
 };
 const copy=async value=>{try{await navigator.clipboard.writeText(value)}catch{setError('Copy was blocked by the browser. Please select and copy the value manually.')}};
 const continueToApp=()=>navigate('/dashboard',{replace:true});
 return <div className="create-account-overlay" role="dialog" aria-modal="true" aria-labelledby="create-account-title">
  <section className="create-account-modal">
   <div className="create-account-brand"><span>₿</span> Crypto<span>Dash</span></div>
   {created?<>
    <div className="create-account-symbol">✓</div>
    <p className="create-account-eyebrow">DEMO ACCOUNT CREATED</p>
    <h1 id="create-account-title">Save your account details</h1>
    <p className="create-account-description">Your account is ready. Save this generated Account ID and PIN now. You will need both if you log out.</p>
    <div className="created-credentials">
     <div><span>Demo Account ID</span><strong>{created.accountId}</strong><button type="button" onClick={()=>copy(created.accountId)}>Copy ID</button></div>
     <div><span>Your 8-digit Share PIN</span><strong>{created.pin}</strong><button type="button" onClick={()=>copy(created.pin)}>Copy PIN</button></div>
    </div>
    <p className="create-account-notice">You can view these details again from Profile. Keep them private and save a copy before continuing.</p>
    <button className="create-account-submit" type="button" onClick={continueToApp}>Continue to CryptoDash</button>
   </>:<>
    <div className="create-account-symbol">✦</div>
    <p className="create-account-eyebrow">DEMO EXCHANGE ACCESS</p>
    <h1 id="create-account-title">Welcome to CryptoDash</h1>
    <p className="create-account-description">New here? Enter your name and Gmail only; we will create your demo account and generate its Account ID and Share PIN. Returning? Enter your saved Account ID and PIN too.</p>
    <div className="create-account-fund"><small>NEW ACCOUNT STARTING BALANCE</small><strong>$500.00 <span>USD</span></strong><p>Virtual funds · No real money involved</p></div>
    <form onSubmit={submit} className="create-account-form">
     <label>Full name<input autoComplete="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your full name" minLength="2" maxLength="80" required/></label>
     <label>Gmail address<input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@gmail.com" required/></label>
     <label>Demo Account ID <span className="create-account-optional">(existing users only)</span><input type="text" inputMode="numeric" autoComplete="off" value={accountId} onChange={e=>setAccountId(e.target.value.replace(/\\D/g,'').slice(0,10))} placeholder="Generated automatically for new users" maxLength="10"/></label>
     <label>8-digit Share PIN <span className="create-account-optional">(existing users only)</span><input type="password" inputMode="numeric" autoComplete="current-password" value={pin} onChange={e=>setPin(e.target.value.replace(/\\D/g,'').slice(0,8))} placeholder="Enter your saved PIN" maxLength="8"/></label>
     <button className="create-account-submit" type="submit" disabled={busy}>{busy?'Please wait…':'Continue'}</button>
    </form>
    {error&&<p className="create-account-error" role="alert">{error}</p>}
    <p className="create-account-foot">Demo-only access · Saved in this browser · Logging out does not delete your account</p>
   </>}
  </section>
 </div>;
}
