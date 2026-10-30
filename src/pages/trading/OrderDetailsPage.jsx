import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import { useApp } from '../../context/AppContext';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { orders } = useApp();

  useEffect(() => {
    API.getOrder(id);
  }, [id]);

  const order = (orders || []).find((o) => o.id === id);

  if (!order) {
    return (
      <div className="page-content">
        <GlassCard className="page-header">
          <h1>Order Details</h1>
        </GlassCard>
        <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          <h3>Order not found</h3>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Order Details</h1>
        <p className="page-subtitle">Details for simulated order #{order.id?.substring(0, 8)}</p>
      </GlassCard>
      <GlassCard style={{ maxWidth: '600px', margin: '20px auto 0' }}>
        <div className="table-wrapper">
          <div className="table">
            <div className="table-header"><div className="table-cell table-header-cell">Field</div><div className="table-cell table-header-cell">Value</div></div>
            <div className="table-row"><div className="table-cell">Order ID</div><div className="table-cell">{order.id}</div></div>
            <div className="table-row"><div className="table-cell">Type</div><div className="table-cell">{order.type}</div></div>
            <div className="table-row"><div className="table-cell">Asset</div><div className="table-cell">{order.symbol || order.assetId}</div></div>
            <div className="table-row"><div className="table-cell">Quantity</div><div className="table-cell">{order.quantity?.toFixed(4)}</div></div>
            <div className="table-row"><div className="table-cell">Price</div><div className="table-cell">${order.price?.toFixed(4)}</div></div>
            <div className="table-row"><div className="table-cell">Total</div><div className="table-cell">${order.total?.toFixed(2)}</div></div>
            <div className="table-row"><div className="table-cell">Fee</div><div className="table-cell">${order.fee?.toFixed(2) || '0.00'}</div></div>
            <div className="table-row"><div className="table-cell">Status</div><div className={`table-cell text-${order.status === 'completed' ? 'success' : 'danger'}`}>{order.status}</div></div>
            <div className="table-row"><div className="table-cell">Created</div><div className="table-cell">{new Date(order.createdAt).toLocaleString()}</div></div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
