import './Chart.css';
export default function PriceChart({data=[],title='Price',height=260}){
 const points=(data||[]).filter(d=>Number.isFinite(Number(d.price)));
 if(points.length<2)return <div className="chart-empty"><p>Chart data is loading…</p></div>;
 const width=900,pad={top:18,right:18,bottom:28,left:74},innerW=width-pad.left-pad.right,innerH=height-pad.top-pad.bottom;
 const vals=points.map(d=>Number(d.price)),min=Math.min(...vals),max=Math.max(...vals),range=max-min||Math.max(max*.01,1);
 const low=min-range*.08,high=max+range*.08;
 const x=i=>pad.left+i/(points.length-1)*innerW,y=v=>pad.top+(high-v)/(high-low)*innerH;
 const path=points.map((p,i)=>(i?'L':'M')+' '+x(i)+' '+y(Number(p.price))).join(' ');
 const area=path+' L '+x(points.length-1)+' '+(pad.top+innerH)+' L '+x(0)+' '+(pad.top+innerH)+' Z';
 const up=vals.at(-1)>=vals[0],stroke=up?'#16C784':'#EA3943',id='chart-'+String(title).replace(/[^a-z0-9]/gi,'');
 return <div className="chart-container" style={{height,width:'100%'}}><div className="chart-svg-wrap" style={{width:'100%',overflow:'hidden'}}><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title+' price chart'} style={{width:'100%',height:'auto',display:'block'}}><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={stroke} stopOpacity=".25"/><stop offset="100%" stopColor={stroke} stopOpacity="0"/></linearGradient></defs>{[0,.25,.5,.75,1].map(f=><g key={f}><line x1={pad.left} y1={pad.top+innerH*f} x2={width-pad.right} y2={pad.top+innerH*f} stroke="currentColor" opacity=".12" strokeDasharray="4 5"/><text x={pad.left-10} y={pad.top+innerH*f+4} textAnchor="end" fontSize="12" fill="currentColor" opacity=".65">{(high-(high-low)*f).toLocaleString(undefined,{maximumFractionDigits:2})}</text></g>)}<path d={area} fill={`url(#${id})`}/><path d={path} fill="none" stroke={stroke} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx={x(points.length-1)} cy={y(vals.at(-1))} r="4" fill={stroke}/></svg></div><div className="chart-legend"><span style={{color:stroke}}>●</span> {title} · {points.length} data points</div></div>;
}