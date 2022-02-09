import { Overlap } from "@/core/Overlap";
import { LatLng, GeoJSON, LeafletEvent, LayerGroup } from "leaflet";
import { Feature, MultiPolygon, Polygon } from "@turf/turf";
import { LeafletMarker } from "@/components/LeafletMarker/LeafletMarker";
import { openRoute } from "@/services/openroute.service";
import { worldPop } from "@/services/worldpop.service";
import { vehicles, vehicleOverlaps, eventEmitter, layers, globalOverlap } from "@/main";
import { utils } from "./Utils";
import { VehicleType, VehicleTime, VehicleColor, VehicleAvailability } from "@/core/VehicleProperties";
import { MapEntity } from "@/core/MapEntity"
import { VehiclePopup } from "@/components/VehiclePopup/VehiclePopup";

// TODO: Implementar tipo de vehículo (bici, coche etc) y en función de eso, que openroute haga la petición correcta
export default class Vehicle {

    // --- Vehicle ---
    id: number;
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
    targetLayer: LayerGroup;

    constructor(id: number, name: string, lat: number = 0, lng: number = 0, type: VehicleType, availability: VehicleAvailability = VehicleAvailability["24H"]) {
        // Set basic info
        this.id = id;
        this.name = name;
        this.position = new LatLng(lat, lng);
        this.availability = availability;
        this.type = type;
        this.time = VehicleTime[this.type]

        // Set target layer
        if (this.availability == VehicleAvailability["12H"]) {
            this.targetLayer = layers.availability.halfDay;
        }

        if (this.availability == VehicleAvailability["12H N"]) {
            this.targetLayer = layers.availability.halfDayNight;
        }

        if (this.availability == VehicleAvailability["24H"]) {
            this.targetLayer = layers.availability.allDay;
        }

        // Set color based on vehicle type
        this.color = VehicleColor[this.type]; // Color azul en hex

        // Marker & Popup
        this.marker = new LeafletMarker(MapEntity[this.type], this.position, true, '');
        this.popup = new VehiclePopup(this);
        this.marker.bindPopup(this.popup);

        // --- Events ---
        // On drag start, clear all vehicle data
        this.marker.on('dragstart', this.deactivate.bind(this))

        // On drag ends, update  position
        this.marker.on('dragend', (event: LeafletEvent) => {
            this.updatePosition(event.target._latlng);
        })

        // On click
        this.marker.on('click', this.activate.bind(this));

        // On time controller change
        eventEmitter.on('timeChange', this.onTimeChange);
    }

    async activate() {
        if (!this.active) {
            console.info("Vehicle activated", this);

            // Activate vehicle
            this.active = true;

            // Hide isochroneLayer
            this.toggleIsochrone(false);

            // Show loading in popup
            this.popup.setLoading();

            // Generate (new) isochrone
            await this.generateIsochrone();

            // Show isochroneLayer
            this.toggleIsochrone(true);

            // Check overlaps
            this.checkOverlap();

            // Get pop
            this.getPopulation();
        }
    }

    deactivate() {
        if (this.active) {
            console.info("Deactivate vehicle", this);

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

            // Deactivate vehicle
            this.deactivate();

            // Update isochrone if is active
            this.activate();
        }

    }

    async generateIsochrone() {
        // Get new isochrone
        const data = await openRoute.getVehicleIsochron(this);

        if (data.error) {
            console.error(data.error);
            return;
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
    }

    toggleIsochrone(visibility = false) {
        if (!this.isochroneLayer) return;

        if (!visibility) {
            this.targetLayer.removeLayer(this.isochroneLayer)
            return;
        }

        this.isochroneLayer.addTo(this.targetLayer);
    }

    async getPopulation() {
        if (!this.isochroneLayer) return;

        // Get population
        const data = await worldPop.getPopulation(this.polygon.geometry);

        if (data.error) {
            console.error(data.error);
            this.popup.setStats();
            return;
        }
        this.population = data.total_population;
        this.popup.setStats();
    }

    checkOverlap() {
        // Check overlap, compare this vehicle against all others
        vehicles.forEach(vehicle => {
            // Discard own vehicle and vehicles without generated isochrone
            if (vehicle != this && vehicle.polygon) {

                // Check overlap
                const overlap = utils.checkOverlap(vehicle.polygon, this.polygon);

                // If there's overlap
                if (overlap) {
                    console.info("Overlap detected", this, vehicle);

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
    }

    clearOverlaps() {
        console.log("Overlaps: ", vehicleOverlaps)

        // Hide global overlap
        globalOverlap.overlap.hide();


        // Clip global overlap by this poly 
        const clip = utils.difference(globalOverlap.feature, this.polygon);

        if (clip) {
            globalOverlap.feature = clip;
            const newOverlap = new Overlap(clip);
            globalOverlap.overlap = newOverlap;
            newOverlap.show();
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

    updatePosition(coord: LatLng) {
        this.position.lat = coord.lat;
        this.position.lng = coord.lng;
        this.marker.setLatLng(coord);
    }

    extract() {
        this.position.lng = this.position.lng + 0.0025;
        this.marker.addToMap(this.targetLayer);
    }
}