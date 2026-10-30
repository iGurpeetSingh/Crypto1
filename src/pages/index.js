// Page component registry — all page components are imported here.
// The full page library is built across the pages/ directories below.

import dashboardPage from './overview/DashboardPage';
import marketOverviewPage from './overview/MarketOverviewPage';
import marketSummaryPage from './overview/MarketSummaryPage';
import topGainersPage from './overview/TopGainersPage';
import topLosersPage from './overview/TopLosersPage';
import trendingPage from './overview/TrendingPage';
import recentActivityPage from './overview/RecentActivityPage';
import alertsPage from './overview/AlertsPage';
import favoritesPage from './overview/FavoritesPage';
import quickActionsPage from './overview/QuickActionsPage';

export { default as dashboardPage } from './overview/DashboardPage';
export { default as marketOverviewPage } from './overview/MarketOverviewPage';
export { default as marketSummaryPage } from './overview/MarketSummaryPage';
export { default as topGainersPage } from './overview/TopGainersPage';
export { default as topLosersPage } from './overview/TopLosersPage';
export { default as trendingPage } from './overview/TrendingPage';
export { default as recentActivityPage } from './overview/RecentActivityPage';
export { default as alertsPage } from './overview/AlertsPage';
export { default as favoritesPage } from './overview/FavoritesPage';
export { default as quickActionsPage } from './overview/QuickActionsPage';

import allMarketsPage from './markets/AllMarketsPage';
import coinDirectoryPage from './markets/CoinDirectoryPage';
import categoriesPage from './markets/CategoriesPage';
import bitcoinPage from './markets/BitcoinPage';
import ethereumPage from './markets/EthereumPage';
import altcoinsPage from './markets/AltcoinsPage';
import stablecoinsPage from './markets/StablecoinsPage';
import newAssetsPage from './markets/NewAssetsPage';
import assetComparisonPage from './markets/AssetComparisonPage';
import watchlistPage from './markets/WatchlistPage';

export { default as allMarketsPage } from './markets/AllMarketsPage';
export { default as coinDirectoryPage } from './markets/CoinDirectoryPage';
export { default as categoriesPage } from './markets/CategoriesPage';
export { default as bitcoinPage } from './markets/BitcoinPage';
export { default as ethereumPage } from './markets/EthereumPage';
export { default as altcoinsPage } from './markets/AltcoinsPage';

import portfolioPage from './portfolio/PortfolioPage';
import holdingsPage from './portfolio/HoldingsPage';
import allocationPage from './portfolio/AllocationPage';
import performancePage from './portfolio/PerformancePage';
import profitLossPage from './portfolio/ProfitLossPage';
import portfolioHistoryPage from './portfolio/HistoryPage';
import historyPage from './portfolio/HistoryPage';
import transactionsPage from './portfolio/TransactionsPage';
import costBasisPage from './portfolio/CostBasisPage';
import diversificationPage from './portfolio/DiversificationPage';
import rebalancePage from './portfolio/RebalancePage';

export { default as portfolioPage } from './portfolio/PortfolioPage';
export { default as holdingsPage } from './portfolio/HoldingsPage';
export { default as allocationPage } from './portfolio/AllocationPage';
export { default as performancePage } from './portfolio/PerformancePage';
export { default as profitLossPage } from './portfolio/ProfitLossPage';
export { default as historyPage } from './portfolio/HistoryPage';
export { default as transactionsPage } from './portfolio/TransactionsPage';
export { default as costBasisPage } from './portfolio/CostBasisPage';
export { default as diversificationPage } from './portfolio/DiversificationPage';
export { default as rebalancePage } from './portfolio/RebalancePage';

import walletPage from './wallet/WalletPage';
import balancesPage from './wallet/BalancesPage';
import depositPage from './wallet/DepositPage';
import withdrawPage from './wallet/WithdrawPage';
import transferPage from './wallet/TransferPage';
import addressesPage from './wallet/AddressesPage';
import walletHistoryPage from './wallet/HistoryPage';
import assetsPage from './wallet/AssetsPage';
import limitsPage from './wallet/LimitsPage';
import securityPage from './wallet/SecurityPage';

export { default as walletPage } from './wallet/WalletPage';
export { default as balancesPage } from './wallet/BalancesPage';
export { default as depositPage } from './wallet/DepositPage';
export { default as withdrawPage } from './wallet/WithdrawPage';
export { default as transferPage } from './wallet/TransferPage';
export { default as addressesPage } from './wallet/AddressesPage';
export { default as walletHistoryPage } from './wallet/HistoryPage';
export { default as assetsPage } from './wallet/AssetsPage';
export { default as limitsPage } from './wallet/LimitsPage';
export { default as securityPage } from './wallet/SecurityPage';

import analyticsPage from './analytics/AnalyticsPage';
import marketCapPage from './analytics/MarketCapPage';
import volumePage from './analytics/VolumePage';
import volatilityPage from './analytics/VolatilityPage';
import correlationsPage from './analytics/CorrelationsPage';
import returnsPage from './analytics/ReturnsPage';
import riskPage from './analytics/RiskPage';
import drawdownPage from './analytics/DrawdownPage';
import heatmapPage from './analytics/HeatmapPage';
import assetScreenerPage from './analytics/AssetScreenerPage';

export { default as analyticsPage } from './analytics/AnalyticsPage';
export { default as marketCapPage } from './analytics/MarketCapPage';
export { default as volumePage } from './analytics/VolumePage';
export { default as volatilityPage } from './analytics/VolatilityPage';
export { default as correlationsPage } from './analytics/CorrelationsPage';
export { default as returnsPage } from './analytics/ReturnsPage';
export { default as riskPage } from './analytics/RiskPage';
export { default as drawdownPage } from './analytics/DrawdownPage';
export { default as heatmapPage } from './analytics/HeatmapPage';
export { default as assetScreenerPage } from './analytics/AssetScreenerPage';

import reportsPage from './reports/ReportsPage';
import portfolioReportPage from './reports/PortfolioReportPage';
import tradeReportPage from './reports/TradeReportPage';
import transactionReportPage from './reports/TransactionReportPage';
import profitLossReportPage from './reports/ProfitLossReportPage';
import feeReportPage from './reports/FeeReportPage';
import activityReportPage from './reports/ActivityReportPage';
import exportPage from './reports/ExportPage';

export { default as reportsPage } from './reports/ReportsPage';
export { default as portfolioReportPage } from './reports/PortfolioReportPage';
export { default as tradeReportPage } from './reports/TradeReportPage';
export { default as transactionReportPage } from './reports/TransactionReportPage';
export { default as profitLossReportPage } from './reports/ProfitLossReportPage';
export { default as feeReportPage } from './reports/FeeReportPage';
export { default as activityReportPage } from './reports/ActivityReportPage';
export { default as exportPage } from './reports/ExportPage';

import notificationsPage from './notifications/NotificationsPage';
import priceAlertsPage from './notifications/PriceAlertsPage';
import createAlertPage from './notifications/CreateAlertPage';
import rulesPage from './notifications/RulesPage';
import alertHistoryPage from './notifications/HistoryPage';

export { default as notificationsPage } from './notifications/NotificationsPage';
export { default as priceAlertsPage } from './notifications/PriceAlertsPage';
export { default as createAlertPage } from './notifications/CreateAlertPage';
export { default as rulesPage } from './notifications/RulesPage';
export { default as alertHistoryPage } from './notifications/HistoryPage';
import automationPage from './automation/AutomationPage';
import automationRulesPage from './automation/AutomationRulesPage';

export { default as automationPage } from './automation/AutomationPage';
export { default as automationRulesPage } from './automation/AutomationRulesPage';

import accountPage from './account/AccountPage';
import profilePage from './account/ProfilePage';
import preferencesPage from './account/PreferencesPage';
import accountSecurityPage from './account/SecurityPage';
import sessionsPage from './account/SessionsPage';
import activityLogPage from './account/ActivityLogPage';
import dataPage from './account/DataPage';
import resetDemoPage from './account/ResetDemoPage';

export { default as accountPage } from './account/AccountPage';
export { default as profilePage } from './account/ProfilePage';
export { default as preferencesPage } from './account/PreferencesPage';
export { default as accountSecurityPage } from './account/SecurityPage';
export { default as sessionsPage } from './account/SessionsPage';
export { default as activityLogPage } from './account/ActivityLogPage';
export { default as dataPage } from './account/DataPage';
export { default as resetDemoPage } from './account/ResetDemoPage';

import settingsPage from './settings/SettingsPage';
import appearancePage from './settings/AppearancePage';
import themePage from './settings/ThemePage';
import regionalPage from './settings/RegionalPage';
import notificationPrefsPage from './settings/NotificationPrefsPage';
import systemHealthPage from './settings/SystemHealthPage';
import helpPage from './settings/HelpPage';

export { default as settingsPage } from './settings/SettingsPage';
export { default as appearancePage } from './settings/AppearancePage';
export { default as themePage } from './settings/ThemePage';
export { default as regionalPage } from './settings/RegionalPage';
export { default as notificationPrefsPage } from './settings/NotificationPrefsPage';
export { default as systemHealthPage } from './settings/SystemHealthPage';
export { default as helpPage } from './settings/HelpPage';

import loginPage from './auth/LoginPage';
import registerPage from './auth/RegisterPage';
import forgotPasswordPage from './auth/ForgotPasswordPage';

export { default as loginPage } from './auth/LoginPage';
export { default as registerPage } from './auth/RegisterPage';
export { default as forgotPasswordPage } from './auth/ForgotPasswordPage';
export { default as notFoundPage } from './common/NotFoundPage';

export { default as stablecoinsPage } from './markets/StablecoinsPage';
export { default as newAssetsPage } from './markets/NewAssetsPage';
export { default as assetComparisonPage } from './markets/AssetComparisonPage';
export { default as watchlistPage } from './markets/WatchlistPage';

import tradingPage from './trading/TradingPage';
import spotTradingPage from './trading/SpotTradingPage';
import buyOrderPage from './trading/BuyOrderPage';
import sellOrderPage from './trading/SellOrderPage';
import convertPage from './trading/ConvertPage';
import orderHistoryPage from './trading/OrderHistoryPage';
import openOrdersPage from './trading/OpenOrdersPage';
import closedOrdersPage from './trading/ClosedOrdersPage';
import orderDetailsPage from './trading/OrderDetailsPage';
import feesPage from './trading/FeesPage';

export { default as tradingPage } from './trading/TradingPage';
export { default as spotTradingPage } from './trading/SpotTradingPage';
export { default as buyOrderPage } from './trading/BuyOrderPage';
export { default as sellOrderPage } from './trading/SellOrderPage';
export { default as convertPage } from './trading/ConvertPage';
export { default as orderHistoryPage } from './trading/OrderHistoryPage';
export { default as openOrdersPage } from './trading/OpenOrdersPage';
export { default as closedOrdersPage } from './trading/ClosedOrdersPage';
export { default as orderDetailsPage } from './trading/OrderDetailsPage';
export { default as feesPage } from './trading/FeesPage';

// Group page objects for router
export const overviewPages = {
  '/dashboard': dashboardPage,
  '/dashboard/overview': marketOverviewPage,
  '/dashboard/market-summary': marketSummaryPage,
  '/dashboard/top-gainers': topGainersPage,
  '/dashboard/top-losers': topLosersPage,
  '/dashboard/trending': trendingPage,
  '/dashboard/recent-activity': recentActivityPage,
  '/dashboard/alerts': alertsPage,
  '/dashboard/favorites': favoritesPage,
  '/dashboard/quick-actions': quickActionsPage,
};

export const marketsPages = {
  '/markets': allMarketsPage,
  '/markets/coins': coinDirectoryPage,
  '/markets/categories': categoriesPage,
  '/markets/bitcoin': bitcoinPage,
  '/markets/ethereum': ethereumPage,
  '/markets/altcoins': altcoinsPage,
  '/markets/stablecoins': stablecoinsPage,
  '/markets/new-assets': newAssetsPage,
  '/markets/asset-comparison': assetComparisonPage,
  '/markets/watchlist': watchlistPage,
};

export const tradingPages = {
  '/trading': tradingPage,
  '/trading/spot': spotTradingPage,
  '/trading/buy': buyOrderPage,
  '/trading/sell': sellOrderPage,
  '/trading/convert': convertPage,
  '/trading/order-history': orderHistoryPage,
  '/trading/open-orders': openOrdersPage,
  '/trading/closed-orders': closedOrdersPage,
  '/trading/order-details': orderDetailsPage,
  '/trading/fees': feesPage,
};

export const portfolioPages = {
  '/portfolio': portfolioPage,
  '/portfolio/holdings': holdingsPage,
  '/portfolio/allocation': allocationPage,
  '/portfolio/performance': performancePage,
  '/portfolio/profit-loss': profitLossPage,
  '/portfolio/history': historyPage,
  '/portfolio/transactions': transactionsPage,
  '/portfolio/cost-basis': costBasisPage,
  '/portfolio/diversification': diversificationPage,
  '/portfolio/rebalance': rebalancePage,
};

export const walletPages = {
  '/wallet': walletPage,
  '/wallet/balances': balancesPage,
  '/wallet/deposit': depositPage,
  '/wallet/withdraw': withdrawPage,
  '/wallet/transfer': transferPage,
  '/wallet/addresses': addressesPage,
  '/wallet/history': walletHistoryPage,
  '/wallet/assets': assetsPage,
  '/wallet/limits': limitsPage,
  '/wallet/security': securityPage,
};

export const analyticsPages = {
  '/analytics': analyticsPage,
  '/analytics/market-cap': marketCapPage,
  '/analytics/volume': volumePage,
  '/analytics/volatility': volatilityPage,
  '/analytics/correlations': correlationsPage,
  '/analytics/returns': returnsPage,
  '/analytics/risk': riskPage,
  '/analytics/drawdown': drawdownPage,
  '/analytics/heatmap': heatmapPage,
  '/analytics/asset-screener': assetScreenerPage,
};

export const reportsPages = {
  '/reports': reportsPage,
  '/reports/portfolio': portfolioReportPage,
  '/reports/trading': tradeReportPage,
  '/reports/transactions': transactionReportPage,
  '/reports/profit-loss': profitLossReportPage,
  '/reports/fees': feeReportPage,
  '/reports/activity': activityReportPage,
  '/reports/export': exportPage,
};

export const notificationsPages = {
  '/notifications': notificationsPage,
  '/notifications/price-alerts': priceAlertsPage,
  '/notifications/create-alert': createAlertPage,
  '/notifications/rules': rulesPage,
  '/notifications/history': alertHistoryPage,
};

export const automationPages = {
  '/automation': automationPage,
  '/automation/rules': automationRulesPage,
};

export const accountPages = {
  '/account': accountPage,
  '/account/profile': profilePage,
  '/account/preferences': preferencesPage,
  '/account/security': accountSecurityPage,
  '/account/sessions': sessionsPage,
  '/account/activity-log': activityLogPage,
  '/account/data': dataPage,
  '/account/reset-demo': resetDemoPage,
};

export const settingsPages = {
  '/settings': settingsPage,
  '/settings/appearance': appearancePage,
  '/settings/theme': themePage,
  '/settings/regional': regionalPage,
  '/settings/notifications': notificationPrefsPage,
  '/settings/system-health': systemHealthPage,
  '/settings/help': helpPage,
};

export const authPages = {
  '/login': loginPage,
  '/register': registerPage,
  '/forgot-password': forgotPasswordPage,
};

