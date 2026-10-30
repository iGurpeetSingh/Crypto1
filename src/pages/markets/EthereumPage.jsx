import { GlassCard } from '../../components/common/GlassCard';

export default function EthereumPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Ethereum (ETH)</h1><p className="page-subtitle">Simulated Ethereum asset details</p></GlassCard>
      <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg><h3>Details coming soon</h3></GlassCard>
    </div>
  );
}
