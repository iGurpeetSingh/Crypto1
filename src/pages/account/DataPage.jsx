import { GlassCard } from '../../components/common/GlassCard';

export default function DataPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Local Data</h1><p className="page-subtitle">Manage your simulated local data and storage</p></GlassCard>
      <GlassCard style={{ maxWidth: '500px', margin: '20px auto 0' }}>
        <div className="card-chart-header"><h3>Data Storage</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="table-wrapper"><div className="table"><div className="table-row"><div className="table-cell table-header-cell">Local Storage</div><div className="table-cell">Demo data</div></div><div className="table-row"><div className="table-cell table-header-cell">Cache</div><div className="table-cell">Simulated</div></div><div className="table-row"><div className="table-cell table-header-cell">IndexedDB</div><div className="table-cell">Not used</div></div></div></div>
        </div>
      </GlassCard>
    </div>
  );
}
