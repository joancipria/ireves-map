// Import Turf.js
import * as turf from '@turf/turf'
import { Coord, Feature, FeatureCollection, MultiPolygon, Polygon } from '@turf/turf';
import { LatLng } from 'leaflet';

class Utils {

    percentage(partialValue: number, totalValue: number, decimals: number) {
        return parseFloat(((100 * partialValue) / totalValue).toFixed(decimals)) || 0;
    }

    emptyPolygon: Feature<(Polygon | MultiPolygon)> = turf.polygon([], {});

    latLngToCoord(coord: LatLng): Coord {
        return turf.point([coord.lng, coord.lat]);
    }

    coordToLatLng(coord: Coord): LatLng {
        return new LatLng(coord[1], coord[0])
    }

    intersect = turf.intersect;
    union = turf.union;
    difference = turf.difference;

    distance(pointA: LatLng | Coord, pointB: LatLng | Coord): number {
        if (pointA instanceof LatLng) {
            pointA = this.latLngToCoord(pointA)
        }
        if (pointB instanceof LatLng) {
            pointB = this.latLngToCoord(pointB)
        }
        return turf.distance(pointA, pointB);
    }
}

export const utils = new Utils();