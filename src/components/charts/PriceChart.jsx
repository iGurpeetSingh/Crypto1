import { useMemo, useState } from 'react';
import './Chart.css';

const toTradingViewSymbol = value => {
  const clean = String(value || 'BTC').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const pair = clean.endsWith('USDT') ? clean : clean === 'USDT' ? 'USDTUSDC' : clean + 'USDT';
  return 'BINANCE:' + pair;
};

export default function PriceChart({ symbol = 'BTC', title = 'BTC/USDT', height = 520, markets = [] }) {
  const [status, setStatus] = useState('Loading live interactive chart');
  const [fullChart, setFullChart] = useState(false);
  const [fullSymbol, setFullSymbol] = useState(symbol);
  const tvSymbol = toTradingViewSymbol(symbol || title);
  const activeSymbol = toTradingViewSymbol(fullChart ? fullSymbol : symbol || title);
  const chartHeight = Math.max(460, Number(height) || 520);

  const buildChartUrl = (selectedSymbol, expanded = false) => {
    const params = new URLSearchParams({
      symbol: selectedSymbol,
      interval: '15',
      timezone: 'Asia/Kolkata',
      theme: 'dark',
      style: '1',
      locale: 'en',
      withdateranges: expanded ? '1' : '0',
      hide_top_toolbar: '0',
      hide_side_toolbar: expanded ? '0' : '1',
      allow_symbol_change: '1',
      save_image: expanded ? '1' : '0',
      calendar: expanded ? '1' : '0',
      details: '1',
      hotlist: expanded ? '1' : '0',
      hide_volume: '0',
      backgroundColor: '#080f19',
      gridColor: 'rgba(42,46,57,0.18)',
      support_host: 'https://www.tradingview.com'
    });
    return 'https://www.tradingview.com/widgetembed/?' + params.toString();
  };

  const chartUrl = useMemo(() => buildChartUrl(tvSymbol, false), [tvSymbol]);
  const fullChartUrl = useMemo(() => buildChartUrl(activeSymbol, true), [activeSymbol, fullChart]);

  return (
    <>
      <section className="trading-chart tradingview-chart-shell">
        <div className="trading-chart-toolbar">
          <div className="chart-symbol-info">
            <strong>{tvSymbol}</strong>
            <span className="chart-live-dot">● {status}</span>
          </div>
          <button className="chart-open-full" type="button" onClick={() => { setFullSymbol(symbol); setFullChart(true); }}>
            Open full chart ↗
          </button>
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
            onError={() => setStatus('Chart unavailable')}
          />
        </div>
        <div className="chart-footnote">Live {tvSymbol} market chart · Crypto1 orders are simulated.</div>
      </section>

      {fullChart && (
        <div className="full-chart-screen" role="dialog" aria-modal="true" aria-label="Full screen live trading chart">
          <header className="full-chart-topbar">
            <div className="full-chart-brand"><span>₿</span><strong>CryptoDash</strong><small>Advanced Chart</small></div>
            <div className="full-chart-pair">
              <b>{activeSymbol.replace('BINANCE:', '').replace('USDT', ' / USDT')}</b>
              <span>● LIVE MARKET</span>
            </div>
            <button type="button" className="full-chart-close" onClick={() => setFullChart(false)} aria-label="Close full chart">✕ <span>Close</span></button>
          </header>
          <div className="full-chart-layout">
            <main className="full-chart-main">
              <iframe
                key={activeSymbol + '-full'}
                title={activeSymbol + ' full interactive TradingView chart'}
                src={fullChartUrl}
                className="full-chart-frame"
                allow="fullscreen; clipboard-write"
                loading="eager"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </main>
            <aside className="full-chart-watchlist">
              <div className="full-chart-watch-head"><b>Watchlist</b><span>{markets.length} Markets</span></div>
              <div className="full-chart-watch-label"><span>Symbol</span><span>Last Price</span><span>24h</span></div>
              <div className="full-chart-watch-items">
                {markets.map(item => {
                  const active = item.symbol === fullSymbol;
                  const change = Number(item.change24 || 0);
                  return <button type="button" key={item.id} className={active ? 'active' : ''} onClick={() => setFullSymbol(item.symbol)}>
                    <span><b>{item.symbol}</b><small>{item.name}</small></span>
                    <strong>{Number(item.price || 0).toLocaleString(undefined, { maximumFractionDigits: 4 })}</strong>
                    <em className={change >= 0 ? 'positive' : 'negative'}>{change >= 0 ? '+' : ''}{change.toFixed(2)}%</em>
                  </button>;
                })}
              </div>
              <div className="full-chart-watch-foot">Prices from CryptoDash public market feed</div>
            </aside>
          </div>
          <footer className="full-chart-footer"><span>Live market chart powered by TradingView</span><span>Demo orders and wallet remain inside CryptoDash</span></footer>
        </div>
      )}
    </>
  );
}
