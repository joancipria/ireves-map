
import CONFIG from "@/config";
import { Marker, LatLng, LatLngExpression, DivIcon, LayerGroup } from "leaflet";
import './LeafletMarker.css';
import { leafletMap } from "@/main";
import { MapEntity } from "@/core/MapEntity"

export class LeafletMarker extends Marker {

    added: boolean;

    constructor(entity: MapEntity, position: LatLng | LatLngExpression, draggable: boolean, customClass?: string, addToMap?: boolean, targetLayer?: LayerGroup) {

        const icon = new DivIcon({
            html: `<img class="marker ${customClass}" src="${require(`@/assets/markers/${entity.toLowerCase()}_marker.png`)}">`,
            iconSize: [CONFIG.MARKER_SIZER, CONFIG.MARKER_SIZER],
            className: '',
        });

        super(position, {
            icon: icon,
            draggable: draggable
        });
        if (addToMap) {
            this.addToMap(targetLayer);
        }
        this.added = false;
    }

    addToMap(targetLayer?: LayerGroup) {
        if (!this.added) {
            if (targetLayer) {
                super.addTo(targetLayer)
            } else {
                super.addTo(leafletMap.map);
            }
            this.added = true;
        }
    }
}
