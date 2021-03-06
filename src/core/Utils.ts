// Import Turf.js
import * as turf from '@turf/turf'
import { Coord, Feature, FeatureCollection, MultiPolygon, Polygon } from '@turf/turf';
import { LatLng } from 'leaflet';

class Utils {

    emptyPolygon: Feature<(Polygon | MultiPolygon)> = turf.polygon([], {});

    simplifyPoly(poly: FeatureCollection, isochroneTime: number) {
        return turf.simplify(poly, {
            tolerance: this.calcTolerance(isochroneTime),
            highQuality: true
        });
    }

    polyIntersect(polyA: Feature<Polygon | MultiPolygon>, polyB: Feature<Polygon | MultiPolygon>) {
        return turf.intersect(polyA, polyB);
    }

    union(polyA: Feature<Polygon | MultiPolygon>, polyB: Feature<Polygon | MultiPolygon>) {
        return turf.union(polyA, polyB)
    }

    difference(polyA: Feature<Polygon | MultiPolygon>, polyB: Feature<Polygon | MultiPolygon>) {
        return turf.difference(polyA, polyB)
    }

    latLngToCoord(coord: LatLng): Coord {
        return turf.point([coord.lng, coord.lat]);
    }

    coordToLatLng(coord: Coord): LatLng {
        return new LatLng(coord[1], coord[0])
    }

    distance(pointA: LatLng | Coord, pointB: LatLng | Coord): number {
        if (pointA instanceof LatLng) {
            pointA = this.latLngToCoord(pointA)
        }
        if (pointB instanceof LatLng) {
            pointB = this.latLngToCoord(pointB)
        }
        return turf.distance(pointA, pointB);
    }

    /**
     * Comprueba si existe solape entre isocronas y devuelve
     * un objeto Overlap / null
     * @param {Feature} polyA 
     * @returns interseccion
     */
    checkOverlap(polyA: Feature<Polygon | MultiPolygon>, polyB: Feature<Polygon | MultiPolygon>) {
        if (!polyA || !polyB) return;
        return this.polyIntersect(polyA, polyB);
    }

    // Calcula la tolerancia para la simplifciación del polígono en función del tiempo de isócrona actual del vehículo
    calcTolerance(isochroneTime: number) {
        // En esta función haremos un map
        // para calcular el parámetro "tolerance" de
        // simplificación del poligono

        // Tiempo min = 1 min
        // Tiempo max = 60 min
        // Tolerancia min = 0.001
        // Tolerancia max = 0.05
        const lowerTiempo = 1;
        const upperTiempo = 30;

        const lowerTolerance = 0.0002;
        const upperTolerance = 0.01;

        // Algoritmo:  [A, B] --> [a, b]
        // (valor - A) * (b - a)/(B - A) + a
        const segundoFactor = (upperTolerance - lowerTolerance) / (upperTiempo - lowerTiempo) + lowerTolerance;
        const tolerance = (isochroneTime - lowerTiempo) * segundoFactor;

        return tolerance;
    }
}

export const utils = new Utils();