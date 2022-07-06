import Base, { BaseType } from "@/core/Base";
import { bases, vehicles, reset, eventEmitter } from "@/main";
import { VehicleAvailability, VehicleType } from "@/core/Vehicle";
import Vehicle from "@/core/Vehicle";
import { FileError } from "@/core/Errors"
import { i18n } from "@/i18n"
import { modelsService } from "@/services/models.service"

// Read demo data file
import demoData from "@/demo_data.json";
import { Vue } from "vue-class-component";

// Create types from JSON demo data
export type JSONData = typeof demoData;
export type JSONVehicle = typeof demoData.vehicles[0];
export type JSONBase = typeof demoData.bases[0];


export class DataLoader {
    vue: Vue;

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
            return { type: "error", message: i18n("FILE_EXTENSION_ERROR") };
        }

        try {
            // Parse text to object
            const data = JSON.parse(await this.readFileAsync(file)) as JSONData;

            // Data validation
            if (data.bases && data.vehicles) {
                // If everything is correct, clear current data
                reset();

                // And create entities
                this.createBases(data.bases);
                this.createVehicles(data.vehicles);
            } else {
                return { type: "error", message: i18n("FILE_PARSE_ERROR") };
            }
        } catch (error) {
            console.error(error)
            return { type: "error", message: i18n("FILE_PARSE_ERROR") };
        }
    }

    /**
     * Loads demo data and creates its entities
     *
     * @return {*}  {(Promise<FileError | void>)}
     * @memberof DataLoader
     */
    async loadDemo(): Promise<FileError | void> {

        // Reset
        reset();

        // Create entities
        this.createBases(demoData.bases);
        this.createVehicles(demoData.vehicles);
    }

    /**
     * Creates vehicles given an JSONVehicle array
     *
     * @private
     * @param {JSONVehicles} data
     * @memberof DataLoader
     */
    private createVehicles(data: JSONVehicle[]): void {
        data.forEach(rawVehicle => {
            const vehicle = this.createVehicle(rawVehicle);

            if (vehicle) {
                vehicles.push(vehicle);
            }
        });
    }

    /**
     * Creates bases given an JSONBase array
     *
     * @private
     * @param {JSONBase[]} data
     * @memberof DataLoader
     */
    private createBases(data: JSONBase[]): void {
        // For each, create new Vehicle
        data.forEach((rawBase: JSONBase) => {
            if (!rawBase.position) {
                return;
            }
            // Clean data
            if (
                rawBase &&
                rawBase.name != "" &&
                rawBase.position &&
                rawBase.position.lat &&
                rawBase.position.lng &&
                rawBase.region
            ) {
                // Get base type from its name
                let baseType: BaseType;
                for (const type of Object.values(BaseType)) {
                    if (rawBase.name.includes(type)) {
                        baseType = BaseType[Object.keys(BaseType)[Object.values(BaseType).indexOf(type)]]
                    }
                }

                // Create new base
                const base = new Base(rawBase.name, baseType, rawBase.position.lat, rawBase.position.lng, rawBase.address, rawBase.region);
                base.marker.addEventListener("click", () => {
                    this.vue.$emit("baseSelected", base);
                    //base.showIsochrone();
                });

                // For each base vehicle 
                if (rawBase.vehicles && rawBase.vehicles.length > 0) {
                    rawBase.vehicles.forEach(rawVehicle => {
                        const vehicle = this.createVehicle(rawVehicle);
                        base.vehicles.push(vehicle);
                    });
                }

                // Push base
                bases.push(base);
            }
        });
    }


    /**
     * Creates a Vehicle from a JSONVehicle
     *
     * @private
     * @param {JSONVehicle} rawVehicle
     * @return {*}  {Vehicle}
     * @memberof DataLoader
     */
    private createVehicle(rawVehicle: JSONVehicle): Vehicle {
        if (rawVehicle && rawVehicle.position.lat && rawVehicle.position.lng) {
            // Create vehicle
            const vehicle = new Vehicle(
                Math.random().toString().slice(2, 10),
                rawVehicle.name,
                rawVehicle.position.lat,
                rawVehicle.position.lng,
                VehicleType[rawVehicle.type],
                VehicleAvailability[rawVehicle.availability]
            );
            return vehicle;
        }
        return;
    }
}

export async function loadModel() {
    // Get static model
    const model = await modelsService.getStaticModel();

    if (model.error) {
        eventEmitter.emit("notification", i18n("MODEL_NETWORK_ERROR"), "is-danger");
        return;
    }

    // Filter model by SVB and SAMU
    const svbs = vehicles.filter(svb => svb.type == VehicleType.SVB);
    const samus = vehicles.filter(samu => samu.type == VehicleType.SAMU);
    let counterSVBS = 0;
    let counterSAMUS = 0;
    

    // Park vehicles
    model.svb.forEach(svb => {
        if (svb.value == 1) {
            bases.forEach(base => {
                if (base.name == svb.base) {
                    base.park(svbs[counterSVBS]);
                    counterSVBS++;
                }
            })
        }
    })

    model.samu.forEach(samu => {
        if (samu.value == 1) {
            bases.forEach(base => {
                if (base.name == samu.base) {
                    base.park(samus[counterSAMUS]);
                    counterSAMUS++;
                }
            })
        }
    })

    eventEmitter.emit("notification", "Model loaded", "is-success");
}