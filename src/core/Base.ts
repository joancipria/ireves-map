import { LeafletMarker } from "@/components/LeafletMarker/LeafletMarker";
import { LatLng, DomUtil } from "leaflet";
import Vehicle from "./Vehicle";
import { MapEntity } from "@/core/MapEntity"
import { VehicleType } from "@/core/Vehicle"
import { layers } from "@/components/LeafletMap.vue";
import { dragging, vehicles } from "@/main";

export enum BaseType {
    HOSPITAL = 'HOSPITAL',
    HEALTH_CENTER = 'CENTRO',
    OFFICE = 'CONSULTORIO',
    UNIT = 'UNIDAD'
}

export default class Base {
    name: string;
    type: BaseType
    position: LatLng;
    region: string;
    address: string;
    vehicles: Vehicle[] = [];
    marker: LeafletMarker;

    constructor(name: string, type: BaseType, lat: number = 0, lng: number = 0, address: string, region: string) {
        this.name = name;
        this.type = type;
        this.position = new LatLng(lat, lng);
        this.address = address;
        this.region = region;

        // Determine initial marker class
        let markerClass = "";
        if (vehicles.length <= 0) {
            markerClass = "disabled-marker";
        }

        // Create marker
        this.marker = new LeafletMarker(MapEntity.BASE, this.position, false, markerClass, true, layers.basesCluster, this.name);

        /* Drag and drop vehicles system */
        // On mouse over
        this.marker.on('mouseover', () => {
            // Set base flag
            dragging.base = this;

            // If user is dragging a vehicle
            if (dragging.vehicle) {
                // Increase base icon size (animated)
                DomUtil.addClass(this.marker.getElement(), "increased-marker");

                // Set vehicle dragend listener
                dragging.vehicle.marker.on('dragend', () => {
                    if (dragging.base && dragging.base == this) {
                        this.park(dragging.vehicle);
                        this.toggleBase(true);
                        dragging.vehicle = undefined;
                        dragging.base = false;
                    }
                })
            }
        });

        this.marker.on('mouseout', () => {
            DomUtil.removeClass(this.marker.getElement(), "increased-marker");
            dragging.base = false;
        })
    }

    extractVehicle(vehicleID: string): void {
        const targetIndex = this.vehicles.findIndex(vehicle => vehicle.id == vehicleID);
        this.vehicles[targetIndex].show();

        vehicles.push(this.vehicles[targetIndex])
        this.vehicles.splice(targetIndex, 1);

        this.updateMarker();
    }

    park(vehicle: Vehicle): void {
        vehicle.updatePosition(this.position);
        vehicle.marker.setLatLng(this.position);
        vehicle.hide();
        this.vehicles.push(vehicle);

        this.updateMarker();
    }

    async showIsochrone() {
        const vehicles = this.getActiveVehicles();
        if (vehicles.samu) {
            await vehicles.samu.activate();
        }
        if (vehicles.svb) {
            await vehicles.svb.activate();
        }
    }

    async getPopulation() {
        const vehicles = this.getActiveVehicles();
        const data = { samu: 0, svb: 0 }
        if (vehicles.samu) {
            data.samu = await vehicles.samu.getPopulation();
        }
        if (vehicles.svb) {
            data.svb = await vehicles.svb.getPopulation();
        }
        return data;
    }

    getActiveVehicles() {
        const samu = this.vehicles.find(vehicle => vehicle.type == VehicleType.SAMU);
        const svb = this.vehicles.find(vehicle => vehicle.type == VehicleType.SVB);

        return { samu: samu, svb: svb };
    }

    toggleBase(enabled: boolean) {
        const markerIcon = this.marker.getElement();

        if (enabled) {
            DomUtil.removeClass(markerIcon, "disabled-marker");
        } else {
            DomUtil.addClass(markerIcon, "disabled-marker");
        }
    }

    updateMarker() {
        if (this.vehicles.length <= 0) {
            this.toggleBase(false);
        } else {
            this.toggleBase(true);
        }
    }

}