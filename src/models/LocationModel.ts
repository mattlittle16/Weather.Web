export interface ILocation {
    lat: number;
    lon: number;
    latRaw: number;
    lonRaw: number;
    location?: string;
    state?: string;
    postalCode?: string;
    country?: string;
}