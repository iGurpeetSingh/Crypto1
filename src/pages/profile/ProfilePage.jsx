import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {useApp} from '../../context/AppContext';
import {apiUrl} from '../../services/api';
import {getSessionToken,getStoredProfile,saveStoredProfile} from '../../services/auth';
import {GlassCard} from '../../components/common/GlassCard';

const money=value=>Number(value||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
export default function ProfilePage(){
 const {cash,holdings,orders,pendingOrders,portfolio}=useApp();
 const [profile,setProfile]=useState(()=>getStoredProfile());
 const [loading,setLoading]=useState(false);
 useEffect(()=>{
  const token=getSessionToken();
  if(!token)return;
  let active=true;setLoading(true);
  fetch(apiUrl('/api/profile/me'),{headers:{Authorization:'Bearer '+token}})
   .then(async response=>{const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||'Profile unavailable');return data.profile;})
   .then(data=>{if(active&&data){setProfile(data);saveStoredProfile(data);}})
   .catch(()=>{})
   .finally(()=>{if(active)setLoading(false);});
  return()=>{active=false;};
 },[]);
 const filled=orders.filter(order=>order.status==='FILLED'||!order.status);
 const name=profile?.name||profile?.fullName||'Demo Trader';
 const email=profile?.email||'Email not connected';
 const positions=holdings.filter(item=>Number(item.quantity)>0);
 return <div className="page-content crypto-profile-page">
  <GlassCard className="page-header"><h1>Profile</h1><p className="page-subtitle">Your demo trading account and activity</p></GlassCard>
  <section className="crypto-profile-identity">
   <div className="crypto-profile-avatar">{String(name).trim().charAt(0).toUpperCase()||'D'}</div>
   <div className="crypto-profile-id"><h2>{name}</h2><p>{email}</p><span>● Demo trading account</span></div>
   <Link className="btn btn--ghost" to="/account">Edit profile</Link>
  </section>
  <div className="grid grid-3 crypto-profile-stats">
   <GlassCard><span>Available demo balance</span><strong>$ {money(cash)}</strong><small>USD available to place orders</small></GlassCard>
   <GlassCard><span>Total filled trades</span><strong>{filled.length}</strong><small>Completed demo buy and sell orders</small></GlassCard>
   <GlassCard><span>Open positions</span><strong>{positions.length}</strong><small>Crypto assets currently held</small></GlassCard>
  </div>
  <GlassCard className="crypto-profile-portfolio">
   <div className="crypto-profile-section-head"><div><h3>Demo portfolio</h3><p>Current simulated holdings</p></div><Link to="/trading">Go to trading →</Link></div>
   {positions.length? <div className="crypto-profile-table"><div className="crypto-profile-row crypto-profile-table-head"><span>Asset</span><span>Quantity</span><span>Average buy price</span></div>{positions.map(item=><div className="crypto-profile-row" key={item.id}><b>{item.name} ({item.symbol})</b><span>{Number(item.quantity).toFixed(6)}</span><span>$ {money(item.avgBuyPrice)}</span></div>)}</div>:<div className="crypto-profile-empty">No trades yet. Your crypto holdings will appear here after your first demo buy.</div>}
  </GlassCard>
  <GlassCard className="crypto-profile-portfolio">
   <div className="crypto-profile-section-head"><div><h3>Recent trading activity</h3><p>Your demo orders only</p></div><Link to="/trading">Trade crypto →</Link></div>
   {filled.length?<div className="crypto-profile-table"><div className="crypto-profile-row crypto-profile-table-head"><span>Market</span><span>Side</span><span>Order value</span></div>{filled.slice(0,8).map(order=><div className="crypto-profile-row" key={order.id}><b>{order.symbol}/USDT</b><span className={order.type==='BUY'?'positive':'negative'}>{order.type}</span><span>$ {money(order.total||order.price*order.quantity)}</span></div>)}</div>:<div className="crypto-profile-empty">No demo trades placed yet. Your completed buy and sell orders will show here.</div>}
   {pendingOrders.filter(order=>order.status==='OPEN').length>0&&<p className="crypto-profile-pending">{pendingOrders.filter(order=>order.status==='OPEN').length} open limit order(s) pending</p>}
  </GlassCard>
  <p className="crypto-profile-note">{loading?'Refreshing account details…':'Demo funds are virtual. Orders do not execute on a real exchange.'}</p>
 </div>;
}
