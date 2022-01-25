import  Vehicle from "../core/Vehicle";
import  HttpClient from "./httpclient.service";

class OpenRouteService extends HttpClient {
    constructor() {
        super('http://127.0.0.1:5000');
    }

    getVehicleIsochron(vehicle: Vehicle) {
        const data = { lat: vehicle.position.lat, lng: vehicle.position.lng, time: vehicle.time }
        return super.get('/isochrones', data);
    }
}

export const openRoute = new OpenRouteService();