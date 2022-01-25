
import CONFIG from "@/config";
import { Marker, LatLng, LatLngExpression, DivIcon } from "leaflet";
import './LeafletMarker.css';
import { leafletMap } from "@/main";

export class LeafletMarker extends Marker {

    added: boolean;

    constructor(entity: string, position: LatLng | LatLngExpression, draggable: boolean, customClass?: string, addToMap?: boolean) {

        const icon = new DivIcon({
            html: `<img class="marker ${customClass}" src="${require(`@/assets/${entity.toLowerCase()}_marker.png`)}">`,
            iconSize: [CONFIG.MARKER_SIZER, CONFIG.MARKER_SIZER],
            className: '',
        });

        super(position, {
            icon: icon,
            draggable: draggable
        });
        if (addToMap) {
            this.addToMap();
        }
    }

    addToMap() {
        if (!this.added) {
            super.addTo(leafletMap.map);
            this.added = true;
        }
    }
}
