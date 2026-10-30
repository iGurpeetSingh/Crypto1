import { GlassCard } from '../../components/common/GlassCard';

export default function SecurityPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Wallet Security</h1>
        <p className="page-subtitle">Simulated wallet security settings — this is a demo with no real keys or blockchain</p>
      </GlassCard>
      <GlassCard>
        <div className="card-chart-header"><h3>Security Status</h3></div>
        <div className="table-wrapper">
          <div className="table">
            <div className="table-header">
              <div className="table-cell table-header-cell">Setting</div>
              <div className="table-cell table-header-cell">Value</div>
            </div>
            <div className="table-row"><div className="table-cell">Two-Factor Authentication</div><div className="table-cell text-success">Disabled (demo)</div></div>
            <div className="table-row"><div className="table-cell">Withdrawal Whitelist</div><div className="table-cell">Disabled (demo)</div></div>
            <div className="table-row"><div className="table-cell">API Access</div><div className="table-cell text-success">Simulated</div></div>
            <div className="table-row"><div className="table-cell">Private Keys</div><div className="table-cell">Not applicable (demo)</div></div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
