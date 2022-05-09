import { LeafletMarker } from "@/components/LeafletMarker/LeafletMarker";
import { LatLng } from "leaflet";
import Vehicle from "./Vehicle";
import { MapEntity } from "@/core/MapEntity"
import { VehicleType } from "@/core/VehicleProperties"
import { layers } from "@/components/LeafletMap.vue";

export default class Base {
    name: string;
    position: LatLng;
    address: string;
    vehicles: Vehicle[] = [];
    marker: LeafletMarker;
    activeVehicles: any;

    constructor(name: string, lat: number = 0, lng: number = 0, address: string) {
        this.name = name;
        this.position = new LatLng(lat, lng);
        this.address = address;
        this.marker = new LeafletMarker(MapEntity.BASE, this.position, false, '', true, layers.basesCluster);
    }

    extractVehicle(vehicleToExtract: Vehicle) {
        const index = this.vehicles.findIndex((vehicle: Vehicle) => {
            if (vehicle === vehicleToExtract) {
                return true;
            }
        });
        this.vehicles.splice(index, 1); // returns array of removed items
        vehicleToExtract.extract();
        this.refreshActiveVehicles();
        this.showIsochrone();
    }

    showIsochrone() {
        this.refreshActiveVehicles();
        if (this.activeVehicles.samu) {
            this.activeVehicles.samu.activate();
        }
        if (this.activeVehicles.svb) {
            this.activeVehicles.svb.activate();
        }
    }

    async getPopulation() {
        this.refreshActiveVehicles();
        const data = { samu: null, svb: null }
        if (this.activeVehicles.samu) {
            data.samu = await this.activeVehicles.samu.getPopulation();
        }
        if (this.activeVehicles.svb) {
            data.svb = await this.activeVehicles.svb.getPopulation();
        }
        return data;
    }


    refreshActiveVehicles() {
        const samu = this.vehicles.find(vehicle => vehicle.type == VehicleType.SAMU);
        const svb = this.vehicles.find(vehicle => vehicle.type == VehicleType.SVB);

        this.activeVehicles = {
            samu: samu,
            svb: svb
        }
    }

}