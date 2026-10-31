import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { routeConfig, groupLabels } from '../../app/routeConfig';
import TopBar from './TopBar';
import CreateAccountModal from '../auth/CreateAccountModal';
import {hasDemoSession} from '../../services/auth';
import './AppShell.css';

const icons={
 overview:'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
 markets:'M3 3v18h18M7 14l4-4 4 4 6-7',
 trading:'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5',
 profile:'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10',
 wallet:'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z',
 account:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 0 0-8',
 settings:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-2.4v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1L8 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6.7v-2.4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L8 8.6l1.7-1.7.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.2h2.4v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.7 1.7-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2V14h-.2a1.7 1.7 0 0 0-1.5 1z'
};
const essential=[
 {path:'/dashboard',name:'Dashboard',group:'overview'},
 {path:'/markets',name:'Markets',group:'markets'},
 {path:'/trading',name:'Spot Trading',group:'trading'},
 {path:'/wallet',name:'Wallet',group:'wallet'},\n {path:'/account',name:'Profile',group:'wallet'}
];

function Navigation({onNavigate,showClose=false}){
 const grouped=essential.reduce((acc,r)=>{(acc[r.group] ||= []).push(r);return acc},{});
 return <>
  <div className="sidebar-header">
   <div className="sidebar-logo"><div className="sidebar-logo-icon">₿</div><span>Crypto<span style={{color:'var(--secondary)'}}>Dash</span></span></div>
   {showClose&&<button className="topbar-btn topbar-btn--icon sidebar-close" onClick={onNavigate} aria-label="Close menu">×</button>}
  </div>
  <nav className="sidebar-nav">
   {Object.entries(grouped).map(([group,routes])=><div key={group} className="nav-group">
    <div className="nav-group-label">{groupLabels[group]||group}</div>
    {routes.map(r=><NavLink key={r.path} to={r.path} end onClick={onNavigate} className={({isActive})=>isActive?'nav-item nav-item--active':'nav-item'}>
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={icons[group]||icons.overview}/></svg><span>{r.name}</span>
    </NavLink>)}
   </div>)}
  </nav>
  <div className="sidebar-footer"><span className="demo-badge">SIMULATED TRADING</span></div>
 </>;
}

export default function AppShell(){
 const location=useLocation();
 const [desktopOpen,setDesktopOpen]=useState(true);
 const [mobileOpen,setMobileOpen]=useState(false);
 const [isMobile,setIsMobile]=useState(()=>typeof window!=='undefined'&&window.matchMedia('(max-width: 768px)').matches);
 useEffect(()=>{
  const media=window.matchMedia('(max-width: 768px)');
  const onChange=e=>{setIsMobile(e.matches);setMobileOpen(false);};
  media.addEventListener?.('change',onChange);
  return()=>media.removeEventListener?.('change',onChange);
 },[]);
 useEffect(()=>{setMobileOpen(false)},[location.pathname]);
 useEffect(()=>{
  const onKey=e=>{if(e.key==='Escape')setMobileOpen(false);};
  window.addEventListener('keydown',onKey);
  return()=>window.removeEventListener('keydown',onKey);
 },[]);
 useEffect(()=>{
  if(!mobileOpen)return;
  const previous=document.body.style.overflow;
  document.body.style.overflow='hidden';
  return()=>{document.body.style.overflow=previous;};
 },[mobileOpen]);

 const handleMenuClick=()=>{
  if(window.matchMedia('(max-width: 768px)').matches)setMobileOpen(v=>!v);
  else setDesktopOpen(v=>!v);
 };
 const mobileLayer=<>
  {mobileOpen&&<>
   <button className="sidebar-backdrop" aria-label="Close navigation menu" onClick={()=>setMobileOpen(false)}/>
   <aside className="sidebar mobile-sidebar" aria-label="Mobile navigation">
    <Navigation showClose onNavigate={()=>setMobileOpen(false)}/>
   </aside>
  </>}
 </>;
 return <div className={`layout ${desktopOpen?'desktop-sidebar-open':'desktop-sidebar-collapsed'}`}>
  {!hasDemoSession()&&<CreateAccountModal/>}
  <div className="bg-orb bg-orb--1"/><div className="bg-orb bg-orb--2"/><div className="bg-orb bg-orb--3"/>
  {location.pathname.startsWith('/trading') ? null : <aside className="sidebar desktop-sidebar" aria-label="Main navigation">
   <Navigation/>
  </aside>}
  <main className={`main ${location.pathname.startsWith('/trading')?'main-trading':''}`}>{!location.pathname.startsWith('/trading')&&<TopBar onMenuClick={handleMenuClick} menuOpen={isMobile?mobileOpen:desktopOpen}/>}<div className="content"><Outlet/></div></main>
  {typeof document!=='undefined'&&createPortal(mobileLayer,document.body)}
 </div>;
}
export {AppShell};
