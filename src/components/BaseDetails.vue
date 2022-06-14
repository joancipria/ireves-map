<template>
  <DetailsPanel :id="'baseDetails'" :title="$t('BASE_DETAILS')">
    <div v-if="base" class="content mt-5">
      <div class="columns">
        <div class="column">
          <img class="base-image" src="@/assets/base.svg" alt="" />
        </div>
        <div class="column is-two-thirds">
          <div class="column">
            <p>{{ base.name }}</p>
          </div>
          <div class="column">
            <p>
              <i class="fas fa-map-marker-alt has-text-danger"></i>
              {{ base.address }}
            </p>
          </div>
        </div>
      </div>
      <div class="columns">
        <!-- <div class="column">
          <h1 class="title is-5">Covered population</h1>
          <i class="fas fa-users"></i>
        </div> -->
      </div>
      <div class="columns">
        <div class="column">
          <br />
          <h1 class="title is-5">{{ $t("AVAILABLE_AMBULANCES") }}</h1>
          <div
            v-for="vehicle of base.vehicles"
            :key="vehicle.id"
          >
            <div class="columns">
              <div class="column">
                <figure class="image is-48x48">
                  <img
                    v-if="vehicle.type == VehicleType.SAMU"
                    class="is-rounded"
                    src="@/assets/samu.png"
                  />
                  <img v-else class="is-rounded" src="@/assets/svb.png" />
                </figure>
              </div>
              <div class="column">
                {{ vehicle.name }}
                <div class="tag is-rounded">
                  <span style="margin-right: 1px" class="icon"
                    ><i class="fas fa-clock"></i
                  ></span>
                  {{ vehicle.availability }}
                </div>
              </div>
              <div class="column">
                <button @click="extractVehicle(vehicle.id)" class="button">
                  <span class="icon is-small">
                    <i class="fas fa-sign-out-alt"></i>
                  </span>
                  <span>{{ $t("EXTRACT") }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DetailsPanel>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import DetailsPanel from "@/components/DetailsPanel.vue";

import Base from "@/core/Base";
import { VehicleType } from "@/core/Vehicle";

@Options({
  props: {
    base: Base,
  },
  data() {
    return {
      VehicleType: VehicleType,
    };
  },
  components: {
    DetailsPanel,
  },
})
export default class BaseDetails extends Vue {
  base!: Base;

  extractVehicle(vehicleID: string) {
    this.base.extractVehicle(vehicleID);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.tag {
  margin: 3px;
}
</style>
