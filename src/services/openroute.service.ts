import  Vehicle from "../core/Vehicle";
import  HttpClient from "./httpclient.service";
import config from "@/config";

class OpenRouteService extends HttpClient {
    constructor() {
        super(config.SERVER_URL);
    }

    getVehicleIsochrone(vehicle: Vehicle) {
        const data = { lat: vehicle.position.lat, lng: vehicle.position.lng, time: vehicle.time }
        return super.get('/isochrones', data);
    }
}

export const openRoute = new OpenRouteService();