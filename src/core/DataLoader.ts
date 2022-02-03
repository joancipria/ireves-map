import Base from "@/core/Base";
import { vehicles, i18n } from "@/main";
import { VehicleType } from "@/core/VehicleProperties";
import Vehicle from "@/core/Vehicle";
import * as Papa from "papaparse";

export default class DataLoader {
    vue: any;

    constructor(vueRef) {
        this.vue = vueRef;
    }

    async loadLocalFile(file: File) {
        // Check extension (.csv)
        const extension = file.name.split(".").pop();

        if (extension !== "csv") {
            return { error: i18n.FILE_EXTENSION_ERROR };
        }

        return await this.load(file, true);
    }

    async loadDemo() {
        return await this.load("demo_data.csv", true);
    }


    private load(file: File | string, mode: any = false) {
        // Parse CSV
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                download: mode,
                header: true,
                complete: (res: Papa.ParseResult<Papa.ParseError>,) => {
                    if (res.errors.length > 0) {
                        res.errors.forEach((error) => {
                            console.error(error);
                        });
                        resolve({ error: i18n.FILE_PARSE_ERROR });
                    }

                    this.createEntities(res.data);
                    resolve(res.data);
                },
            });
        });
    }


    private createEntities(data: any) {
        // For each, create new Vehicle
        let id = 0;
        const bases: Base[] = [];
        data.forEach((row: any) => {
            // Clean data
            if (
                row &&
                row.Base != "" &&
                row.x != "" &&
                row.y != "" &&
                row.Nombre != "" &&
                (row.Tipo == VehicleType.SAMU || row.Tipo == VehicleType.SVB)
            ) {
                // Create vehicle
                const vehicle = new Vehicle(
                    id,
                    row.Nombre,
                    row.x,
                    row.y,
                    VehicleType[row.Tipo],
                    row.horario
                );

                // Check if base already exists
                const found = bases.some((base) => base.name === row.Base);

                if (found) {
                    // exists
                    const index = bases.findIndex((base) => {
                        if (base.name === row.Base) {
                            return true;
                        }
                    });

                    // same address?
                    if (bases[index].address === row.Dirección) {
                        // Yes
                        bases[index].vehicles.push(vehicle);
                    } else {
                        // No, extract vehicle?
                        vehicle.extract();
                        // const base = new Base(row.Base, row.x, row.y, row.Dirección);
                        // base.marker.addEventListener("click", () => {
                        //   this.$emit("baseSelected", base);
                        // });
                        // base.vehicles.push(vehicle);
                        // bases.push(base);
                    }
                } else {
                    // doesn't exists

                    // Create bew base
                    const base = new Base(row.Base, row.x, row.y, row.Dirección);
                    base.marker.addEventListener("click", () => {
                        this.vue.$emit("baseSelected", base);
                        base.showIsochrone();
                    });

                    // Add vehicle to base
                    base.vehicles.push(vehicle);

                    // Push base
                    bases.push(base);
                }
                // Push vehicle
                vehicles.push(vehicle);
            }
            id++;
        });
    }
}