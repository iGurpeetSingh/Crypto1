import { useMemo, useState } from 'react';
import './Chart.css';

const toTradingViewSymbol = value => {
  const clean = String(value || 'BTC').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const pair = clean.endsWith('USDT') ? clean : clean === 'USDT' ? 'USDTUSDC' : clean + 'USDT';
  return 'BINANCE:' + pair;
};

export default function PriceChart({ symbol = 'BTC', title = 'BTC/USDT', height = 520 }) {
  const [status, setStatus] = useState('Loading live interactive chart');
  const tvSymbol = toTradingViewSymbol(symbol || title);
  const chartHeight = Math.max(460, Number(height) || 520);
  const chartUrl = useMemo(() => {
    const params = new URLSearchParams({
      symbol: tvSymbol,
      interval: '15',
      timezone: 'Asia/Kolkata',
      theme: 'dark',
      style: '1',
      locale: 'en',
      withdateranges: '1',
      hide_top_toolbar: '0',
      hide_side_toolbar: '0',
      allow_symbol_change: '1',
      save_image: '0',
      calendar: '0',
      details: '1',
      hotlist: '0',
      studies: 'Volume@tv-basicstudies',
      backgroundColor: '#131722',
      gridColor: 'rgba(42,46,57,0.06)',
      support_host: 'https://www.tradingview.com'
    });
    return 'https://www.tradingview.com/widgetembed/?' + params.toString();
  }, [tvSymbol]);

  return (
    <section className="trading-chart tradingview-chart-shell">
      <div className="trading-chart-toolbar">
        <div className="chart-symbol-info">
          <strong>{tvSymbol}</strong>
          <span className="chart-live-dot">● {status}</span>
        </div>
        <a className="chart-open-full" href={'https://www.tradingview.com/chart/?symbol=' + encodeURIComponent(tvSymbol)} target="_blank" rel="noopener noreferrer">
          Open full chart ↗
        </a>
      </div>
      <div className="tradingview-frame-wrap" style={{ height: chartHeight, minHeight: chartHeight }}>
        <iframe
          key={tvSymbol}
          title={tvSymbol + ' live interactive candlestick chart'}
          src={chartUrl}
          className="tradingview-frame"
          loading="eager"
          allow="fullscreen; clipboard-write"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setStatus('Live interactive market chart')}
          onError={() => setStatus('Chart unavailable — open full chart')}
        />
      </div>
      <div className="chart-footnote">
        Live market chart with timeframes, indicators, drawing tools, zoom and crosshair. Crypto1 orders remain simulated.
      </div>
    </section>
  );
}
