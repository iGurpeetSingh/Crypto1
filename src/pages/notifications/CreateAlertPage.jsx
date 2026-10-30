import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import FormField from '../../components/forms/FormField';
import FormButton from '../../components/forms/FormButton';
import { useApp } from '../../context/AppContext';

export default function CreateAlertPage() {
  const { showToast } = useApp();
  const navigate = useNavigate();
  const [assetId, setAssetId] = useState('');
  const [condition, setCondition] = useState('above');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!assetId || !price || Number(price) <= 0) return setError('Enter valid asset and price');
    setLoading(true);
    try {
      await API.createAlert({ assetId, condition, price: Number(price) });
      showToast('Alert created', 'success');
      navigate('/notifications/price-alerts');
    } catch (err) {
      showToast(err.message || 'Failed to create alert', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Create Price Alert</h1><p className="page-subtitle">Set a simulated price alert</p></GlassCard>
      <GlassCard style={{ maxWidth: '500px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <FormField label="Asset"><input type="text" value={assetId} onChange={(e) => setAssetId(e.target.value)} placeholder="BTC" /></FormField>
          <FormField label="Condition"><select value={condition} onChange={(e) => setCondition(e.target.value)} style={{ width: '100%' }}><option value="above">Price above</option><option value="below">Price below</option></select></FormField>
          <FormField label="Target Price"><input type="number" step="any" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" /></FormField>
          {error && <div className="text-danger" style={{ marginBottom: '12px' }}>{error}</div>}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <FormButton variant="ghost" onClick={() => navigate('/notifications/price-alerts')}>Cancel</FormButton>
            <FormButton variant="primary" loading={loading} type="submit">Create Alert</FormButton>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
