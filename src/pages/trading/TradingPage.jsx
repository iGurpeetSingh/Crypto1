import { useEffect, useMemo, useState } from 'react';
import { GlassCard } from '../../components/common/GlassCard';
import PriceChart from '../../components/charts/PriceChart';
import { useApp } from '../../context/AppContext';
import './TradingPage.css';

const money=(n,d=2)=>Number(n||0).toLocaleString(undefined,{minimumFractionDigits:d,maximumFractionDigits:d});
const pairFor=s=>String(s||'BTC').toUpperCase().replace(/USDT$/,'')+'USDT';
const timeOf=t=>new Date(t).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'});

export default function TradingPage(){
 const {markets,trade,placeLimitOrder,cancelLimitOrder,orders,pendingOrders,cash,holdings,marketSource,transactions}=useApp();
 const [assetId,setAssetId]=useState('bitcoin'),[side,setSide]=useState('buy');
 const [orderType,setOrderType]=useState('limit'),[quantity,setQuantity]=useState('0.001');
 const [limitPrice,setLimitPrice]=useState(''),[stopLoss,setStopLoss]=useState(''),[takeProfit,setTakeProfit]=useState('');
 const [message,setMessage]=useState(''),[error,setError]=useState('');
 const [book,setBook]=useState({bids:[],asks:[]}),[recentTrades,setRecentTrades]=useState([]);
 const [feedState,setFeedState]=useState('Connecting to Binance public market feed');
 const [tableTab,setTableTab]=useState('open'),[bookMode,setBookMode]=useState('both');
 const [lastTick,setLastTick]=useState(Date.now());
 const asset=markets.find(m=>m.id===assetId)||markets[0];
 const pair=pairFor(asset?.symbol),price=Number(asset?.price||0),qty=Number(quantity)||0;
 const holding=holdings.find(h=>h.id===asset?.id),maxQty=side==='buy'?cash/(Math.max(price,1e-10)*1.001):Number(holding?.quantity||0);
 const executionPrice=orderType==='limit'?(Number(limitPrice)||price):price;
 const total=executionPrice*qty,fee=total*.001,estimated=side==='buy'?total+fee:total-fee;
 const openOrders=pendingOrders.filter(o=>o.status==='OPEN');
 const marketOrders=orders.filter(o=>o.symbol===asset?.symbol);
 const change=Number(asset?.change24||0);

 useEffect(()=>{
  let stopped=false,timer;
  const load=async()=>{
   try{
    const [depthRes,tradesRes]=await Promise.all([
     fetch('https://api.binance.com/api/v3/depth?symbol='+pair+'&limit=12'),
     fetch('https://api.binance.com/api/v3/trades?symbol='+pair+'&limit=18')
    ]);
    if(!depthRes.ok||!tradesRes.ok)throw new Error('Binance public feed unavailable');
    const [depth,ticks]=await Promise.all([depthRes.json(),tradesRes.json()]);
    if(stopped)return;
    setBook({bids:(depth.bids||[]).slice(0,12),asks:(depth.asks||[]).slice(0,12).reverse()});
    setRecentTrades((ticks||[]).slice().reverse());
    setFeedState('Binance spot · live public feed');
    setLastTick(Date.now());
   }catch(e){if(!stopped)setFeedState('Live order book unavailable · chart and demo ledger remain available');}
  };
  load();timer=setInterval(load,5000);
  return()=>{stopped=true;clearInterval(timer);};
 },[pair]);

 const submit=e=>{
  e.preventDefault();setMessage('');setError('');
  try{
   if(!asset)throw new Error('Select a market first.');
   if(orderType==='limit'){
    const order=placeLimitOrder({side,assetId,quantity:qty,limitPrice:Number(limitPrice),stopLoss,takeProfit});
    setMessage('Limit order placed · '+order.id+' · waiting for '+money(order.limitPrice));
   }else{
    const order=trade({side,assetId,quantity:qty,stopLoss,takeProfit});
    setMessage(order.type+' market order filled · '+order.quantity+' '+order.symbol+' at $'+money(order.price));
   }
  }catch(e){setError(e.message);}
 };
 const pct=v=>maxQty>0?(maxQty*v).toFixed(8):'0';
 const depthRows=useMemo(()=>{
  const asks=book.asks.map(([p,q])=>({price:Number(p),qty:Number(q),side:'ask'}));
  const bids=book.bids.map(([p,q])=>({price:Number(p),qty:Number(q),side:'bid'}));
  return {asks,bids};
 },[book]);
 const activeRows=tableTab==='open'?openOrders:tableTab==='orders'?orders:tableTab==='trades'?marketOrders:transactions;

 return <div className="page-content binance-terminal">
  <div className="terminal-market-head">
   <div className="terminal-pair">
    <select aria-label="Trading market" value={assetId} onChange={e=>{setAssetId(e.target.value);setLimitPrice('');setStopLoss('');setTakeProfit('');}}>
     {markets.map(m=><option key={m.id} value={m.id}>{m.symbol}/USDT · {m.name}</option>)}
    </select>
    <div className="terminal-price-line"><strong>${money(price)}</strong><span className={change>=0?'positive':'negative'}>{change>=0?'+':''}{change.toFixed(2)}%</span></div>
    <small>{asset?.name} · {pair}</small>
   </div>
   <div className="terminal-stat"><small>24h High</small><b>${money(asset?.high24||price*1.025)}</b></div>
   <div className="terminal-stat"><small>24h Low</small><b>${money(asset?.low24||price*.975)}</b></div>
   <div className="terminal-stat"><small>24h Volume</small><b>${money(asset?.volume24||0,0)}</b></div>
   <div className="terminal-status"><i/> {feedState}</div>
  </div>

  <div className="terminal-workspace">
   <section className="terminal-book terminal-panel">
    <div className="terminal-panel-title"><b>Order Book</b><select value={bookMode} onChange={e=>setBookMode(e.target.value)} aria-label="Order book view"><option value="both">Both</option><option value="bids">Bids</option><option value="asks">Asks</option></select></div>
    <div className="book-labels"><span>Price (USDT)</span><span>Amount ({asset?.symbol})</span></div>
    {bookMode!=='bids'&&depthRows.asks.map((r,i)=><div className="book-row ask" key={'a'+i}><span>{money(r.price,price<1?5:2)}</span><span>{money(r.qty,4)}</span><i style={{width:Math.min(100,r.qty/(Math.max(...depthRows.asks.map(x=>x.qty),.000001))*100)+'%'}}/></div>)}
    <div className="book-mid-price"><b>${money(price)}</b><span className={change>=0?'positive':'negative'}>{change>=0?'▲':'▼'} {Math.abs(change).toFixed(2)}%</span></div>
    {bookMode!=='asks'&&depthRows.bids.map((r,i)=><div className="book-row bid" key={'b'+i}><span>{money(r.price,price<1?5:2)}</span><span>{money(r.qty,4)}</span><i style={{width:Math.min(100,r.qty/(Math.max(...depthRows.bids.map(x=>x.qty),.000001))*100)+'%'}}/></div>)}
    {!depthRows.bids.length&&!depthRows.asks.length&&<p className="terminal-muted">Waiting for live order book…</p>}
   </section>

   <div className="terminal-center">
    <section className="terminal-panel terminal-chart-panel">
     <div className="terminal-chart-title"><div><b>{pair}</b><span className="terminal-live"><i/> LIVE</span></div><small>Spot · Candlestick chart</small></div>
     <PriceChart data={asset?.history||[]} title={asset?.symbol||'BTC'} symbol={asset?.symbol||'BTC'} height={390}/>
    </section>
    <section className="terminal-panel terminal-order-entry">
     <div className="terminal-order-heading"><b>Spot</b><span>Available <strong>${money(cash)}</strong></span><span>Fee <strong>0.10%</strong></span></div>
     <div className="terminal-order-grid">
      <form onSubmit={submit} className="terminal-order-form">
       <div className="terminal-order-tabs"><button type="button" className={side==='buy'?'selected buy':'buy'} onClick={()=>{setSide('buy');setMessage('');setError('');}}>Buy {asset?.symbol}</button><button type="button" className={side==='sell'?'selected sell':'sell'} onClick={()=>{setSide('sell');setMessage('');setError('');}}>Sell {asset?.symbol}</button></div>
       <div className="terminal-type-tabs"><button type="button" className={orderType==='limit'?'active':''} onClick={()=>setOrderType('limit')}>Limit</button><button type="button" className={orderType==='market'?'active':''} onClick={()=>setOrderType('market')}>Market</button></div>
       {orderType==='limit'&&<label>Price (USDT)<input type="number" min="0.00000001" step="any" required value={limitPrice} onChange={e=>setLimitPrice(e.target.value)} placeholder={money(price)}/></label>}
       <label>Amount ({asset?.symbol})<input type="number" min="0.00000001" step="any" required value={quantity} onChange={e=>setQuantity(e.target.value)} placeholder="0.00"/></label>
       <div className="terminal-percent">{[.25,.5,.75,1].map(v=><button type="button" key={v} onClick={()=>setQuantity(pct(v))}>{v===1?'100%':v*100+'%'}</button>)}</div>
       <div className="terminal-order-total"><span>Est. Total</span><b>${money(estimated)} USDT</b></div>
       <button className={'terminal-submit '+side} type="submit" disabled={!asset||qty<=0||(orderType==='limit'&&!(Number(limitPrice)>0))||(side==='sell'&&qty>Number(holding?.quantity||0))}>{side==='buy'?'Buy':'Sell'} {asset?.symbol}</button>
       <div className="terminal-balance-line"><span>Available {side==='buy'?'USDT':' '+asset?.symbol}</span><b>{side==='buy'?money(cash):money(holding?.quantity||0,6)}</b></div>
       {message&&<p className="terminal-success" role="status">{message}</p>}{error&&<p className="terminal-error" role="alert">{error}</p>}
      </form>
      <div className="terminal-protection">
       <b>Advanced settings</b>
       <label>Stop-loss (USDT)<input type="number" min="0" step="any" value={stopLoss} onChange={e=>setStopLoss(e.target.value)} placeholder="Optional"/></label>
       <label>Take-profit (USDT)<input type="number" min="0" step="any" value={takeProfit} onChange={e=>setTakeProfit(e.target.value)} placeholder="Optional"/></label>
       <div className="terminal-fee-note">Market orders execute immediately in your simulated spot wallet. Limit orders wait for the selected price while this browser app is open. Trading is simulated; no exchange order is submitted.</div>
      </div>
     </div>
    </section>
   </div>

   <aside className="terminal-right">
    <section className="terminal-panel">
     <div className="terminal-panel-title"><b>Market Trades</b><small>Live</small></div>
     <div className="terminal-trade-head"><span>Price (USDT)</span><span>Amount</span><span>Time</span></div>
     <div className="terminal-tape">{recentTrades.map(t=><div className={t.isBuyerMaker?'negative':'positive'} key={t.id}><span>{money(t.price,price<1?5:2)}</span><span>{money(t.qty,4)}</span><span>{timeOf(t.time)}</span></div>)}
      {!recentTrades.length&&<p className="terminal-muted">Waiting for trades…</p>}
     </div>
     <div className="terminal-feed-foot">Updated {timeOf(lastTick)}</div>
    </section>
    <section className="terminal-panel terminal-wallet-mini">
     <b>Spot Wallet</b><strong>${money(cash)}</strong><small>Available demo balance</small>
     <a href="/wallet">Open Wallet →</a>
    </section>
   </aside>
  </div>

  <section className="terminal-panel terminal-history">
   <div className="terminal-history-tabs">
    {[['open','Open Orders',openOrders.length],['orders','Order History',orders.length],['trades','My Trades',marketOrders.length],['funds','Funds',transactions.length]].map(([id,label,count])=><button key={id} className={tableTab===id?'active':''} onClick={()=>setTableTab(id)}>{label} <span>{count}</span></button>)}
   </div>
   <div className="terminal-table-scroll"><table><thead><tr>{tableTab==='open'?<><th>Date</th><th>Pair</th><th>Type</th><th>Side</th><th>Price</th><th>Amount</th><th>Status</th><th>Action</th></>:tableTab==='funds'?<><th>Date</th><th>Type</th><th>Description</th><th>Amount</th></>:<><th>Date</th><th>Pair</th><th>Side</th><th>Price</th><th>Amount</th><th>Fee</th><th>Status</th></>}</tr></thead><tbody>
    {activeRows.map((o,i)=><tr key={o.id||i}>{tableTab==='open'?<><td>{new Date(o.createdAt).toLocaleString()}</td><td>{o.symbol}/USDT</td><td>Limit</td><td className={o.side==='BUY'?'positive':'negative'}>{o.side}</td><td>{money(o.limitPrice)}</td><td>{money(o.quantity,6)}</td><td>{o.status}</td><td>{o.status==='OPEN'&&<button className="terminal-cancel" onClick={()=>cancelLimitOrder(o.id)}>Cancel</button>}</td></>:tableTab==='funds'?<><td>{new Date(o.createdAt).toLocaleString()}</td><td>{o.type}</td><td>{o.description}</td><td>{money(o.amount)}</td></>:<><td>{new Date(o.createdAt).toLocaleString()}</td><td>{o.symbol}/USDT</td><td className={o.type==='BUY'?'positive':'negative'}>{o.type}</td><td>{money(o.price)}</td><td>{money(o.quantity,6)}</td><td>{money(o.fee)}</td><td>{o.status}</td></>}</tr>)}
    </tbody></table>{!activeRows.length&&<div className="terminal-empty">No records yet. Your orders and trades will appear here.</div>}</div>
   <div className="terminal-disclaimer">Market data is supplied by public exchange endpoints. Orders are simulated in CryptoDash and do not execute on Binance or any real exchange.</div>
  </section>
 </div>;
}
