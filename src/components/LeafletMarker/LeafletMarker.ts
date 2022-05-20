
import CONFIG from "@/config";
import { Marker, LatLng, LatLngExpression, DivIcon, LayerGroup } from "leaflet";
import './LeafletMarker.css';
import { leafletMap } from "@/components/LeafletMap.vue";
import { MapEntity } from "@/core/MapEntity"

export class LeafletMarker extends Marker {

    added: boolean;

    constructor(entity: MapEntity, position: LatLng | LatLngExpression, draggable: boolean, customClass?: string, addToMap?: boolean, targetLayer?: LayerGroup) {

        // Create icon
        const icon = new DivIcon({
            html: `<img class="marker ${customClass}" src="${require(`@/assets/markers/${entity.toLowerCase()}_marker.png`)}">`,
            iconSize: [CONFIG.MARKER_SIZER, CONFIG.MARKER_SIZER],
            className: '',
        });

        // Create marker
        super(position, {
            icon: icon,
            draggable: draggable
        });

        // Set initial value
        this.added = false;

        // Add to map if specified
        if (addToMap) {
            setTimeout(() => this.addToMap(targetLayer), 0)
        }
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
