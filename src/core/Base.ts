import { LeafletMarker } from "@/components/LeafletMarker/LeafletMarker";
import { LatLng } from "leaflet";
import Vehicle from "./Vehicle";
import { MapEntity } from "@/core/MapEntity"

export default class Base {
    name: string;
    position: LatLng;
    address: string;
    vehicles: Vehicle[] = [];
    marker: LeafletMarker;

    constructor(name: string, lat: number = 0, lng: number = 0, address: string) {
        this.name = name;
        this.position = new LatLng(lat, lng);
        this.address = address;
        this.marker = new LeafletMarker(MapEntity.BASE, this.position, false, '', true);
    }

    extractVehicle(vehicleToExtract: Vehicle) {
        const index = this.vehicles.findIndex((vehicle: Vehicle) => {
            if (vehicle === vehicleToExtract) {
                return true;
            }
        });
        this.vehicles.splice(index, 1); // returns array of removed items
        vehicleToExtract.extract();
    }

    showIsochrone(vehicleIndex: number = 0) {
        const samu = this.vehicles.find(vehicle => vehicle.type == 'SAMU');
        const svb = this.vehicles.find(vehicle => vehicle.type == 'SVB');

        if (samu) {
            samu.onClick();
        }
        if (svb) {
            svb.onClick();
        }

    }

}