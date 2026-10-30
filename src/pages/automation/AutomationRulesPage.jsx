import { GlassCard } from '../../components/common/GlassCard';

export default function AutomationRulesPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Automation Rules</h1><p className="page-subtitle">Configure simulated trading automation rules</p></GlassCard>
      <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M12 1v4m0 16v-4m-4 1h1.5m12.124-3.937L12.757 17m0 0L7.5 9.5M12.757 17l-5.257 5.257M17 12c2.21 0 4-1.79 4-4v-3c0-2.21-1.79-4-4-4h-3c-2.21 0-4 1.79-4 4v3c0 2.21 1.79 4 4 4h3"/></svg><h3>No automation rules configured</h3></GlassCard>
    </div>
  );
}
