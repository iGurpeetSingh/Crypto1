import {useState} from 'react';
import {GlassCard} from '../../components/common/GlassCard';
import PriceChart from '../../components/charts/PriceChart';
import {useApp} from '../../context/AppContext';
const money=n=>'$'+Number(n||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
export default function TradingPage(){
 const {markets,trade,placeLimitOrder,cancelLimitOrder,orders,pendingOrders,cash,holdings,marketSource}=useApp();
 const [assetId,setAssetId]=useState('bitcoin'),[side,setSide]=useState('buy'),[quantity,setQuantity]=useState('0.01');
 const [entryType,setEntryType]=useState('market'),[limitPrice,setLimitPrice]=useState('');
 const [stopLoss,setStopLoss]=useState(''),[takeProfit,setTakeProfit]=useState('');
 const [message,setMessage]=useState(''),[error,setError]=useState('');
 const asset=markets.find(m=>m.id===assetId)||markets[0],qty=Number(quantity)||0,price=asset?.price||0;
 const executionPrice=entryType==='limit'?(Number(limitPrice)||price):price;
 const gross=executionPrice*qty,fee=gross*.001;
 const holding=holdings.find(h=>h.id===asset?.id);
 const estimated=side==='buy'?gross+fee:gross-fee;
 const validRisk=side!=='buy'||((!Number(stopLoss)||Number(stopLoss)<executionPrice)&&(!Number(takeProfit)||Number(takeProfit)>executionPrice));
 const submit=e=>{
  e.preventDefault();setMessage('');setError('');
  try{
   if(entryType==='limit'){
    const order=placeLimitOrder({side,assetId:asset.id,quantity:qty,limitPrice,stopLoss,takeProfit});
    setMessage('Limit order placed · '+order.id+' · waiting for '+money(order.limitPrice));
   }else{
    const order=trade({side,assetId:asset.id,quantity:qty,stopLoss,takeProfit});
    setMessage(order.type+' market order filled · '+order.quantity+' '+order.symbol+' at '+money(order.price));
   }
  }catch(err){setError(err.message)}
 };
 const maxQuantity=side==='buy'?cash/(Math.max(executionPrice,.00000001)*1.001):Number(holding?.quantity||0);
 return <div className="page-content">
  <GlassCard className="page-header"><h1>Spot Trading</h1><p className="page-subtitle">Market and limit orders · 0.10% simulated fee · demo exchange</p></GlassCard>
  <div className="trading-terminal-grid">
   <GlassCard className="card-chart trading-terminal-chart">
    <div className="card-chart-header"><div><h3>{asset?.name} / USD</h3><span className="text-secondary">{asset?.symbol} · 24h {asset?.change24>=0?'+':''}{Number(asset?.change24||0).toFixed(2)}%</span></div><strong className="trading-current-price">{money(price)}</strong></div>
    <div className="chart-asset-picker"><label>Market<select value={assetId} onChange={e=>{setAssetId(e.target.value);setStopLoss('');setTakeProfit('');}}>{markets.map(m=><option key={m.id} value={m.id}>{m.symbol}/USD — {m.name}</option>)}</select></label></div>
    <PriceChart data={asset?.history||[]} title={asset?.symbol||'Market'} symbol={asset?.symbol||'BTC'} height={390} stopLoss={Number(stopLoss)||Number(holding?.stopLoss)||0} takeProfit={Number(takeProfit)||Number(holding?.takeProfit)||0}/>
    <div className="trading-feed-status">{marketSource||'Market data'} · Quotes update automatically. Demo orders execute in this browser.</div>
   </GlassCard>
   <GlassCard className="trading-order-panel"><h3>Place order</h3>
    <div className="trading-side-switch"><button type="button" className={side==='buy'?'buy-active':''} onClick={()=>{setSide('buy');setMessage('');setError('');}}>Buy / Long</button><button type="button" className={side==='sell'?'sell-active':''} onClick={()=>{setSide('sell');setMessage('');setError('');}}>Sell</button></div>
    <form onSubmit={submit} className="trading-order-form">
     <label>Order type<select value={entryType} onChange={e=>setEntryType(e.target.value)}><option value="market">Market — execute immediately</option><option value="limit">Limit — execute at target price</option></select></label>
     {entryType==='limit'&&<label>Limit price (USD)<input type="number" min="0.00000001" step="any" required value={limitPrice} onChange={e=>setLimitPrice(e.target.value)} placeholder={String(price)}/><small>Buy fills when market price reaches or drops below your limit. Sell fills when it reaches or rises above your limit.</small></label>}
     <label>Quantity ({asset?.symbol})<input type="number" min="0.00000001" step="any" required value={quantity} onChange={e=>setQuantity(e.target.value)}/></label>
     <div className="trading-quick-qty">{[.25,.5,.75,1].map(v=><button type="button" key={v} onClick={()=>setQuantity((maxQuantity*v).toFixed(8))}>{v===1?'Max':Math.round(v*100)+'%'}</button>)}</div>
     <div className="trading-risk-settings"><h4>Position protection</h4>
      <label>Stop-loss price (USD)<input type="number" min="0" step="any" value={stopLoss} onChange={e=>setStopLoss(e.target.value)} placeholder="Optional"/></label>
      <label>Take-profit price (USD)<input type="number" min="0" step="any" value={takeProfit} onChange={e=>setTakeProfit(e.target.value)} placeholder="Optional"/></label>
      <small>Saved to the demo position. Trigger checks run when market quotes refresh while this app is open.</small>
     </div>
     <div className="trading-order-summary"><div><span>Current market price</span><b>{money(price)}</b></div>{entryType==='limit'&&<div><span>Limit execution price</span><b>{money(executionPrice)}</b></div>}<div><span>Order value</span><b>{money(gross)}</b></div><div><span>Trading fee (0.10%)</span><b>{money(fee)}</b></div><div><span>Estimated {side==='buy'?'cost':'proceeds'}</span><b>{money(estimated)}</b></div><div><span>Available USD</span><b>{money(cash)}</b></div><div><span>Available {asset?.symbol}</span><b>{Number(holding?.quantity||0).toFixed(8)}</b></div></div>
     {!validRisk&&<p className="text-danger">For a long position, stop-loss must be below the entry price and take-profit above it.</p>}
     <button className={side==='buy'?'btn btn--primary':'btn btn--secondary'} type="submit" disabled={!asset||qty<=0||!validRisk||(side==='sell'&&qty>Number(holding?.quantity||0))}>{entryType==='limit'?'Place '+side.toUpperCase()+' LIMIT':side==='buy'?'Buy':'Sell'} {asset?.symbol}</button>
     {message&&<p className="text-success" role="status">{message}</p>}{error&&<p className="text-danger" role="alert">{error}</p>}
    </form>
   </GlassCard>
  </div>
  <GlassCard className="card-chart"><div className="card-chart-header"><h3>Open limit orders</h3><span>{pendingOrders.filter(o=>o.status==='OPEN').length} open</span></div>
   <div className="table-wrapper"><table className="table"><thead><tr><th>Time</th><th>Side</th><th>Asset</th><th>Quantity</th><th>Limit price</th><th>Status</th><th>Action</th></tr></thead><tbody>
    {pendingOrders.map(o=><tr key={o.id}><td>{new Date(o.createdAt).toLocaleString()}</td><td>{o.side}</td><td>{o.symbol}</td><td>{o.quantity}</td><td>{money(o.limitPrice)}</td><td>{o.status}</td><td>{o.status==='OPEN'&&<button type="button" className="btn btn--ghost btn--small" onClick={()=>cancelLimitOrder(o.id)}>Cancel</button>}{o.status==='REJECTED'&&<span className="text-danger">{o.rejectionReason}</span>}</td></tr>)}
   </tbody></table>{!pendingOrders.length&&<div className="table-empty">No limit orders placed.</div>}</div>
  </GlassCard>
  <GlassCard className="card-chart"><div className="card-chart-header"><h3>Filled order history</h3><span>{orders.length} fills</span></div>
   <div className="table-wrapper"><table className="table"><thead><tr><th>Time</th><th>Side</th><th>Asset</th><th>Quantity</th><th>Fill price</th><th>Fee</th><th>Reason</th><th>Status</th></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td>{new Date(o.createdAt).toLocaleString()}</td><td>{o.type}</td><td>{o.symbol}</td><td>{o.quantity}</td><td>{money(o.price)}</td><td>{money(o.fee)}</td><td>{o.triggerReason||'Manual'}</td><td className="text-success">{o.status}</td></tr>)}</tbody></table>{!orders.length&&<div className="table-empty">No fills yet. Place your first order above.</div>}</div>
  </GlassCard>
 </div>;
}
