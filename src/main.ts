import { createApp } from 'vue'
import App from './App.vue'
import Vehicle from '@/core/Vehicle';
import Base from '@/core/Base';
import './registerServiceWorker'
import router from './router'
import { EventEmitter } from 'events';

// Bulma 
import 'bulma/css/bulma.css'
import 'bulma-list/css/bulma-list.css'

// Font Awesome
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faAmbulance, faLayerGroup, faBicycle, faCar, faUpload, faHospitalSymbol, faSignOutAlt, faMapMarkerAlt, faUsers, faCog } from "@fortawesome/free-solid-svg-icons";
import { LayerGroup } from 'leaflet';
library.add(faAmbulance, faLayerGroup, faBicycle, faCar, faUpload, faHospitalSymbol, faSignOutAlt, faMapMarkerAlt, faUsers, faCog);
dom.watch();

// Global variables
export const leafletMap: any = { map: null };
export let bases: Base[] = [];
export let vehicles: Vehicle[] = [];

export const vehicleOverlaps: any[] = [];
export const globalOverlap: any = { feature: null, overlap: null }

export const layers = {
    availability: {
        allDay: new LayerGroup(),
        halfDay: new LayerGroup(),
        halfDayNight: new LayerGroup()
    },
    bases: new LayerGroup()
};

export const eventEmitter = new EventEmitter();

// Import locale strings
let localeFile;
try {
    localeFile = require('./i18n/' + navigator.language + '.json')
} catch {
    localeFile = require('./i18n/en-US.json');
}
export const i18n = localeFile;

createApp(App).use(router).mount('#app')


export const reset = () => {
    // Remove base markers
    layers.bases.clearLayers();

    // Remove vehicles markers
    vehicles.forEach((vehicle: Vehicle) => {
        vehicle.toggleIsochrone(false);
        vehicle.marker.remove();
    })

    // Reset global overlap
    if(globalOverlap.overlap){
        globalOverlap.overlap.hide();
        globalOverlap.feature = null;
        globalOverlap.overlap = null;
    }

    // Clear data
    bases = [];
    vehicles = [];

}