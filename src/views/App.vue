<template>
  <NavBar @show-settings="showSettings"></NavBar>
  <CSVLoader @base-selected="onBaseSelected"></CSVLoader>
  <Settings ref="settings"></Settings>
  <BaseDetails ref="baseDetails" :base="selectedBase"></BaseDetails>
  <Leaflet-map></Leaflet-map>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import LeafletMap from "@/components/LeafletMap.vue"; // @ is an alias to /src
import CSVLoader from "@/components/CSVLoader.vue";
import BaseDetails from "@/components/BaseDetails.vue";
import NavBar from "@/components/NavBar.vue";
import Settings from "@/components/Settings.vue";
import Base from "@/core/Base";

@Options({
  components: {
    LeafletMap,
    CSVLoader,
    BaseDetails,
    NavBar,
    Settings,
  },
})
export default class App extends Vue {
  selectedBase: Base = null;

  declare $refs: {
    baseDetails: BaseDetails;
    settings: Settings;
  };

  onBaseSelected(base: Base) {
    this.selectedBase = base;
    this.$refs.baseDetails.show();
  }

  showSettings() {
    this.$refs.settings.show();
  }
}
</script>
<style scoped lang="scss">
</style>