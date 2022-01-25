import CONFIG from '@/config'
import { leafletMap } from "@/main";
import { worldPop } from "@/services/worldpop.service";
import { Feature, center, polygon } from "@turf/turf";
import { GeoJSON, LatLngExpression } from "leaflet";
import { LeafletMarker } from "@/components/LeafletMarker/LeafletMarker";
import { OverlapPopup } from '@/components/OverlapPopup/OverlapPopup';
import { MapEntity } from "@/core/MapEntity"

export class Overlap {

    population: number;
    polygons: Feature[];
    overlapLayer: GeoJSON;
    marker: LeafletMarker;
    popup: OverlapPopup

    constructor(feature: Feature) {
        this.population = null;

        // Overlap can be composed of several polygons
        this.polygons = [];

        // If feature contains various polygons
        if (feature.geometry.type === 'MultiPolygon') {
            // push each polygon
            feature.geometry.coordinates.forEach((coord: any) => {
                this.polygons.push(polygon(coord));
            });

        } else {
            // push unique polygon
            this.polygons.push(feature);
        }

        // Create layer with overlapping polygon/s
        this.overlapLayer = new GeoJSON(feature, {
            style: {
                color: CONFIG.OVERLAP_COLOR // Color verde
            }
        });

        // Set marker coords as polygon/s ' center and convert to LatLngExpression reversing order. 
        // Why reverse? See https://github.com/Leaflet/Leaflet/issues/2495#issuecomment-36286272
        const markerCoords: LatLngExpression = center(feature).geometry.coordinates.reverse() as LatLngExpression;

        // Create marker
        this.marker = new LeafletMarker(MapEntity.OVERLAP, markerCoords, false, 'overlap-marker');

        // Set popup content
        this.popup = new OverlapPopup(this);
        this.marker.bindPopup(this.popup);

        // Bind on click event
        this.marker.on('click', () => {
            // Get population
            if (!this.population) {
                this.getPopulation();
            }
        });
    }

    async getPopulation(index: number = 0, estimacion: number = 0) {
        if (index >= this.polygons.length || isNaN(estimacion) || this.population) {
            return;
        }

        this.popup.setLoading();

        if (!this.polygons[index]) {
            index += 1;
        }

        const data = await worldPop.getPopulation(this.polygons[index].geometry);

        // TODO: Reutilizar mensaje error
        if (data.error) {
            console.error(data.error);
            this.popup.setStats();
            return;
        }

        // TODO: Esta parte del código para qué es?

        estimacion += data.total_population;

        if (index === this.polygons.length - 1) {
            this.population = Math.floor(estimacion);
            this.popup.setStats();
            return;
        }
        this.getPopulation(index + 1, estimacion);
    }


    hide() {
        if (leafletMap.map.hasLayer(this.overlapLayer)) {
            leafletMap.map.removeLayer(this.overlapLayer);
            leafletMap.map.removeLayer(this.marker);
        }
    }

    show() {
        if (!leafletMap.map.hasLayer(this.overlapLayer)) {
            this.overlapLayer.addTo(leafletMap.map);
            this.marker.addTo(leafletMap.map);
        }
    }
}