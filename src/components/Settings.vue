<template>
  <div class="modal" :class="{ 'is-active': visibility }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ $t("SETTINGS") }}</p>
        <button @click="hide" class="delete" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">{{ $t("LANGUAGE") }}</label>
          <div class="control">
            <div class="select">
              <select @change="setLanguage" v-model="currentLanguage">
                <option value="es-ES">{{ $t("SPANISH") }}</option>
                <option value="ca">{{ $t("CATALAN") }}</option>
                <option value="en-US">{{ $t("ENGLISH") }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="label">{{ $t("BASE_MAP") }}</label>
          <div class="control">
            <div class="select">
              <select @change="changeBaseLayer" v-model="currentBaseLayer">
                <option value="openstreet">Openstreet</option>
                <option value="grayscale">Grayscale</option>
                <option value="streets">Streets</option>
              </select>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons is-right">
          <button @click="hide" class="button is-success">
            {{ $t("SAVE_CHANGES") }}
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import TimeController from "@/components/TimeController.vue";
import { locale } from "@/i18n";
import { VehicleType } from "@/core/Vehicle";
import { leafletMap, layers } from "@/components/LeafletMap.vue";

@Options({
  components: {
    TimeController,
  },
  data() {
    return {
      VehicleType: VehicleType,
      currentBaseLayer: "openstreet",
      currentLanguage: locale,
    };
  },
  computed: {},
})
export default class Settings extends Vue {
  visibility: boolean = false;

  currentBaseLayer!: string;
  currentLanguage!: string;

  show() {
    this.visibility = true;
  }

  hide() {
    this.visibility = false;
  }

  changeBaseLayer() {
    leafletMap.map.removeLayer(layers.openstreet);
    leafletMap.map.removeLayer(layers.grayscale);
    leafletMap.map.removeLayer(layers.streets);
    leafletMap.map.addLayer(layers[this.currentBaseLayer]);
  }

  setLanguage() {
    //
  }
}
</script>
<style scoped lang="scss">
.modal-background {
  background-color: rgba(10, 10, 10, 0.6);
}
</style>