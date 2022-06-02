class Settings {

    locale: string;
    baseMap: string;

    constructor() {
        this.loadSettings();
    }

    /**
     * Saves user settings to localStorage
     *
     * @param {string} locale
     * @param {string} baseMap
     * @memberof Settings
     */
    saveSettings(locale: string, baseMap: string): void {
        if (typeof (Storage) !== "undefined") {
            localStorage.setItem("revesMapLocale", locale);
            localStorage.setItem("revesMapBaseMap", baseMap);
        } else {
            // Sorry! No Web Storage support..
        }
    }


    /**
     * Loads settings from localStorage
     *
     * @private
     * @memberof Settings
     */
    private loadSettings(): void {
        this.locale = localStorage.getItem("revesMapLocale");
        this.baseMap = localStorage.getItem("revesMapBaseMap");
    }
}

export const settings = new Settings();
