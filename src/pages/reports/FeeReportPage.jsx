import { GlassCard } from '../../components/common/GlassCard';

export default function FeeReportPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Fee Report</h1>
        <p className="page-subtitle">Simulated trading fee breakdown</p>
      </GlassCard>
      <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
        <h3>Fee report coming soon</h3>
      </GlassCard>
    </div>
  );
}
