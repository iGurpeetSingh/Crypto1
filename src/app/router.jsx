import {Navigate,createBrowserRouter} from 'react-router-dom';
import {AppShell} from '../components/layout/AppShell';
import {routeConfig} from './routeConfig';
import {dashboardPage as DashboardPage,allMarketsPage as MarketsPage,tradingPage as TradingPage,profilePage as ProfilePage,walletPage as WalletPage,accountPage as AccountPage,settingsPage as SettingsPage,loginPage as LoginPage,registerPage as RegisterPage,notFoundPage as NotFoundPage} from '../pages/index.js';
const pages={'/dashboard':DashboardPage,'/markets':MarketsPage,'/trading':TradingPage,'/profile':ProfilePage,'/wallet':WalletPage,'/account':AccountPage,'/settings':SettingsPage,'/login':LoginPage,'/register':RegisterPage};
export const router=createBrowserRouter([{path:'/',element:<AppShell/>,children:[{index:true,element:<Navigate to="/dashboard" replace/>},...routeConfig.map(route=>{if(route.isCatchAll)return {...route,element:<NotFoundPage/>};const Page=pages[route.path]||DashboardPage;return {...route,element:<Page/>};})]}]);
