import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import CreateAccountModal from '../auth/CreateAccountModal';
import { hasDemoSession } from '../../services/auth';
import './AppShell.css';

export function AppShell(){
 return <div className="layout no-sidebar permanent-no-sidebar">
  {!hasDemoSession()&&<CreateAccountModal/>}
  <div className="bg-orb bg-orb--1"/><div className="bg-orb bg-orb--2"/><div className="bg-orb bg-orb--3"/>
  <main className="main permanent-fullwidth">
   <TopBar/>
   <div className="content permanent-content"><Outlet/></div>
  </main>
 </div>;
}
export default AppShell;
