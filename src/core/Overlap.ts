import CONFIG from '@/config'
import { layers, map } from "@/components/LeafletMap.vue";
import { popService } from "@/services/population.service";
import { Feature, center, polygon } from "@turf/turf";
import { GeoJSON, LatLngExpression } from "leaflet";
import { LeafletMarker } from "@/components/LeafletMarker/LeafletMarker";
import { OverlapPopup } from '@/components/OverlapPopup/OverlapPopup';
import { MapEntity } from "@/core/MapEntity"

export class Overlap {

    population: number;
    polygons: Feature[];
    feature: Feature;
    overlapLayer: GeoJSON;
    marker: LeafletMarker;
    popup: OverlapPopup

    constructor(feature: Feature) {
        this.feature = feature;
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

    async getPopulation() {
        this.popup.setLoading();

        const data = await popService.getPopulation(this.feature.geometry);

        // TODO: Reutilizar mensaje error
        if (data.error) {
            console.error(data.error);
            this.popup.setStats();
            return;
        }

        this.population = data.total_population;
        this.popup.setStats();

        return data.total_population;
    }


    hide() {
        if (map.hasLayer(this.overlapLayer)) {
            map.removeLayer(this.overlapLayer);
            map.removeLayer(this.marker);
        }
    }

    show() {
        if (!map.hasLayer(this.overlapLayer)) {
            this.overlapLayer.addTo(layers.overlaps);
            this.marker.addTo(layers.overlaps);
        }
    }
}