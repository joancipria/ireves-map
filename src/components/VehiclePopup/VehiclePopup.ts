import { Popup } from "leaflet";
import Vehicle from "@/core/Vehicle";
import { i18n } from "@/i18n";

export class VehiclePopup extends Popup {
    vehicle: Vehicle;

    constructor(vehicle: Vehicle) {
        super();
        this.vehicle = vehicle;
        this.setLoading();
    }

    setStats() {
        super.setContent(`
        <table class="table">
            <tbody>
                <tr>
                <th scope="row">${i18n.NAME}:</th>
                <td>${this.vehicle.name}</td>
                </tr>
                <tr>
                <th scope="row">${i18n.AVAILABILITY}:</th>
                <td>${this.vehicle.availability}</td>
                </tr>
                <tr>
                <th scope="row">${i18n.COVERED_POPULATION}:</th>
                <td>${this.vehicle.population || i18n.NOT_AVAILABLE_ERROR}</td>
                </tr>
            </tbody>
        </table>    
        `);
    }

    setLoading() {
        super.setContent(`
        <table class="table">
            <tbody>
                <tr>
                <th scope="row">${i18n.NAME}:</th>
                <td>${this.vehicle.name}</td>
                </tr>
                <tr>
                <th scope="row">${i18n.AVAILABILITY}:</th>
                <td>${this.vehicle.availability}</td>
                </tr>
                <tr>
                <th scope="row">${i18n.COVERED_POPULATION}:</th>
                <td>${i18n.LOADING} ...</td>
                </tr>
            </tbody>
        </table>    
        `);
    }

    setError() {
        super.setContent(`
        <table class="table">
            <tbody>
                <tr>
                <th scope="row">${i18n.NAME}:</th>
                <td>${this.vehicle.name}</td>
                </tr>
                <tr>
                <th scope="row">${i18n.AVAILABILITY}:</th>
                <td>${this.vehicle.availability}</td>
                </tr>
                <tr>
                <th scope="row">${i18n.COVERED_POPULATION}:</th>
                <td>${i18n.NOT_AVAILABLE_ERROR}</td>
                </tr>
            </tbody>
        </table>    
        `);
    }
}