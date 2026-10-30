import { GlassCard } from '../../components/common/GlassCard';

export default function RegionalPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Regional</h1><p className="page-subtitle">Set your preferred language and region</p></GlassCard>
      <GlassCard style={{ maxWidth: '500px', margin: '20px auto 0' }}>
        <div className="card-chart-header"><h3>Regional Settings</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="table-wrapper"><div className="table"><div className="table-row"><div className="table-cell table-header-cell">Language</div><div className="table-cell">English</div></div><div className="table-row"><div className="table-cell table-header-cell">Currency</div><div className="table-cell">USD</div></div><div className="table-row"><div className="table-cell table-header-cell">Timezone</div><div className="table-cell">Local</div></div><div className="table-row"><div className="table-cell table-header-cell">Date Format</div><div className="table-cell">MM/DD/YYYY</div></div></div></div>
        </div>
      </GlassCard>
    </div>
  );
}
