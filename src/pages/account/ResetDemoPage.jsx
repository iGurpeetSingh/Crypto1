import { useState } from 'react';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import { useApp } from '../../context/AppContext';

export default function ResetDemoPage() {
  const { showToast } = useApp();
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (confirm !== 'I confirm') return showToast('Type "I confirm" to reset', 'error');
    setLoading(true);
    try {
      await API.resetDemo();
      showToast('Demo data reset', 'success');
    } catch (err) {
      showToast(err.message || 'Reset failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Reset Demo Data</h1><p className="page-subtitle">Reset all simulated demo data to default state</p></GlassCard>
      <GlassCard style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="card-chart-header"><h3>Confirm Reset</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="text" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Type 'I confirm'" className="form-input" style={{ width: '100%' }} />
          <button className="btn btn--secondary" onClick={handleReset} disabled={loading}>{loading ? 'Resetting...' : 'Reset All Demo Data'}</button>
        </div>
      </GlassCard>
    </div>
  );
}
