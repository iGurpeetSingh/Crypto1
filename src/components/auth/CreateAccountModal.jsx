import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {requestEmailOtp,verifyEmailOtp} from '../../services/auth';
import './CreateAccountModal.css';

export default function CreateAccountModal(){
 const [name,setName]=useState('');
 const [email,setEmail]=useState('');
 const [otp,setOtp]=useState('');
 const [step,setStep]=useState('details');
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const [notice,setNotice]=useState('');
 const navigate=useNavigate();
 const send=async event=>{
  event.preventDefault();setBusy(true);setError('');setNotice('');
  try{
   const result=await requestEmailOtp({fullName:name,email,purpose:'register'});
   setStep('verify');setNotice(result.message||'Verification code sent. Check your Gmail inbox.');
  }catch(err){setError(err.message||'Could not send verification code.');}
  finally{setBusy(false);}
 };
 const verify=async event=>{
  event.preventDefault();setBusy(true);setError('');
  try{
   await verifyEmailOtp({email,otp,purpose:'register'});
   navigate('/dashboard',{replace:true});
   window.location.reload();
  }catch(err){setError(err.message||'Email verification failed.');}
  finally{setBusy(false);}
 };
 return <div className="create-account-overlay" role="dialog" aria-modal="true" aria-labelledby="create-account-title">
  <section className="create-account-modal">
   <div className="create-account-brand"><span>₿</span> Crypto<span>Dash</span></div>
   <div className="create-account-symbol">✦</div>
   <p className="create-account-eyebrow">START YOUR DEMO JOURNEY</p>
   <h1 id="create-account-title">Create New Account</h1>
   <p className="create-account-description">Create your personal account and start practicing crypto trading with virtual funds.</p>
   <div className="create-account-fund"><small>YOUR STARTING DEMO BALANCE</small><strong>$500.00 <span>USD</span></strong><p>Virtual funds · No real money involved</p></div>
   {step==='details'?<form onSubmit={send} className="create-account-form">
    <label>Your full name<input autoComplete="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your name" minLength="2" maxLength="80" required/></label>
    <label>Gmail address<input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@gmail.com" required/></label>
    <button className="create-account-submit" type="submit" disabled={busy}>{busy?'Sending verification…':'Create New Account'}</button>
   </form>:<form onSubmit={verify} className="create-account-form">
    <div className="create-account-email">Verification code sent to <b>{email}</b></div>
    <label>6-digit verification code<input inputMode="numeric" autoComplete="one-time-code" value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="000000" minLength="6" maxLength="6" required/></label>
    <button className="create-account-submit" type="submit" disabled={busy||otp.length!==6}>{busy?'Verifying…':'Verify & Start Trading'}</button>
    <button className="create-account-back" type="button" onClick={()=>{setStep('details');setOtp('');setError('');}}>Change name or Gmail</button>
   </form>}
   {notice&&<p className="create-account-notice" role="status">{notice}</p>}
   {error&&<p className="create-account-error" role="alert">{error}</p>}
   <p className="create-account-foot">Secure email verification · Demo trading only</p>
  </section>
 </div>;
}
