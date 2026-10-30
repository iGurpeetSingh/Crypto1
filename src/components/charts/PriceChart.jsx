import './Chart.css';

export default function PriceChart({ data, title, height = 240, showTooltip = false, onHover = () => {} }) {
  if (!data || data.length < 2) {
    return (
      <div className="chart-empty">
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}>
          <circle cx="32" cy="32" r="24" />
        </svg>
        <p>No chart data available</p>
      </div>
    );
  }

  const width = 800;
  const chartWidth = width - 60;
  const chartHeight = height - 40;
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const values = data.map((d) => d.price);
  const minVal = Math.min(...values) * 0.95;
  const maxVal = Math.max(...values) * 1.05;
  const range = maxVal - minVal || 1;

  const getX = (i) => padding.left + (i / (data.length - 1)) * innerWidth;
  const getY = (val) => padding.top + innerHeight - ((val - minVal) / range) * innerHeight;

  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.price)}`).join(' ');
  const areaPath = `${path} L ${getX(data.length - 1)} ${padding.top + innerHeight} L ${getX(0)} ${padding.top + innerHeight} Z`;

  const gradientId = `gradient-${title.replace(/\s/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`;

  return (
    <div className="chart-container" style={{ height }}>
      <div className="chart-header">
        <h3>{title}</h3>
      </div>
      <div className="chart-svg-wrap" style={{ padding: '20px 0' }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255, 92, 168, 0.35)" />
              <stop offset="100%" stopColor="rgba(255, 92, 168, 0.01)" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <line
              key={f}
              x1={padding.left}
              y1={padding.top + innerHeight * f}
              x2={width - padding.right}
              y2={padding.top + innerHeight * f}
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="4 4"
            />
          ))}
          {/* Area fill */}
          <path d={areaPath} fill={`url(#${gradientId})`} />
          {/* Price line */}
          <path
            d={path}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Data points */}
          {data.length > 0 && (
            <circle
              cx={getX(data.length - 1)}
              cy={getY(data[data.length - 1].price)}
              r="4"
              fill="rgba(255, 92, 168, 0.9)"
              stroke="#FFF"
              strokeWidth="2"
            />
          )}
        </svg>
      </div>
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ background: 'linear-gradient(135deg, #FF5CA8, #C084FC)' }} />
          <span>{title} Price</span>
        </div>
      </div>
    </div>
  );
}
