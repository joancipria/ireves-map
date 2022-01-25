<template>
  <div id="map"></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Map, TileLayer } from "leaflet";
import { leafletMap } from "@/main";

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
    let baseLayers = {
      Base: new TileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      ),
    };

    this.map = new Map("map", {
      zoomControl: true,
      minZoom: 2,
      layers: [baseLayers["Base"]],
      attributionControl: false,
    });
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