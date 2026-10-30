import { GlassCard } from '../../components/common/GlassCard';

export default function QuickActionsPage() {
  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Quick Actions</h1>
        <p className="page-subtitle">Common tasks you can perform instantly</p>
      </GlassCard>

      <div className="quick-actions-grid">
        <button className="quick-action quick-action--block" onClick={() => {}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 24, height: 24 }}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg>
          <div className="quick-action-label">Spot Trade</div>
          <div className="quick-action-desc">Execute a simulated spot buy or sell</div>
        </button>
        <button className="quick-action quick-action--block" onClick={() => {}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 24, height: 24 }}><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          <div className="quick-action-label">Check Portfolio</div>
          <div className="quick-action-desc">View your simulated holdings</div>
        </button>
        <button className="quick-action quick-action--block" onClick={() => {}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 24, height: 24 }}><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg>
          <div className="quick-action-label">Deposits & Withdrawals</div>
          <div className="quick-action-desc">Simulate demo deposits and withdrawals</div>
        </button>
        <button className="quick-action quick-action--block" onClick={() => {}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 24, height: 24 }}><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
          <div className="quick-action-label">Analytics</div>
          <div className="quick-action-desc">Review market, volume, and risk analytics</div>
        </button>
        <button className="quick-action quick-action--block" onClick={() => {}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 24, height: 24 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8"/></svg>
          <div className="quick-action-label">Reports</div>
          <div className="quick-action-desc">Generate portfolio and transaction reports</div>
        </button>
        <button className="quick-action quick-action--block" onClick={() => {}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 24, height: 24 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <div className="quick-action-label">Help & Support</div>
          <div className="quick-action-desc">Access the help centre and documentation</div>
        </button>
      </div>
    </div>
  );
}
