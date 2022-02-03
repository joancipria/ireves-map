<template>
  <div :class="{ open: base && visibility }" class="box details">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ i18n.BASE_DETAILS }}</p>
      <button @click="hide" class="delete" aria-label="close"></button>
    </header>
    <div v-if="base" class="content mt-5">
      <div class="columns">
        <div class="colum">
          <img src="@/assets/base.svg" alt="" />
        </div>
        <div class="column">
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
          <h1 class="title is-5">{{ i18n.AVAILABLE_AMBULANCES }}</h1>
          <div class="list has-visible-pointer-controls">
            <div
              v-for="vehicle of base.vehicles"
              :key="vehicle.id"
              class="list-item"
            >
              <div class="list-item-image">
                <figure class="image is-64x64">
                  <img
                    v-if="vehicle.type == VehicleType.SAMU"
                    class="is-rounded"
                    src="@/assets/samu.png"
                  />
                  <img v-else class="is-rounded" src="@/assets/svb.png" />
                </figure>
              </div>

              <div class="list-item-content">
                <div class="list-item-title">{{ vehicle.name }}</div>
                <div class="list-item-description">
                  <div class="tag is-rounded">
                    {{ vehicle.type }}
                  </div>

                  <div class="tag is-rounded">
                    {{ vehicle.availability }}
                  </div>
                </div>
              </div>
              <div class="list-item-controls">
                <div class="buttons is-right">
                  <button @click="extractVehicle(vehicle)" class="button">
                    <span class="icon is-small">
                      <i class="fas fa-sign-out-alt"></i>
                    </span>
                    <span>{{ i18n.EXTRACT }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Base from "@/core/Base";
import Vehicle from "@/core/Vehicle";
import { i18n } from "@/main";
import { VehicleType } from "@/core/VehicleProperties";

@Options({
  props: {
    base: Base,
  },
  data() {
    return {
      i18n: i18n,
      VehicleType: VehicleType,
    };
  },
})
export default class BaseDetails extends Vue {
  visibility: boolean = false;
  base!: Base;

  show() {
    this.visibility = true;
  }

  hide() {
    this.visibility = false;
  }

  extractVehicle(vehicle: Vehicle) {
    this.base.extractVehicle(vehicle);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.details {
  z-index: 10;
  position: fixed;
  right: -30%;
  height: 100%;
  width: 30%;
  -webkit-box-shadow: -3px 0px 5px 0px rgba(0, 0, 0, 0.2);
  box-shadow: -3px 0px 5px 0px rgba(0, 0, 0, 0.2);
  transition: all ease-in-out 0.3s;

  header {
    background: #fff;
    padding: 10px;
  }
}
.open {
  transform: translate3d(-100%, 0, 0);
  animation-timing-function: 1s ease-in;
}
.box {
  border-top: 1px solid #dbdbdb;
  border-radius: 0px;
}
.tag {
  margin-right: 2px;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .details {
    right: -100%;
    width: 100%;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .details {
    right: -60%;
    width: 60%;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .details {
    right: -50%;
    width: 50%;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .details {
    right: -40%;
    width: 40%;
  }
}

/* Large devices (laptops/desktops, 1100px and up) */
@media only screen and (min-width: 1100px) {
  .details {
    right: -30%;
    width: 30%;
  }
}
</style>
