const fs = require('fs');
const path = 'c:/Users/GauriSingh/Downloads/Crypto/Crypto/src/pages/index.js';
let lines = fs.readFileSync(path, 'utf8').split('\n');

let insertIdx = lines.findIndex(l => l.includes("export { default as tradingPage }"));
let imports = [
"import tradingPage from './trading/TradingPage';",
"import spotTradingPage from './trading/SpotTradingPage';",
"import buyOrderPage from './trading/BuyOrderPage';",
"import sellOrderPage from './trading/SellOrderPage';",
"import convertPage from './trading/ConvertPage';",
"import orderHistoryPage from './trading/OrderHistoryPage';",
"import openOrdersPage from './trading/OpenOrdersPage';",
"import closedOrdersPage from './trading/ClosedOrdersPage';",
"import orderDetailsPage from './trading/OrderDetailsPage';",
"import feesPage from './trading/FeesPage';",
"",
];
lines.splice(insertIdx, 0, ...imports);

insertIdx = lines.findIndex(l => l.includes("export { default as walletPage }"));
imports = [
"import walletPage from './wallet/WalletPage';",
"import balancesPage from './wallet/BalancesPage';",
"import depositPage from './wallet/DepositPage';",
"import withdrawPage from './wallet/WithdrawPage';",
"import transferPage from './wallet/TransferPage';",
"import addressesPage from './wallet/AddressesPage';",
"import walletHistoryPage from './wallet/HistoryPage';",
"import assetsPage from './wallet/AssetsPage';",
"import limitsPage from './wallet/LimitsPage';",
"import securityPage from './wallet/SecurityPage';",
"",
];
lines.splice(insertIdx, 0, ...imports);

insertIdx = lines.findIndex(l => l.includes("export { default as analyticsPage }"));
imports = [
"import analyticsPage from './analytics/AnalyticsPage';",
"import marketCapPage from './analytics/MarketCapPage';",
"import volumePage from './analytics/VolumePage';",
"import volatilityPage from './analytics/VolatilityPage';",
"import correlationsPage from './analytics/CorrelationsPage';",
"import returnsPage from './analytics/ReturnsPage';",
"import riskPage from './analytics/RiskPage';",
"import drawdownPage from './analytics/DrawdownPage';",
"import heatmapPage from './analytics/HeatmapPage';",
"import assetScreenerPage from './analytics/AssetScreenerPage';",
"",
];
lines.splice(insertIdx, 0, ...imports);

insertIdx = lines.findIndex(l => l.includes("export { default as reportsPage }"));
imports = [
"import reportsPage from './reports/ReportsPage';",
"import portfolioReportPage from './reports/PortfolioReportPage';",
"import tradeReportPage from './reports/TradeReportPage';",
"import transactionReportPage from './reports/TransactionReportPage';",
"import profitLossReportPage from './reports/ProfitLossReportPage';",
"import feeReportPage from './reports/FeeReportPage';",
"import activityReportPage from './reports/ActivityReportPage';",
"import exportPage from './reports/ExportPage';",
"",
];
lines.splice(insertIdx, 0, ...imports);

insertIdx = lines.findIndex(l => l.includes("export { default as notificationsPage }"));
imports = [
"import notificationsPage from './notifications/NotificationsPage';",
"import priceAlertsPage from './notifications/PriceAlertsPage';",
"import createAlertPage from './notifications/CreateAlertPage';",
"import rulesPage from './notifications/RulesPage';",
"import alertHistoryPage from './notifications/HistoryPage';",
"",
];
lines.splice(insertIdx, 0, ...imports);

insertIdx = lines.findIndex(l => l.includes("export { default as automationPage }"));
imports = [
"import automationPage from './automation/AutomationPage';",
"import automationRulesPage from './automation/AutomationRulesPage';",
"",
];
lines.splice(insertIdx, 0, ...imports);

insertIdx = lines.findIndex(l => l.includes("export { default as accountPage }"));
imports = [
"import accountPage from './account/AccountPage';",
"import profilePage from './account/ProfilePage';",
"import preferencesPage from './account/PreferencesPage';",
"import accountSecurityPage from './account/SecurityPage';",
"import sessionsPage from './account/SessionsPage';",
"import activityLogPage from './account/ActivityLogPage';",
"import dataPage from './account/DataPage';",
"import resetDemoPage from './account/ResetDemoPage';",
"",
];
lines.splice(insertIdx, 0, ...imports);

insertIdx = lines.findIndex(l => l.includes("export { default as settingsPage }"));
imports = [
"import settingsPage from './settings/SettingsPage';",
"import appearancePage from './settings/AppearancePage';",
"import themePage from './settings/ThemePage';",
"import regionalPage from './settings/RegionalPage';",
"import notificationPrefsPage from './settings/NotificationPrefsPage';",
"import systemHealthPage from './settings/SystemHealthPage';",
"import helpPage from './settings/HelpPage';",
"",
];
lines.splice(insertIdx, 0, ...imports);

insertIdx = lines.findIndex(l => l.includes("export { default as loginPage }"));
imports = [
"import loginPage from './auth/LoginPage';",
"import registerPage from './auth/RegisterPage';",
"import forgotPasswordPage from './auth/ForgotPasswordPage';",
"",
];
lines.splice(insertIdx, 0, ...imports);

fs.writeFileSync(path, lines.join('\n'));
console.log('All imports added successfully');