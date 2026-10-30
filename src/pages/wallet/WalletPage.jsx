import {apiUrl} from '../../services/api';
import {useEffect,useState} from 'react';
import {GlassCard} from '../../components/common/GlassCard';
import MetricCard from '../../components/cards/MetricCard';
import {useApp} from '../../context/AppContext';
import {getSessionToken,getStoredProfile,saveStoredProfile} from '../../services/auth';
const money=n=>'$'+Number(n||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
const inr=n=>'₹'+Number(n||0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});
function loadRazorpay(){
 return new Promise((resolve,reject)=>{
  if(window.Razorpay){resolve(true);return;}
  const script=document.createElement('script');script.src='https://checkout.razorpay.com/v1/checkout.js';script.async=true;
  script.onload=()=>resolve(true);script.onerror=()=>reject(new Error('Could not load Razorpay checkout. Check network access.'));
  document.body.appendChild(script);
 });
}
export default function WalletPage(){
 const {cash,funding,transactions,moveFunds,addDemoFunds,holdings,markets}=useApp();
 const [amount,setAmount]=useState('100');const [from,setFrom]=useState('funding');const [to,setTo]=useState('spot');const [notice,setNotice]=useState('');const [error,setError]=useState('');
 const [inrAmount,setInrAmount]=useState('500');const [inrBalance,setInrBalance]=useState(Number(getStoredProfile()?.balanceInr||0));
 const [paymentBusy,setPaymentBusy]=useState(false),[paymentMessage,setPaymentMessage]=useState(''),[paymentError,setPaymentError]=useState('');
 const run=fn=>{setNotice('');setError('');try{fn();setNotice('Demo transaction completed.');}catch(e){setError(e.message)}};
 const refreshRealWallet=async()=>{
  const token=getSessionToken();if(!token)return;
  const response=await fetch(apiUrl('/api/profile/me'),{headers:{Authorization:'Bearer '+token}});
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(data.error||'Could not load real wallet balance');
  setInrBalance(Number(data.profile.balanceInr||0));saveStoredProfile(data.profile);
 };
 useEffect(()=>{refreshRealWallet().catch(e=>setPaymentError(e.message));},[]);
 const startPayment=async()=>{
  setPaymentError('');setPaymentMessage('');
  const token=getSessionToken();
  if(!token){setPaymentError('Real payments require a verified account. Sign in with email OTP first.');return;}
  const amountValue=Number(inrAmount);
  if(!Number.isInteger(amountValue)||amountValue<100||amountValue>500000){setPaymentError('Enter a whole amount between ₹100 and ₹5,00,000.');return;}
  setPaymentBusy(true);
  try{
   const response=await fetch(apiUrl('/api/payments/create-order',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({amountInr:amountValue})});
   const order=await response.json().catch(()=>({}));
   if(!response.ok)throw new Error(order.error||'Payment order creation failed.');
   await loadRazorpay();
   const checkout=new window.Razorpay({
    key:order.keyId,amount:order.amount,currency:order.currency,order_id:order.orderId,
    name:'CryptoDash',description:'Add funds to your INR wallet',
    prefill:{email:getStoredProfile()?.email||''},
    theme:{color:'#2563EB'},
    handler:async payment=>{
     try{
      const verified=await fetch(apiUrl('/api/payments/verify',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify(payment)});
      const result=await verified.json().catch(()=>({}));
      if(!verified.ok)throw new Error(result.error||'Payment verification failed.');
      await refreshRealWallet();
      setPaymentMessage(result.message||'Payment verified and wallet credited.');
     }catch(e){setPaymentError(e.message);}
    },
    modal:{ondismiss:()=>setPaymentBusy(false)}
   });
   checkout.on('payment.failed',event=>setPaymentError(event.error?.description||'Payment failed. No balance was added.'));
   checkout.open();
  }catch(e){setPaymentError(e.message);}finally{setPaymentBusy(false);}
 };
 return <div className="page-content"><GlassCard className="page-header"><h1>Wallet</h1><p className="page-subtitle">Real INR payment wallet and simulated crypto trading balances</p></GlassCard>
  <GlassCard className="real-wallet-card"><div className="real-wallet-heading"><div><span className="real-wallet-eyebrow">PAYMENT WALLET · INR</span><h2>{inr(inrBalance)}</h2><p>Server-verified balance from captured Razorpay payments</p></div><span className="payment-secure-pill">Secure checkout</span></div>
   <div className="real-wallet-deposit"><label>Deposit amount (INR)<input type="number" min="100" max="500000" step="1" value={inrAmount} onChange={e=>setInrAmount(e.target.value)}/></label><button className="btn btn--primary" onClick={startPayment} disabled={paymentBusy}>{paymentBusy?'Opening checkout…':'Add money with Razorpay'}</button></div>
   {paymentMessage&&<p className="text-success" role="status">{paymentMessage}</p>}{paymentError&&<p className="text-danger" role="alert">{paymentError}</p>}
   <p className="account-hint">Live payments are enabled only after Supabase, Resend and Razorpay environment variables and database schema are configured in Vercel.</p>
  </GlassCard>
  <div className="grid grid-3"><MetricCard label="Spot USD (demo)" value={money(cash)} subtitle="Available for simulated trading" accent="#42DDAA"/><MetricCard label="Funding USD (demo)" value={money(funding)} subtitle="Internal demo wallet" accent="#C084FC"/><MetricCard label="Crypto assets" value={holdings.length} subtitle="Coins held in demo account" accent="#FF5CA8"/></div>
  <div className="grid grid-2" style={{marginTop:20}}><GlassCard><h3>Demo deposit / withdraw</h3><p style={{margin:'8px 0 16px',opacity:.7}}>This section changes simulated USD only. It does not process money.</p><input type="number" min="0.01" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} style={{width:'100%',padding:12,marginBottom:12}}/><div className="grid grid-2"><button className="btn btn--primary" onClick={()=>run(()=>addDemoFunds({type:'deposit',amount}))}>Add demo funds</button><button className="btn btn--secondary" onClick={()=>run(()=>addDemoFunds({type:'withdraw',amount}))}>Withdraw demo funds</button></div></GlassCard>
   <GlassCard><h3>Internal demo transfer</h3><div style={{display:'grid',gap:12,marginTop:14}}><label>From<select value={from} onChange={e=>setFrom(e.target.value)} style={{width:'100%',padding:10}}><option value="funding">Funding wallet</option><option value="spot">Spot wallet</option></select></label><label>To<select value={to} onChange={e=>setTo(e.target.value)} style={{width:'100%',padding:10}}><option value="spot">Spot wallet</option><option value="funding">Funding wallet</option></select></label><label>Amount (USD)<input type="number" min="0.01" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} style={{width:'100%',padding:10}}/></label><button className="btn btn--primary" onClick={()=>run(()=>moveFunds({from,to,amount}))}>Transfer</button></div></GlassCard></div>
  {(notice||error)&&<p className={error?'text-danger':'text-success'}>{error||notice}</p>}
  <GlassCard className="card-chart"><h3>Asset balances</h3><div className="table-wrapper"><table className="table"><thead><tr><th>Asset</th><th>Quantity</th><th>Market value</th></tr></thead><tbody>{holdings.map(h=>{const p=markets.find(m=>m.id===h.id)?.price||h.avgBuyPrice;return <tr key={h.id}><td>{h.name} ({h.symbol})</td><td>{h.quantity.toFixed(8)}</td><td>{money(h.quantity*p)}</td></tr>})}</tbody></table>{!holdings.length&&<div className="table-empty">No crypto holdings. Buy an asset from Spot Trading.</div>}</div></GlassCard>
  <GlassCard className="card-chart"><h3>Demo transaction history</h3><div className="table-wrapper"><table className="table"><thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Amount</th></tr></thead><tbody>{transactions.map(t=><tr key={t.id}><td>{new Date(t.createdAt).toLocaleString()}</td><td>{t.type}</td><td>{t.description}</td><td>{money(t.amount)}</td></tr>)}</tbody></table>{!transactions.length&&<div className="table-empty">No demo transactions yet.</div>}</div></GlassCard>
 </div>;
}
