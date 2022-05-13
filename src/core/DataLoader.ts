import Base, { BaseType } from "@/core/Base";
import { i18n, bases, reset } from "@/main";
import { VehicleAvailability, VehicleType } from "@/core/Vehicle";
import Vehicle from "@/core/Vehicle";

export default class DataLoader {
    vue: any;

    constructor(vueRef) {
        this.vue = vueRef;
    }

    async loadLocalFile(file: File) {
        // Check extension (.csv)
        const extension = file.name.split(".").pop();

        if (extension !== "json") {
            return { error: i18n.FILE_EXTENSION_ERROR };
        }

        // Clear current data
        reset();

        // File reader
        const reader = new FileReader();

        reader.addEventListener('load', (event) => {
            // On load, parse string to object and create entities
            const data = JSON.parse(event.target.result.toString());
            this.createEntities(data);
        });
        reader.readAsText(file);

        return 0;
    }

    async loadDemo() {
        // Fetch demo file and create entities
        const data = await fetch('demo_data.json').then(res => res.json()).then(res => { return res })
        this.createEntities(data);
        return 0;
    }


    private createEntities(data: any) {
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
                    base.showIsochrone();
                });

                // For each base vehicle 
                if (item.vehicles.length > 0) {
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