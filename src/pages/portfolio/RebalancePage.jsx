import { GlassCard } from '../../components/common/GlassCard';

export default function RebalancePage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Rebalance</h1><p className="page-subtitle">Simulated portfolio rebalancing tool</p></GlassCard>
      <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        <h3>Rebalancing tool coming soon</h3>
      </GlassCard>
    </div>
  );
}
