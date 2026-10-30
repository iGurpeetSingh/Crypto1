import { useEffect } from 'react';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';

export default function AnalyticsPage() {
  useEffect(() => { API.getMarkets(); }, []);

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Analytics</h1>
        <p className="page-subtitle">Market analytics and research tools for simulated crypto assets</p>
      </GlassCard>
      <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        <h3>Analytics Dashboard</h3>
        <p>Select an analytics view from the sidebar</p>
      </GlassCard>
    </div>
  );
}
