import { utils } from "./Utils";
import { regionsService } from "@/services/regions.service";
import { bases, eventEmitter } from "@/main"
import Base from "@/core/Base";
import { map, layers } from "@/components/LeafletMap.vue";
import { GeoJSON, LatLng } from "leaflet";
import { VehicleColor, VehicleType } from "./Vehicle";
import { popService } from "@/services/population.service";
import { i18n } from "@/i18n"
import { Overlap } from "@/core/Overlap";

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
        const regions = await regionsService.getAllRegions();

        if (regions.error) {
            eventEmitter.emit("notification", i18n("GENERIC_NETWORK_ERROR"), "is-danger");
            this.fetchRegions();
            return;
        } else {
            this.regions = regions;
        }
    }

    async filter(region: number, typeFilter: string[]) {
        this.filteredBases = [];
        this.region = region;
        // Get & show region bounds
        if (region != 0) {
            const bounds = await this.getBounds(region);

            if (bounds.error) {
                eventEmitter.emit("notification", i18n("BOUNDS_NETWORK_ERROR"), "is-danger");
                return;
            }

            this.showBounds(bounds);
        }

        // Clear map
        layers.basesCluster.clearLayers();
        //layers.vehiclesCluster.clearLayers();
        layers.isochrones.clearLayers();
        layers.overlaps.clearLayers();


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
        // Initial pop
        const population = { samu: { raw: 0, per: 0 }, svb: { raw: 0, per: 0 }, total: { raw: 0, per: 0 } };

        // Clear map
        layers.isochrones.clearLayers();
        layers.overlaps.clearLayers();

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
                        // Add it 
                        if (vehicle.type == VehicleType.SAMU) {
                            samuIsochrone = utils.union(samuIsochrone, vehicle.polygon);
                        }

                        if (vehicle.type == VehicleType.SVB) {
                            svbIsochrone = utils.union(svbIsochrone, vehicle.polygon);
                        }
                    }
                });
            }
        }

        // If both, SAMU isochrone & SVB isochrone are empty, finish query
        if (samuIsochrone == utils.emptyPolygon && svbIsochrone == utils.emptyPolygon) {
            eventEmitter.emit("notification", "Consulta vacia", "is-warning");
            return population;
        }

        // Create overlap
        const overlap = utils.intersect(samuIsochrone, svbIsochrone);

        // Current region pop
        const regionPop = this.regions.find((region) => region.id == this.region).population;

        // Store pop
        population.samu.raw = await this.getIsochronePopulation(samuIsochrone);
        population.svb.raw = await this.getIsochronePopulation(svbIsochrone);

        population.samu.per = utils.percentage(population.samu.raw, regionPop, 2);
        population.svb.per = utils.percentage(population.svb.raw, regionPop, 2);

        // Render layers 
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

        // Render overlap
        if (overlap) {
            const layerOverlap = new Overlap(overlap);
            population.total.raw = await layerOverlap.getPopulation();
            population.total.per = utils.percentage(population.total.raw, regionPop, 2);
            layerOverlap.show();
        }

        return population;
    }

    async getIsochronePopulation(isochrone) {
        // Intersect isochrone with region bounds and get pop
        if (isochrone != utils.emptyPolygon) {
            isochrone = utils.intersect(isochrone, this.bounds.features[0]);

            if (!isochrone) {
                return 0;
            }

            const data = await popService.getPopulation(
                isochrone.geometry
            );

            if (data.error || isNaN(data.total_population)) {
                eventEmitter.emit("notification", i18n("GENERIC_NETWORK_ERROR"), "is-danger");
                return 0;
            } else {
                return data.total_population;
            }
        }
    }
}
export const query = new Query();