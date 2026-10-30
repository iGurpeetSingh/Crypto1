import { RouterProvider } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { router } from './app/router';
import './styles/variables.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/responsive.css';

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

export default App;
