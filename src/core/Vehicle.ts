import { Overlap } from "@/core/Overlap";
import { LatLng, GeoJSON, LeafletEvent } from "leaflet";
import { Feature } from "@turf/turf";
import { LeafletMarker } from "@/components/LeafletMarker/LeafletMarker";
import { openRoute } from "@/services/openroute.service";
import { worldPop } from "@/services/worldpop.service";
import { vehicles, vehicleOverlaps, leafletMap, eventEmitter } from "@/main";
import { utils } from "./Utils";
import { VehicleType, VehicleTime, VehicleColor } from "@/core/VehicleProperties";
import { MapEntity } from "@/core/MapEntity"

import { VehiclePopup } from "@/components/VehiclePopup/VehiclePopup";

// TODO: Implementar tipo de vehículo (bici, coche etc) y en función de eso, que openroute haga la petición correcta
export default class Vehicle {

    // --- Vehicle ---
    id: number;
    name: string;
    position: LatLng;
    availability: string;
    description: string;
    type: string;
    // subtype: string;
    // tag: string;

    // --- Isochrone ---
    time: number;
    isochroneLayer: GeoJSON; // Leaflet isochrone layer
    polygon: Feature; // Feature polygon from openRoute
    overlaps: Overlap[];
    population: number;
    color: string = '#e61212';
    marker: LeafletMarker;
    popup: VehiclePopup;

    constructor(id: number, name: string, lat: number = 0, lng: number = 0, type: VehicleType, availability: string = '12 AM', description: string = '') {
        this.id = id;
        this.name = name;
        this.position = new LatLng(lat, lng);
        this.availability = availability;
        this.description = description;
        this.type = type;

        this.isochroneLayer = null;
        this.polygon = null;
        this.overlaps = [];
        this.population = null;
        this.time = VehicleTime[this.type]

        // Set color based on vehicle type
        this.color = VehicleColor[this.type]; // Color azul en hex
        this.marker = new LeafletMarker(MapEntity[this.type], this.position, true, '');


        // --- Define marker events ---
        // On drag start, hide isochroneLayer and overlaps
        this.marker.on('dragstart', () => {
            this.toggleIsochroneLayer(false);

            this.isochroneLayer = null;
            this.polygon = null;
            this.population = null;

            this.clearOverlaps();
        })

        // On drag ends, update  position
        this.marker.on('dragend', (event: LeafletEvent) => {
            this.updatePosition(event.target._latlng);
        })

        // On click
        this.marker.on('click', async () => {
            // Check if isochroneLayer has been generated
            if (this.isochroneLayer) {
                this.getPopulation(); // Then get population
            } else {
                await this.updateIsochrone()
                this.getPopulation();
            }
        })

        this.popup = new VehiclePopup(this);
        this.marker.bindPopup(this.popup);


        // On time controller change
        eventEmitter.on('timeChange', async (time, type) => {
            if (type == this.type) {
                console.log("tiempo actualizado")
                // Update time
                this.time = time;

                // Clear overlaps
                this.clearOverlaps();

                // Update isochrone if there's a polygon
                if (this.polygon) {
                    await this.updateIsochrone();
                    this.getPopulation();
                }
            }
        });
    }

    // TODO: Rename function
    async onClick() {
        // Check if isochroneLayer has been generated
        if (this.isochroneLayer) {
            this.getPopulation(); // Then get population
        } else {
            await this.updateIsochrone()
            this.getPopulation();
        }
    }

    async updateIsochrone() {
        // Hide isochroneLayer
        this.toggleIsochroneLayer(false);

        // Show loading in popup
        this.popup.setLoading();

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

            // Show isochroneLayer
            this.toggleIsochroneLayer(true);
        }

        // Check overlaps
        this.checkOverlap();
    }

    updatePosition(coord: LatLng) {
        this.position.lat = coord.lat;
        this.position.lng = coord.lng;
        this.marker.setLatLng(coord);
    }

    toggleIsochroneLayer(visibility = false) {
        if (!this.isochroneLayer) return;

        if (!visibility) {
            if (this.isochroneLayer) {
                leafletMap.map.removeLayer(this.isochroneLayer);
            }
            return;
        }

        if (this.isochroneLayer) {
            leafletMap.map.addLayer(this.isochroneLayer);
        }
    }

    async getPopulation() {
        if (!this.isochroneLayer) return;

        // Get populaton
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
                    // Create overlap
                    const currentOverlap = new Overlap(overlap);
                    currentOverlap.show();
                    this.overlaps.push(currentOverlap);

                    // Store both vehicles and overlap 
                    vehicleOverlaps.push([vehicle, this, currentOverlap]);
                }
            }
        });
        console.log(vehicleOverlaps)
    }

    clearOverlaps() {
        // Check if there's any active overlap
        for (let i = 0; i < vehicleOverlaps.length; i++) {
            if (vehicleOverlaps[i] && (vehicleOverlaps[i][0] == this || vehicleOverlaps[i][1] == this)) {
                vehicleOverlaps[i][2].hide(); // Hide it
                delete vehicleOverlaps[i]; // Remove it
            }
        }
    }

    extract() {
        this.position.lng = this.position.lng + 0.0025;
        this.marker.addToMap();
    }
}