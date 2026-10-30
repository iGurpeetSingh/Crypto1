import { GlassCard } from '../../components/common/GlassCard';

export default function ActivityReportPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Activity Report</h1>
        <p className="page-subtitle">Simulated account activity report</p>
      </GlassCard>
      <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        <h3>Activity report coming soon</h3>
      </GlassCard>
    </div>
  );
}
