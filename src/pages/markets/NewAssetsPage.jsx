import { GlassCard } from '../../components/common/GlassCard';

export default function NewAssetsPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>New Assets</h1><p className="page-subtitle">Recently added simulated crypto assets</p></GlassCard>
      <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M12 2v20M12 12l6 6M12 12l-6 6"/></svg><h3>New asset listings coming soon</h3></GlassCard>
    </div>
  );
}
