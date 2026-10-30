import { GlassCard } from '../../components/common/GlassCard';

export default function AssetScreenerPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Asset Screener</h1><p className="page-subtitle">Filter and screen simulated crypto assets</p></GlassCard>
      <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M21 15V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/></svg><h3>Asset screener coming soon</h3></GlassCard>
    </div>
  );
}
