<template>
  <div class="modal" :class="{ 'is-active': modalActive }">
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
              <select>
                <option>{{ i18n.SPANISH }}</option>
                <option>{{ i18n.CATALAN }}</option>
                <option>{{ i18n.ENGLISH }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="field mt-5">
          <label class="label">SAMU {{ i18n.ISOCHRONE_TIME }}</label>
          <div class="control">
            <TimeController :group="VehicleType.SAMU"></TimeController>
          </div>
        </div>
        <div class="field mt-5">
          <label class="label">SVB {{ i18n.ISOCHRONE_TIME }}</label>
          <div class="control">
            <TimeController :group="VehicleType.SVB"></TimeController>
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
import { i18n } from "@/main";
import { VehicleType } from "@/core/VehicleProperties";

@Options({
  components: {
    TimeController,
  },
  data() {
    return {
      i18n: i18n,
      VehicleType: VehicleType,
    };
  },
  computed: {},
})
export default class Settings extends Vue {
  modalActive: boolean = false;

  show() {
    this.modalActive = true;
  }

  hide() {
    this.modalActive = false;
  }
}
</script>
<style scoped lang="scss">
.box {
  height: 50vh;
}
.modal-background {
  background-color: rgba(10, 10, 10, 0.6);
}
</style>