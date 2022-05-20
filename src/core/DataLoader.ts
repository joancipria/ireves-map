import Base, { BaseType } from "@/core/Base";
import { i18n, bases, vehicles, reset } from "@/main";
import { VehicleAvailability, VehicleType } from "@/core/Vehicle";
import Vehicle from "@/core/Vehicle";
import { FileError } from "@/core/Errors"

export default class DataLoader {
    vue: any;

    constructor(vueRef) {
        this.vue = vueRef;
    }

    /**
     * Wrapper for an async file reader. See https://simon-schraeder.de/posts/filereader-async/
     *
     * @private
     * @param {File} file
     * @return {*}  {Promise<string>}
     * @memberof DataLoader
     */
    private readFileAsync(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                resolve(reader.result as string);
            };

            reader.onerror = reject;

            //reader.readAsArrayBuffer(file);
            reader.readAsText(file);
        })
    }


    /**
     * Loads a file and creates its entities
     *
     * @param {File} file
     * @return {*}  {(Promise<FileError | void>)}
     * @memberof DataLoader
     */
    async loadLocalFile(file: File): Promise<FileError | void> {
        // Check extension (.json)
        const extension = file.name.split(".").pop();
        if (extension !== "json") {
            return { type: "error", message: i18n.FILE_EXTENSION_ERROR };
        }

        try {
            // Parse text to object
            const data = JSON.parse(await this.readFileAsync(file));

            // Data validation
            if (data.bases && data.vehicles) {
                // If everything is correct, clear current data
                reset();

                // And create entities
                this.createBases(data.bases);
                this.createVehicles(data.vehicles);
            } else {
                return { type: "error", message: i18n.FILE_PARSE_ERROR };
            }
        } catch (error) {
            return { type: "error", message: i18n.FILE_PARSE_ERROR };
        }
    }

    /**
     * Loads demo data and creates its entities
     *
     * @return {*}  {(Promise<FileError | void>)}
     * @memberof DataLoader
     */
    async loadDemo(): Promise<FileError | void> {
        // Fetch demo file 
        const data = await fetch('demo_data.json').then(res => res.json()).then(res => { return res })

        // Create entities
        this.createBases(data.bases);
        this.createVehicles(data.vehicles);
    }

    private createVehicles(data: any): void {
        data.forEach(rawVehicle => {
            if (rawVehicle.x != "" && rawVehicle.y != "") {
                // Create vehicle
                let id = 0;
                const vehicle = new Vehicle(
                    id,
                    rawVehicle.name,
                    rawVehicle.x,
                    rawVehicle.y,
                    VehicleType[rawVehicle.type],
                    VehicleAvailability[rawVehicle.availability]
                );
                vehicles.push(vehicle);
                id++;
            }
        });

    }
    private createBases(data: any): void {
        // For each, create new Vehicle
        data.forEach((item: any) => {
            // Clean data
            if (
                item &&
                item.name != "" &&
                item.x != "" &&
                item.y != "" &&
                item.region != ""
            ) {
                // Get base type from its name
                let baseType: BaseType;
                for (const type of Object.values(BaseType)) {
                    if (item.name.includes(type)) {
                        baseType = BaseType[Object.keys(BaseType)[Object.values(BaseType).indexOf(type)]]
                    }
                }

                // Create new base
                const base = new Base(item.name, baseType, item.x, item.y, item.address, item.region);
                base.marker.addEventListener("click", () => {
                    this.vue.$emit("baseSelected", base);
                    //base.showIsochrone();
                });

                // For each base vehicle 
                if (item.vehicles && item.vehicles.length > 0) {
                    item.vehicles.forEach(rawVehicle => {
                        if (rawVehicle.x != "" && rawVehicle.y != "") {
                            // Create vehicle
                            const vehicle = new Vehicle(
                                0,
                                rawVehicle.name,
                                rawVehicle.x,
                                rawVehicle.y,
                                VehicleType[rawVehicle.type],
                                VehicleAvailability[rawVehicle.availability]
                            );
                            base.vehicles.push(vehicle);
                        }
                    });
                }

                // Push base
                bases.push(base);
            }
        });
    }
}