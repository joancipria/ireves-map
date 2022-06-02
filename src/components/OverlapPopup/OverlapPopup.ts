import { Popup } from "leaflet";
import { i18n } from "@/i18n";
import { Overlap } from "../../core/Overlap";

export class OverlapPopup extends Popup {
    overlap: Overlap;

    constructor(overlap: Overlap) {
        super();
        this.overlap = overlap;
        this.setLoading();
    }

    setStats() {
        super.setContent(`
        <table class="table">
            <tbody>
                <tr>
                <th scope="row">${i18n("COVERED_POPULATION")}:</th>
                <td>${this.overlap.population || i18n("NOT_AVAILABLE_ERROR")}</td>
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
                <th scope="row">${i18n("COVERED_POPULATION")}:</th>
                <td>${i18n("LOADING")}</td>
                </tr>
            </tbody>
        </table>    
        `);
    }
}