import { bases, vehicles } from "@/main";
import { saveAs } from "file-saver";

class DataExport {

    /**
     * Exports (downloads) a JSON file with all app data
     *
     * @param {string} fileName
     * @memberof DataExport
     */
    export(fileName: string): void {

        if (!fileName) {
            fileName = "Reves Map data";
        }

        // Build file structure
        const data = {
            bases: bases,
            vehicles: vehicles
        }

        // Creat cleaned blob
        const blob = new Blob([JSON.stringify(data, this.customReplacer())], { type: "text/json;charset=utf-8" });

        // Save file
        saveAs(blob, `${fileName}.json`);
    }

    /**
     * Custom replacer for JSON.stringify(). See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
     *
     * @memberof DataExport
     */
    customReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
            // Drop circular objects
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return;
                }
                seen.add(value);
            }

            // Drop internal properties and all leaflet visual stuff
            if (key === "marker" || key === "activeVehicles" || key === "active" || key === "time" || key === "isochroneLayer" || key === "polygon" || key === "population" || key === "color" || key === "popup") {
                return;
            }
            return value;
        };
    };
}

export const dataExport = new DataExport();