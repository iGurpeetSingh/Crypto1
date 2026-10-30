import {useNavigate} from 'react-router-dom';
import {useApp} from '../../context/AppContext';
import './TopBar.css';
export default function TopBar({onMenuClick,menuOpen}){
 const navigate=useNavigate();const {refresh,marketSource}=useApp();
 return <header className="topbar">
  <button className="topbar-btn topbar-btn--icon mobile-menu-toggle" onClick={onMenuClick} aria-label={menuOpen?'Close navigation':'Open navigation'} aria-expanded={menuOpen}>
   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">{menuOpen?<><path d="M6 6l12 12M18 6L6 18"/></>:<><path d="M4 7h16M4 12h16M4 17h16"/></>}</svg>
  </button>
  <button className="topbar-brand" onClick={()=>navigate('/dashboard')}><span className="topbar-brand-icon">₿</span><span>Crypto<span style={{color:'var(--secondary)'}}>Dash</span></span></button>
  <div className="topbar-spacer"/>
  <span className="topbar-market-status">{marketSource?.includes('live')?'● LIVE MARKET':'● DEMO MARKET'}</span>
  <button className="topbar-btn topbar-refresh" onClick={refresh}><span aria-hidden="true">↻</span> Refresh</button>
  <button className="topbar-btn topbar-account" onClick={()=>navigate('/profile')}>Profile</button>
 </header>;
}
