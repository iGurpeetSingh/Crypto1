import { GlassCard } from '../../components/common/GlassCard';

export default function AccountPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Account</h1>
        <p className="page-subtitle">Manage your simulated account settings and information</p>
      </GlassCard>
      <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z"/></svg>
        <h3>Account Overview</h3>
        <p>Select an account section from the sidebar</p>
      </GlassCard>
    </div>
  );
}
