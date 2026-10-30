import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import FormField from '../../components/forms/FormField';
import FormButton from '../../components/forms/FormButton';
import { useApp } from '../../context/AppContext';

export default function ConvertPage() {
  const { markets, portfolio, showToast } = useApp();
  const navigate = useNavigate();

  const [fromAssetId, setFromAssetId] = useState(markets[0]?.id || '');
  const [toAssetId, setToAssetId] = useState(markets[1]?.id || '');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        await API.getMarkets();
      } catch (e) { console.error(e); }
    }
    load();
  }, []);

  const fromAsset = markets.find((m) => m.id === fromAssetId);
  const toAsset = markets.find((m) => m.id === toAssetId);
  const fromHoldings = portfolio.assets?.find((h) => h.id === fromAssetId);

  let conversionVal = 0;
  if (fromAsset && amount && fromHoldings) {
    conversionVal = Number(amount) * fromAsset.price;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!fromAssetId || !toAssetId) { setError('Select both assets'); return; }
    if (fromAssetId === toAssetId) { setError('Source and target must differ'); return; }
    if (!amount || Number(amount) <= 0) { setError('Enter a valid amount'); return; }
    if (!fromHoldings || fromHoldings.quantity < Number(amount)) { setError('Insufficient source asset quantity'); return; }

    setLoading(true);
    try {
      // Demo conversion: deduct from source, credit to target
      await API.placeOrder({ type: 'sell', assetId: fromAssetId, quantity: Number(amount), price: fromAsset.price, side: 'sell' });
      showToast('Conversion complete', 'success');
      navigate('/trading');
    } catch (err) {
      showToast(err.message || 'Conversion failed', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Asset Conversion</h1>
        <p className="page-subtitle">Simulated internal conversion between demo assets. No real blockchain involved.</p>
      </GlassCard>

      <GlassCard style={{ maxWidth: '640px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormField label="From Asset" error={error}>
              <select value={fromAssetId} onChange={(e) => setFromAssetId(e.target.value)}>
                {markets.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.symbol}) — ${m.price.toLocaleString()}</option>)}
              </select>
            </FormField>
            <FormField label="To Asset" error={error}>
              <select value={toAssetId} onChange={(e) => setToAssetId(e.target.value)}>
                {markets.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.symbol}) — ${m.price.toLocaleString()}</option>)}
              </select>
            </FormField>
          </div>

          <FormField label="Amount" error={error}>
            <input
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
            />
          </FormField>

          {fromAsset && fromHoldings && conversionVal > 0 && (
            <div className="form-field">
              <label className="form-label">Preview</label>
              <div className="glass glass-hover" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>Amount: <strong>{number(amount).toFixed(4)} {fromAsset.symbol}</strong></div>
                <div>Value: <strong>${conversionVal.toLocaleString()}</strong></div>
                <div className="text-xs text-secondary">To: {toAsset?.name} ({toAsset?.symbol})</div>
              </div>
            </div>
          )}

          {error && <div className="text-danger" style={{ marginBottom: '12px' }}>{error}</div>}

          <div className="form-field">
            <div className="flex gap-4" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <FormButton variant="ghost" onClick={() => navigate('/trading')}>Cancel</FormButton>
              <FormButton variant="primary" loading={loading} disabled={!fromAsset || !toAsset || !amount || fromAssetId === toAssetId}>
                {loading ? 'Processing...' : 'Confirm Conversion'}
              </FormButton>
            </div>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
