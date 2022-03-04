<template>
  <div id="map"></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Control, LatLng, LayerGroup, Map, TileLayer } from "leaflet";
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

    const bounds: any = [
      new LatLng(44.638612045930095, -13.782874547541086),
      new LatLng(33.37482804543294, 11.521634438365721),
    ];

    this.map = new Map("map", {
      zoomControl: true,
      minZoom: 6,
      layers: [
        baseLayers.Openstreet,
        layers.availability.allDay,
        layers.availability.halfDay,
        layers.availability.halfDayNight,
        layers.bases,
      ],
      attributionControl: false,
      maxBounds: bounds, // Set the map's geographical boundaries.
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
    this.map.setView([39.47482213445976, -0.3747370894871375], 8);
    this.map.panTo(new LatLng(39.47482213445976, -0.3747370894871375));
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