import type { IGeocode } from "./GeocodeModel";

export interface IReverseGeocode extends IGeocode {
    local_names?: [string, string][]
};