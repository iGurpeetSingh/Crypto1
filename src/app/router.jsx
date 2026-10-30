import { Navigate, createBrowserRouter } from 'react-router-dom';
import { routeConfig } from './routeConfig';
import {
  dashboardPage as DashboardPage,
  overviewPages,
  marketsPages,
  tradingPages,
  portfolioPages,
  walletPages,
  analyticsPages,
  reportsPages,
  notificationsPages,
  automationPages,
  accountPages,
  settingsPages,
  authPages,
  notFoundPage as NotFoundPage,
} from '../pages/index.js';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  ...routeConfig.map((route) => {
    if (route.isCatchAll) {
      return { ...route, element: <NotFoundPage /> };
    }

    const pageMap = {
      dashboard: overviewPages,
      overview: overviewPages,
      markets: marketsPages,
      trading: tradingPages,
      portfolio: portfolioPages,
      wallet: walletPages,
      analytics: analyticsPages,
      reports: reportsPages,
      notifications: notificationsPages,
      automation: automationPages,
      account: accountPages,
      settings: settingsPages,
      auth: authPages,
    };

    const PageComponent = pageMap[route.group]?.[route.path] || DashboardPage;
    return { ...route, element: <PageComponent /> };
  }),
]);
