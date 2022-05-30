<template>
  <SideBar :id="'newQuery'" :title="i18n.NEW_QUERY">
    <div class="content mt-5">
      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">{{ i18n.REGION }}</label>
            <div class="control">
              <div class="select">
                <select @change="filter" v-model="currentRegion">
                  <option value="Global">Global</option>
                  <option
                    v-for="region in regions"
                    :value="region"
                    :key="region"
                  >
                    {{ region }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="label">{{ i18n.FILTER }}</label>
            <div class="control">
              <label class="checkbox m-2">
                <input
                  type="checkbox"
                  v-model="currentTypes"
                  :value="BaseType.HOSPITAL"
                  @change="filter"
                />
                {{ i18n.HOSPITALS }}
              </label>

              <label class="checkbox m-2">
                <input
                  type="checkbox"
                  v-model="currentTypes"
                  :value="BaseType.HEALTH_CENTER"
                  @change="filter"
                />
                {{ i18n.HEALTH_CENTERS }}
              </label>

              <label class="checkbox m-2">
                <input
                  type="checkbox"
                  v-model="currentTypes"
                  :value="BaseType.OFFICE"
                  @change="filter"
                />
                {{ i18n.OFFICES }}
              </label>

              <label class="checkbox m-2">
                <input
                  type="checkbox"
                  v-model="currentTypes"
                  :value="BaseType.UNIT"
                  @change="filter"
                />
                {{ i18n.UNITS }}
              </label>
            </div>
          </div>

          <div class="field">
            <label class="label">SAMU {{ i18n.ISOCHRONE_TIME }}</label>
            <div class="control">
              <TimeController :group="VehicleType.SAMU"></TimeController>
            </div>
          </div>

          <div class="field">
            <label class="label">SVB {{ i18n.ISOCHRONE_TIME }}</label>
            <div class="control">
              <TimeController :group="VehicleType.SVB"></TimeController>
            </div>
          </div>

          <div class="field">
            <div class="control">
              <button @click="launchQuery" class="button is-success">
                Ejecutar consulta
              </button>
            </div>
          </div>

          <hr />
          <div v-if="finished">
            <b>Población total cubierta:</b>
            {{ this.totalPopulation.samu + this.totalPopulation.svb }}<br />
            <b>Población cubierta con SVB:</b> {{ this.totalPopulation.svb
            }}<br />
            <b>Población cubierta con SAMU:</b> {{ this.totalPopulation.samu
            }}<br />

            <br />

            <button @click="generateReport" class="button">
              <span class="icon">
                <i class="fas fa-file-download"></i>
              </span>
              <span>Generar informe</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </SideBar>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { i18n, bases } from "@/main";
import SideBar from "@/components/SideBar.vue";
import { layers, leafletMap } from "@/components/LeafletMap.vue";

import TimeController from "@/components/TimeController.vue";
import { VehicleType } from "@/core/Vehicle";
import Base, { BaseType } from "@/core/Base";
import { dataExport } from "@/core/DataExport";

@Options({
  props: {},
  data() {
    return {
      i18n: i18n,
      VehicleType: VehicleType,
      BaseType: BaseType,
      regions: String[""],
      currentTypes: ["HOSPITAL", "CENTRO", "CONSULTORIO", "UNIDAD"],
      currentRegion: "Global",
    };
  },
  components: {
    SideBar,
    TimeController,
  },
})
export default class NewQuery extends Vue {
  private regions: string[] = [
    "Alt Maestrat",
    "Alt Millars",
    "Alt Palància",
    "Baix Maestrat",
    "Baix Segura",
    "Camp de Morvedre",
    "Camp de Túria",
    "El Baix Vinalopo",
    "El Comtat",
    "Els Ports",
    "Els serrans",
    "Horta Nord",
    "Horta Oest",
    "Horta Sud",
    "L'Alacantí",
    "L'Alcalatén",
    "L'Alcoià",
    "La Canal de Navarrés",
    "La Costera",
    "La Foia de Bunyol",
    "La Marina Baixa",
    "La Plana d'Utiel-Requena",
    "La Safor",
    "La Vall d'Aiora",
    "La Vall d'Albaida",
    "L'Alt Vinalopó",
    "Marina Alta",
    "Plana Alta",
    "Plana Baixa",
    "Racó d'Ademús",
    "Ribera Alta",
    "Ribera Baixa",
    "València",
    "Vinalopó Mitjà",
  ];

  currentBases: Base[];
  currentTypes!: string[];
  currentRegion!: string;
  finished: boolean = false;
  totalPopulation = { samu: 0, svb: 0 };

  filter() {
    this.currentBases = [];

    layers.basesCluster.clearLayers();
    layers.isochrones.clearLayers();
    layers.overlaps.clearLayers();
    //layers.vehiclesCluster.clearLayers();

    bases.forEach((base: Base) => {
      if (base.region == this.currentRegion || this.currentRegion == "Global") {
        if (this.currentTypes.includes(base.type)) {
          this.currentBases.push(base);
          base.marker
            .asyncAddTo(layers.basesCluster)
            .then(() => base.updateMarker());
        }
      }
    });

    if (this.currentBases.length > 0 && this.currentRegion != "Global") {
      leafletMap.map.flyTo(this.currentBases[0].marker.getLatLng(), 11);
    }
  }

  launchQuery() {
    this.totalPopulation.samu = 0;
    this.totalPopulation.svb = 0;

    let counter = 0;

    if (this.currentBases && this.currentBases.length > 0) {
      this.currentBases.forEach(async (base) => {
        await base.showIsochrone();
        const pop = await base.getPopulation();
        this.totalPopulation.samu += pop.samu;
        this.totalPopulation.svb += pop.svb;
        counter++;

        if (counter == this.currentBases.length) {
          this.finished = true;
        }
      });
    }
  }

  generateReport(region: string) {
    dataExport.exportReport(
      this.currentRegion,
      this.totalPopulation.samu + this.totalPopulation.svb
    );
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
