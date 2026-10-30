import { RouterProvider } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { AppProvider } from './context/AppContext';
import { router } from './app/router';
import './styles/variables.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/responsive.css';

function AppRouter() {
  return <RouterProvider router={router} />;
}

function App() {
  return (
    <AppProvider>
      <AppShell>
        <AppRouter />
      </AppShell>
    </AppProvider>
  );
}

export default App;


