import {Navigate,createBrowserRouter} from 'react-router-dom';
import {AppShell} from '../components/layout/AppShell';
import {routeConfig} from './routeConfig';
import {dashboardPage as DashboardPage,allMarketsPage as MarketsPage,tradingPage as TradingPage,profilePage as ProfilePage,walletPage as WalletPage,notFoundPage as NotFoundPage} from '../pages/index.js';
const pages={'/dashboard':DashboardPage,'/markets':MarketsPage,'/trading':TradingPage,'/wallet':WalletPage};
export const router=createBrowserRouter([{path:'/',element:<AppShell/>,children:[{index:true,element:<Navigate to="/dashboard" replace/>},...routeConfig.map(route=>{if(route.isCatchAll)return {...route,element:<NotFoundPage/>};const Page=pages[route.path]||DashboardPage;return {...route,element:<Page/>};}),{path:'/account',element:<ProfilePage/>},{path:'/profile',element:<Navigate to='/account' replace/>},{path:'/settings',element:<Navigate to='/dashboard' replace/>},{path:'/portfolio',element:<Navigate to='/dashboard' replace/>},{path:'/login',element:<Navigate to='/dashboard' replace/>},{path:'/register',element:<Navigate to='/dashboard' replace/>}]}]);
