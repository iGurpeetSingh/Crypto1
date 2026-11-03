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
 const [showRecovery,setShowRecovery]=useState(false);
 const [otp,setOtp]=useState('');
 const [otpSent,setOtpSent]=useState(false);
 const navigate=useNavigate();
 const submit=async event=>{
  event.preventDefault();setError('');
  if(name.trim().length<2){setError('Please enter your full name.');return;}
  if(!/^[^\s@]+@gmail\.com$/i.test(email.trim())){setError('Please enter a valid Gmail address ending in @gmail.com.');return;}
  setBusy(true);
  try{
   if(!otpSent){
    const response=await fetch('/api/auth/request-otp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fullName:name,email})});
    const data=await response.json();
    if(!response.ok)throw new Error(data.error||'Could not send Gmail OTP.');
    setOtpSent(true);setOtp('');
    return;
   }
   if(!/^\d{6}$/.test(otp))throw new Error('Enter the 6-digit OTP sent to your Gmail.');
   const response=await fetch('/api/auth/verify-otp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,otp})});
   const data=await response.json();
   if(!response.ok)throw new Error(data.error||'OTP verification failed.');
   if(!data.verified||data.email!==email.trim().toLowerCase())throw new Error('Gmail verification could not be confirmed.');
   enterDemoAccount({name,email,accountId:showRecovery?accountId:'',pin:showRecovery?pin:''});
   navigate('/dashboard',{replace:true});
  }catch(err){
   const message=err.message||'Could not continue.';
   setError(message);
   if(/saved Demo Account ID|saved 10-digit|saved 8-digit|No account was found|Welcome back|Account Number/i.test(message))setShowRecovery(true);
  }finally{setBusy(false);}
 };
 return <div className="create-account-overlay" role="dialog" aria-modal="true" aria-labelledby="create-account-title">
  <section className="create-account-modal">
   <div className="create-account-brand"><span>₿</span> Crypto<span>Dash</span></div>
   <div className="create-account-symbol">✦</div>
   <p className="create-account-eyebrow">DEMO EXCHANGE ACCESS</p>
   <h1 id="create-account-title">Welcome to CryptoDash</h1>
   <p className="create-account-description">New here? Enter only your full name and Gmail. Your account, Account Number and Share PIN will be created automatically. After entering the dashboard, find your PIN in Profile. New and returning users verify their Gmail with an OTP before continuing.</p>
   <div className="create-account-fund"><small>NEW ACCOUNT STARTING BALANCE</small><strong>$500.00 <span>USD</span></strong><p>Virtual funds · No real money involved</p></div>
   <form onSubmit={submit} className="create-account-form">
    <label>Full name<input autoComplete="name" value={name} disabled={otpSent} onChange={e=>setName(e.target.value)} placeholder="Enter your full name" minLength="2" maxLength="80" required/></label>
    <label>Gmail address<input type="email" autoComplete="email" value={email} disabled={otpSent} onChange={e=>setEmail(e.target.value)} placeholder="you@gmail.com" required/></label>
    {otpSent&&<label>6-digit Gmail OTP<input inputMode="numeric" autoComplete="one-time-code" value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="Enter OTP from your Gmail" maxLength="6" required/></label>}
    <button className="create-account-submit" type="submit" disabled={busy}>{busy?'Please wait…':otpSent?'Verify OTP & Continue':'Send Gmail OTP'}</button>
    {otpSent&&<button type="button" className="create-account-back" onClick={()=>{setOtpSent(false);setOtp('');setError('');}}>Change Gmail / Request another OTP</button>}
   </form>
   <button type="button" className="create-account-recovery-toggle" onClick={()=>{setShowRecovery(v=>!v);setError('');}}>
    {showRecovery?'Hide returning-user login':'Already have an account? Login with Account Number + PIN'}
   </button>
   {showRecovery&&<div className="create-account-recovery">
    <p>Returning users: enter the same name and Gmail above, then provide your saved details.</p>
    <label>10-digit Demo Account Number<input type="text" inputMode="numeric" autoComplete="off" value={accountId} onChange={e=>setAccountId(e.target.value.replace(/\D/g,'').slice(0,10))} placeholder="Enter your saved Account Number" maxLength="10"/></label>
    <label>8-digit Share PIN<input type="password" inputMode="numeric" autoComplete="current-password" value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,'').slice(0,8))} placeholder="Enter your saved PIN" maxLength="8"/></label>
   </div>}
   {error&&<p className="create-account-error" role="alert">{error}</p>}
   <p className="create-account-foot">Demo-only access · Saved in this browser · Logging out does not delete your account</p>
  </section>
 </div>;
}
