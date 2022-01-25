
export default class HttpClient {
    private serverURL: string;

    constructor(serverURL: string) {
        this.serverURL = serverURL;
    }

    async get(path: string, params: any) {
        const url: URL = new URL(this.serverURL);
        url.pathname = path;

        const searchParams = new URLSearchParams(params);

        const response = await fetch(url.toString() + '?' + searchParams.toString());

        if (response.status >= 200 && response.status <= 299) {
            const jsonResponse = await response.json();
            return jsonResponse;
        } else {
            // Handle errors
            console.error(response.status, response.statusText);
            return { error: response.statusText }
        }
    }

}