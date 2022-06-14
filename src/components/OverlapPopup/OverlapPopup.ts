import { Popup } from "leaflet";
import { i18n } from "@/i18n";
import { Overlap } from "../../core/Overlap";

export class OverlapPopup extends Popup {
    overlap: Overlap;

    constructor(overlap: Overlap) {
        super({ closeButton: false });
        this.overlap = overlap;
        this.setLoading();
    }

    setStats() {
        super.setContent(`<b>${i18n("COVERED_POPULATION")}:</b> ${this.overlap.population || i18n("NOT_AVAILABLE_ERROR")}`);
    }

    setLoading() {
        super.setContent(`<b>${i18n("COVERED_POPULATION")}:</b> ${i18n("LOADING")}`);
    }
}