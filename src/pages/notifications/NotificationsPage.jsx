import { GlassCard } from '../../components/common/GlassCard';

export default function NotificationsPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Notifications</h1>
        <p className="page-subtitle">Manage simulated price alerts and notification preferences</p>
      </GlassCard>
      <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/></svg>
        <h3>Notifications Center</h3>
        <p>Select a notification type from the sidebar</p>
      </GlassCard>
    </div>
  );
}
