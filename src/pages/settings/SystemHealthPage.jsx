import { GlassCard } from '../../components/common/GlassCard';

export default function SystemHealthPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>System Health</h1><p className="page-subtitle">Check the health of your simulated application</p></GlassCard>
      <GlassCard style={{ maxWidth: '500px', margin: '20px auto 0' }}>
        <div className="card-chart-header"><h3>System Status</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="table-wrapper"><div className="table"><div className="table-row"><div className="table-cell table-header-cell">Backend</div><div className="table-cell text-success">Online (simulated)</div></div><div className="table-row"><div className="table-cell table-header-cell">Market Data</div><div className="table-cell text-success">Simulated</div></div><div className="table-row"><div className="table-cell table-header-cell">Wallet</div><div className="table-cell text-success">Demo active</div></div></div></div>
        </div>
      </GlassCard>
    </div>
  );
}
