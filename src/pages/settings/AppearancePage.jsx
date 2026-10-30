import { GlassCard } from '../../components/common/GlassCard';

export default function AppearancePage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Appearance</h1><p className="page-subtitle">Customize the look of your simulated application</p></GlassCard>
      <GlassCard style={{ maxWidth: '500px', margin: '20px auto 0' }}>
        <div className="card-chart-header"><h3>Theme Settings</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="table-wrapper"><div className="table"><div className="table-row"><div className="table-cell table-header-cell">Theme</div><div className="table-cell">Pink Glass</div></div><div className="table-row"><div className="table-cell table-header-cell">Accent Color</div><div className="table-cell">#FF5CA8</div></div></div></div>
        </div>
      </GlassCard>
    </div>
  );
}
