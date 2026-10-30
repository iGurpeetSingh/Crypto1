import { GlassCard } from '../../components/common/GlassCard';

export default function DrawdownPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Drawdown</h1><p className="page-subtitle">Maximum drawdown analysis for simulated portfolio</p></GlassCard>
      <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2z"/><path d="M12 13V9"/><path d="M12 9h.01"/></svg><h3>Drawdown analysis coming soon</h3></GlassCard>
    </div>
  );
}
