import { GlassCard } from '../../components/common/GlassCard';

export default function TransactionReportPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Transaction Report</h1>
        <p className="page-subtitle">Simulated wallet transaction report</p>
      </GlassCard>
      <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        <h3>Transaction report coming soon</h3>
      </GlassCard>
    </div>
  );
}
