import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './AppLayout';
import Home from './pages/Home';

const AppRoutes = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout Component={Home} />
    }
]);

export default AppRoutes;