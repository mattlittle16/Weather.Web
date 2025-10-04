import { useMemo, useEffect } from "react";
import { useWeather } from "../shared/WeatherProvider";
import starrynight from "../assets/pics/starrynight.png";
import sunrise from "../assets/pics/sunrise.png";
import sunny from "../assets/pics/sunny.png";
import cloudy from "../assets/pics/cloudy.png";
import partlyCloudy from "../assets/pics/partly-cloudy.png";
import rain from "../assets/pics/rain.png";
import thunderstorm from "../assets/pics/thunderstorm.png";
import sunset from "../assets/pics/sunset.png";
import defaultBackground from "../assets/pics/default.png";

/**
 * Custom hook to determine the appropriate background image based on:
 * - Current local time
 * - Sunrise/sunset times
 * - Weather conditions
 */
export const useBackground = (): string => {
    const { currentWeather } = useWeather();

    const backgroundImage = useMemo(() => {
        if (!currentWeather || !currentWeather.dailyConditions.length) {
            return defaultBackground; // Default fallback
        }

        const now = new Date();
        const todayConditions = currentWeather.dailyConditions[0];
        
        const sunriseTime = new Date(todayConditions.sunrise);
        const sunsetTime = new Date(todayConditions.sunset);
        
        // Calculate time windows (30 minutes = 30 * 60 * 1000 milliseconds)
        const thirtyMinutes = 30 * 60 * 1000;
        const sunriseWindowStart = new Date(sunriseTime.getTime() - thirtyMinutes);
        const sunriseWindowEnd = new Date(sunriseTime.getTime() + thirtyMinutes);
        const sunsetWindowStart = new Date(sunsetTime.getTime() - thirtyMinutes);
        const sunsetWindowEnd = new Date(sunsetTime.getTime() + thirtyMinutes);

        const currentTime = now.getTime();
        const description = currentWeather.currentCondition.description.toLowerCase();

        // Rule 1: Before sunrise window (more than 30 min before sunrise)
        if (currentTime < sunriseWindowStart.getTime()) {
            return starrynight;
        }

        // Rule 2: Within sunrise window (30 min before to 30 min after sunrise)
        if (currentTime >= sunriseWindowStart.getTime() && currentTime <= sunriseWindowEnd.getTime()) {
            return sunrise;
        }

        // Rule 3: Within sunset window (30 min before to 30 min after sunset)
        if (currentTime >= sunsetWindowStart.getTime() && currentTime <= sunsetWindowEnd.getTime()) {
            return sunset;
        }

        // Rule 4: After sunset (more than 30 min after sunset)
        if (currentTime > sunsetWindowEnd.getTime()) {
            return starrynight;
        }

        // Daytime rules (after sunrise window, before sunset window)
        // Check weather conditions
        if (description.includes("clear sky")) {
            return sunny;
        }

        if (description.includes("overcast") || description.includes("broken")) {
            return cloudy;
        }

        if (description.includes("scattered") || description.includes("few")) {
            return partlyCloudy;
        }

        if (description.includes("rain")) {
            return rain;
        }

        if (description.includes("thunder")) {
            return thunderstorm;
        }

        // Default to sunny if no conditions match
        return defaultBackground;
    }, [currentWeather]);

    // Apply background to body element
    useEffect(() => {
        document.body.style.backgroundImage = `url(${backgroundImage})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.minHeight = '100vh';
        
        // Cleanup function to reset background when component unmounts
        return () => {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundPosition = '';
            document.body.style.backgroundRepeat = '';
            document.body.style.backgroundAttachment = '';
            document.body.style.minHeight = '';
        };
    }, [backgroundImage]);

    return backgroundImage;
};
