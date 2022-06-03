
import CONFIG from "@/config";
import { Marker, LatLng, LatLngExpression, DivIcon, LayerGroup } from "leaflet";
import './LeafletMarker.css';
import { map } from "@/components/LeafletMap.vue";
import { MapEntity } from "@/core/MapEntity"

export class LeafletMarker extends Marker {

    added: boolean;

    constructor(entity: MapEntity, position: LatLng | LatLngExpression, draggable: boolean, customClass?: string, addToMap?: boolean, targetLayer?: LayerGroup, tooltipText?: string | string[]) {

        // Create icon
        const icon = new DivIcon({
            html: `<img class="marker" src="${require(`@/assets/markers/${entity.toLowerCase()}_marker.png`)}">`,
            iconSize: [CONFIG.MARKER_SIZER, CONFIG.MARKER_SIZER],
            className: customClass,
        });

        // Create marker
        super(position, {
            icon: icon,
            draggable: draggable
        });

        // Add tooltip
        if (tooltipText) {
            this.bindTooltip(`<div class="list"><div class="list-item"><div class="list-item-content"><div class="list-item-title">${tooltipText.toString().replaceAll(',', ' - ')}</div></div></div></div>`);
        }

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
                //super.addTo(targetLayer)
                targetLayer.addLayer(this);
            } else {
                //super.addTo(map);
                map.addLayer(this);
            }
            this.added = true;
        }
    }

    asyncAddTo(targetLayer?: LayerGroup) {
        return new Promise((resolve, reject) => {
            if (targetLayer) {
                //super.addTo(targetLayer)
                targetLayer.addLayer(this);
            } else {
                //super.addTo(map);
                map.addLayer(this);
            }

            const resolver = setInterval(() => {
                if (this.getElement()) {
                    this.added = true;
                    clearInterval(resolver);
                    resolve(this.added);
                }
            })

        });
    }
}
