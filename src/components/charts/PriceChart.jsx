import { useEffect, useMemo, useState } from 'react';
import './Chart.css';

const WINDOWS = [
  { label: '1H', interval: '1m', limit: 60 },
  { label: '24H', interval: '15m', limit: 96 },
  { label: '7D', interval: '1h', limit: 168 },
  { label: 'ALL', interval: '1d', limit: 365 },
];
const money = value => Number(value).toLocaleString(undefined, {
  minimumFractionDigits: value < 1 ? 4 : 2,
  maximumFractionDigits: value < 1 ? 6 : 2,
});
const marketPair = symbol => {
  const normalized = String(symbol || 'BTC').toUpperCase();
  if (normalized === 'USDT') return 'USDTUSDC';
  return normalized.endsWith('USDT') ? normalized : normalized + 'USDT';
};

export default function PriceChart({
  data = [], title = 'BTC/USDT', symbol, height = 390,
  stopLoss = 0, takeProfit = 0,
}) {
  const [range, setRange] = useState('7D');
  const [candles, setCandles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState('Connecting to exchange market data');
  const [error, setError] = useState('');
  const [hoverIndex, setHoverIndex] = useState(null);
  const [showVolume, setShowVolume] = useState(true);

  const pair = marketPair(symbol || title);
  const windowConfig = WINDOWS.find(item => item.label === range) || WINDOWS[2];

  useEffect(() => {
    let cancelled = false;
    let timer;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const url = 'https://api.binance.com/api/v3/klines?symbol=' +
          encodeURIComponent(pair) + '&interval=' + windowConfig.interval +
          '&limit=' + windowConfig.limit;
        const response = await fetch(url, { headers: { accept: 'application/json' } });
        if (!response.ok) throw new Error('Exchange feed returned HTTP ' + response.status);
        const rows = await response.json();
        if (!Array.isArray(rows) || rows.length < 2) throw new Error('Exchange returned insufficient OHLC data');
        const parsed = rows.map(row => ({
          time: Number(row[0]),
          open: Number(row[1]),
          high: Number(row[2]),
          low: Number(row[3]),
          close: Number(row[4]),
          volume: Number(row[5]),
        })).filter(c => [c.time,c.open,c.high,c.low,c.close,c.volume].every(Number.isFinite));
        if (!cancelled) {
          setCandles(parsed);
          setFeed('Binance spot OHLC · ' + pair);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Unable to load exchange candles');
          setFeed('Exchange OHLC unavailable');
          // Price history fallback is deliberately a line series, never fabricated OHLC candles.
          const fallback = (data || []).filter(p => Number.isFinite(Number(p.price))).slice(-windowConfig.limit);
          setCandles(fallback.map((p,i,arr) => {
            const close = Number(p.price);
            const open = i ? Number(arr[i-1].price) : close;
            return { time: Number(p.date) || i, open, close, high: Math.max(open,close), low: Math.min(open,close), volume: 0 };
          }));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    timer = setInterval(load, windowConfig.interval === '1m' ? 15000 : 30000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [pair, windowConfig.interval, windowConfig.limit, data]);

  const geometry = useMemo(() => {
    if (candles.length < 2) return null;
    const W=1100, H=height, left=18, right=88, top=18, bottom=showVolume?82:34;
    const plotW=W-left-right, plotH=H-top-bottom;
    const values=candles.flatMap(c=>[c.high,c.low]);
    const rawMin=Math.min(...values), rawMax=Math.max(...values);
    const padding=(rawMax-rawMin)*.08 || rawMax*.005;
    const min=rawMin-padding, max=rawMax+padding;
    const y=value=>top+(max-value)/(max-min)*plotH;
    const step=plotW/candles.length;
    const bodyW=Math.max(2,Math.min(12,step*.68));
    const maxVol=Math.max(1,...candles.map(c=>c.volume));
    return {W,H,left,right,top,bottom,plotW,plotH,min,max,y,step,bodyW,maxVol};
  },[candles,height,showVolume]);

  const fmtTime = timestamp => {
    const date = new Date(timestamp);
    return range === '1H' || range === '24H'
      ? date.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})
      : date.toLocaleDateString([], {month:'short',day:'numeric'});
  };

  if (!candles.length && loading) return <div className="trading-chart-empty">Loading real OHLC candlesticks…</div>;
  if (!candles.length) return <div className="trading-chart-empty">No chart data available for {pair}. {error}</div>;
  const g=geometry;
  const selected=hoverIndex===null?candles[candles.length-1]:candles[hoverIndex];
  const fmt=money;
  const last= candles[candles.length-1];
  const candleX=i=>g.left+g.step*(i+.5);

  return <section className="trading-chart">
    <div className="trading-chart-toolbar">
      <div className="chart-symbol-info"><strong>{pair}</strong><span className="chart-live-dot">● {feed}</span></div>
      <div className="chart-range-tabs">{WINDOWS.map(item=><button type="button" key={item.label} className={range===item.label?'active':''} onClick={()=>{setRange(item.label);setHoverIndex(null);}}>{item.label}</button>)}</div>
    </div>
    <div className="chart-candle-readout">
      <span>O <b>{fmt(selected.open)}</b></span><span>H <b className="candle-up">{fmt(selected.high)}</b></span>
      <span>L <b className="candle-down">{fmt(selected.low)}</b></span><span>C <b>{fmt(selected.close)}</b></span>
      <span>Vol <b>{Number(selected.volume).toLocaleString(undefined,{maximumFractionDigits:2})}</b></span>
    </div>
    <div className="trading-chart-canvas">
      <svg viewBox={`0 0 ${g.W} ${g.H}`} role="img" aria-label={pair+' real OHLC candlestick chart'}
        onPointerLeave={()=>setHoverIndex(null)}
        onPointerMove={event=>{
          const rect=event.currentTarget.getBoundingClientRect();
          const x=(event.clientX-rect.left)/rect.width*g.W;
          setHoverIndex(Math.max(0,Math.min(candles.length-1,Math.floor((x-g.left)/g.step))));
        }}>
        <defs><clipPath id="ohlc-clip"><rect x={g.left} y={g.top} width={g.plotW} height={g.plotH}/></clipPath></defs>
        {[0,.2,.4,.6,.8,1].map(f=><g key={f}>
          <line x1={g.left} x2={g.W-g.right} y1={g.top+g.plotH*f} y2={g.top+g.plotH*f} stroke="currentColor" opacity=".13" strokeDasharray="4 6"/>
          <text x={g.W-g.right+10} y={g.top+g.plotH*f+4} fontSize="12" fill="currentColor" opacity=".7">{fmt(g.max-(g.max-g.min)*f)}</text>
        </g>)}
        <g clipPath="url(#ohlc-clip)">
          {stopLoss>g.min&&stopLoss<g.max&&<g><line x1={g.left} x2={g.W-g.right} y1={g.y(Number(stopLoss))} y2={g.y(Number(stopLoss))} stroke="#EA3943" strokeDasharray="7 5" strokeWidth="2"/><text x={g.left+8} y={g.y(Number(stopLoss))-7} fontSize="12" fill="#EA3943">STOP LOSS</text></g>}
          {takeProfit>g.min&&takeProfit<g.max&&<g><line x1={g.left} x2={g.W-g.right} y1={g.y(Number(takeProfit))} y2={g.y(Number(takeProfit))} stroke="#16C784" strokeDasharray="7 5" strokeWidth="2"/><text x={g.left+8} y={g.y(Number(takeProfit))-7} fontSize="12" fill="#16C784">TAKE PROFIT</text></g>}
          {candles.map((c,i)=>{
            const x=candleX(i), up=c.close>=c.open, color=up?'#16C784':'#EA3943';
            const top=Math.min(g.y(c.open),g.y(c.close)), body=Math.max(1.5,Math.abs(g.y(c.open)-g.y(c.close)));
            return <g key={c.time}><line x1={x} x2={x} y1={g.y(c.high)} y2={g.y(c.low)} stroke={color} strokeWidth="1.5"/>
              <rect x={x-g.bodyW/2} y={top} width={g.bodyW} height={body} rx=".7" fill={color}/></g>;
          })}
          {hoverIndex!==null&&candles[hoverIndex]&&<line x1={candleX(hoverIndex)} x2={candleX(hoverIndex)} y1={g.top} y2={g.top+g.plotH} stroke="#CBD5E1" strokeDasharray="4 4" opacity=".8"/>}
          <line x1={g.left} x2={g.W-g.right} y1={g.y(last.close)} y2={g.y(last.close)} stroke="#F0B90B" strokeDasharray="5 4"/>
        </g>
        {showVolume&&candles.map((c,i)=>{
          const x=candleX(i), barH=(c.volume/g.maxVol)*34;
          return <rect key={'v'+c.time} x={x-g.bodyW/2} y={g.H-35-barH} width={g.bodyW} height={barH} fill={c.close>=c.open?'#16C784':'#EA3943'} opacity=".5"/>;
        })}
        <rect x={g.W-g.right+4} y={Math.max(g.top,Math.min(g.top+g.plotH-22,g.y(last.close)-11))} width="78" height="22" rx="4" fill="#F0B90B"/>
        <text x={g.W-g.right+43} y={Math.max(g.top+15,Math.min(g.top+g.plotH-7,g.y(last.close)+4))} textAnchor="middle" fontSize="12" fontWeight="700" fill="#111">{fmt(last.close)}</text>
        <text x={g.left} y={g.H-7} fontSize="11" fill="currentColor" opacity=".55">{fmtTime(candles[0].time)}</text>
        <text x={g.W-g.right} y={g.H-7} textAnchor="end" fontSize="11" fill="currentColor" opacity=".55">{fmtTime(last.time)}</text>
      </svg>
    </div>
    <div className="chart-controls">
      <button type="button" className={showVolume?'active':''} onClick={()=>setShowVolume(v=>!v)}>{showVolume?'Hide':'Show'} Volume</button>
      <span>{loading?'Updating…':error?'Fallback price samples':'Live exchange OHLC'}</span>
      <span>{candles.length} candles</span>
    </div>
    <div className="chart-footnote">{error?'Exchange OHLC feed unavailable: '+error:'Real exchange OHLC candles; refreshed automatically.'} Chart is market-data only; orders execute in the demo trading ledger.</div>
  </section>;
}
