import { GlassCard } from '../../components/common/GlassCard';

export default function LimitsPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Transaction Limits</h1>
        <p className="page-subtitle">Simulated limits for demo wallet transfers, deposits, and withdrawals</p>
      </GlassCard>
      <GlassCard>
        <div className="card-chart-header"><h3>Simulated Daily Limits</h3></div>
        <div className="table-wrapper">
          <div className="table">
            <div className="table-header">
              <div className="table-cell table-header-cell">Action</div>
              <div className="table-cell table-header-cell">Daily Limit</div>
              <div className="table-cell table-header-cell">Used Today</div>
              <div className="table-cell table-header-cell">Remaining</div>
            </div>
            <div className="table-row"><div className="table-cell">Deposits</div><div className="table-cell">$10,000</div><div className="table-cell">$0</div><div className="table-cell text-success">$10,000</div></div>
            <div className="table-row"><div className="table-cell">Withdrawals</div><div className="table-cell">$5,000</div><div className="table-cell">$0</div><div className="table-cell text-success">$5,000</div></div>
            <div className="table-row"><div className="table-cell">Transfers</div><div className="table-cell">$10,000</div><div className="table-cell">$0</div><div className="table-cell text-success">$10,000</div></div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
