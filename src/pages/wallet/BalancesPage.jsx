import { useEffect, useState } from 'react';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';

export default function BalancesPage() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await API.getAccounts();
        setAccounts(data);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const totalBalance = accounts.reduce((s, a) => s + (a.demoBalance || 0), 0);

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Balances</h1>
        <p className="page-subtitle">Simulated USD balances across your demo wallet accounts</p>
      </GlassCard>

      <GlassCard style={{ padding: '16px', maxWidth: '800px' }}>
        <div className="card-chart-header">
          <h3>Overview</h3>
        </div>
        <div className="grid grid-3">
          <div className="table-wrapper"><div className="table"><div className="table-row"><div className="table-cell">Total USD</div><div className="table-cell text-success">${totalBalance.toLocaleString()}</div></div></div></div>
          <div className="table-wrapper"><div className="table"><div className="table-row"><div className="table-cell">Accounts</div><div className="table-cell">{accounts.length}</div></div></div></div>
          <div className="table-wrapper"><div className="table"><div className="table-row"><div className="table-cell">Avg Balance</div><div className="table-cell">${accounts.length ? (totalBalance / accounts.length).toLocaleString() : '0'}</div></div></div></div>
        </div>
      </GlassCard>

      <GlassCard style={{ marginTop: '20px' }}>
        <div className="card-chart-header"><h3>Account Balances</h3></div>
        <div className="table-wrapper">
          <div className="table">
            <div className="table-header">
              <div className="table-cell table-header-cell">Account</div>
              <div className="table-cell table-header-cell">Name</div>
              <div className="table-cell table-header-cell">Currency</div>
              <div className="table-cell table-header-cell">Balance</div>
            </div>
            {accounts.map((a) => (
              <div key={a.id} className="table-row">
                <div className="table-cell">{a.id}</div>
                <div className="table-cell">{a.name}</div>
                <div className="table-cell">USD</div>
                <div className="table-cell">${a.demoBalance.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
