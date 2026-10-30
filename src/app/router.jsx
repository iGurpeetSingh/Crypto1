import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
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

const pageMaps = {
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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      ...routeConfig.map((route) => {
        if (route.isCatchAll) {
          return { ...route, element: <NotFoundPage /> };
        }

        const PageComponent = pageMaps[route.group]?.[route.path] || DashboardPage;
        return { ...route, element: <PageComponent /> };
      }),
    ],
  },
]);
