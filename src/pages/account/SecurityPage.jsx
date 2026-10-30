import { GlassCard } from '../../components/common/GlassCard';

export default function SecurityPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Account Security</h1><p className="page-subtitle">Manage your simulated account security settings</p></GlassCard>
      <GlassCard style={{ maxWidth: '500px', margin: '20px auto 0' }}>
        <div className="card-chart-header"><h3>Security Status</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="table-wrapper"><div className="table"><div className="table-row"><div className="table-cell table-header-cell">Two-Factor Auth</div><div className="table-cell text-success">Disabled (demo)</div></div><div className="table-row"><div className="table-cell table-header-cell">Password Last Changed</div><div className="table-cell">Never (demo)</div></div><div className="table-row"><div className="table-cell table-header-cell">Recovery Email</div><div className="table-cell">demo@example.com</div></div></div></div>
        </div>
      </GlassCard>
    </div>
  );
}
