import { useMemo, useState } from 'react';
import './Chart.css';

const ranges = [{label:'1H',count:12},{label:'24H',count:288},{label:'7D',count:2016},{label:'ALL',count:2016}];
export default function PriceChart({data=[],title='BTC/USDT',height=360}){
 const [range,setRange]=useState('7D');
 const selected=ranges.find(r=>r.label===range)||ranges[2];
 const source=(data||[]).filter(d=>Number.isFinite(Number(d.price))).slice(-selected.count);
 const candles=useMemo(()=>source.map((point,i)=>{
   const close=Number(point.price), prev=i?Number(source[i-1].price):close*(1-((i%2?1:-1)*.002));
   const open=prev, spread=Math.max(close*.001,Math.abs(close-open)*.45);
   return {open,close,high:Math.max(open,close)+spread,low:Math.min(open,close)-spread};
 }),[source]);
 if(candles.length<2)return <div className="trading-chart-empty">Waiting for market price history…</div>;
 const W=1000,H=height, left=78,right=82,top=18,bottom=30,plotW=W-left-right,plotH=H-top-bottom;
 const values=candles.flatMap(c=>[c.high,c.low]),min=Math.min(...values),max=Math.max(...values),pad=(max-min)*.08||max*.01,lo=min-pad,hi=max+pad;
 const y=v=>top+(hi-v)/(hi-lo)*plotH, step=plotW/candles.length, bodyW=Math.max(3,Math.min(13,step*.62));
 const fmt=v=>v>=1000?v.toLocaleString(undefined,{maximumFractionDigits:0}):v>=1?v.toFixed(2):v.toFixed(5);
 return <section className="trading-chart">
  <div className="trading-chart-toolbar"><div><strong>{title}/USD</strong><span className="chart-live-dot">● Market</span></div><div className="chart-range-tabs">{ranges.map(r=><button key={r.label} className={range===r.label?'active':''} onClick={()=>setRange(r.label)}>{r.label}</button>)}</div></div>
  <div className="trading-chart-canvas"><svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title+' candlestick price chart'} preserveAspectRatio="none">
   {[0,.2,.4,.6,.8,1].map(f=><g key={f}><line x1={left} y1={top+plotH*f} x2={W-right} y2={top+plotH*f} stroke="currentColor" opacity=".12" strokeDasharray="3 5"/><text x={W-right+10} y={top+plotH*f+4} fontSize="12" fill="currentColor" opacity=".65">{fmt(hi-(hi-lo)*f)}</text></g>)}
   {candles.map((c,i)=>{const cx=left+step*(i+.5),up=c.close>=c.open,color=up?'#16C784':'#EA3943',bodyY=Math.min(y(c.open),y(c.close)),bodyH=Math.max(1.5,Math.abs(y(c.open)-y(c.close)));return <g key={i}><line x1={cx} x2={cx} y1={y(c.high)} y2={y(c.low)} stroke={color} strokeWidth="1.3"/><rect x={cx-bodyW/2} y={bodyY} width={bodyW} height={bodyH} fill={color} rx=".6"/></g>})}
   <line x1={left} x2={W-right} y1={y(candles.at(-1).close)} y2={y(candles.at(-1).close)} stroke="#F0B90B" strokeDasharray="5 4" opacity=".9"/><rect x={W-right+4} y={y(candles.at(-1).close)-10} width={74} height={20} rx="3" fill="#F0B90B"/><text x={W-right+41} y={y(candles.at(-1).close)+4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#111">{fmt(candles.at(-1).close)}</text>
   <text x={left} y={H-7} fontSize="11" fill="currentColor" opacity=".5">Older</text><text x={W-right} y={H-7} textAnchor="end" fontSize="11" fill="currentColor" opacity=".5">Latest</text>
  </svg></div><div className="chart-footnote">Candlestick-style view · candles are estimated from available price samples, not exchange OHLC data.</div>
 </section>;
}