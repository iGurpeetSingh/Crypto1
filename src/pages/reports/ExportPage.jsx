import { GlassCard } from '../../components/common/GlassCard';

export default function ExportPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Data Export</h1>
        <p className="page-subtitle">Export simulated portfolio and trading data</p>
      </GlassCard>
      <GlassCard style={{ maxWidth: '500px', margin: '20px auto 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card-chart-header"><h3>Export Formats</h3></div>
          <button className="btn btn--primary" style={{ width: '100%' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18, marginRight: '8px' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Export CSV</button>
          <button className="btn btn--ghost" style={{ width: '100%' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18, marginRight: '8px' }}><polyline points="20 6 9 17 4 12" /></svg>Export JSON</button>
        </div>
      </GlassCard>
    </div>
  );
}
