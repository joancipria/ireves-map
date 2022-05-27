import { createApp } from 'vue'
import App from './App.vue'
import Vehicle from '@/core/Vehicle';
import Base from '@/core/Base';
import './registerServiceWorker'
import router from './router'
import { EventEmitter } from 'events';

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

// Import locale strings
export let language = navigator.language;
let localeFile;
try {
    localeFile = require('./i18n/' + language + '.json')
} catch {
    localeFile = require('./i18n/en-US.json');
    language = "en-US";
}
export const i18n = localeFile;

createApp(App).use(router).mount('#app')


export const reset = (): void => {
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