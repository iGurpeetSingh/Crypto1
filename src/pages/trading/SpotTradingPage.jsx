import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import { useApp } from '../../context/AppContext';

export default function SpotTradingPage() {
  const { markets, portfolio, refresh, showToast } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    API.getMarkets();
  }, []);

  const goToBuy = () => navigate('/trading/buy');
  const goToSell = () => navigate('/trading/sell');
  const goToConvert = () => navigate('/trading/convert');
  const goToOrderHistory = () => navigate('/trading/order-history');
  const goToOpenOrders = () => navigate('/trading/open-orders');
  const goToClosedOrders = () => navigate('/trading/closed-orders');
  const goToFees = () => navigate('/trading/fees');

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Trading Simulator</h1>
        <p className="page-subtitle">Simulated spot trading — all orders are local demo operations with no real exchange integration</p>
      </GlassCard>

      <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="grid grid-3">
          <button className="btn btn--primary" onClick={goToBuy}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg>
            Demo Buy Order
          </button>
          <button className="btn btn--secondary" onClick={goToSell}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}><path d="M12 2l10 5-10 5-10-5z"/><path d="M2 17l10 5 10-5"/></svg>
            Demo Sell Order
          </button>
          <button className="btn btn--ghost" onClick={goToConvert}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}><path d="M12 2v20M12 12L18 6M12 12L6 6"/></svg>
            Asset Conversion
          </button>
        </div>

        <div className="card-chart-header" style={{ marginTop: '16px' }}>
          <h3>Order Management</h3>
        </div>
        <div className="grid grid-3" style={{ marginTop: '12px' }}>
          <button className="btn btn--ghost" onClick={goToOrderHistory}>
            Order History
            <span className="nav-badge">26</span>
          </button>
          <button className="btn btn--ghost" onClick={goToOpenOrders}>
            Open Orders
            <span className="nav-badge">27</span>
          </button>
          <button className="btn btn--ghost" onClick={goToClosedOrders}>
            Closed Orders
            <span className="nav-badge">28</span>
          </button>
        </div>

        <div className="grid grid-2" style={{ marginTop: '12px' }}>
          <GlassCard className="card-chart">
            <div className="card-chart-header">
              <h3>Demo Balance</h3>
            </div>
            <div className="table-wrapper">
              <div className="table">
                <div className="table-header">
                  <div className="table-cell table-header-cell">Balance</div>
                  <div className="table-cell table-header-cell">In USD</div>
                </div>
                <div className="table-row">
                  <div className="table-cell">{`$${portfolio.totalValue.toLocaleString()}`}</div>
                  <div className="table-cell text-success">+${(portfolio.totalPl || 0).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="card-chart">
            <div className="card-chart-header">
              <h3>Quick Links</h3>
            </div>
            <div className="quick-actions">
              <button className="quick-action" onClick={goToFees}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>Fees Breakdown</button>
            </div>
          </GlassCard>
        </div>
      </GlassCard>
    </div>
  );
}
