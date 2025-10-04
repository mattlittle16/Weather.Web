/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from "react";
import type { ILocation } from "../models/LocationModel";
import { geoCode, reverseGeocode } from "../loaders/ApiLoader";
import { LocationRefreshStatus } from "./enums/Enums";

interface ILocationContext {
    currentLocation: ILocation | null;
    refreshCurrentLocation: () => Promise<{ status: LocationRefreshStatus; location?: ILocation }>;
    refreshCurrentLocationManually: (countryCode: string, city?: string, state?: string, postalCode?: string) => Promise<{ status: LocationRefreshStatus; location?: ILocation }>;
    savedLocations: ILocation[];
    addSavedLocation: (location: ILocation) => void;
    removeSavedLocation: (location: ILocation) => void;
}

const LocationContext = createContext<ILocationContext | null>(null);

const LocationProvider = ({ children }: any) => {
    interface ILocalLocationStorage {
        currentLocation: ILocation | null;
        savedLocations: ILocation[];
    };

    const storedLocations = localStorage.getItem("savedLocations");
    const initialLocation = storedLocations ? JSON.parse(storedLocations) as ILocalLocationStorage : undefined;

    const [currentLocation, setCurrentLocation] = useState<ILocation | null>(initialLocation?.currentLocation || null);
    const [savedLocations, setSavedLocations] = useState<ILocation[]>(initialLocation?.savedLocations || []);

    useEffect(() => {
        const writeStateToStorage = () => {
            localStorage.setItem("savedLocations", JSON.stringify({ currentLocation, savedLocations }));
        };
        writeStateToStorage();
    }, [currentLocation, savedLocations]);

    let tempLocation: ILocation | null = null;



    const refreshCurrentLocation = (): Promise<{ status: LocationRefreshStatus; location?: ILocation }> => {
        return new Promise((resolve) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        try {
                            const latitude = position.coords.latitude.toFixedNumber(2);
                            const longitude = position.coords.longitude.toFixedNumber(2);

                            if (latitude && longitude && (
                                latitude === currentLocation?.latRaw &&
                                longitude === currentLocation?.lonRaw
                            )) {
                                console.log('browser coords match stored location, skipping reverse geocode');
                                resolve({ status: LocationRefreshStatus.Success, location: currentLocation! });
                                return;
                            }

                            const location = await reverseGeocode(latitude, longitude);

                            tempLocation = {
                                lat: location.lat!.toFixedNumber(2),
                                lon: location.lon!.toFixedNumber(2),
                                latRaw: latitude.toFixedNumber(2),
                                lonRaw: longitude.toFixedNumber(2),
                                location: location.name,
                                state: location.state,
                                country: location.country
                            } as ILocation;

                            setCurrentLocation({
                                ...tempLocation
                            } as ILocation);

                            addSavedLocation({ ...tempLocation } as ILocation);

                            resolve({ status: LocationRefreshStatus.Success, location: tempLocation });
                        } catch (error) {
                            console.error("Error during reverse geocoding:", error);
                            resolve({ status: LocationRefreshStatus.Error });
                        }
                    },
                    (error) => {
                        console.error("Error obtaining location:", error);
                        resolve({ status: LocationRefreshStatus.Error });
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 10000
                    }
                );
            } else {
                resolve({ status: LocationRefreshStatus.Error });
            }
        });
    };

    const refreshCurrentLocationManually = async (countryCode: string, city?: string, state?: string, postalCode?: string): Promise<{ status: LocationRefreshStatus; location?: ILocation }> => {
        try {
            const location = await geoCode(countryCode, city, state, postalCode);
            if (location && location.lat && location.lon) {

                tempLocation = {
                    lat: location.lat!.toFixedNumber(2),
                    lon: location.lon!.toFixedNumber(2),
                    latRaw: 0,
                    lonRaw: 0,
                    location: location.name,
                    state: location.state,
                    postalCode: postalCode,
                    country: location.country
                } as ILocation;

                setCurrentLocation({
                    ...tempLocation
                } as ILocation);

                addSavedLocation({ ...tempLocation } as ILocation);
                

                return { status: LocationRefreshStatus.Success, location: tempLocation };
            } else {
                return { status: LocationRefreshStatus.NotFound };
            }
        } catch (error) {
            console.error("Error occurred while searching for location:", error);
            return { status: LocationRefreshStatus.Error };
        }
    };
   

    const addSavedLocation = (location: ILocation) => {
        setSavedLocations((prevLocations) => [
            ...prevLocations.filter(loc => !(loc.lat === location.lat && loc.lon === location.lon)),
            location
        ]);
    };

    const removeSavedLocation = (location: ILocation) => {
        setSavedLocations((prevLocations) => [
            ...prevLocations.filter(loc => !(loc.lat === location.lat && loc.lon === location.lon))
        ]);
    };



    return (
        <LocationContext.Provider value={{
            currentLocation,
            savedLocations, addSavedLocation, removeSavedLocation, refreshCurrentLocation,
            refreshCurrentLocationManually
        }}>
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
