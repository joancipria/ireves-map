<template>
  <Notification></Notification>
  <NavBar
    @show-data-loader="showDataLoader"
    @show-settings="showSettings"
    @show-export="showExportPanel"
  ></NavBar>
  <FileLoader :mode="fileLoaderMode" ref="fileLoader" @base-selected="onBaseSelected"></FileLoader>
  <Settings ref="settings"></Settings>
  <BaseDetails ref="baseDetails" :base="selectedBase"></BaseDetails>
  <ExportPanel ref="exportPanel"></ExportPanel>
  <Leaflet-map></Leaflet-map>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import LeafletMap from "@/components/LeafletMap.vue"; // @ is an alias to /src
import FileLoader from "@/components/FileLoader.vue";
import BaseDetails from "@/components/BaseDetails.vue";
import ExportPanel from "@/components/ExportPanel.vue";
import NavBar from "@/components/NavBar.vue";
import Settings from "@/components/Settings.vue";
import Notification from "@/components/Notification.vue";
import Base from "@/core/Base";

@Options({
  components: {
    LeafletMap,
    FileLoader,
    BaseDetails,
    ExportPanel,
    NavBar,
    Settings,
    Notification
  },
})
export default class App extends Vue {
  selectedBase: Base = null;
  fileLoaderMode: boolean = true;

  declare $refs: {
    baseDetails: BaseDetails;
    settings: Settings;
    fileLoader: FileLoader;
    exportPanel: ExportPanel;
  };

  onBaseSelected(base: Base) {
    this.selectedBase = base;
    this.$refs.baseDetails.show();
    this.$refs.exportPanel.hide();
  }

  showSettings() {
    this.$refs.settings.show();
  }

  showExportPanel (){
    this.$refs.exportPanel.show();
    this.$refs.baseDetails.hide();
  }

  showDataLoader() {
    this.fileLoaderMode = false;
    this.$refs.fileLoader.show();
  }
}
</script>
<style scoped lang="scss">
</style>