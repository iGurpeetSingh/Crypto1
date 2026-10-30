import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import FormField from '../../components/forms/FormField';
import FormButton from '../../components/forms/FormButton';
import { useApp } from '../../context/AppContext';

export default function SellOrderPage() {
  const { markets, portfolio, showToast } = useApp();
  const navigate = useNavigate();

  const [assetId, setAssetId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [priceType, setPriceType] = useState('market');
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

  const asset = markets.find((m) => m.id === assetId);
  const holding = portfolio.assets?.find((h) => h.id === assetId);
  const proceeds = asset ? asset.price * Number(quantity) : 0;
  const fee = asset ? proceeds * 0.005 : 0;
  const net = asset ? proceeds - fee : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!assetId) { setError('Select an asset'); return; }
    if (!quantity || Number(quantity) <= 0) { setError('Enter a valid quantity'); return; }
    if (!holding || holding.quantity < Number(quantity)) { setError('Insufficient asset quantity'); return; }

    setLoading(true);
    try {
      await API.placeOrder({ type: 'sell', assetId, quantity: Number(quantity), price: asset.price, side: 'sell' });
      showToast('Sell order placed successfully', 'success');
      navigate('/trading');
    } catch (err) {
      showToast(err.message || 'Order failed', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Demo Sell Order</h1>
        <p className="page-subtitle">Sell a simulated asset you own. All trades are local demo operations.</p>
      </GlassCard>

      <GlassCard style={{ maxWidth: '640px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <FormField label="Asset" error={error}>
            <select value={assetId} onChange={(e) => setAssetId(e.target.value)}>
              <option value="">Select an asset you own</option>
              {markets.map((m) => {
                const h = portfolio.assets?.find((hh) => hh.id === m.id);
                return h ? <option key={m.id} value={m.id}>{m.name} ({m.symbol}) — {h.quantity.toFixed(4)} held</option> : null;
              })}
            </select>
          </FormField>

          <FormField label="Quantity to Sell" error={error}>
            <input
              type="number"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0.0"
              min={0}
              max={holding?.quantity || 0}
            />
          </FormField>

          <div className="form-field">
            <label className="form-label">Price Type</label>
            <select value={priceType} onChange={(e) => setPriceType(e.target.value)}>
              <option value="market">Market Price</option>
              <option value="limit">Limit Price</option>
            </select>
          </div>

          {asset && holding && (
            <div className="form-field">
              <label className="form-label">Order Preview</label>
              <div className="glass glass-hover" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>Proceeds: <strong>${proceeds.toLocaleString()}</strong></div>
                {fee > 0 && <div>Estimated Fee (0.5%): <strong>${fee.toLocaleString()}</strong></div>}
                <div className="text-sm">Net Received: <strong>${net.toLocaleString()}</strong></div>
                <div className="text-xs text-secondary">Available: {holding.quantity.toFixed(4)}</div>
              </div>
            </div>
          )}

          {error && <div className="text-danger" style={{ marginBottom: '12px' }}>{error}</div>}

          <div className="form-field">
            <div className="flex gap-4" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <FormButton variant="ghost" onClick={() => navigate('/trading')}>Cancel</FormButton>
              <FormButton variant="secondary" loading={loading} disabled={!asset || !quantity || !holding || holding.quantity < Number(quantity)}>
                {loading ? 'Processing...' : 'Confirm Sell Order'}
              </FormButton>
            </div>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
