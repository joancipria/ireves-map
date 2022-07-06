<template>
  <SideBar :id="'newQuery'" :title="$t('NEW_QUERY')">
    <div class="content mt-5">
      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">{{ $t("REGION") }}</label>
            <div class="control">
              <div class="select">
                <select @change="filter" v-model="currentRegion">
                  <option value="0">Global</option>
                  <option
                    v-for="region in query.regions"
                    :value="region.id"
                    :key="region.id"
                  >
                    {{ region.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="label">{{ $t("FILTER") }}</label>
            <div class="control">
              <label class="checkbox m-2">
                <input
                  type="checkbox"
                  v-model="currentTypes"
                  :value="BaseType.HOSPITAL"
                  @change="filter"
                />
                {{ $t("HOSPITALS") }}
              </label>

              <label class="checkbox m-2">
                <input
                  type="checkbox"
                  v-model="currentTypes"
                  :value="BaseType.HEALTH_CENTER"
                  @change="filter"
                />
                {{ $t("HEALTH_CENTERS") }}
              </label>

              <label class="checkbox m-2">
                <input
                  type="checkbox"
                  v-model="currentTypes"
                  :value="BaseType.OFFICE"
                  @change="filter"
                />
                {{ $t("OFFICES") }}
              </label>

              <label class="checkbox m-2">
                <input
                  type="checkbox"
                  v-model="currentTypes"
                  :value="BaseType.UNIT"
                  @change="filter"
                />
                {{ $t("UNITS") }}
              </label>
            </div>
          </div>

          <div class="field">
            <label class="label">SAMU {{ $t("ISOCHRONE_TIME") }}</label>
            <div class="control">
              <TimeController :group="VehicleType.SAMU"></TimeController>
            </div>
          </div>

          <div class="field">
            <label class="label">SVB {{ $t("ISOCHRONE_TIME") }}</label>
            <div class="control">
              <TimeController :group="VehicleType.SVB"></TimeController>
            </div>
          </div>

          <div class="field">
            <div class="control">
              <button @click="launchQuery" class="button is-success">
                {{ $t("LAUNCH_QUERY") }}
              </button>
            </div>
          </div>

          <div class="field">
            <div class="control">
              <button @click="loadModel" class="button">Cargar modelo</button>
            </div>
          </div>

          <hr />
          <div v-if="finished">
            <b>{{ $t("COVERED_POPULATION") }}:</b>
            {{ this.totalPopulation.total.per }}% ({{
              this.totalPopulation.total.raw
            }})<br />
            <b>{{ $t("COVERED_POPULATION") }} SVB:</b>
            {{ this.totalPopulation.svb.per }}% ({{
              this.totalPopulation.svb.raw
            }})<br />
            <b>{{ $t("COVERED_POPULATION") }} SAMU:</b>
            {{ this.totalPopulation.samu.per }}% ({{
              this.totalPopulation.samu.raw
            }})<br />

            <br />

            <button @click="generateReport" class="button">
              <span class="icon">
                <i class="fas fa-file-download"></i>
              </span>
              <span> {{ $t("GENERATE_REPORT") }} </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </SideBar>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import SideBar from "@/components/SideBar.vue";

import TimeController from "@/components/TimeController.vue";
import { VehicleType } from "@/core/Vehicle";
import { BaseType } from "@/core/Base";
import { dataExport } from "@/core/DataExport";
import { loadModel } from "@/core/DataLoader";
import { query } from "@/core/Query";

@Options({
  props: {},
  data() {
    return {
      query: query,
      VehicleType: VehicleType,
      BaseType: BaseType,
      currentTypes: ["HOSPITAL", "CENTRO", "CONSULTORIO", "UNIDAD"],
      currentRegion: 0,
    };
  },
  components: {
    SideBar,
    TimeController,
  },
})
export default class NewQuery extends Vue {
  currentTypes!: string[]; // Current selected types
  currentRegion!: number; // Current selected region
  finished: boolean = false; // Finished query flag
  totalPopulation = {
    samu: { raw: 0, per: 0 },
    svb: { raw: 0, per: 0 },
    total: { raw: 0, per: 0 },
  };

  generateReport() {
    dataExport.exportReport(
      query.regions[this.currentRegion - 1].name,
      this.totalPopulation.total.per
    );
  }

  filter() {
    query.filter(this.currentRegion, this.currentTypes);
  }

  async launchQuery() {
    this.finished = false;
    this.totalPopulation = await query.query();
    this.finished = true;
  }

  loadModel() {
    loadModel();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
