import {useState} from 'react';
import {NavLink,useNavigate} from 'react-router-dom';
import {GlassCard} from '../../components/common/GlassCard';
import {requestEmailOtp,verifyEmailOtp} from '../../services/auth';

export default function RegisterPage(){
 const [name,setName]=useState(''),[email,setEmail]=useState(''),[otp,setOtp]=useState('');
 const [otpSent,setOtpSent]=useState(false),[error,setError]=useState(''),[message,setMessage]=useState(''),[loading,setLoading]=useState(false);
 const navigate=useNavigate();
 const send=async e=>{e.preventDefault();setError('');setMessage('');setLoading(true);try{const result=await requestEmailOtp({email,fullName:name,purpose:'register'});setOtpSent(true);setMessage(result.message||'Verification code sent to your email.');}catch(err){setError(err.message)}finally{setLoading(false)}};
 const verify=async e=>{e.preventDefault();setError('');setLoading(true);try{await verifyEmailOtp({email,otp,purpose:'register'});navigate('/account');}catch(err){setError(err.message)}finally{setLoading(false)}};
 return <main className="auth-page"><GlassCard className="auth-card"><div className="auth-brand"><span className="sidebar-logo-icon">₿</span> CryptoDash</div><h1>Create your account</h1><p className="auth-subtitle">Verify your email to create a CryptoDash account</p>
 {!otpSent?<form className="auth-form" onSubmit={send}><label>Full name<input autoComplete="name" required minLength="2" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label><label>Email address<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><button className="btn btn--primary" type="submit" disabled={loading}>{loading?'Sending…':'Send email OTP'}</button></form>
 :<form className="auth-form" onSubmit={verify}><p className="auth-info">Enter the 6-digit code sent to <b>{email}</b>. It expires in 5 minutes.</p><label>Email verification code<input inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" minLength="6" maxLength="6" required value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="000000"/></label><button className="btn btn--primary" type="submit" disabled={loading||otp.length!==6}>{loading?'Verifying…':'Verify email and create account'}</button><button className="btn btn--ghost" type="button" onClick={()=>{setOtpSent(false);setOtp('');setMessage('')}}>Change email</button></form>}
 {message&&<p className="text-success" role="status">{message}</p>}{error&&<p className="text-danger" role="alert">{error}</p>}
 <p className="auth-switch">Already have an account? <NavLink to="/login">Sign in</NavLink></p><p className="auth-note">Email verification uses the configured server email provider. No password is stored in this browser.</p></GlassCard></main>;
}
