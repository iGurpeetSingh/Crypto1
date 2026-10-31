import {useMemo,useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {useApp} from '../../context/AppContext';
import {getStoredProfile,logout} from '../../services/auth';
import {GlassCard} from '../../components/common/GlassCard';
import './ProfilePage.css';

const money=value=>Number(value||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const signed=value=>(Number(value)>=0?'+':'−')+'$'+money(Math.abs(Number(value||0)));
const dateKey=value=>{const d=new Date(value);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
export default function ProfilePage(){
 const {orders,markets}=useApp();
 const [profile]=useState(()=>getStoredProfile());
 const navigate=useNavigate();
 const daily=useMemo(()=>{
  const map={};
  orders.forEach(order=>{
   const key=dateKey(order.createdAt);
   if(!map[key])map[key]={count:0,realized:0,buy:0,sell:0};
   map[key].count+=1;
   map[key].realized+=Number(order.realizedPnl||0);
   if(order.type==='BUY')map[key].buy+=1;
   if(order.type==='SELL')map[key].sell+=1;
  });
  return map;
 },[orders]);
 const todayKey=dateKey(new Date());
 const today=daily[todayKey]||{count:0,realized:0,buy:0,sell:0};
 const days=useMemo(()=>{
  const end=new Date();end.setHours(0,0,0,0);
  const start=new Date(end);start.setDate(start.getDate()-363);start.setDate(start.getDate()-((start.getDay()+6)%7));
  return Array.from({length:364},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);const key=dateKey(d);return {key,...(daily[key]||{count:0,realized:0,buy:0,sell:0})};});
 },[daily]);
 const sortedDays=Object.entries(daily).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,14);
 const name=profile?.name||profile?.fullName||'Demo Trader';
 const email=profile?.email||'Email not connected';
 const phone=profile?.phone||'Mobile number not provided';
 const totalRealized=orders.reduce((sum,o)=>sum+Number(o.realizedPnl||0),0);
 const totalTrades=orders.length;
 return <div className="page-content crypto-profile-page">
  <GlassCard className="page-header"><h1>My Profile</h1><p className="page-subtitle">Your demo account identity and daily trading performance</p></GlassCard>
  <section className="crypto-profile-identity">
   <div className="crypto-profile-avatar">{String(name).trim().charAt(0).toUpperCase()||'D'}</div>
   <div className="crypto-profile-id"><h2>{name}</h2><p>{email}</p><span>● Demo account · {phone}</span></div>
   <button className="crypto-profile-logout" onClick={()=>{logout();navigate('/dashboard',{replace:true});window.location.reload();}}>Logout</button>
  </section>
  <section className="profile-daily-section">
   <div className="profile-daily-heading"><div><h2>Today's Trading P/L</h2><p>Profit and loss from completed demo sell trades today</p></div><span className="profile-today-date">{new Date().toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'short',year:'numeric'})}</span></div>
   <div className="profile-daily-cards">
    <GlassCard><span>Today's Realized P/L</span><strong className={today.realized>=0?'positive':'negative'}>{signed(today.realized)}</strong><small>Only completed sell trades</small></GlassCard>
    <GlassCard><span>Trades Today</span><strong>{today.count}</strong><small>{today.buy} buys · {today.sell} sells</small></GlassCard>
    <GlassCard><span>All-time Realized P/L</span><strong className={totalRealized>=0?'positive':'negative'}>{signed(totalRealized)}</strong><small>{totalTrades} recorded orders</small></GlassCard>
   </div>
  </section>
  <GlassCard className="profile-activity-card">
   <div className="profile-daily-heading"><div><h3>Daily Trading Activity</h3><p>Each square represents one day. Hover to inspect trades and realized P/L.</p></div><span className="profile-activity-total">{totalTrades} total trades</span></div>
   <div className="profile-calendar-wrap">
    <div className="profile-calendar-months"><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div>
    <div className="profile-calendar-grid">{days.map((day,i)=><span key={day.key} className={'profile-calendar-cell '+(day.count===0?'level-0':day.realized>0?'level-profit':day.realized<0?'level-loss':'level-trade')} style={{gridColumn:Math.floor(i/7)+1,gridRow:i%7+1}} title={day.key+' · '+day.count+' trades · '+signed(day.realized)}/>)}</div>
   </div>
   <div className="profile-calendar-legend"><span>Less</span><i className="level-0"/><i className="level-trade"/><i className="level-profit"/><i className="level-loss"/><span>More activity</span></div>
  </GlassCard>
  <GlassCard className="profile-daily-log">
   <div className="profile-daily-heading"><div><h3>Day-wise Profit / Loss</h3><p>Daily realized results from your demo trading history</p></div><Link to="/trading">Open Spot Trading →</Link></div>
   {sortedDays.length?<div className="profile-day-table"><div className="profile-day-row profile-day-head"><span>Date</span><span>Trades</span><span>Buy / Sell</span><span>Profit / Loss</span></div>{sortedDays.map(([key,value])=><div className="profile-day-row" key={key}><b>{new Date(key+'T12:00:00').toLocaleDateString(undefined,{day:'2-digit',month:'short',year:'numeric'})}</b><span>{value.count}</span><span>{value.buy} / {value.sell}</span><strong className={value.realized>=0?'positive':'negative'}>{signed(value.realized)}</strong></div>)}</div>:<div className="crypto-profile-empty">No trades recorded yet. Once you place demo trades, daily profit/loss and trade counts will appear here.</div>}
  </GlassCard>
  <p className="crypto-profile-note">Demo profile details are saved in this browser. Daily P/L shown here is realized profit/loss from completed sell orders; open-position P/L remains in Wallet.</p>
 </div>;
}
