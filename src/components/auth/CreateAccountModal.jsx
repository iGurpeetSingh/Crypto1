import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {createDemoSession} from '../../services/auth';
import './CreateAccountModal.css';
import { playWelcomeVoice } from '../../services/welcomeVoice';



export default function CreateAccountModal(){
 const [name,setName]=useState('');
 const [email,setEmail]=useState('');
 const [phone,setPhone]=useState('');
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const navigate=useNavigate();
 const submit=event=>{
  event.preventDefault();setError('');
  const cleanEmail=email.trim().toLowerCase();
  if(!/^[^\s@]+@gmail\.com$/.test(cleanEmail)){setError('Please enter a valid Gmail address ending in @gmail.com.');return;}
  if(!/^\+?[0-9\s()-]{8,18}$/.test(phone.trim())){setError('Please enter a valid mobile number.');return;}
  if(name.trim().length<2){setError('Please enter your full name.');return;}
  setBusy(true);
  try{
   createDemoSession({name:name.trim(),email:cleanEmail,phone:phone.trim()});
   // Speech starts directly from the account-creation click, satisfying browser
   // autoplay rules. Client-side navigation keeps the announcement playing.
   playWelcomeVoice();
   navigate('/dashboard',{replace:true});
  }catch(err){setError(err.message||'Could not create demo account.');}
  finally{setBusy(false);}
 };
 return <div className="create-account-overlay" role="dialog" aria-modal="true" aria-labelledby="create-account-title">
  <section className="create-account-modal">
   <div className="create-account-brand"><span>₿</span> Crypto<span>Dash</span></div>
   <div className="create-account-symbol">✦</div>
   <p className="create-account-eyebrow">START YOUR DEMO JOURNEY</p>
   <h1 id="create-account-title">Demo Login / Create Account</h1>
   <p className="create-account-description">Enter your details to open your personal demo trading profile. No OTP or real payment required.</p>
   <div className="create-account-fund"><small>YOUR STARTING DEMO BALANCE</small><strong>$500.00 <span>USD</span></strong><p>Virtual funds · No real money involved</p></div>
   <form onSubmit={submit} className="create-account-form">
    <label>Your full name<input autoComplete="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your name" minLength="2" maxLength="80" required/></label>
    <label>Gmail address<input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@gmail.com" required/></label>
    <label>Mobile number<input type="tel" autoComplete="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+91 98765 43210" minLength="8" maxLength="18" required/></label>
    <button className="create-account-submit" type="submit" disabled={busy}>{busy?'Opening demo account…':'Login / Create Demo Account'}</button>
   </form>
   {error&&<p className="create-account-error" role="alert">{error}</p>}
   <p className="create-account-foot">Demo-only profile · Details saved in this browser · No real authentication</p>
  </section>
 </div>;
}
