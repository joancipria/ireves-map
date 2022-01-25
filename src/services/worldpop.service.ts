import HttpClient from "./httpclient.service";

class WorldPopService extends HttpClient {

    constructor() {
        super('http://127.0.0.1:5000');
    }

    getPopulation(polygon: unknown) {
        const data = { polygon: JSON.stringify(polygon) }
        return super.get('/population', data);
    }
}

export const worldPop = new WorldPopService();