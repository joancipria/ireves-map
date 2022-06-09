import HttpClient from "./httpclient.service";
import config from "@/config";

class PopulationService extends HttpClient {

    constructor() {
        super(config.SERVER_URL);
    }

    getPopulation(polygon: unknown) {
        const data = { polygon: JSON.stringify(polygon) }
        return super.get('/population', data);
    }
}

export const popService = new PopulationService();