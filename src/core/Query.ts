import { utils } from "./Utils";
import { regionsService } from "@/services/regions.service";
import { bases } from "@/main"
import Base from "@/core/Base";
import { map, layers } from "@/components/LeafletMap.vue";
import { GeoJSON, LatLng } from "leaflet";
import { VehicleColor, VehicleType } from "./Vehicle";
import { popService } from "@/services/population.service";

class Query {

    private region: number = 0;
    regions;
    private bounds;
    private filteredBases: Base[] = [];


    constructor() {
        // Fetch regions as soon as possible
        this.fetchRegions();
    }

    private async getBounds(regionID: number) {
        // Get current region bounds
        this.bounds = await regionsService.getRegionBounds(regionID);
        return this.bounds;
    }

    private showBounds(bounds) {
        // Clear bounds layer
        layers.bounds.clearLayers();

        // Create layer
        const boundsLayer = new GeoJSON(bounds.features[0], {
            style: {
                color: "#484848", // Color verde
                //fill: false,
                weight: 5,
            },
        });

        // Add it to map
        boundsLayer.addTo(layers.bounds);

        // Fly to it
        map.flyTo(
            new LatLng(
                parseFloat(bounds.features[1].geometry.coordinates[1]),
                parseFloat(bounds.features[1].geometry.coordinates[0])
            ),
            11
        );
    }

    private async fetchRegions() {
        this.regions = await regionsService.getAllRegions();
    }

    async filter(region: number, typeFilter: string[]) {
        this.region = region;
        // Get & show region bounds
        if (region != 0) {
            const bounds = await this.getBounds(region);
            this.showBounds(bounds);
        }

        // Clear map
        layers.basesCluster.clearLayers();
        layers.isochrones.clearLayers();
        layers.overlaps.clearLayers();
        //layers.vehiclesCluster.clearLayers();

        // For each base
        bases.forEach((base: Base) => {
            // Check region
            if (base.region == region || region == 0) {
                if (typeFilter.includes(base.type)) {
                    this.filteredBases.push(base);
                    base.marker.addTo(layers.basesCluster);
                }
            }
        });
    }

    async query() {
        let samuIsochrone = utils.emptyPolygon;
        let svbIsochrone = utils.emptyPolygon;


        // If filtered bases is empty, apply default filter
        if (this.filteredBases.length == 0) {
            this.filter(0, ["HOSPITAL", "CENTRO", "CONSULTORIO", "UNIDAD"]);
        }


        // For each base (targeting filter)
        for (const base of this.filteredBases) {
            // If contains vehicles
            if (base.vehicles.length > 0) {
                // Generate isochrones
                await base.showIsochrone();

                // For each vehicle in base
                base.vehicles.forEach((vehicle) => {
                    // Check is active
                    if (vehicle.polygon) {
                        //
                        if (vehicle.type == VehicleType.SAMU) {
                            // if (globalSamuIsochrone) {
                            //     globalSamuIsochrone = utils.union(
                            //         vehicle.polygon,
                            //         globalSamuIsochrone
                            //     );
                            // } else {
                            //     globalSamuIsochrone = vehicle.polygon;
                            // }
                            samuIsochrone = utils.union(samuIsochrone, vehicle.polygon);
                        }

                        if (vehicle.type == VehicleType.SVB) {
                            // if (globalSvbIsochrone) {
                            //     globalSvbIsochrone = utils.union(
                            //         vehicle.polygon,
                            //         globalSvbIsochrone
                            //     );
                            // } else {
                            //     globalSvbIsochrone = vehicle.polygon;
                            // }
                            svbIsochrone = utils.union(svbIsochrone, vehicle.polygon);
                        }
                    }
                });
            }
        }

        let globalIsochrone = utils.union(
            samuIsochrone,
            svbIsochrone
        );

        globalIsochrone = utils.intersect(
            globalIsochrone,
            this.bounds.features[0]
        );

        // Get pop
        const population = { samu: { raw: 0, per: 0 }, svb: { raw: 0, per: 0 }, total: { raw: 0, per: 0 } };
        const totalData = await popService.getPopulation(
            globalIsochrone.geometry
        );

        const samuData = await popService.getPopulation(
            samuIsochrone.geometry
        );

        const svbData = await popService.getPopulation(
            svbIsochrone.geometry
        );

        if (samuData.error || svbData.error || totalData.error) {
            console.error(samuData.error, svbData.error);
            return;
        } else {

            const regionPop = this.regions.find((region) => region.id == this.region).population;

            // Store pop
            population.samu.raw = samuData.total_population;
            population.svb.raw = svbData.total_population;
            population.total.raw = totalData.total_population;

            population.samu.per = utils.percentage(samuData.total_population, regionPop, 2);
            population.svb.per = utils.percentage(svbData.total_population, regionPop, 2);
            population.total.per = utils.percentage(totalData.total_population, regionPop, 2);

            // Print 
            const layerSVB = new GeoJSON(svbIsochrone, {
                style: {
                    color: VehicleColor.SVB,
                },
            });

            const layerSAMU = new GeoJSON(samuIsochrone, {
                style: {
                    color: VehicleColor.SAMU,
                },
            });

            layers.isochrones.addLayer(layerSVB).addTo(map);
            layers.isochrones.addLayer(layerSAMU).addTo(map);
        }



        return population;
    }
}
export const query = new Query();