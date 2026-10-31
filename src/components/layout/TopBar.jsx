import {useNavigate} from 'react-router-dom';
import {NavLink} from 'react-router-dom';
import {useApp} from '../../context/AppContext';
import './TopBar.css';
export default function TopBar(){
 const navigate=useNavigate();const {refresh,marketSource}=useApp();
 return <header className="topbar topbar-global">
  <button className="topbar-brand" onClick={()=>navigate('/dashboard')}><span className="topbar-brand-icon">₿</span><span>Crypto<span style={{color:'var(--secondary)'}}>Dash</span></span></button>
  <nav className="topbar-main-nav" aria-label="Main navigation">
   <NavLink to="/dashboard">Dashboard</NavLink><NavLink to="/markets">Markets</NavLink><NavLink to="/trading">Trade</NavLink><NavLink to="/wallet">Wallet</NavLink><NavLink to="/account">Profile</NavLink>
  </nav>
  <div className="topbar-spacer"/>
  <span className="topbar-market-status">{marketSource?.toLowerCase().includes('live')?'● LIVE MARKET':'● DEMO MARKET'}</span>
  <button className="topbar-btn topbar-refresh" onClick={refresh}><span aria-hidden="true">↻</span> Refresh</button>
 </header>;
}
