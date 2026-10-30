import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import FormField from '../../components/forms/FormField';
import FormButton from '../../components/forms/FormButton';
import { useApp } from '../../context/AppContext';

export default function WithdrawPage() {
  const { showToast } = useApp();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const a = await API.getAccounts();
        setAccounts(a);
        setAccountId(a[0]?.id || '');
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const account = accounts.find((a) => a.id === accountId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!amount || Number(amount) <= 0) return setError('Enter a valid amount');
    if (!accountId) return setError('Select an account');
    if (account && Number(amount) > account.demoBalance) return setError('Insufficient balance');
    setLoading(true);
    try {
      await API.withdraw({ accountId, amount: Number(amount), description });
      showToast('Withdrawal completed', 'success');
      navigate('/wallet');
    } catch (err) {
      showToast(err.message || 'Withdrawal failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Withdraw</h1>
        <p className="page-subtitle">Simulate a demo withdrawal from your account</p>
      </GlassCard>
      <GlassCard style={{ maxWidth: '560px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <FormField label="Account">
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)} style={{ width: '100%' }}>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Amount (USD)" hint="Simulated withdrawal from demo account">
            <input type="number" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
          </FormField>
          <FormField label="Description (optional)">
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Withdrawal" />
          </FormField>
          {account && (
            <FormField label="Available Balance">
              <input type="text" value={account.demoBalance.toLocaleString()} readOnly style={{ opacity: 0.7 }} />
            </FormField>
          )}
          {error && <div className="text-danger" style={{ marginBottom: '12px' }}>{error}</div>}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <FormButton variant="ghost" onClick={() => navigate('/wallet')}>Cancel</FormButton>
            <FormButton variant="secondary" loading={loading} type="submit">Confirm Withdrawal</FormButton>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
