// Central route configuration for all 90+ pages.
// Each route maps a path to a page component and metadata.

export const routeConfig = [
  // A. Overview and dashboard — 1 to 10
  { path: '/dashboard',        name: 'Dashboard',             idx: 1, group: 'overview' },
  { path: '/dashboard/overview',      name: 'Market Overview',           idx: 2, group: 'overview' },
  { path: '/dashboard/market-summary', name: 'Market Summary',           idx: 3, group: 'overview' },
  { path: '/dashboard/top-gainers',   name: 'Top Gainers',             idx: 4, group: 'overview' },
  { path: '/dashboard/top-losers',    name: 'Top Losers',              idx: 5, group: 'overview' },
  { path: '/dashboard/trending',      name: 'Trending Assets',         idx: 6, group: 'overview' },
  { path: '/dashboard/recent-activity', name: 'Recent Activity',      idx: 7, group: 'overview' },
  { path: '/dashboard/alerts',        name: 'Price Alerts',            idx: 8, group: 'overview' },
  { path: '/dashboard/favorites',     name: 'Favorites',               idx: 9, group: 'overview' },
  { path: '/dashboard/quick-actions', name: 'Quick Actions',           idx: 10, group: 'overview' },

  // B. Crypto markets — 11 to 20
  { path: '/markets',            name: 'All Markets',           idx: 11, group: 'markets' },
  { path: '/markets/coins',      name: 'Coin Directory',        idx: 12, group: 'markets' },
  { path: '/markets/categories', name: 'Market Categories',     idx: 13, group: 'markets' },

  // C. Trading simulator — 21 to 30
  { path: '/trading',             name: 'Trading',             idx: 21, group: 'trading' },
  { path: '/trading/spot',        name: 'Spot Trading',        idx: 22, group: 'trading' },
  { path: '/trading/buy',         name: 'Demo Buy Order',      idx: 23, group: 'trading' },
  { path: '/trading/sell',        name: 'Demo Sell Order',     idx: 24, group: 'trading' },
  { path: '/trading/convert',     name: 'Asset Conversion',    idx: 25, group: 'trading' },
  { path: '/trading/order-history', name: 'Order History',     idx: 26, group: 'trading' },
  { path: '/trading/open-orders', name: 'Open Orders',         idx: 27, group: 'trading' },
  { path: '/trading/closed-orders', name: 'Closed Orders',     idx: 28, group: 'trading' },

  // F. Analytics and research — 51 to 60
  { path: '/analytics',             name: 'Analytics',              idx: 51, group: 'analytics' },
  { path: '/analytics/market-cap',  name: 'Market Cap',             idx: 52, group: 'analytics' },
  { path: '/analytics/volume',      name: 'Volume Analytics',       idx: 53, group: 'analytics' },
  { path: '/analytics/volatility',  name: 'Volatility',             idx: 54, group: 'analytics' },
  { path: '/analytics/correlations', name: 'Correlation Matrix',    idx: 55, group: 'analytics' },
  { path: '/analytics/returns',     name: 'Returns Analysis',       idx: 56, group: 'analytics' },
  { path: '/analytics/risk',        name: 'Portfolio Risk',         idx: 57, group: 'analytics' },
  { path: '/analytics/drawdown',    name: 'Drawdown',               idx: 58, group: 'analytics' },
  { path: '/analytics/heatmap',     name: 'Asset Heatmap',          idx: 59, group: 'analytics' },
  { path: '/analytics/asset-screener', name: 'Asset Screener',     idx: 60, group: 'analytics' },

  // G. Reports — 61 to 68
  { path: '/reports',             name: 'Reports',               idx: 61, group: 'reports' },
  { path: '/reports/portfolio',   name: 'Portfolio Report',      idx: 62, group: 'reports' },
  { path: '/reports/trading',     name: 'Trade Report',          idx: 63, group: 'reports' },
  { path: '/reports/transactions', name: 'Transaction Report',   idx: 64, group: 'reports' },
  { path: '/reports/profit-loss', name: 'Profit/Loss Report',    idx: 65, group: 'reports' },
  { path: '/reports/fees',        name: 'Fee Report',            idx: 66, group: 'reports' },
  { path: '/reports/activity',    name: 'Activity Report',       idx: 67, group: 'reports' },
  { path: '/reports/export',      name: 'Data Export',           idx: 68, group: 'reports' },

  // H. Notifications and automation simulation — 69 to 75
  { path: '/notifications',     name: 'Notifications',         idx: 69, group: 'notifications' },
  { path: '/notifications/price-alerts', name: 'Price Alerts',  idx: 70, group: 'notifications' },
  { path: '/notifications/create-alert', name: 'Create Alert',  idx: 71, group: 'notifications' },
  { path: '/notifications/rules',         name: 'Alert Rules',     idx: 72, group: 'notifications' },
  { path: '/notifications/history',       name: 'Alert History',   idx: 73, group: 'notifications' },
  { path: '/automation',       name: 'Automation',             idx: 74, group: 'automation' },
  { path: '/automation/rules', name: 'Automation Rules',       idx: 75, group: 'automation' },

  // I. User, access, and account — 76 to 83
  { path: '/account',                name: 'Account',              idx: 76, group: 'account' },
  { path: '/account/profile',        name: 'Profile',              idx: 77, group: 'account' },
  { path: '/account/preferences',    name: 'Preferences',          idx: 78, group: 'account' },
  { path: '/account/security',       name: 'Security',             idx: 79, group: 'account' },
  { path: '/account/sessions',       name: 'Sessions',             idx: 80, group: 'account' },
  { path: '/account/activity-log',   name: 'Activity Log',         idx: 81, group: 'account' },
  { path: '/account/data',           name: 'Local Data',           idx: 82, group: 'account' },
  { path: '/account/reset-demo',     name: 'Reset Demo Data',      idx: 83, group: 'account' },

  // J. Settings and system — 84 to 90
  { path: '/settings',        name: 'Settings',             idx: 84, group: 'settings' },
  { path: '/settings/appearance',    name: 'Appearance',         idx: 85, group: 'settings' },
  { path: '/settings/theme',         name: 'Theme',              idx: 86, group: 'settings' },
  { path: '/settings/regional',      name: 'Regional',           idx: 87, group: 'settings' },
  { path: '/settings/notifications', name: 'Notification Prefs', idx: 88, group: 'settings' },
  { path: '/system/health',          name: 'System Health',      idx: 89, group: 'settings' },
  { path: '/help',                   name: 'Help Centre',        idx: 90, group: 'settings' },

  // Auth
  { path: '/login',          name: 'Login',           idx: 91, group: 'auth' },
  { path: '/register',       name: 'Register',        idx: 92, group: 'auth' },
  { path: '/forgot-password', name: 'Forgot Password', idx: 93, group: 'auth' },

  // 404
  { path: '*', name: '404 Not Found', idx: 94, group: 'misc', isCatchAll: true },
];

export const groupLabels = {
  overview: 'Overview & Dashboard',
  markets: 'Crypto Markets',
  trading: 'Trading Simulator',
  portfolio: 'Portfolio',
  wallet: 'Wallet',
  analytics: 'Analytics',
  reports: 'Reports',
  notifications: 'Notifications',
  automation: 'Automation',
  account: 'Account',
  settings: 'Settings',
  auth: 'Authentication',
  misc: 'Misc',
};
