import HttpClient from "./httpclient.service";
import config from "@/config";

class ModelsService extends HttpClient {

    constructor() {
        super(config.SERVER_URL);
    }

    getStaticModel(model?: string) {
        return super.get('/model/static', model);
    }
}

export const modelsService = new ModelsService();