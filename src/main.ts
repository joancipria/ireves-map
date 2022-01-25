import { createApp } from 'vue'
import App from './App.vue'
import Vehicle from './core/Vehicle';
import './registerServiceWorker'
import router from './router'
import { EventEmitter} from 'events';

// Bulma 
import 'bulma/css/bulma.css'
import 'bulma-list/css/bulma-list.css'

// Font Awesome
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faAmbulance, faLayerGroup, faBicycle, faCar, faUpload, faHospitalSymbol, faSignOutAlt, faMapMarkerAlt, faUsers, faCog } from "@fortawesome/free-solid-svg-icons";
library.add(faAmbulance, faLayerGroup, faBicycle, faCar, faUpload, faHospitalSymbol, faSignOutAlt, faMapMarkerAlt, faUsers, faCog);
dom.watch();

// Global variables
export const vehicles: Vehicle[] = [];
export const vehicleOverlaps: any[][] = [];
export const leafletMap: any = { map: null };

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
