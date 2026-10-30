import { GlassCard } from '../../components/common/GlassCard';

export default function ThemePage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Theme</h1><p className="page-subtitle">Select your preferred simulated theme</p></GlassCard>
      <GlassCard style={{ maxWidth: '500px', margin: '20px auto 0' }}>
        <div className="card-chart-header"><h3>Available Themes</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="table-wrapper"><div className="table"><div className="table-row"><div className="table-cell table-header-cell">Theme</div><div className="table-cell">Pink Glass</div><div className="table-cell text-success">Active</div></div><div className="table-row"><div className="table-cell table-header-cell">Dark Mode</div><div className="table-cell">Available</div></div><div className="table-row"><div className="table-cell table-header-cell">Light Mode</div><div className="table-cell">Available</div></div></div></div>
        </div>
      </GlassCard>
    </div>
  );
}
