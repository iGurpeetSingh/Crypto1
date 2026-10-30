import { GlassCard } from '../../components/common/GlassCard';

export default function AssetsPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Wallet Assets</h1>
        <p className="page-subtitle">All simulated asset balances held in your wallet</p>
      </GlassCard>
      <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
        <h3>No assets held</h3>
        <p>Buy assets first to see them listed here.</p>
      </GlassCard>
    </div>
  );
}
