import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const AppContext = createContext(null);
const STORAGE_KEY = 'crypto1_demo_exchange_v1';
const SEED_MARKETS = [
  ['bitcoin','Bitcoin','BTC',67500,2.45,42000000000],['ethereum','Ethereum','ETH',3520,1.82,18000000000],
  ['tether','Tether','USDT',1,0.01,62000000000],['binancecoin','BNB','BNB',590,-0.75,1400000000],
  ['solana','Solana','SOL',168,5.21,3200000000],['ripple','XRP','XRP',0.62,-1.35,1900000000],
  ['usd-coin','USD Coin','USDC',1,0.02,4500000000],['dogecoin','Dogecoin','DOGE',0.16,3.7,900000000],
  ['cardano','Cardano','ADA',0.45,-2.1,360000000],['avalanche-2','Avalanche','AVAX',38,1.1,280000000],
  ['chainlink','Chainlink','LINK',17.5,2.2,410000000],['tron','TRON','TRX',0.12,0.8,250000000]
].map(([id,name,symbol,price,change24,volume24]) => ({id,name,symbol,price,change24,volume24,marketCap:0,history:Array.from({length:36},(_,i)=>({price:price*(1+(Math.sin(i/4)*0.018)+(i/36*change24/100)),date:i}))}));

function readSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; }
}
function save(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { console.warn('Could not save demo account', e); }
}
const initial = readSaved() || {
  cash: 10000, funding: 5000, holdings: [], orders: [], transactions: [],
  settings: { theme: 'pink-glass', accent: '#FF5CA8', currency: 'USD', locale: 'en-US', tableDensity: 'normal' }
};

export function AppProvider({ children }) {
  const [markets,setMarkets] = useState(SEED_MARKETS);
  const [cash,setCash] = useState(initial.cash ?? 10000);
  const [funding,setFunding] = useState(initial.funding ?? 5000);
  const [holdings,setHoldings] = useState(initial.holdings || []);
  const [orders,setOrders] = useState(initial.orders || []);
  const [transactions,setTransactions] = useState(initial.transactions || []);
  const [loading,setLoading] = useState(false);
  const [marketSource,setMarketSource] = useState('Fallback demo prices');
  const [lastUpdated,setLastUpdated] = useState(null);
  const [settings,setSettings] = useState(initial.settings || {});
  const [watchlist] = useState([]);
  const [alerts] = useState([]);

  const persist = useCallback((patch) => {
    const next = { cash, funding, holdings, orders, transactions, settings, ...patch };
    save(next);
  }, [cash,funding,holdings,orders,transactions,settings]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h', { headers: { accept: 'application/json' } });
      if (!response.ok) throw new Error('Market provider returned ' + response.status);
      const rows = await response.json();
      if (!Array.isArray(rows) || !rows.length) throw new Error('Market data is empty');
      setMarkets(rows.map(c => ({
        id:c.id,name:c.name,symbol:c.symbol.toUpperCase(),image:c.image,price:Number(c.current_price)||0,
        change24:Number(c.price_change_percentage_24h)||0,volume24:Number(c.total_volume)||0,marketCap:Number(c.market_cap)||0,
        history:(c.sparkline_in_7d?.price || []).filter(Number.isFinite).map((price,i)=>({price,date:i}))
      })));
      setMarketSource('CoinGecko live market data');
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      console.warn('Live market data unavailable; showing demo prices:', error.message);
      setMarketSource('Demo prices · live feed unavailable');
      setLastUpdated(new Date().toISOString());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); const timer = setInterval(refresh, 60000); return () => clearInterval(timer); }, [refresh]);
  useEffect(() => { save({ cash, funding, holdings, orders, transactions, settings }); }, [cash, funding, holdings, orders, transactions, settings]);

  const portfolio = useMemo(() => {
    const assets = holdings.map(h => ({...h}));
    const totalBase = assets.reduce((s,h)=>s+h.quantity*h.avgBuyPrice,0);
    const totalValue = assets.reduce((s,h)=>s+h.quantity*(markets.find(m=>m.id===h.id)?.price || h.avgBuyPrice),0);
    return { totalValue: totalValue + cash, investedValue:totalValue, totalBase, totalPl:totalValue-totalBase, assets };
  },[holdings,markets,cash]);

  const trade = useCallback(({side,assetId,quantity,stopLoss=0,takeProfit=0,triggerReason=''}) => {
    const asset = markets.find(m=>m.id===assetId);
    const qty = Number(quantity);
    if (!asset || !Number.isFinite(qty) || qty <= 0) throw new Error('Select a valid asset and quantity.');
    const price = asset.price;
    const gross = price * qty;
    const fee = gross * 0.001;
    const sl=Number(stopLoss)||0, tp=Number(takeProfit)||0;
    if(side==='buy'&&sl>0&&sl>=price) throw new Error('Stop-loss must be below the current market price for a long position.');
    if(side==='buy'&&tp>0&&tp<=price) throw new Error('Take-profit must be above the current market price for a long position.');
    if (side === 'buy') {
      const total = gross + fee;
      if (total > cash) throw new Error('Insufficient USD balance. Add demo funds or reduce quantity.');
      setCash(v=>{const n=v-total; persist({cash:n}); return n;});
      setHoldings(prev=>{
        const old=prev.find(h=>h.id===asset.id);
        const next=old?prev.map(h=>h.id===asset.id?{...h,quantity:h.quantity+qty,avgBuyPrice:((h.quantity*h.avgBuyPrice)+gross)/(h.quantity+qty),stopLoss:sl||h.stopLoss||0,takeProfit:tp||h.takeProfit||0}:h):[...prev,{id:asset.id,name:asset.name,symbol:asset.symbol,quantity:qty,avgBuyPrice:price,stopLoss:sl,takeProfit:tp}];
        persist({holdings:next}); return next;
      });
    } else if (side === 'sell') {
      const old=holdings.find(h=>h.id===asset.id);
      if (!old || old.quantity < qty) throw new Error('Insufficient ' + asset.symbol + ' holdings to sell.');
      const proceeds=gross-fee;
      setCash(v=>{const n=v+proceeds; persist({cash:n}); return n;});
      setHoldings(prev=>{const next=prev.map(h=>h.id===asset.id?{...h,quantity:h.quantity-qty}:h).filter(h=>h.quantity>1e-10);persist({holdings:next});return next;});
    } else throw new Error('Unsupported order type.');
    const order={id:'ORD-'+Date.now(),type:side.toUpperCase(),assetId:asset.id,symbol:asset.symbol,name:asset.name,quantity:qty,price,total:gross,fee,stopLoss:sl,takeProfit:tp,triggerReason,status:'FILLED',createdAt:new Date().toISOString()};
    setOrders(prev=>{const next=[order,...prev].slice(0,100);persist({orders:next});return next;});
    setTransactions(prev=>{const next=[{id:'TX-'+Date.now(),type:side.toUpperCase(),description:side.toUpperCase()+' '+qty+' '+asset.symbol,amount:side==='buy'?-gross:gross,createdAt:new Date().toISOString()},...prev].slice(0,100);persist({transactions:next});return next;});
    return order;
  },[markets,holdings,cash,persist]);

  // Simulated protective exits: evaluate saved stop-loss / take-profit levels on every market update.
  useEffect(() => {
    const triggered = holdings.find(h => {
      const current = markets.find(m => m.id === h.id)?.price;
      return current > 0 && h.quantity > 0 && ((h.stopLoss > 0 && current <= h.stopLoss) || (h.takeProfit > 0 && current >= h.takeProfit));
    });
    if (triggered) {
      const current = markets.find(m => m.id === triggered.id)?.price;
      const reason = triggered.stopLoss > 0 && current <= triggered.stopLoss ? 'STOP_LOSS' : 'TAKE_PROFIT';
      try { trade({ side: 'sell', assetId: triggered.id, quantity: triggered.quantity, triggerReason: reason }); }
      catch (error) { console.warn('Protective exit failed:', error.message); }
    }
  }, [markets, holdings, trade]);

  const moveFunds = useCallback(({from,to,amount})=>{
    const value=Number(amount);
    if(!Number.isFinite(value)||value<=0||from===to) throw new Error('Enter a valid transfer amount and different accounts.');
    if(from==='funding'&&value>funding) throw new Error('Insufficient funding wallet balance.');
    if(from==='spot'&&value>cash) throw new Error('Insufficient spot wallet balance.');
    const nextCash=from==='spot'?cash-value:cash+value;
    const nextFunding=from==='funding'?funding-value:funding+value;
    setCash(nextCash);setFunding(nextFunding);persist({cash:nextCash,funding:nextFunding});
    setTransactions(prev=>{const next=[{id:'TX-'+Date.now(),type:'TRANSFER',description:'Transfer '+from+' → '+to,amount:value,createdAt:new Date().toISOString()},...prev];persist({transactions:next});return next;});
  },[cash,funding,persist]);

  const addDemoFunds = useCallback(({type,amount})=>{
    const value=Number(amount); if(!Number.isFinite(value)||value<=0||value>1000000) throw new Error('Enter an amount between $0 and $1,000,000.');
    if(type==='deposit'){setCash(v=>{const n=v+value;persist({cash:n});return n;});}
    else {if(value>cash)throw new Error('Insufficient USD balance.');setCash(v=>{const n=v-value;persist({cash:n});return n;});}
    setTransactions(prev=>{const next=[{id:'TX-'+Date.now(),type:type.toUpperCase(),description:'Demo '+type,amount:value,createdAt:new Date().toISOString()},...prev];persist({transactions:next});return next;});
  },[cash,persist]);

  const value = { markets, portfolio, cash, balances:cash+funding, funding, holdings, orders, transactions, watchlist, alerts, settings, loading, error:null, marketSource, lastUpdated, refresh, trade, moveFunds, addDemoFunds, toasts:[], showToast:()=>{}, dismissToast:()=>{} };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp(){const ctx=useContext(AppContext);if(!ctx)throw new Error('useApp must be used within AppProvider');return ctx;}
