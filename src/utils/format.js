

export function formatNumber(value, { decimals = 2 } = {}) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals }).format(value);
}

export function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPrice(value) {
  if (value === 0) return '$0.00';
  const abs = Math.abs(value);
  if (abs >= 1) return `$${formatNumber(value)}`;
  if (abs >= 0.01) return `$${formatNumber(value, { decimals: 4 })}`;
  return `$${formatNumber(value, { decimals: 8 })}`;
}

export function formatPercent(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export const format = { formatNumber, formatCurrency, formatPrice, formatPercent };
