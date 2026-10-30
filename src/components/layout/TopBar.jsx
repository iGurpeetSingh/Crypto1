import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './TopBar.css';

export default function TopBar({ onMenuClick, menuOpen }) {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <header className="topbar">
      <NavLink to="/dashboard" className="topbar-brand">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 32, height: 32 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
        <span>CryptoDash</span>
      </NavLink>

      <div className="topbar-spacer" />

      <div className="topbar-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search assets, markets, orders..."
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="topbar-actions">
        <button
          className="topbar-btn topbar-btn--icon"
          onClick={onMenuClick}
          aria-label={menuOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <line x1="3" y1="3" x2="21" y2="21" /> : <line x1="12" y1="3" x2="12" y2="21" />}
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </button>

        <button className="topbar-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a8 8 0 0 0-8-8 8 8 0 0 0-4.7 1.6L3 13v5h5" />
            <path d="M3 13h5v5h-5" />
            <path d="M3 21a8 8 0 0 0 8 8h4a8 8 0 0 0 8-8v-5h-5" />
          </svg>
          Refresh
        </button>

        <button className="topbar-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          Notifications
          <span className="nav-badge" style={{ backgroundColor: 'var(--secondary)' }}>3</span>
        </button>

        <button className="topbar-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Account
        </button>

        <div className="text-xs text-secondary ml-1">
          <span className="demo-badge">SIMULATED DATA</span>
        </div>
      </div>
    </header>
  );
}
