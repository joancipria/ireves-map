<template>
  <div id="map"></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { settings } from "@/core/Settings";

// Leaflet
import "leaflet/dist/leaflet.css";
import {
  LayerGroup,
  DivIcon,
  LatLng,
  Map,
  TileLayer,
  LatLngBounds,
} from "leaflet";

// Marker Cluster. See https://github.com/Leaflet/Leaflet.markercluster/issues/874 & https://stackoverflow.com/questions/69477915/leaflet-litelement-l-is-not-defined-in-plugin
import { MarkerClusterGroup } from "leaflet.markercluster/src";

// Leaflet Map
export let map: Map;

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
  mounted() {
    // Map bounds
    const bounds = new LatLngBounds(
      new LatLng(44.638612045930095, -13.782874547541086),
      new LatLng(33.37482804543294, 11.521634438365721)
    );

    map = new Map("map", {
      preferCanvas: true,
      zoomControl: true,
      minZoom: 6,
      touchZoom: true,
      tap: true,
      doubleClickZoom: false,
      layers: [
        layers[settings.baseMap] || layers.openstreet,
        layers.vehiclesCluster,
        layers.basesCluster,
        layers.isochrones,
        layers.overlaps,
      ],
      attributionControl: false,
      maxBounds: bounds, // Set the map's geographical boundaries.
    });

    // Add zoom control
    map.zoomControl.setPosition("bottomleft");

    // Set view in CV
    const initialPosition = new LatLng(39.47482213445976, -0.3747370894871375);
    map.setView(initialPosition, 8);
    map.panTo(initialPosition);
    //leafletMap.map = this.map;
  }
}

// Map layers
export const layers = {
  openstreet: new TileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  ),
  grayscale: new TileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
    { id: "mapbox/light-v9" }
  ),
  streets: new TileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
    { id: "mapbox/streets-v11" }
  ),
  isochrones: new LayerGroup(),
  overlaps: new LayerGroup(),
  vehiclesCluster: new MarkerClusterGroup({
    chunkedLoading: true,
    showCoverageOnHover: false,
    iconCreateFunction: (cluster) => {
      return new DivIcon({
        html: `<div>${cluster.getChildCount()}</div>`,
        className: "vehicle-cluster-marker cluster-marker",
      });
    },
  }),
  basesCluster: new MarkerClusterGroup({
    chunkedLoading: true,
    showCoverageOnHover: false,
    iconCreateFunction: (cluster) => {
      return new DivIcon({
        html: `<div>${cluster.getChildCount()}</div>`,
        className: "base-cluster-marker cluster-marker",
      });
    },
  }),
};
</script>
<style scoped lang="scss">
#map {
  width: 100vw;
  height: 94vh;
  z-index: 0;
}
</style>