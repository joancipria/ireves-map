
export default class HttpClient {
    private serverURL: string;
    private networkTimeOut: number = 7000; // 7s to abort

    constructor(serverURL: string) {
        this.serverURL = serverURL;
    }

    async get(path: string, params?: any) {

        // Build URL
        const url: URL = new URL(this.serverURL);
        url.pathname = path;

        const searchParams = new URLSearchParams(params);

        try {
            // Create abort controller to handle timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.networkTimeOut);

            // Fetch with timeout
            const response = await fetch(url.toString() + '?' + searchParams.toString(), { signal: controller.signal });
            clearTimeout(timeoutId);

            if (response.status >= 200 && response.status <= 299) {
                const jsonResponse = await response.json();
                return jsonResponse;
            } else {
                // Handle errors
                console.error(response.status, response.statusText);
                return { error: response.statusText }
            }
        } catch (error) {
            // Timeout error
            return { error: "Request timeout" }
        }
    }
}