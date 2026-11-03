import {useState} from 'react';
import {GlassCard} from '../../components/common/GlassCard';
import {getStoredProfile} from '../../services/auth';

export default function ProfilePage(){
 const [showPin,setShowPin]=useState(false);
 const [copied,setCopied]=useState('');
 const profile=getStoredProfile();
 const copy=async(value,label)=>{
  try{await navigator.clipboard.writeText(String(value));setCopied(label);setTimeout(()=>setCopied(''),1800)}
  catch{setCopied('Select the value and copy manually')}
 };
 const row=(label,value)=><div key={label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:14,flexWrap:'wrap',padding:'12px 0',borderBottom:'1px solid var(--glass-border)'}}><span style={{color:'var(--text-secondary)'}}>{label}</span><strong style={{color:'var(--text-primary)',overflowWrap:'anywhere'}}>{value||'—'}</strong></div>;
 return <div className="page-content">
  <GlassCard className="page-header"><h1>My Profile</h1><p className="page-subtitle">Your demo account identity and recovery details</p></GlassCard>
  <GlassCard style={{maxWidth:620,margin:'20px auto 0'}}>
   <div className="card-chart-header"><h3>Account Information</h3><span className="demo-badge">DEMO ACCOUNT</span></div>
   <div style={{display:'grid',gap:2}}>
    {row('Full name',profile?.name)}
    {row('Gmail ID',profile?.email)}
    {row('Demo Account Number',profile?.accountId)}
    {row('Account type',profile?.role||'USER')}
    {row('Created',profile?.createdAt?new Date(profile.createdAt).toLocaleDateString():'—')}
   </div>
   <div className="profile-pin-panel">
    <div><span className="profile-pin-label">Your Share PIN</span><strong className="profile-pin-value">{profile?.pin?(showPin?profile.pin:'••••••••'):'Not available'}</strong><p>Tap Show PIN to reveal it. Save it safely for your next login.</p></div>
    <div className="profile-pin-actions">
     <button type="button" className="topbar-btn" onClick={()=>setShowPin(v=>!v)}>{showPin?'Hide PIN':'Show PIN'}</button>
     <button type="button" className="topbar-btn" disabled={!profile?.pin} onClick={()=>copy(profile.pin,'PIN copied')}>Copy PIN</button>
    </div>
   </div>
   <div className="profile-pin-panel profile-id-panel">
    <div><span className="profile-pin-label">Demo Account Number</span><strong className="profile-pin-value">{profile?.accountId||'—'}</strong></div>
    <button type="button" className="topbar-btn" disabled={!profile?.accountId} onClick={()=>copy(profile.accountId,'Account number copied')}>Copy Account Number</button>
   </div>
   {copied&&<p className="create-account-notice" role="status">{copied}</p>}
   <p className="profile-security-note">This is a browser-local demo account. Your PIN and trading data stay in this browser. Clearing browser data can remove them. Never reuse a banking or payment PIN here.</p>
  </GlassCard>
 </div>;
}
