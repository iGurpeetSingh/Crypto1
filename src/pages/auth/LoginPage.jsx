import {useState} from 'react';
import {NavLink,useNavigate} from 'react-router-dom';
import {GlassCard} from '../../components/common/GlassCard';
import {requestEmailOtp,verifyEmailOtp} from '../../services/auth';

export default function LoginPage(){
 const [email,setEmail]=useState(''),[otp,setOtp]=useState(''),[otpSent,setOtpSent]=useState(false);
 const [error,setError]=useState(''),[message,setMessage]=useState(''),[devOtp,setDevOtp]=useState(''),[loading,setLoading]=useState(false);
 const navigate=useNavigate();
 const send=async e=>{e.preventDefault();setError('');setMessage('');setLoading(true);try{const result=await requestEmailOtp({email,purpose:'login'});setOtpSent(true);setDevOtp(result.devOtp||'');setMessage(result.message||'Verification code sent to your email.');}catch(err){setError(err.message)}finally{setLoading(false)}};
 const verify=async e=>{e.preventDefault();setError('');setLoading(true);try{await verifyEmailOtp({email,otp,purpose:'login'});navigate('/account');}catch(err){setError(err.message)}finally{setLoading(false)}};
 return <main className="auth-page"><GlassCard className="auth-card"><div className="auth-brand"><span className="sidebar-logo-icon">₿</span> CryptoDash</div><h1>Welcome back</h1><p className="auth-subtitle">Secure sign in with an email verification code</p>
 {!otpSent?<form className="auth-form" onSubmit={send}><label>Email address<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><button className="btn btn--primary" type="submit" disabled={loading}>{loading?'Sending…':'Send login OTP'}</button></form>
 :<form className="auth-form" onSubmit={verify}><p className="auth-info">Enter the code sent to <b>{email}</b>. It expires in 5 minutes.</p><label>6-digit email code<input inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" minLength="6" maxLength="6" required value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="000000"/></label><button className="btn btn--primary" type="submit" disabled={loading||otp.length!==6}>{loading?'Verifying…':'Verify and sign in'}</button><button className="btn btn--ghost" type="button" onClick={()=>{setOtpSent(false);setOtp('');setMessage('')}}>Change email</button></form>}
 {message&&<p className="text-success" role="status">{message}</p>}{devOtp&&<p className="auth-info" role="status">Development OTP: <b>{devOtp}</b> (local testing only; no email was sent)</p>}{error&&<p className="text-danger" role="alert">{error}</p>}
 <p className="auth-switch">New here? <NavLink to="/register">Create an account</NavLink></p><p className="auth-note">Email OTP verification requires the configured backend and verified sender domain.</p></GlassCard></main>;
}
