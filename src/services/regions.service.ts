import HttpClient from "./httpclient.service";
import config from "@/config";

class RegionsService extends HttpClient {

    constructor() {
        super(config.SERVER_URL);
    }

    getAllRegions() {
        return super.get('/regions');
    }

    getRegionBounds(regionID: number) {
        const data = { region: regionID }
        return super.get('/regions/bounds', data);
    }
}

export const regionsService = new RegionsService();