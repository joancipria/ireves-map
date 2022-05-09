<template>
  <div class="modal" :class="{ 'is-active': visibility }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ i18n.SETTINGS }}</p>
        <button @click="hide" class="delete" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">{{ i18n.LANGUAGE }}</label>
          <div class="control">
            <div class="select">
              <select @change="setLanguage" v-model="currentLanguage">
                <option value="es-ES">{{ i18n.SPANISH }}</option>
                <option value="ca">{{ i18n.CATALAN }}</option>
                <option value="en-US">{{ i18n.ENGLISH }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="label">{{ i18n.BASE_MAP }}</label>
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
            {{ i18n.SAVE_CHANGES }}
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import TimeController from "@/components/TimeController.vue";
import { i18n, language } from "@/main";
import { VehicleType } from "@/core/Vehicle";
import { leafletMap, layers } from "@/components/LeafletMap.vue";

@Options({
  components: {
    TimeController,
  },
  data() {
    return {
      i18n: i18n,
      VehicleType: VehicleType,
      currentBaseLayer: "openstreet",
      currentLanguage: language,
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