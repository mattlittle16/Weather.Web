import './App.css'
import axios from "axios";
import { RouterProvider } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { LocationProvider } from './shared/LocationProvider';
import { WeatherProvider } from './shared/WeatherProvider';

declare module 'axios' {
  export interface AxiosRequestConfig {
    defaultErrorMessage?: string;
    unauthorizedErrorMessage?: string;
    notFoundErrorMessage?: string;
  }
}

axios.defaults.headers["Cache-Control"] = 'no-cache, no-store, must-revalidate';
axios.defaults.headers["Pragma"] = 'no-cache';
axios.defaults.headers["Expires"] = '0';

function App() {  
  return (
    <LocationProvider>
      <WeatherProvider>
        <RouterProvider router={AppRoutes} />
      </WeatherProvider>
    </LocationProvider>
  )
}

export default App
