import { Overlap } from "@/core/Overlap";
import { LatLng, GeoJSON, LeafletEvent } from "leaflet";
import { Feature, MultiPolygon, Polygon } from "@turf/turf";
import { LeafletMarker } from "@/components/LeafletMarker/LeafletMarker";
import { openRoute } from "@/services/openroute.service";
import { worldPop } from "@/services/worldpop.service";
import { vehicleOverlaps, eventEmitter, globalOverlap, bases, dragging } from "@/main";
import { layers, leafletMap } from "@/components/LeafletMap.vue";
import { utils } from "./Utils";
import { MapEntity } from "@/core/MapEntity"
import { VehiclePopup } from "@/components/VehiclePopup/VehiclePopup";
import {i18n} from "@/i18n"

export enum VehicleType {
    SAMU = 'SAMU',
    SVB = 'SVB'
}

export enum VehicleTime {
    SAMU = 10,
    SVB = 15
}

export enum VehicleColor {
    SAMU = '#e61212',
    SVB = '#129fe6'
}

export enum VehicleAvailability {
    "12H" = '12H',
    "12H N" = '12H N',
    "24H" = '24H'
}

// TODO: Implementar tipo de vehículo (bici, coche etc) y en función de eso, que openroute haga la petición correcta
export default class Vehicle {

    // --- Vehicle ---
    id: string;
    name: string;
    position: LatLng;
    availability: VehicleAvailability;
    type: string;

    // --- Isochrone ---
    active: boolean = false;
    time: number;
    isochroneLayer: GeoJSON = null; // Leaflet isochrone layer
    polygon: Feature<Polygon | MultiPolygon> = null; // Feature polygon from openRoute
    population: number = null;
    color: string = '#e61212';
    marker: LeafletMarker;
    popup: VehiclePopup;

    constructor(id: string, name: string, lat: number = 0, lng: number = 0, type: VehicleType, availability: VehicleAvailability = VehicleAvailability["24H"]) {
        // Set basic info
        this.id = id;
        this.name = name;
        this.position = new LatLng(lat, lng);
        this.availability = availability;
        this.type = type;
        this.time = VehicleTime[this.type]

        // Set color based on vehicle type
        this.color = VehicleColor[this.type];

        // Popup (disabled for now)
        this.popup = new VehiclePopup(this);
        //this.marker.bindPopup(this.popup);

        // --- Events ---
        // On click (disabled for now)
        //this.marker.on('click', this.activate.bind(this));

        // On time controller change
        eventEmitter.on('timeChange', this.onTimeChange.bind(this));

        // Create marker
        this.initMarker();
    }

    async activate() {
        if (!this.active) {
            // Activate vehicle
            this.active = true;

            // Hide isochroneLayer
            //this.toggleIsochrone(false);

            // Show loading in popup
            this.popup.setLoading();

            // Generate (new) isochrone
            const result = await this.getIsochrone();

            if (result.error) {
                if (result.error.code == 3099) {
                    eventEmitter.emit("notification", i18n.ISOCHRONE_OUT_OF_SPAIN_ERROR);
                } else {
                    eventEmitter.emit("notification", i18n.ISOCHRONE_NETWORK_ERROR);
                }
                this.active = false;
                this.popup.setError();
                return;
            } else {
                // Show isochroneLayer
                this.toggleIsochrone(true);

                // Check overlaps
                this.checkOverlap();

                // Get pop
                this.getPopulation();
            }
        }
    }

    deactivate() {
        if (this.active) {
            // Hide isochrone
            this.toggleIsochrone(false);

            if (globalOverlap.overlap && this.polygon) { // TODO: Sólo si hay overlap
                this.clearOverlaps();
            }

            this.isochroneLayer = null;
            this.polygon = null;
            this.population = null;

            // Deactivate vehicle
            this.active = false;
        }
    }

    async onTimeChange(time, type) {
        if (type == this.type) {
            // Update time
            this.time = time;

            // If active, update isochrone
            if (this.active) {
                // Deactivate vehicle
                this.deactivate();

                // Update isochrone if is active
                this.activate();
            }
        }
    }

    async getIsochrone() {
        // Get new isochrone
        const data = await openRoute.getVehicleIsochrone(this);

        if (data.error) {
            //console.error(data.error);
            return data;
        } else {
            // Store Feature polygon (necessary to calc population and overlap)
            this.polygon = data.features[0];

            // Create isochroneLayer (Leaflet layer)
            this.isochroneLayer = new GeoJSON(data, {
                style: {
                    color: this.color
                }
            });
        }
        return data;
    }

    toggleIsochrone(visibility: boolean = false) {
        if (!this.isochroneLayer) return;

        if (!visibility) {
            layers.isochrones.removeLayer(this.isochroneLayer)
            return;
        }
        layers.isochrones.addLayer(this.isochroneLayer).addTo(leafletMap.map)
    }

    async getPopulation() {
        if (!this.isochroneLayer) {
            await this.getIsochrone();
        }

        // Get population
        const data = await worldPop.getPopulation(this.polygon.geometry);

        if (data.error) {
            console.error(data.error);
            this.popup.setStats();
            return;
        }
        this.population = data.total_population;
        this.popup.setStats();

        return this.population;
    }

    getRawOverlap(targetVehicle: Vehicle) {
        const overlap = utils.checkOverlap(targetVehicle.polygon, this.polygon);
        return overlap;
    }

    checkOverlap() {
        bases.forEach(base => {
            // Check overlap, compare this vehicle against all others
            base.vehicles.forEach(vehicle => {
                // Discard own vehicle, vehicles without generated isochrone and vehicles from same base
                if (vehicle != this && vehicle.polygon && !(base.vehicles.includes(this) && base.vehicles.includes(vehicle))) {

                    // Check overlap
                    const overlap = this.getRawOverlap(vehicle);

                    // If there's overlap
                    if (overlap) {
                        // Check if there's 1 or more overlap
                        if (vehicleOverlaps.length >= 1) {
                            // Hide global overlap
                            globalOverlap.overlap.hide()

                            // Join global overlap with current overlap
                            globalOverlap.feature = utils.union(overlap, globalOverlap.feature)
                        } else {
                            // Set current overlap as global overlap
                            globalOverlap.feature = overlap;
                        }

                        // Activate new overlap
                        const newGlobalOverlap = new Overlap(globalOverlap.feature);
                        newGlobalOverlap.show();
                        globalOverlap.overlap = newGlobalOverlap;

                        // Create overlap
                        const currentOverlap = new Overlap(overlap);

                        // Store both vehicles and overlap 
                        vehicleOverlaps.push([vehicle, this, currentOverlap]);
                    }
                }
            });
        });
    }

    clearOverlaps() {
        // Hide global overlap
        globalOverlap.overlap.hide();


        // Check if current isochrone overlaps with globalOverlap
        const clip = utils.difference(globalOverlap.feature, this.polygon);

        if (clip) {

            // Join all overlaps except this
            let allOverlaps = utils.emptyPolygon;
            for (let i = 0; i < vehicleOverlaps.length; i++) {
                if (!(vehicleOverlaps[i] && (vehicleOverlaps[i][0] == this || vehicleOverlaps[i][1] == this))) {
                    allOverlaps = utils.union(allOverlaps, vehicleOverlaps[i][2].feature);
                }
            }

            // Diff between allOverlaps and current isochrone
            const toRemove = utils.difference(this.polygon, allOverlaps);

            // Clip globalOverlap by toRemove
            const overlapClip = utils.difference(globalOverlap.feature, toRemove);

            // Update overlap
            globalOverlap.feature = overlapClip;
            const newOverlap = new Overlap(overlapClip);
            globalOverlap.overlap = newOverlap;
            globalOverlap.overlap.show();
        }

        // Check if there's any active overlap
        for (let i = 0; i < vehicleOverlaps.length; i++) {
            if (vehicleOverlaps[i] && (vehicleOverlaps[i][0] == this || vehicleOverlaps[i][1] == this)) {
                vehicleOverlaps[i][2].hide(); // Hide it
                vehicleOverlaps.splice(i, 1); // Remove it
            }
        }

        if (vehicleOverlaps.length == 0) {
            globalOverlap.overlap.hide();
        }
    }

    updatePosition(coord: LatLng): void {
        this.position = coord;
        //this.marker.setLatLng(coord)
    }

    show(): void {
        //layers.vehiclesCluster.addLayer(this.marker);
        this.marker.setLatLng(this.position);
    }

    hide() {
        //layers.vehiclesCluster.removeLayer(this.marker);
        this.marker.setLatLng(new LatLng(0, 0));
        this.deactivate();
    }

    initMarker() {
        // Marker & Popup
        this.marker = new LeafletMarker(MapEntity[this.type], this.position, true, "", true, layers.vehiclesCluster, [this.name, this.availability]);

        // While dragging, close tooltip 
        this.marker.on('drag', () => {
            this.marker.closeTooltip();
        })

        // On drag start
        this.marker.on('dragstart', () => {
            this.deactivate.bind(this)
            dragging.vehicle = this;
            this.marker.getElement().classList.add("dragging-disabled")
        })

        // On drag ends
        this.marker.on('dragend', (event: LeafletEvent) => {
            // Update position
            this.updatePosition(event.target._latlng);
            this.marker.getElement().classList.remove("dragging-disabled")
        })
    }
}