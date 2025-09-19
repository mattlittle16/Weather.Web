import axios from "axios";
import type { IGeocode } from "../models/GeocodeModel";


export const geoCode = async (city: string, state: string, postalCode: string): Promise<IGeocode> => {
    const key = import.meta.env.VITE_GEOCODE_API_KEY;
    const url = `https://weather-api.mattlittle.me/geocode?city=${city}&state=${state}&postalCode=${postalCode}`;

    const response = await axios.get(url, {
        headers: {
            'accept': 'application/json',
            'x-api-key': key
        }        
    });

    return response.data;
}