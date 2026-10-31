import {useState} from 'react';
import {GlassCard} from '../../components/common/GlassCard';
import MetricCard from '../../components/cards/MetricCard';
import {useApp} from '../../context/AppContext';

const money=n=>'$'+Number(n||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});

export default function WalletPage(){
 const {cash,transactions,addDemoFunds,holdings,markets,portfolio}=useApp();
 const [amount,setAmount]=useState('100');
 const [notice,setNotice]=useState('');
 const [error,setError]=useState('');
 const run=type=>{
  setNotice('');setError('');
  try{addDemoFunds({type,amount});setNotice(type==='deposit'?'Demo funds added to your Main Wallet.':'Demo funds withdrawn from your Main Wallet.');}
  catch(e){setError(e.message);}
 };
 return <div className="page-content">
  <GlassCard className="page-header"><h1>Wallet</h1><p className="page-subtitle">Your single USD demo wallet for simulated crypto trading</p></GlassCard>
  <GlassCard>
   <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,flexWrap:'wrap'}}>
    <div><span className="real-wallet-eyebrow">MAIN DEMO WALLET · USD</span><h2 style={{fontSize:38,margin:'12px 0'}}>{money(cash)}</h2><p style={{opacity:.7,margin:0}}>Starting balance: $500.00 · Simulated funds only</p></div>
    <span className="demo-badge">SIMULATED TRADING</span>
   </div>
  </GlassCard>
  <div className="grid grid-3" style={{marginTop:20}}>
   <MetricCard label="Available Balance" value={money(cash)} subtitle="Available for simulated buy orders" accent="#42DDAA"/>
   <MetricCard label="Portfolio Value" value={money(portfolio?.investedValue||0)} subtitle="Current value of your crypto holdings" accent="#C084FC"/>
   <MetricCard label="Total Profit / Loss" value={money(portfolio?.totalProfitLoss||0)} subtitle="Realized + unrealized demo P/L" accent={(portfolio?.totalProfitLoss||0)>=0?'#42DDAA':'#FF6B8A'}/>
  </div>
  <div className="grid grid-2" style={{marginTop:20}}>
   <GlassCard><h3>Demo deposit / withdraw</h3><p style={{margin:'8px 0 16px',opacity:.7}}>Changes the same Main Demo Wallet. No real money or second wallet is involved.</p>
    <label>Amount (USD)<input type="number" min="0.01" max="1000000" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} style={{width:'100%',padding:12,marginTop:8,marginBottom:12}}/></label>
    <div className="grid grid-2"><button className="btn btn--primary" onClick={()=>run('deposit')}>Add demo funds</button><button className="btn btn--secondary" onClick={()=>run('withdraw')}>Withdraw demo funds</button></div>
    {notice&&<p className="text-success" role="status">{notice}</p>}{error&&<p className="text-danger" role="alert">{error}</p>}
   </GlassCard>
   <GlassCard><h3>Wallet details</h3><div style={{display:'grid',gap:14,marginTop:16}}><div><span style={{opacity:.65}}>Wallet type</span><strong style={{display:'block',marginTop:4}}>Main Demo Wallet</strong></div><div><span style={{opacity:.65}}>Currency</span><strong style={{display:'block',marginTop:4}}>USD ($)</strong></div><div><span style={{opacity:.65}}>Separate testing / funding wallets</span><strong style={{display:'block',marginTop:4}}>None</strong></div></div></GlassCard>
  </div>
  <GlassCard className="card-chart" style={{marginTop:20}}><h3>Asset balances</h3><div className="table-wrapper"><table className="table"><thead><tr><th>Asset</th><th>Quantity</th><th>Market value</th></tr></thead><tbody>{holdings.map(h=>{const p=markets.find(m=>m.id===h.id)?.price||h.avgBuyPrice;return <tr key={h.id}><td>{h.name} ({h.symbol})</td><td>{h.quantity.toFixed(8)}</td><td>{money(h.quantity*p)}</td></tr>})}</tbody></table>{!holdings.length&&<div className="table-empty">No crypto holdings. Buy an asset from Spot Trading.</div>}</div></GlassCard>
  <GlassCard className="card-chart"><h3>Demo transaction history</h3><div className="table-wrapper"><table className="table"><thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Amount</th></tr></thead><tbody>{transactions.map(t=><tr key={t.id}><td>{new Date(t.createdAt).toLocaleString()}</td><td>{t.type}</td><td>{t.description}</td><td>{money(t.amount)}</td></tr>)}</tbody></table>{!transactions.length&&<div className="table-empty">No demo transactions yet.</div>}</div></GlassCard>
 </div>;
}
