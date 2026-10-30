import { createBrowserRouter } from 'react-router-dom';
import { routeConfig, groupLabels } from './routeConfig';
import { dashboardPage, overviewPages, marketsPages, tradingPages, portfolioPages, walletPages, analyticsPages, reportsPages, notificationsPages, automationPages, accountPages, settingsPages, authPages, notFoundPage } from '../pages/index.js';

export const router = createBrowserRouter(
  [
    { path: '/', element: <dashboardPage /> },
    ...routeConfig.map((route) => ({
      ...route,
      element: route.isCatchAll ? notFoundPage : null,
    })).map((route) => {
      if (route.isCatchAll) return route;
      const pageMap = {
        dashboard: dashboardPage,
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
      const PageComponent = pageMap[route.group]?.[route.path] || dashboardPage;
      return { ...route, element: <PageComponent /> };
    }),
  ],
);
