import {apiUrl} from '../../services/api';
import {useEffect,useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {GlassCard} from '../../components/common/GlassCard';
import {getSessionToken,getStoredProfile,logout,saveStoredProfile} from '../../services/auth';

export default function AccountPage(){
 const [profile,setProfile]=useState(()=>getStoredProfile());
 const [name,setName]=useState(profile?.name||'');
 const [loading,setLoading]=useState(Boolean(getSessionToken()));
 const [saving,setSaving]=useState(false),[error,setError]=useState(''),[message,setMessage]=useState('');
 const navigate=useNavigate();
 useEffect(()=>{
  const token=getSessionToken();
  if(!token){setLoading(false);return;}
  fetch(apiUrl('/api/profile/me'),{headers:{Authorization:'Bearer '+token}})
   .then(async r=>{const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.error||'Could not load account');return data.profile;})
   .then(p=>{setProfile(p);setName(p.name||'');saveStoredProfile(p);})
   .catch(e=>setError(e.message))
   .finally(()=>setLoading(false));
 },[]);
 const save=async e=>{e.preventDefault();setError('');setMessage('');const token=getSessionToken();if(!token){setError('Sign in with email OTP to update your verified profile.');return;}setSaving(true);try{const response=await fetch(apiUrl('/api/profile/update'),{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({fullName:name})});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||'Profile update failed');setProfile(data.profile);saveStoredProfile(data.profile);setMessage('Profile updated successfully.');}catch(e){setError(e.message)}finally{setSaving(false)}};
 const signOut=()=>{logout();setProfile(null);setName('');navigate('/login');};
 const isSignedIn=Boolean(getSessionToken())&&Boolean(profile);
 return <div className="page-content">
  <GlassCard className="page-header"><h1>Account & Profile</h1><p className="page-subtitle">Your verified CryptoDash identity and account settings</p></GlassCard>
  {loading?<GlassCard><p>Loading verified account…</p></GlassCard>:!isSignedIn?<GlassCard className="account-empty"><div className="account-avatar">₿</div><h2>Sign in to your account</h2><p>Your personal profile, email verification and wallet records appear here after signing in.</p><div className="account-actions"><Link className="btn btn--primary" to="/login">Sign in with email OTP</Link><Link className="btn btn--ghost" to="/register">Create account</Link></div>{error&&<p className="text-danger">{error}</p>}</GlassCard>
  :<>
   <div className="account-profile-hero"><div className="account-avatar">{(profile.name||profile.email||'C').slice(0,1).toUpperCase()}</div><div><h2>{profile.name||'CryptoDash user'}</h2><p>{profile.email}</p><span className="account-verified">● Email verified</span></div></div>
   <div className="grid grid-2"><GlassCard><h3>Personal profile</h3><form className="account-form" onSubmit={save}><label>Full name<input value={name} onChange={e=>setName(e.target.value)} required minLength="2" maxLength="80"/></label><label>Verified email<input value={profile.email} readOnly/></label><label>Member since<input value={profile.createdAt?new Date(profile.createdAt).toLocaleDateString():'—'} readOnly/></label><button className="btn btn--primary" type="submit" disabled={saving}>{saving?'Saving…':'Save profile'}</button></form>{message&&<p className="text-success">{message}</p>}{error&&<p className="text-danger">{error}</p>}</GlassCard>
   <GlassCard><h3>Account & security</h3><div className="account-security-list"><div><span>Email status</span><b className="text-success">Verified</b></div><div><span>Authentication</span><b>Email OTP</b></div><div><span>Wallet (INR)</span><b>₹{Number(profile.balanceInr||0).toLocaleString('en-IN',{minimumFractionDigits:2})}</b></div></div><p className="account-hint">Keep your email account secure. Never share an OTP with anyone.</p><button className="btn btn--ghost" onClick={signOut}>Sign out</button></GlassCard></div>
   <GlassCard><h3>Quick access</h3><div className="account-actions"><Link className="btn btn--ghost" to="/wallet">Wallet & payments</Link><Link className="btn btn--ghost" to="/portfolio">Portfolio</Link><Link className="btn btn--ghost" to="/settings">Settings</Link></div></GlassCard>
  </>}
 </div>;
}
