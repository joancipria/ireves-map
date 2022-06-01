<template>
  <div>
    <input
      type="range"
      min="1"
      max="30"
      step="1"
      v-model="time"
      @change="updateTime"
    />
    <p>{{ time }} {{ $t("MINUTES") }}</p>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { eventEmitter } from "@/main";
import { VehicleType, VehicleTime } from "@/core/Vehicle";

@Options({
  components: {},
  props: {
    group: String,
  },
  data() {
    return {
    };
  },
  computed: {},
})
export default class TimeController extends Vue {
  time: number = 0;
  group!: VehicleType;

  mounted() {
    this.time = VehicleTime[this.group];
  }

  updateTime() {
    eventEmitter.emit("timeChange", this.time, this.group);
  }
}
</script>
<style scoped lang="scss">
</style>