import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/common/GlassCard';
import MetricCard from '../../components/cards/MetricCard';
import PriceChart from '../../components/charts/PriceChart';
import { useApp } from '../../context/AppContext';
const money=n=>'$'+Number(n||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
export default function DashboardPage(){
 const {markets,portfolio,cash,holdings,orders,loading,marketSource,lastUpdated,refresh}=useApp();
 const navigate=useNavigate();
 const btc=markets.find(m=>m.symbol==='BTC')||markets[0];
 const topGainers=useMemo(()=>[...markets].sort((a,b)=>b.change24-a.change24).slice(0,6),[markets]);
 const topLosers=useMemo(()=>[...markets].sort((a,b)=>a.change24-b.change24).slice(0,6),[markets]);
 return <div className="page-content">
 <GlassCard className="page-header"><div style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',alignItems:'center'}}><div><h1>Crypto Market Dashboard</h1><p className="page-subtitle">Live market overview and your demo trading account</p><small style={{opacity:.65}}>{marketSource} · {lastUpdated?'Updated '+new Date(lastUpdated).toLocaleTimeString():'Connecting…'}</small></div><button className="btn btn--ghost" onClick={refresh}>↻ Refresh market</button></div></GlassCard>
 <div className="grid grid-4"><MetricCard label="Account equity" value={money(portfolio.totalValue)} subtitle="Cash + current crypto value" accent="#42DDAA"/><MetricCard label="Available USD" value={money(cash)} subtitle="Ready to buy crypto" accent="#FF5CA8"/><MetricCard label="Unrealized P/L" value={money(portfolio.totalPl)} subtitle={money(portfolio.totalBase)+' cost basis'} accent={portfolio.totalPl>=0?'#42DDAA':'#EA3943'}/><MetricCard label="Assets held" value={holdings.length} subtitle="Coins in your portfolio" accent="#C084FC"/></div>
 <div className="grid grid-2" style={{marginTop:20}}><GlassCard className="card-chart"><div className="card-chart-header"><h3>{btc?.name||'Crypto'} price chart</h3><strong>{money(btc?.price)}</strong></div><PriceChart data={btc?.history||[]} title={btc?.symbol||'Market'} height={300}/></GlassCard>
 <GlassCard className="card-chart"><h3 style={{marginBottom:14}}>Quick trade</h3><p style={{opacity:.7,marginBottom:18}}>Open spot trading to buy or sell at the current market price.</p><button className="btn btn--primary" onClick={()=>navigate('/trading')} style={{width:'100%'}}>Buy / Sell Crypto</button><div style={{marginTop:22,display:'grid',gap:10}}><div style={{display:'flex',justifyContent:'space-between'}}><span>Spot wallet</span><b>{money(cash)}</b></div><div style={{display:'flex',justifyContent:'space-between'}}><span>Crypto holdings</span><b>{holdings.length} assets</b></div><div style={{display:'flex',justifyContent:'space-between'}}><span>Filled orders</span><b>{orders.length}</b></div></div><button className="btn btn--ghost" style={{width:'100%',marginTop:18}} onClick={()=>navigate('/wallet')}>Open wallet</button></GlassCard></div>
 <div className="grid grid-2" style={{marginTop:20}}>{[[ 'Top gainers',topGainers],['Top losers',topLosers]].map(([heading,list])=><GlassCard className="card-chart" key={heading}><h3 style={{marginBottom:12}}>{heading}</h3><div className="table-wrapper"><table className="table"><thead><tr><th>Asset</th><th>Price (USD)</th><th>24h</th></tr></thead><tbody>{list.map(a=><tr key={a.id}><td>{a.name} <span style={{opacity:.6}}>{a.symbol}</span></td><td>{money(a.price)}</td><td className={a.change24>=0?'text-success':'text-danger'}>{a.change24>=0?'+':''}{a.change24.toFixed(2)}%</td></tr>)}</tbody></table></div></GlassCard>)}</div>
 </div>;
}