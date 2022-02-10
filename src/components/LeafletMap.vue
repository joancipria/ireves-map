<template>
  <div id="map"></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Control, LayerGroup, Map, TileLayer } from "leaflet";
import { leafletMap, layers } from "@/main";

import "leaflet/dist/leaflet.css";

@Options({
  components: {},
  data() {
    return {
      zoom: 10,
      mapOptions: {},
    };
  },
  computed: {},
})
export default class LeafletMap extends Vue {
  map!: Map;

  mounted() {
    const baseLayers = {
      Openstreet: new TileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ),
      Grayscale: new TileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
        { id: "mapbox/light-v9" }
      ),
      Streets: new TileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
        { id: "mapbox/streets-v11" }
      ),
    };

    this.map = new Map("map", {
      zoomControl: true,
      minZoom: 2,
      layers: [
        baseLayers.Openstreet,
        layers.availability.allDay,
        layers.availability.halfDay,
        layers.availability.halfDayNight,
        layers.bases,
      ],
      attributionControl: false,
    });

    let overlayMaps = {
      "12H": layers.availability.halfDay,
      "12H (Nocturnas)": layers.availability.halfDayNight,
      "24H": layers.availability.allDay,
    };

    const layersControl = new Control.Layers(baseLayers, overlayMaps, {
      position: "topleft",
    }).addTo(this.map);

    this.map.zoomControl.setPosition("bottomleft");
    this.map.setView([39, -0.6], 10);
    leafletMap.map = this.map;
  }
}
</script>
<style scoped lang="scss">
#map {
  width: 100vw;
  height: 94vh;
  z-index: 0;
}
</style>