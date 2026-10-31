import { Outlet, useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import CreateAccountModal from '../auth/CreateAccountModal';
import { hasDemoSession } from '../../services/auth';
import './AppShell.css';

export default function AppShell(){
 const location=useLocation();
 const isTrading=location.pathname.startsWith('/trading');
 return <div className="layout no-sidebar">
  {!hasDemoSession()&&<CreateAccountModal/>}
  <div className="bg-orb bg-orb--1"/><div className="bg-orb bg-orb--2"/><div className="bg-orb bg-orb--3"/>
  <main className={`main ${isTrading?'main-trading':''}`}>
   {!isTrading&&<TopBar/>}
   <div className="content"><Outlet/></div>
  </main>
 </div>;
}
