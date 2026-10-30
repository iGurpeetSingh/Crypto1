import { useMemo, useState } from 'react';
import './Chart.css';

const ranges = [{label:'1H',count:12},{label:'24H',count:288},{label:'7D',count:2016},{label:'ALL',count:2016}];
export default function PriceChart({data=[],title='BTC/USDT',height=360,stopLoss=0,takeProfit=0}){
 const [range,setRange]=useState('7D');\n const [hoverIndex,setHoverIndex]=useState(null);
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
  <div className="trading-chart-canvas"><svg viewBox={`0 0 ${W} ${H}`} onPointerLeave={()=>setHoverIndex(null)} onPointerMove={e=>{const rect=e.currentTarget.getBoundingClientRect();const px=(e.clientX-rect.left)/rect.width*W;setHoverIndex(Math.max(0,Math.min(candles.length-1,Math.floor((px-left)/step))))}} role="img" aria-label={title+' candlestick price chart'} preserveAspectRatio="none">
   {[0,.2,.4,.6,.8,1].map(f=><g key={f}><line x1={left} y1={top+plotH*f} x2={W-right} y2={top+plotH*f} stroke="currentColor" opacity=".12" strokeDasharray="3 5"/><text x={W-right+10} y={top+plotH*f+4} fontSize="12" fill="currentColor" opacity=".65">{fmt(hi-(hi-lo)*f)}</text></g>)}
   {stopLoss>lo&&stopLoss<hi&&<g><line x1={left} x2={W-right} y1={y(Number(stopLoss))} y2={y(Number(stopLoss))} stroke="#EA3943" strokeDasharray="6 4"/><text x={left+6} y={y(Number(stopLoss))-5} fontSize="11" fill="#EA3943">STOP {fmt(Number(stopLoss))}</text></g>}\n   {takeProfit>lo&&takeProfit<hi&&<g><line x1={left} x2={W-right} y1={y(Number(takeProfit))} y2={y(Number(takeProfit))} stroke="#16C784" strokeDasharray="6 4"/><text x={left+6} y={y(Number(takeProfit))-5} fontSize="11" fill="#16C784">TARGET {fmt(Number(takeProfit))}</text></g>}\n   {candles.map((c,i)=>{const cx=left+step*(i+.5),up=c.close>=c.open,color=up?'#16C784':'#EA3943',bodyY=Math.min(y(c.open),y(c.close)),bodyH=Math.max(1.5,Math.abs(y(c.open)-y(c.close)));return <g key={i}><line x1={cx} x2={cx} y1={y(c.high)} y2={y(c.low)} stroke={color} strokeWidth="1.3"/><rect x={cx-bodyW/2} y={bodyY} width={bodyW} height={bodyH} fill={color} rx=".6"/></g>})}
   {hoverIndex!==null&&candles[hoverIndex]&&<g pointerEvents="none"><line x1={left+step*(hoverIndex+.5)} x2={left+step*(hoverIndex+.5)} y1={top} y2={top+plotH} stroke="currentColor" strokeDasharray="3 3" opacity=".5"/><circle cx={left+step*(hoverIndex+.5)} cy={y(candles[hoverIndex].close)} r="4" fill="#F0B90B"/><rect x={left+8} y={top+7} width="230" height="58" rx="6" fill="#101B2A" stroke="#334155"/><text x={left+18} y={top+26} fontSize="12" fill="#F8FAFC">O {fmt(candles[hoverIndex].open)}  H {fmt(candles[hoverIndex].high)}</text><text x={left+18} y={top+46} fontSize="12" fill="#F8FAFC">L {fmt(candles[hoverIndex].low)}  C {fmt(candles[hoverIndex].close)}</text></g>}\n   <line x1={left} x2={W-right} y1={y(candles.at(-1).close)} y2={y(candles.at(-1).close)} stroke="#F0B90B" strokeDasharray="5 4" opacity=".9"/><rect x={W-right+4} y={y(candles.at(-1).close)-10} width={74} height={20} rx="3" fill="#F0B90B"/><text x={W-right+41} y={y(candles.at(-1).close)+4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#111">{fmt(candles.at(-1).close)}</text>
   <text x={left} y={H-7} fontSize="11" fill="currentColor" opacity=".5">Older</text><text x={W-right} y={H-7} textAnchor="end" fontSize="11" fill="currentColor" opacity=".5">Latest</text>
  </svg></div><div className="chart-footnote">Hover over candles to inspect O/H/L/C. Candles are estimated from sampled prices; not exchange OHLC data.</div>
 </section>;
}