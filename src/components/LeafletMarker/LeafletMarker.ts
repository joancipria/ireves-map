
import CONFIG from "@/config";
import { Marker, LatLng, LatLngExpression, DivIcon, LayerGroup } from "leaflet";
import './LeafletMarker.css';
import { map } from "@/components/LeafletMap.vue";
import { MapEntity } from "@/core/MapEntity"

export class LeafletMarker extends Marker {

    added: boolean;
    loaded: boolean;

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
            this.bindTooltip(`${tooltipText.toString().replaceAll(',', ' - ')}`);
        }

        // Set initial value
        this.added = false;
        this.loaded = false;

        // Add to map if specified
        if (addToMap) {
            setTimeout(() => this.addToMap(targetLayer), 0)
        }

        // Update added on add/remove events
        this.on('add', () => {
            this.added = true;
        })

        this.on('remove', () => {
            this.added = false;
        })
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
            this.loaded = true;
        }
    }

    /*asyncAddTo(targetLayer?: LayerGroup) {
        return new Promise((resolve) => {
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
    }*/
}
