import { GlassCard } from '../../components/common/GlassCard';

export default function RiskPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Portfolio Risk</h1><p className="page-subtitle">Simulated portfolio risk metrics</p></GlassCard>
      <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg><h3>Risk metrics coming soon</h3></GlassCard>
    </div>
  );
}
