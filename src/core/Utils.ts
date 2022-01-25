// Import Turf.js
import * as turf from '@turf/turf'
import { Feature, FeatureCollection } from '@turf/turf';

class Utils {

    simplifyPoly(poly: FeatureCollection, isochroneTime: number) {
        return turf.simplify(poly, {
            tolerance: this.calcTolerance(isochroneTime),
            highQuality: true
        });
    }

    // TODO: tipar
    polyIntersect(polyA: any, polyB: any) {
        return turf.intersect(polyA, polyB);
    }

    /**
     * Comprueba si existe solape entre isocronas y devuelve
     * un objeto Overlap / null
     * @param {Feature} polyA 
     * @returns interseccion
     */
    checkOverlap(polyA: Feature, polyB: Feature) {
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