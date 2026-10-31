import {Navigate} from 'react-router-dom';

// Authentication is handled by the browser-based demo login in AppShell.
export default function AuthRedirect(){
 return <Navigate to="/dashboard" replace/>;
}
