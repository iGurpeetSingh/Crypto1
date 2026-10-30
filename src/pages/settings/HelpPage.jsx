import { GlassCard } from '../../components/common/GlassCard';

export default function HelpPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Help Centre</h1><p className="page-subtitle">Get help with your simulated crypto application</p></GlassCard>
      <GlassCard style={{ maxWidth: '500px', margin: '20px auto 0' }}>
        <div className="card-chart-header"><h3>Support Topics</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="table-wrapper"><div className="table"><div className="table-row"><div className="table-cell table-header-cell">Topic</div><div className="table-cell table-header-cell">Description</div></div><div className="table-row"><div className="table-cell">Getting Started</div><div className="table-cell">Introduction to the demo app</div></div><div className="table-row"><div className="table-cell">Trading Guide</div><div className="table-cell">How to place simulated orders</div></div><div className="table-row"><div className="table-cell">Wallet Guide</div><div className="table-cell">Managing demo funds</div></div><div className="table-row"><div className="table-cell">FAQ</div><div className="table-cell">Frequently asked questions</div></div></div></div>
        </div>
      </GlassCard>
    </div>
  );
}
