import {useMemo,useState} from 'react';
import {GlassCard} from '../../components/common/GlassCard';
import PriceChart from '../../components/charts/PriceChart';
import {useApp} from '../../context/AppContext';
const money=n=>'$'+Number(n||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
export default function TradingPage(){
 const {markets,trade,orders,cash,holdings}=useApp();
 const [assetId,setAssetId]=useState('bitcoin'),[side,setSide]=useState('buy'),[quantity,setQuantity]=useState('0.01');
 const [entryType,setEntryType]=useState('market'),[limitPrice,setLimitPrice]=useState(''),[stopLoss,setStopLoss]=useState(''),[takeProfit,setTakeProfit]=useState('');
 const [message,setMessage]=useState(''),[error,setError]=useState('');
 const asset=markets.find(m=>m.id===assetId)||markets[0],qty=Number(quantity)||0,price=asset?.price||0,gross=price*qty,fee=gross*.001;
 const holding=holdings.find(h=>h.id===asset?.id),estimated=side==='buy'?gross+fee:gross-fee;
 const validRisk=side!=='buy'||((!Number(stopLoss)||Number(stopLoss)<price)&&(!Number(takeProfit)||Number(takeProfit)>price));
 const submit=e=>{e.preventDefault();setMessage('');setError('');try{if(entryType==='limit'&&Math.abs(Number(limitPrice)-price)>.00000001)throw new Error('Limit orders need a live order book and pending-order engine. This demo currently supports immediate market execution only. Switch to Market order to execute.');const o=trade({side,assetId:asset.id,quantity:qty,stopLoss,takeProfit});setMessage(o.type+' filled · '+o.quantity+' '+o.symbol+' at '+money(o.price));}catch(err){setError(err.message)}};
 return <div className="page-content">
 <GlassCard className="page-header"><h1>Spot Trading</h1><p className="page-subtitle">Trading terminal · market orders · 0.10% simulated fee</p></GlassCard>
 <div className="trading-terminal-grid">
  <GlassCard className="card-chart trading-terminal-chart"><div className="card-chart-header"><div><h3>{asset?.name} / USD</h3><span className="text-secondary">{asset?.symbol} · 24h {asset?.change24>=0?'+':''}{Number(asset?.change24||0).toFixed(2)}%</span></div><strong className="trading-current-price">{money(price)}</strong></div>
   <div className="chart-asset-picker"><label>Market<select value={assetId} onChange={e=>setAssetId(e.target.value)}>{markets.map(m=><option key={m.id} value={m.id}>{m.symbol}/USD — {m.name}</option>)}</select></label></div>
   <PriceChart data={asset?.history||[]} title={asset?.symbol||'Market'} height={390}/>
  </GlassCard>
  <GlassCard className="trading-order-panel"><h3>Place order</h3><div className="trading-side-switch"><button className={side==='buy'?'buy-active':''} onClick={()=>setSide('buy')}>Buy / Long</button><button className={side==='sell'?'sell-active':''} onClick={()=>setSide('sell')}>Sell</button></div>
   <form onSubmit={submit} className="trading-order-form">
    <label>Order type<select value={entryType} onChange={e=>setEntryType(e.target.value)}><option value="market">Market — execute now</option><option value="limit">Limit — set target price</option></select></label>
    {entryType==='limit'&&<label>Limit price (USD)<input type="number" min="0.00000001" step="any" value={limitPrice} onChange={e=>setLimitPrice(e.target.value)} placeholder={String(price)}/><small>Pending limit execution is not enabled in this demo yet.</small></label>}
    <label>Quantity ({asset?.symbol})<input type="number" min="0.00000001" step="any" required value={quantity} onChange={e=>setQuantity(e.target.value)}/></label>
    <div className="trading-quick-qty">{[.25,.5,.75,1].map(v=><button type="button" key={v} onClick={()=>{const max=side==='buy'?(cash/(price*1.001)):Number(holding?.quantity||0);setQuantity((max*v).toFixed(8))}}>{v===1?'Max':Math.round(v*100)+'%'}</button>)}</div>
    <div className="trading-risk-settings"><h4>Position protection</h4><label>Stop-loss price (USD)<input type="number" min="0" step="any" value={stopLoss} onChange={e=>setStopLoss(e.target.value)} placeholder="Optional"/></label><label>Take-profit price (USD)<input type="number" min="0" step="any" value={takeProfit} onChange={e=>setTakeProfit(e.target.value)} placeholder="Optional"/></label><small>These levels are saved with your demo position. Automatic trigger execution requires a running order-monitor service.</small></div>
    <div className="trading-order-summary"><div><span>Market price</span><b>{money(price)}</b></div><div><span>Order value</span><b>{money(gross)}</b></div><div><span>Trading fee (0.10%)</span><b>{money(fee)}</b></div><div><span>Estimated {side==='buy'?'cost':'proceeds'}</span><b>{money(estimated)}</b></div><div><span>Available USD</span><b>{money(cash)}</b></div><div><span>Available {asset?.symbol}</span><b>{Number(holding?.quantity||0).toFixed(8)}</b></div></div>
    {!validRisk&&<p className="text-danger">For a buy position, stop-loss must be below market and take-profit above market.</p>}
    <button className={side==='buy'?'btn btn--primary':'btn btn--secondary'} type="submit" disabled={!asset||qty<=0||!validRisk|| (side==='sell'&&qty>Number(holding?.quantity||0))}>{side==='buy'?'Buy':'Sell'} {asset?.symbol}</button>
    {message&&<p className="text-success" role="status">{message}</p>}{error&&<p className="text-danger" role="alert">{error}</p>}
   </form>
  </GlassCard>
 </div>
 <GlassCard className="card-chart" style={{marginTop:20}}><div className="card-chart-header"><h3>Recent orders</h3><span>{orders.length} orders</span></div><div className="table-wrapper"><table className="table"><thead><tr><th>Time</th><th>Side</th><th>Asset</th><th>Quantity</th><th>Fill price</th><th>Stop-loss</th><th>Take-profit</th><th>Status</th></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td>{new Date(o.createdAt).toLocaleString()}</td><td>{o.type}</td><td>{o.symbol}</td><td>{o.quantity}</td><td>{money(o.price)}</td><td>{o.stopLoss?money(o.stopLoss):'—'}</td><td>{o.takeProfit?money(o.takeProfit):'—'}</td><td className="text-success">{o.status}</td></tr>)}</tbody></table>{!orders.length&&<div className="table-empty">No trades yet. Place your first market order.</div>}</div></GlassCard>
 </div>;
}
