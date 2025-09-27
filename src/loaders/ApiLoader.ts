import axios from "axios";
import type { IGeocode } from "../models/GeocodeModel";
import type { IReverseGeocode } from "../models/ReverseGeocodeModel";


export const geoCode = async (countryCode: string, city?: string, state?: string, postalCode?: string): Promise<IGeocode> => {
    const key = import.meta.env.VITE_GEOCODE_API_KEY;
    let url = '';
    if (city && state) {
        url = `https://weather-api.mattlittle.me/geocode?city=${city}&state=${state}&countryCode=${countryCode}`;
    } else {
        url = `https://weather-api.mattlittle.me/geocode?postalCode=${postalCode}&countryCode=${countryCode}`;
    }

    const response = await axios.get(url, {
        headers: {
            'accept': 'application/json',
            'x-api-key': key
        }        
    });

    return response.data;
}

export const reverseGeocode = async (lat: number, lon: number): Promise<IReverseGeocode> => {
    const key = import.meta.env.VITE_GEOCODE_API_KEY;
    const url = `https://weather-api.mattlittle.me/reverseGeocode?lat=${lat}&lon=${lon}`;

    const response = await axios.get(url, {
        headers: {
            'accept': 'application/json',
            'x-api-key': key
        }        
    });

    return response.data;
}