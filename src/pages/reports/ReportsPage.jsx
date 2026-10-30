import { GlassCard } from '../../components/common/GlassCard';

export default function ReportsPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Reports</h1>
        <p className="page-subtitle">Generate and view simulated reports for your portfolio and trading activity</p>
      </GlassCard>
      <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M9 11H6v2h3zm-3-3v6m0 0v6m0-6h6m-6 0H6m6 0v-3m0 0v3m0-3v3m0 0v3m0-3h3m-3 0h3m-3 0v-3m0 0v3m0-3h3m-3 0h3m-3 0v-3m0 0v3m0-3h3m-3 0h3m-3 0v-3m0 0v3m0-3h3m-3 0h3m-3 0v-3m0 0v3m0-3h3m-3 0h3m-3 0v-3m0 0v3m0-3h3m-3 0h3m-3 0v-3m0 0v3m0-3h3m-3 0h3m-3 0v-3m0 0v3m0-3h3m-3 0h3m-3 0v-3m0 0v3m0-3h3m-3 0h3m-3 0v-3m0 0v3m0-3h3m-3 0h3"/></svg>
        <h3>Reports Dashboard</h3>
        <p>Select a report type from the sidebar</p>
      </GlassCard>
    </div>
  );
}
