import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import MetricCard from '../../components/cards/MetricCard';
import { useApp } from '../../context/AppContext';

export default function WalletPage() {
  const { balances, refresh, loading } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    API.getWallet();
  }, []);

  if (loading) return <div className="page-content"><GlassCard><div className="skeleton-grid" /></GlassCard></div>;

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Wallet</h1>
        <p className="page-subtitle">Simulated demo wallet with internal demo accounts and transaction history</p>
      </GlassCard>

      <div className="grid grid-4">
        <MetricCard
          label="Total Balance"
          value={`$${balances.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`}
          subtitle="Simulated demo balance"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><path d="M20 4H11a3 3 0 0 0 3 3"/></svg>}
          accent="#FF5CA8"
          loading={loading}
        />
        <MetricCard
          label="Accounts"
          value="3"
          subtitle="Demo Investor A, B, C"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>}
          accent="#C084FC"
          loading={loading}
        />
        <MetricCard
          label="Profit/Loss"
          value={`${balances >= 0 ? '+' : ''}${((balances - 25000) / 25000 * 100).toFixed(2)}%`}
          subtitle="Demo balance change from starting balance"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>}
          accent="#42DDAA"
          loading={loading}
        />
        <MetricCard
          label="Transactions"
          value={0}
          subtitle="Active demo operations"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>}
          accent="#FF9ECF"
          loading={loading}
        />
      </div>

      <div className="grid grid-2" style={{ marginTop: '20px' }}>
        <GlassCard className="card-chart">
          <div className="card-chart-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <button className="quick-action" onClick={() => navigate('/wallet/deposit')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg>
              Deposit
            </button>
            <button className="quick-action" onClick={() => navigate('/wallet/withdraw')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}><path d="M3 21h18M4 17V9m4 8V5m4 12V7m4 12V9"/></svg>
              Withdraw
            </button>
            <button className="quick-action" onClick={() => navigate('/wallet/transfer')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              Transfer
            </button>
            <button className="quick-action" onClick={() => navigate('/wallet/history')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              History
            </button>
          </div>
        </GlassCard>

        <GlassCard className="card-chart">
          <div className="card-chart-header">
            <h3>Account Balances (Demo)</h3>
          </div>
          <div className="table-wrapper">
            <div className="table">
              <div className="table-header">
                <div className="table-cell table-header-cell">Account</div>
                <div className="table-cell table-header-cell">Balance</div>
                <div className="table-cell table-header-cell">Type</div>
              </div>
              <div className="table-row">
                <div className="table-cell">Demo Investor A</div>
                <div className="table-cell">$25,000</div>
                <div className="table-cell text-success">Active</div>
              </div>
              <div className="table-row">
                <div className="table-cell">Demo Investor B</div>
                <div className="table-cell">$15,000</div>
                <div className="table-cell text-success">Active</div>
              </div>
              <div className="table-row">
                <div className="table-cell">Demo Investor C</div>
                <div className="table-cell">$8,000</div>
                <div className="table-cell text-success">Active</div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
