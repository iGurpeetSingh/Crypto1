import { GlassCard } from '../../components/common/GlassCard';

export default function PreferencesPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Preferences</h1><p className="page-subtitle">Configure your simulated application preferences</p></GlassCard>
      <GlassCard style={{ maxWidth: '500px', margin: '20px auto 0' }}>
        <div className="card-chart-header"><h3>General Preferences</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="table-wrapper"><div className="table"><div className="table-row"><div className="table-cell table-header-cell">Currency</div><div className="table-cell">USD</div></div><div className="table-row"><div className="table-cell table-header-cell">Language</div><div className="table-cell">English</div></div><div className="table-row"><div className="table-cell table-header-cell">Timezone</div><div className="table-cell">Local</div></div></div></div>
        </div>
      </GlassCard>
    </div>
  );
}
