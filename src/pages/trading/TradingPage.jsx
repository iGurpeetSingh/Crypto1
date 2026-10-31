import { useEffect, useMemo, useState } from 'react';
import PriceChart from '../../components/charts/PriceChart';
import { useApp } from '../../context/AppContext';
import './TradingPage.css';

const money = (n, digits = 2) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
const signedMoney = n => (Number(n) > 0 ? '+' : Number(n) < 0 ? '-' : '') + '$' + money(Math.abs(Number(n || 0)));
const dayKey = value => { const d = new Date(value); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const pairFor = symbol => String(symbol || 'BTC').toUpperCase().replace(/USDT$/, '') + 'USDT';

export default function TradingPage() {
  const { markets, trade, placeLimitOrder, cancelLimitOrder, orders, pendingOrders, cash, holdings, transactions, portfolio } = useApp();
  const [assetId, setAssetId] = useState('bitcoin');
  const [side, setSide] = useState('buy');
  const [orderType, setOrderType] = useState('market');
  const [quantity, setQuantity] = useState('0.001');
  const [limitPrice, setLimitPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tableTab, setTableTab] = useState('trades');
  const [book, setBook] = useState({ bids: [], asks: [] });
  const [recentTrades, setRecentTrades] = useState([]);
  const [feedState, setFeedState] = useState('Connecting to public market feed');
  const [lastTick, setLastTick] = useState(Date.now());

  const asset = markets.find(m => m.id === assetId) || markets[0];
  const pair = pairFor(asset?.symbol);
  const price = Number(asset?.price || 0);
  const qty = Number(quantity) || 0;
  const holding = holdings.find(h => h.id === asset?.id);
  const openOrders = pendingOrders.filter(o => o.status === 'OPEN');
  const marketTrades = orders.filter(o => o.symbol === asset?.symbol);
  const total = price * qty;
  const fee = total * 0.001;
  const estimated = side === 'buy' ? total + fee : total - fee;
  const maxQty = side === 'buy' ? cash / Math.max(price * 1.001, 0.00000001) : Number(holding?.quantity || 0);

  const dailyMap = useMemo(() => {
    const map = {};
    orders.forEach(order => {
      const key = dayKey(order.createdAt);
      if (!map[key]) map[key] = { count: 0, realized: 0 };
      map[key].count += 1;
      map[key].realized += Number(order.realizedPnl || 0);
      if (order.type === 'BUY') {
        const currentPrice = Number(markets.find(m => m.id === order.assetId)?.price || order.price);
        map[key].realized += (currentPrice - Number(order.price)) * Number(order.quantity);
      }
    });
    return map;
  }, [orders, markets]);
  const today = dailyMap[dayKey(new Date())] || { count: 0, realized: 0 };
  const liveOpenPl = Number(portfolio?.unrealizedPl || 0);
  const todayPl = today.realized;
  const totalRealized = orders.reduce((sum, order) => sum + Number(order.realizedPnl || 0), 0);
  const activityDays = useMemo(() => {
    const end = new Date(); end.setHours(0, 0, 0, 0);
    const start = new Date(end); start.setDate(end.getDate() - 363); start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    return Array.from({ length: 364 }, (_, i) => {
      const date = new Date(start); date.setDate(start.getDate() + i);
      const key = dayKey(date);
      return { key, ...(dailyMap[key] || { count: 0, realized: 0 }) };
    });
  }, [dailyMap]);

  useEffect(() => {
    let stopped = false;
    const load = async () => {
      try {
        const [depthResponse, tradesResponse] = await Promise.all([
          fetch('https://api.binance.com/api/v3/depth?symbol=' + pair + '&limit=10'),
          fetch('https://api.binance.com/api/v3/trades?symbol=' + pair + '&limit=12')
        ]);
        if (!depthResponse.ok || !tradesResponse.ok) throw new Error('Public feed unavailable');
        const [depth, ticks] = await Promise.all([depthResponse.json(), tradesResponse.json()]);
        if (stopped) return;
        setBook({ bids: depth.bids || [], asks: (depth.asks || []).slice().reverse() });
        setRecentTrades((ticks || []).slice().reverse());
        setFeedState('Binance public market feed');
        setLastTick(Date.now());
      } catch {
        if (!stopped) setFeedState('Public feed unavailable · simulated trading still works');
      }
    };
    load();
    const timer = setInterval(load, 5000);
    return () => { stopped = true; clearInterval(timer); };
  }, [pair]);

  const submit = event => {
    event.preventDefault(); setMessage(''); setError('');
    try {
      if (!asset || !qty || qty <= 0) throw new Error('Enter a valid trade amount.');
      if (orderType === 'limit') {
        const order = placeLimitOrder({ side, assetId, quantity: qty, limitPrice: Number(limitPrice), stopLoss, takeProfit });
        setMessage('Limit order ' + order.id + ' saved. It will fill when market price reaches your limit.');
      } else {
        const order = trade({ side, assetId, quantity: qty, stopLoss, takeProfit });
        setMessage(order.type + ' filled: ' + money(order.quantity, 6) + ' ' + order.symbol + ' at $' + money(order.price));
      }
    } catch (err) { setError(err.message || 'Trade could not be placed.'); }
  };

  const rows = tableTab === 'open' ? openOrders : tableTab === 'funds' ? transactions : tableTab === 'trades' ? marketTrades : orders;
  const livePnlFor = order => {
    if (order.type === 'SELL') return Number(order.realizedPnl || 0);
    const livePrice = Number(markets.find(m => m.id === order.assetId)?.price || order.price);
    return (livePrice - Number(order.price)) * Number(order.quantity);
  };

  return <div className="page-content binance-terminal">
    <div className="exchange-ticker-strip">{markets.slice(0,7).map(m=><div className="exchange-ticker" key={m.id}><b>{m.symbol}/USDT</b><span>{money(m.price, m.price<1?4:2)}</span><em className={(m.change24||0)>=0?'positive':'negative'}>{(m.change24||0)>=0?'+':''}{money(m.change24||0)}%</em></div>)}</div>
    <div className="terminal-market-head exchange-market-head">
      <div className="terminal-pair">
        <select aria-label="Trading market" value={assetId} onChange={e => { setAssetId(e.target.value); setLimitPrice(''); }}>
          {markets.map(m => <option key={m.id} value={m.id}>{m.symbol}/USDT · {m.name}</option>)}
        </select>
        <div className="terminal-price-line"><strong>${money(price)}</strong><span className={(asset?.change24 || 0) >= 0 ? 'positive' : 'negative'}>{(asset?.change24 || 0) >= 0 ? '+' : ''}{money(asset?.change24 || 0)}%</span></div>
        <small>{asset?.name} · {pair}</small>
      </div>
      <div className="terminal-stat"><small>24h Change</small><b className={(asset?.change24||0)>=0?'positive':'negative'}>{(asset?.change24||0)>=0?'+':''}{money(asset?.change24||0)}%</b></div>
      <div className="terminal-stat"><small>24h High</small><b>${money(asset?.high24 || price)}</b></div>
      <div className="terminal-stat"><small>24h Low</small><b>${money(asset?.low24 || price)}</b></div>
      <div className="terminal-stat"><small>24h Volume</small><b>${money(asset?.volume24 || 0, 0)}</b></div>
      <div className="terminal-status"><i />{feedState}</div>
    </div>

    <div className="terminal-workspace">
      <section className="terminal-book terminal-panel">
        <div className="terminal-panel-title"><b>Order Book</b></div>
        <div className="book-labels"><span>Price (USDT)</span><span>Amount</span></div>
        {book.asks.map(([p, q], i) => <div className="book-row ask" key={'a' + i}><span>{money(p)}</span><span>{money(q, 4)}</span></div>)}
        <div className="book-mid-price"><b>${money(price)}</b></div>
        {book.bids.map(([p, q], i) => <div className="book-row bid" key={'b' + i}><span>{money(p)}</span><span>{money(q, 4)}</span></div>)}
        {!book.bids.length && !book.asks.length && <p className="terminal-muted">Waiting for public order book…</p>}
      </section>

      <div className="terminal-center">
        <section className="terminal-panel terminal-chart-panel">
          <div className="terminal-chart-title"><b>{pair}</b><small>Market chart · public prices</small></div>
          <PriceChart data={asset?.history || []} title={asset?.symbol || 'BTC'} symbol={asset?.symbol || 'BTC'} height={360} />
        </section>
        <section className="terminal-panel terminal-order-entry">
          <div className="terminal-order-heading"><b>Demo Spot Trading</b><span>Available <strong>${money(cash)}</strong></span><span>Fee <strong>0.10%</strong></span></div>
          <div className="terminal-order-grid">
            <form onSubmit={submit} className="terminal-order-form">
              <div className="terminal-order-tabs">
                <button type="button" className={side === 'buy' ? 'selected buy' : 'buy'} onClick={() => setSide('buy')}>Buy {asset?.symbol}</button>
                <button type="button" className={side === 'sell' ? 'selected sell' : 'sell'} onClick={() => setSide('sell')}>Sell {asset?.symbol}</button>
              </div>
              <div className="terminal-type-tabs">
                <button type="button" className={orderType === 'market' ? 'active' : ''} onClick={() => setOrderType('market')}>Market</button>
                <button type="button" className={orderType === 'limit' ? 'active' : ''} onClick={() => setOrderType('limit')}>Limit</button>
              </div>
              {orderType === 'limit' && <label>Limit Price (USDT)<input type="number" min="0.00000001" step="any" required value={limitPrice} onChange={e => setLimitPrice(e.target.value)} placeholder={money(price)} /></label>}
              <label>Amount ({asset?.symbol})<input type="number" min="0.00000001" step="any" required value={quantity} onChange={e => setQuantity(e.target.value)} /></label>
              <div className="terminal-percent">{[0.25, 0.5, 0.75, 1].map(v => <button type="button" key={v} onClick={() => setQuantity((maxQty * v).toFixed(8))}>{v * 100}%</button>)}</div>
              <div className="terminal-order-total"><span>Estimated total</span><b>${money(estimated)} USDT</b></div>
              <button className={'terminal-submit ' + side} type="submit" disabled={!asset || qty <= 0 || (orderType === 'limit' && !(Number(limitPrice) > 0)) || (side === 'sell' && qty > Number(holding?.quantity || 0))}>{side === 'buy' ? 'Buy' : 'Sell'} {asset?.symbol}</button>
              <div className="terminal-balance-line"><span>Available {side === 'buy' ? 'USD' : asset?.symbol}</span><b>{side === 'buy' ? money(cash) : money(holding?.quantity || 0, 8)}</b></div>
              {message && <p className="terminal-success" role="status">{message}</p>}
              {error && <p className="terminal-error" role="alert">{error}</p>}
            </form>
            <div className="terminal-protection">
              <b>Risk controls</b>
              <label>Stop-loss<input type="number" min="0" step="any" value={stopLoss} onChange={e => setStopLoss(e.target.value)} placeholder="Optional" /></label>
              <label>Take-profit<input type="number" min="0" step="any" value={takeProfit} onChange={e => setTakeProfit(e.target.value)} placeholder="Optional" /></label>
              <div className="terminal-fee-note">Market orders fill immediately at the current displayed price. Limit orders wait for the selected price. All orders are simulated and use the single $500 demo wallet.</div>
            </div>
          </div>
        </section>
      </div>

      <aside className="terminal-right">
        <section className="terminal-panel">
          <div className="terminal-panel-title"><b>Recent Market Trades</b><small>Live public feed</small></div>
          <div className="terminal-trade-head"><span>Price</span><span>Amount</span><span>Time</span></div>
          <div className="terminal-tape">{recentTrades.map(t => <div className={t.isBuyerMaker ? 'negative' : 'positive'} key={t.id}><span>{money(t.price)}</span><span>{money(t.qty, 4)}</span><span>{new Date(t.time).toLocaleTimeString()}</span></div>)}</div>
          <div className="terminal-feed-foot">Updated {new Date(lastTick).toLocaleTimeString()}</div>
        </section>
        <section className="terminal-panel terminal-wallet-mini"><b>Main Demo Wallet</b><strong>${money(cash)}</strong><small>Available virtual balance</small><a href="/wallet">Open Wallet →</a></section>
      </aside>
    </div>

    <section className="terminal-panel terminal-performance exchange-performance-hidden">
      <div className="performance-heading"><div><b>Trading Performance</b><small>Daily estimated trade P/L and trade count · last 52 weeks</small></div><span>{orders.length} total trades</span></div>
      <div className="performance-metrics">
        <div><small>Today's P/L</small><strong className={todayPl >= 0 ? 'positive' : 'negative'}>{signedMoney(todayPl)}</strong><em>{today.count} trades · {signedMoney(today.realized)} closed</em></div>
        <div><small>Total realized P/L</small><strong className={totalRealized >= 0 ? 'positive' : 'negative'}>{signedMoney(totalRealized)}</strong><em>Completed sell trades</em></div>
        <div><small>Live open P/L</small><strong className={liveOpenPl >= 0 ? 'positive' : 'negative'}>{signedMoney(liveOpenPl)}</strong><em>Current open holdings</em></div>
      </div>
      <div className="activity-calendar-wrap">
        <div className="activity-weekdays"><span>Mon</span><span>Wed</span><span>Fri</span></div>
        <div className="activity-calendar" role="img" aria-label="Daily trading activity for the last 52 weeks">
          {activityDays.map((day, i) => <span key={day.key} className={'activity-cell ' + (day.count === 0 ? 'level-0' : day.realized > 0 ? 'level-profit' : day.realized < 0 ? 'level-loss' : 'level-trade')} style={{ gridColumn: Math.floor(i / 7) + 1, gridRow: i % 7 + 1 }} title={day.key + ' · ' + day.count + ' trades · realized P/L ' + signedMoney(day.realized)} />)}
        </div>
      </div>
      <div className="performance-legend"><span>Less</span><i className="level-0" /><i className="level-trade" /><i className="level-profit" /><i className="level-loss" /><span>More activity / P&L</span><small>Hover over a day to see trade count and estimated P/L.</small></div>
    </section>

    <section className="terminal-panel terminal-history">
      <div className="terminal-history-tabs">
        {[['open', 'Open Orders', openOrders.length], ['orders', 'Order History', orders.length], ['trades', 'My Trades', marketTrades.length], ['funds', 'Funds', transactions.length]].map(([id, label, count]) => <button key={id} className={tableTab === id ? 'active' : ''} onClick={() => setTableTab(id)}>{label} <span>{count}</span></button>)}
      </div>
      <div className="terminal-table-scroll">
        <table>
          <thead><tr>{tableTab === 'open' ? <><th>Date</th><th>Pair</th><th>Side</th><th>Limit Price</th><th>Amount</th><th>Status</th><th>Action</th></> : tableTab === 'funds' ? <><th>Date</th><th>Type</th><th>Description</th><th>Amount</th></> : <><th>Date</th><th>Pair</th><th>Side</th><th>Price</th><th>Amount</th><th>Fee</th><th>Profit / Loss</th><th>Status</th></>}</tr></thead>
          <tbody>{rows.map((row, i) => <tr key={row.id || i}>
            {tableTab === 'open' ? <><td>{new Date(row.createdAt).toLocaleString()}</td><td>{row.symbol}/USDT</td><td>{row.side}</td><td>{money(row.limitPrice)}</td><td>{money(row.quantity, 6)}</td><td>{row.status}</td><td>{row.status === 'OPEN' && <button className="terminal-cancel" onClick={() => cancelLimitOrder(row.id)}>Cancel</button>}</td></>
              : tableTab === 'funds' ? <><td>{new Date(row.createdAt).toLocaleString()}</td><td>{row.type}</td><td>{row.description}</td><td>{signedMoney(row.amount)}</td></>
              : <><td>{new Date(row.createdAt).toLocaleString()}</td><td>{row.symbol}/USDT</td><td className={row.type === 'BUY' ? 'positive' : 'negative'}>{row.type}</td><td>{money(row.price)}</td><td>{money(row.quantity, 6)}</td><td>{money(row.fee)}</td><td className={livePnlFor(row) >= 0 ? 'positive' : 'negative'}>{signedMoney(livePnlFor(row))}</td><td>{row.status}</td></>}
          </tr>)}</tbody>
        </table>
        {!rows.length && <div className="terminal-empty">No records yet. Your trades will appear here after placing an order.</div>}
      </div>
      <div className="terminal-disclaimer">Market prices are public. Buy and sell orders, balances and profit/loss are simulated in this demo app and are not real exchange trades.</div>
    </section>
  </div>;
}
