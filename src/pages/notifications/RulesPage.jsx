import { GlassCard } from '../../components/common/GlassCard';

export default function RulesPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Alert Rules</h1><p className="page-subtitle">Configure simulated alert rules and conditions</p></GlassCard>
      <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M9 17h6m0 0v-6m0 6H9m6 0H9"/><path d="M18 18V4"/></svg><h3>Alert rules coming soon</h3></GlassCard>
    </div>
  );
}
