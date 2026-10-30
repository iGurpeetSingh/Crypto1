import { GlassCard } from '../../components/common/GlassCard';

export default function BitcoinPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Bitcoin (BTC)</h1><p className="page-subtitle">Simulated Bitcoin asset details</p></GlassCard>
      <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M18 12h-3m3 3h-3"/><path d="M18 6L12 18M6 12l6 6"/></svg><h3>Details coming soon</h3></GlassCard>
    </div>
  );
}
