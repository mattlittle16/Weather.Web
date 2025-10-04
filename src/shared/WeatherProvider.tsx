/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from "react";
import { WeatherStatus } from "./enums/Enums";
import type { IWeather } from "../models/WeatherModel";
import { getWeather } from "../loaders/ApiLoader";
import { useLocation } from "./LocationProvider";

interface IWeatherContext {
    currentWeather: IWeather | null;
    lastUpdated: Date | null;
    refreshWeather: (lat: number, lon: number) => Promise<WeatherStatus>;
}

const WeatherContext = createContext<IWeatherContext | null>(null);

const WeatherProvider = ({ children }: any) => {
    const { currentLocation } = useLocation();
    const [currentWeather, setCurrentWeather] = useState<IWeather | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const refreshWeather = async (lat: number, lon: number) => {
        try {
            const data = await getWeather(lat, lon);
            setCurrentWeather(data);
            setLastUpdated(new Date());
            return WeatherStatus.Success;
        } catch (error) {
            console.error("Error fetching weather data:", error);
            return WeatherStatus.Error;
        }
    };

    // Auto-refresh weather data at configured interval
    useEffect(() => {
        if (!currentLocation?.lat || !currentLocation?.lon) {
            return;
        }

        // Get refresh interval from env (default to 5 minutes if not set)
        const refreshInterval = parseInt(import.meta.env.VITE_WEATHER_REFRESH_INTERVAL_MS || '300000', 10);

        const intervalId = setInterval(() => {
            // Only refresh if the page is visible (save API calls when tab is hidden)
            if (document.visibilityState === 'visible') {
                console.log('Auto-refreshing weather data...');
                refreshWeather(currentLocation.lat, currentLocation.lon);
            }
        }, refreshInterval);

        // Cleanup interval on unmount or when location changes
        return () => clearInterval(intervalId);
    }, [currentLocation?.lat, currentLocation?.lon]);

    return (
        <WeatherContext.Provider value={{
            currentWeather,
            lastUpdated,
            refreshWeather
        }}>
            {children}
        </WeatherContext.Provider>
    )
}

const useWeather = () => {
    const context = useContext(WeatherContext);
    if (!context) {
        throw new Error("useWeather must be used within a WeatherProvider");
    }
    return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { WeatherProvider, useWeather };