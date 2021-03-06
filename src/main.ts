import { createApp } from 'vue'
import App from './App.vue'
import Vehicle from '@/core/Vehicle';
import Base from '@/core/Base';
import './registerServiceWorker'
import router from './router'
import { EventEmitter } from 'events';

// Vue-i18n translation plugin
import { vuei18n } from './i18n';

// Leaflet layers
import { layers } from "@/components/LeafletMap.vue"

// Bulma 
import 'bulma/css/bulma.css'
import 'bulma-list/css/bulma-list.css'

// Font Awesome
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faAmbulance, faLayerGroup, faBicycle, faCar, faUpload, faHospitalSymbol, faSignOutAlt, faMapMarkerAlt, faUsers, faCog, faClock, faFileDownload, faFileExport, faSearch } from "@fortawesome/free-solid-svg-icons";
library.add(faAmbulance, faLayerGroup, faBicycle, faCar, faUpload, faHospitalSymbol, faSignOutAlt, faMapMarkerAlt, faUsers, faCog, faClock, faFileDownload, faFileExport, faSearch);
dom.watch();

// Global variables
export let bases: Base[] = [];
export let vehicles: Vehicle[] = [];
export let dragging: any = { vehicle: null, base: false };

export let vehicleOverlaps: any[] = [];
export let globalOverlap: any = { feature: null, overlap: null }

// Global events
export const eventEmitter = new EventEmitter();

createApp(App).use(router).use(vuei18n).mount('#app')

export function reset(): void {
    // Remove all markers & overlaps
    layers.basesCluster.clearLayers();
    layers.vehiclesCluster.clearLayers();
    layers.isochrones.clearLayers();
    layers.overlaps.clearLayers();

    // Clear data
    bases = [];
    vehicles = [];
    vehicleOverlaps = [];
    globalOverlap = [];
    dragging = { vehicle: null, base: false }
}