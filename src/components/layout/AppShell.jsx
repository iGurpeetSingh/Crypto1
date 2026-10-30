import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { routeConfig, groupLabels } from '../../app/routeConfig';
import TopBar from './TopBar';
import './AppShell.css';

const icons = {
  overview: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  markets: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37',
  trading: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
  portfolio: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  wallet: 'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M16 12h-6m-6 4h6m2 0H4a2 2',
  analytics: 'M18 20V10M12 20V4M6 20v-6',
  reports: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M8 13h8 M8 17h8',
  notifications: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
  automation: 'M12 2v4m0 12v4m10-10h-4M4 12H2m15.07-6.07l-2.83 2.83M7.66 16.34l-2.83 2.83m0-10.66l2.83 2.83m9.24 9.24l2.83 2.83',
  account: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 7c4 0 8-4 8-8',
  settings: 'M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z M12 3c-4.97 0-8 2.76-8 6.72',
  auth: 'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4 M10 17l5-5-5-5 M15 12H3',
  misc: 'M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 0 15.357-2m0 0H15',
};

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [collapsed, setCollapsed] = useState(false);

  const groupedRoutes = routeConfig.reduce((acc, route) => {
    if (!route.group) return acc;
    if (!acc[route.group]) acc[route.group] = [];
    acc[route.group].push(route);
    return acc;
  }, {});

  const isCollapsed = collapsed && window.innerWidth <= 768;

  return (
    <div className="layout">
      <div className={`bg-orb bg-orb--1`} />
      <div className={`bg-orb bg-orb--2`} />
      <div className={`bg-orb bg-orb--3`} />

      <aside
        className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''} ${isCollapsed ? 'sidebar--collapsed' : ''}`}
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">&#x20BF;</div>
            <span>Crypto<span style={{ color: 'var(--secondary)' }}>Dash</span></span>
          </div>
          <button
            className="topbar-btn topbar-btn--icon"
            onClick={() => setCollapsed(!collapsed)}
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          {Object.entries(groupedRoutes).map(([group, routes]) => (
            <div key={group} className={`nav-group ${collapsed ? 'collapsed' : ''}`}>
              <div className="nav-group-label">{groupLabels[group] || group}</div>
              {routes.map((r) => (
                <NavLink
                  key={r.path}
                  to={r.path}
                  className={({ isActive }) => (isActive ? 'nav-item nav-item--active' : 'nav-item')}
                  end={r.end}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d={icons[r.group] || icons.misc} />
                  </svg>
                  <span>{r.name}</span>
                  {r.path === '/dashboard' && <span className="nav-badge">{r.idx}</span>}
                  {r.path === '/markets' && <span className="nav-badge">{r.idx}</span>}
                  {r.path === '/wallet' && <span className="nav-badge">{r.idx}</span>}
                  {r.path === '/trading' && <span className="nav-badge">{r.idx}</span>}
                  {r.path === '/portfolio' && <span className="nav-badge">{r.idx}</span>}
                  {r.path === '/analytics' && <span className="nav-badge">{r.idx}</span>}
                  {r.path === '/reports' && <span className="nav-badge">{r.idx}</span>}
                  {r.path === '/notifications' && <span className="nav-badge">{r.idx}</span>}
                  {r.path === '/automation' && <span className="nav-badge">{r.idx}</span>}
                  {r.path === '/account' && <span className="nav-badge">{r.idx}</span>}
                  {r.path === '/settings' && <span className="nav-badge">{r.idx}</span>}
                  {r.path === '/login' && <span className="nav-badge">{r.idx}</span>}
                  {r.path === '/register' && <span className="nav-badge">{r.idx}</span>}
                  {r.path === '/forgot-password' && <span className="nav-badge">{r.idx}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="glass glass-hover" style={{ padding: '12px 16px', border: 'none' }}>
            <div className="text-xs text-secondary mb-1 block">Demo Mode</div>
            <div className="flex items-center gap-2">
              <span className="demo-badge">Simulated Data</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Local</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} menuOpen={sidebarOpen} />
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export { AppShell };
