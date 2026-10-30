import { GlassCard } from '../../components/common/GlassCard';

export default function AssetComparisonPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Asset Comparison</h1><p className="page-subtitle">Compare simulated crypto assets side by side</p></GlassCard>
      <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg><h3>Asset comparison coming soon</h3></GlassCard>
    </div>
  );
}
