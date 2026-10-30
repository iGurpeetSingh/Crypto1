import { GlassCard } from '../../components/common/GlassCard';

export default function AddressesPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Demo Addresses</h1>
        <p className="page-subtitle">Simulated wallet addresses generated locally for display purposes</p>
      </GlassCard>
      <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
        <h3>No active addresses</h3>
        <p>Addresses are locally generated and not connected to any real blockchain.</p>
      </GlassCard>
    </div>
  );
}
