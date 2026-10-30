import { GlassCard } from '../../components/common/GlassCard';

export default function AltcoinsPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Altcoin Explorer</h1><p className="page-subtitle">Explore alternative cryptocurrencies beyond BTC and ETH</p></GlassCard>
      <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><h3>Altcoin details coming soon</h3></GlassCard>
    </div>
  );
}
