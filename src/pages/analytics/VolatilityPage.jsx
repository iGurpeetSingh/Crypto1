import { GlassCard } from '../../components/common/GlassCard';

export default function VolatilityPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Volatility</h1><p className="page-subtitle">Simulated price volatility analysis</p></GlassCard>
      <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5"/></svg><h3>Volatility metrics coming soon</h3></GlassCard>
    </div>
  );
}
