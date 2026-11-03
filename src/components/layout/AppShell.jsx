import {Outlet} from 'react-router-dom';
import {useEffect,useState} from 'react';
import TopBar from './TopBar';
import CreateAccountModal from '../auth/CreateAccountModal';
import {hasDemoSession} from '../../services/auth';
import './AppShell.css';

export function AppShell(){
 const [hasSession,setHasSession]=useState(()=>hasDemoSession());
 useEffect(()=>{
  const onAccountReady=()=>setHasSession(true);
  const onLogout=()=>setHasSession(false);
  window.addEventListener('crypto1:account-ready',onAccountReady);
  window.addEventListener('crypto1:logout',onLogout);
  return()=>{window.removeEventListener('crypto1:account-ready',onAccountReady);window.removeEventListener('crypto1:logout',onLogout);};
 },[]);
 return <div className="layout no-sidebar permanent-no-sidebar">
  {!hasSession&&<CreateAccountModal/>}
  <div className="bg-orb bg-orb--1"/><div className="bg-orb bg-orb--2"/><div className="bg-orb bg-orb--3"/>
  <main className="main permanent-fullwidth"><TopBar/><div className="content permanent-content"><Outlet/></div></main>
 </div>;
}
export default AppShell;
