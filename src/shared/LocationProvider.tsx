/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState } from "react";
import type { ILocation } from "../models/LocationModel";

interface ILocationContext {
    currentLocation: ILocation | null;
    setCurrentLocation: (location: ILocation) => void;
    savedLocations: ILocation[];
    addSavedLocation: (location: ILocation) => void;
    removeSavedLocation: (location: ILocation) => void;
}

const LocationContext = createContext<ILocationContext | null>(null);

const LocationProvider = ({ children }: any) => {
    const storedLocations = localStorage.getItem("savedLocations");
    const initialLocations = storedLocations ? JSON.parse(storedLocations) as ILocationContext : undefined;

    const [currentLocation, setCurrentLocation] = useState<ILocation | null>(initialLocations?.currentLocation || null);
    const [savedLocations, setSavedLocations] = useState<ILocation[]>(initialLocations?.savedLocations || []);

    const updateCurrentLocation = (location: ILocation) => {
        setCurrentLocation(location);
        localStorage.setItem("savedLocations", JSON.stringify({ currentLocation: location, savedLocations }));
    };

    const addSavedLocation = (location: ILocation) => {
        if (!savedLocations.find(loc => loc.lat === location.lat && loc.lon === location.lon)) {
            const updatedLocations = [...savedLocations, location];
            setSavedLocations(updatedLocations);
            localStorage.setItem("savedLocations", JSON.stringify({ currentLocation, savedLocations: updatedLocations }));
        }
    };

    const removeSavedLocation = (location: ILocation) => {
        const updatedLocations = savedLocations.filter(loc => !(loc.lat === location.lat && loc.lon === location.lon));
        setSavedLocations(updatedLocations);
        localStorage.setItem("savedLocations", JSON.stringify({ currentLocation, savedLocations: updatedLocations }));
    };



    return (
        <LocationContext.Provider value={{ currentLocation, setCurrentLocation: updateCurrentLocation, savedLocations, addSavedLocation, removeSavedLocation }}>
            {children}
        </LocationContext.Provider>
    )
}

const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error("useLocation must be used within a LocationProvider");
    }
    return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { LocationProvider, useLocation };
