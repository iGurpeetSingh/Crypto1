import { useEffect, useState } from 'react';
import { GlassCard } from '../../components/common/GlassCard';
import MetricCard from '../../components/cards/MetricCard';
import { useApp } from '../../context/AppContext';

const money = n => '$' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const COOLDOWN = 24 * 60 * 60 * 1000;

export default function WalletPage() {
  const { cash, transactions, holdings, markets, portfolio, claimDailyDemoFunds, fundingClaimedAt } = useApp();
  const [now, setNow] = useState(Date.now());
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const lastClaim = new Date(fundingClaimedAt).getTime();
  const nextClaimAt = (Number.isFinite(lastClaim) ? lastClaim : now) + COOLDOWN;
  const remaining = Math.max(0, nextClaimAt - now);
  const canClaim = remaining === 0;
  const countdown = [Math.floor(remaining / 3600000), Math.floor((remaining % 3600000) / 60000), Math.floor((remaining % 60000) / 1000)]
    .map(value => String(value).padStart(2, '0')).join(':');

  const claim = () => {
    setNotice('');
    setError('');
    try {
      claimDailyDemoFunds();
      setNotice('$500 demo funds added. Your next claim will be available in 24 hours.');
    } catch (err) {
      setError(err.message || 'Demo funds could not be claimed.');
    }
  };

  return <div className="page-content">
    <GlassCard className="page-header"><h1>Wallet</h1><p className="page-subtitle">Your single USD demo wallet for simulated crypto trading</p></GlassCard>
    <GlassCard>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div><span className="real-wallet-eyebrow">TOTAL DEMO ACCOUNT VALUE · USD</span><h2 style={{ fontSize: 38, margin: '12px 0', color: '#42DDAA' }}>{money(portfolio?.totalValue ?? cash)}</h2><p style={{ opacity: .7, margin: 0 }}>Available USD: {money(cash)} · Open asset value: {money(portfolio?.investedValue || 0)} · Simulated funds only</p></div>
        <span className="demo-badge">SIMULATED TRADING</span>
      </div>
    </GlassCard>
    <div className="grid grid-3" style={{ marginTop: 20 }}>
      <MetricCard label="Total Account Value" value={money(portfolio?.totalValue ?? cash)} subtitle="Available USD + current crypto holdings" accent="#42DDAA" />
      <MetricCard label="Available USD" value={money(cash)} subtitle="Free balance for new buy orders" accent="#42DDAA" />
      <MetricCard label="Open Asset Value" value={money(portfolio?.investedValue || 0)} subtitle="Live market value of open holdings" accent="#C084FC" />
      <MetricCard label="Total Profit / Loss" value={money(portfolio?.totalProfitLoss || 0)} subtitle="Realized + unrealized demo P/L" accent={(portfolio?.totalProfitLoss || 0) >= 0 ? '#42DDAA' : '#FF6B8A'} />
    </div>
    <div className="grid grid-2" style={{ marginTop: 20 }}>
      <GlassCard>
        <h3>Daily Demo Funds</h3>
        <p style={{ margin: '8px 0 16px', opacity: .7 }}>Claim exactly $500 in virtual USD once every 24 hours. No real money is involved.</p>
        <button className="btn btn--primary" onClick={claim} disabled={!canClaim} style={{ width: '100%', opacity: canClaim ? 1 : .55, cursor: canClaim ? 'pointer' : 'not-allowed' }}>
          {canClaim ? 'Claim $500 Demo Funds' : 'Next $500 available in ' + countdown}
        </button>
        {notice && <p className="text-success" role="status">{notice}</p>}
        {error && <p className="text-danger" role="alert">{error}</p>}
        <p style={{ opacity: .65, fontSize: 13, marginTop: 12 }}>Your first $500 demo balance is provided when the demo account is initialized. The next claim unlocks 24 hours later.</p>
      </GlassCard>
      <GlassCard><h3>Wallet details</h3><div style={{ display: 'grid', gap: 14, marginTop: 16 }}><div><span style={{ opacity: .65 }}>Wallet type</span><strong style={{ display: 'block', marginTop: 4 }}>Main Demo Wallet</strong></div><div><span style={{ opacity: .65 }}>Currency</span><strong style={{ display: 'block', marginTop: 4 }}>USD ($)</strong></div><div><span style={{ opacity: .65 }}>Funding rule</span><strong style={{ display: 'block', marginTop: 4 }}>$500 every 24 hours</strong></div></div></GlassCard>
    </div>
    <GlassCard className="card-chart" style={{ marginTop: 20 }}><h3>Asset balances</h3><div className="table-wrapper"><table className="table"><thead><tr><th>Asset</th><th>Quantity</th><th>Market value</th></tr></thead><tbody>{holdings.map(h => { const p = markets.find(m => m.id === h.id)?.price || h.avgBuyPrice; return <tr key={h.id}><td>{h.name} ({h.symbol})</td><td>{h.quantity.toFixed(8)}</td><td>{money(h.quantity * p)}</td></tr>; })}</tbody></table>{!holdings.length && <div className="table-empty">No crypto holdings. Buy an asset from Spot Trading.</div>}</div></GlassCard>
    <GlassCard className="card-chart"><h3>Demo transaction history</h3><div className="table-wrapper"><table className="table"><thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Amount</th></tr></thead><tbody>{transactions.map(t => <tr key={t.id}><td>{new Date(t.createdAt).toLocaleString()}</td><td>{t.type}</td><td>{t.description}</td><td>{money(t.amount)}</td></tr>)}</tbody></table>{!transactions.length && <div className="table-empty">No demo transactions yet.</div>}</div></GlassCard>
  </div>;
}
