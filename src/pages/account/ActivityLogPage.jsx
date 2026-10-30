import { GlassCard } from '../../components/common/GlassCard';

export default function ActivityLogPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Activity Log</h1><p className="page-subtitle">View simulated account activity history</p></GlassCard>
      <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M12 2v20m-9-9h18M12 2V2m0 20V2m0 0l-9 9m9-9-9-9"/></svg><h3>No activity logged (demo)</h3></GlassCard>
    </div>
  );
}
