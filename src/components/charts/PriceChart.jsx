import { useEffect, useId, useRef, useState } from 'react';
import './Chart.css';

const toTradingViewSymbol = value => {
  const clean = String(value || 'BTC').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const pair = clean.endsWith('USDT') ? clean : clean === 'USDT' ? 'USDTUSDC' : clean + 'USDT';
  return 'BINANCE:' + pair;
};

export default function PriceChart({ symbol = 'BTC', title = 'BTC/USDT', height = 460 }) {
  const hostRef = useRef(null);
  const widgetId = 'crypto1-tv-' + useId().replace(/:/g, '');
  const [status, setStatus] = useState('Loading TradingView market chart…');
  const [failed, setFailed] = useState(false);
  const tvSymbol = toTradingViewSymbol(symbol || title);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    setStatus('Connecting to live exchange chart…');
    setFailed(false);
    host.replaceChildren();

    const widget = document.createElement('div');
    widget.id = widgetId;
    widget.className = 'tradingview-widget-container__widget';
    widget.style.width = '100%';
    widget.style.height = '100%';

    const copyright = document.createElement('div');
    copyright.className = 'tradingview-widget-copyright';
    const link = document.createElement('a');
    link.href = 'https://www.tradingview.com/';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'View market chart on TradingView';
    copyright.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.text = JSON.stringify({
      autosize: true,
      symbol: tvSymbol,
      interval: '15',
      timezone: 'Asia/Kolkata',
      theme: 'dark',
      style: '1',
      locale: 'en',
      withdateranges: true,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      save_image: false,
      calendar: false,
      details: true,
      hotlist: false,
      studies: ['Volume@tv-basicstudies'],
      support_host: 'https://www.tradingview.com'
    });
    script.onload = () => setStatus('Live interactive market chart');
    script.onerror = () => {
      setFailed(true);
      setStatus('TradingView chart could not load. Check your network or content blocker.');
    };

    host.append(widget, copyright, script);
    return () => {
      script.onload = null;
      script.onerror = null;
      host.replaceChildren();
    };
  }, [tvSymbol, widgetId]);

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
      <div
        className="tradingview-widget-container"
        ref={hostRef}
        style={{ width: '100%', height: Math.max(340, Number(height) || 460), minHeight: 340 }}
        aria-label={tvSymbol + ' interactive candlestick trading chart'}
      />
      {failed && (
        <div className="trading-chart-error" role="status">
          Chart loading was blocked by the browser or network. <a href={'https://www.tradingview.com/chart/?symbol=' + encodeURIComponent(tvSymbol)} target="_blank" rel="noopener noreferrer">Open this live chart directly</a>.
        </div>
      )}
      <div className="chart-footnote">
        Interactive live market chart powered by TradingView. Use the chart toolbar for timeframes, indicators, drawing tools, zoom and crosshair. Orders in Crypto1 remain simulated.
      </div>
    </section>
  );
}
