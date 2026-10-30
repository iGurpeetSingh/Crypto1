import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import FormField from '../../components/forms/FormField';
import FormButton from '../../components/forms/FormButton';
import { useApp } from '../../context/AppContext';

export default function TransferPage() {
  const { showToast } = useApp();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const a = await API.getAccounts();
        setAccounts(a);
        if (a.length > 0) setFromId(a[0].id);
        if (a.length > 1) setToId(a[1].id);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const fromAccount = accounts.find((a) => a.id === fromId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!amount || Number(amount) <= 0) return setError('Enter a valid amount');
    if (fromId === toId) return setError('Source and destination must differ');
    if (!fromAccount || Number(amount) > fromAccount.demoBalance) return setError('Insufficient balance');
    setLoading(true);
    try {
      await API.transfer({ fromAccountId: fromId, toAccountId: toId, amount: Number(amount), description });
      showToast('Transfer completed', 'success');
      navigate('/wallet');
    } catch (err) {
      showToast(err.message || 'Transfer failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Transfer</h1>
        <p className="page-subtitle">Simulate transferring demo funds between accounts</p>
      </GlassCard>
      <GlassCard style={{ maxWidth: '560px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormField label="From Account">
              <select value={fromId} onChange={(e) => setFromId(e.target.value)} style={{ width: '100%' }}>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </FormField>
            <FormField label="To Account">
              <select value={toId} onChange={(e) => setToId(e.target.value)} style={{ width: '100%' }}>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </FormField>
          </div>
          <FormField label="Amount (USD)" hint="Simulated transfer between demo accounts">
            <input type="number" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
          </FormField>
          <FormField label="Description (optional)">
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Internal transfer" />
          </FormField>
          {fromAccount && (
            <FormField label="From Balance">
              <input type="text" value={fromAccount.demoBalance.toLocaleString()} readOnly style={{ opacity: 0.7 }} />
            </FormField>
          )}
          {error && <div className="text-danger" style={{ marginBottom: '12px' }}>{error}</div>}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <FormButton variant="ghost" onClick={() => navigate('/wallet')}>Cancel</FormButton>
            <FormButton variant="primary" loading={loading} type="submit">Confirm Transfer</FormButton>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
