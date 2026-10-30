import './MetricCard.css';

export default function MetricCard({ label, value, subtitle, icon, trend, trendLabel = '24h', accent = '#FF5CA8', loading = false }) {
  return (
    <div className="metric-card">
      <div className="metric-header" style={{ borderTop: `2px solid rgba(255,255,255,${loading ? 0.05 : 0.15})` }}>
        {icon}
        <span className="metric-label">{label}</span>
      </div>
      <div className="metric-body">
        {loading ? (
          <>
            <div className="skeleton-value" />
            <div className="skeleton-subtitle" />
          </>
        ) : (
          <>
            <div className="metric-value" style={{ color: accent }}>
              {value}
            </div>
            <div className="metric-subtitle">{subtitle}</div>
          </>
        )}
      </div>
      {trend !== undefined && (
        <div className={`metric-trend ${trend >= 0 ? 'trend-up' : 'trend-down'}`}>
          <span className="trend-value">{trend >= 0 ? '+' : ''}{trend.toFixed(2)}%</span>
          <span className="trend-label">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}
