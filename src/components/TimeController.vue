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
    <p>{{ time }} {{minutes}}</p>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { eventEmitter } from "@/main";
import { i18n } from "@/main";

@Options({
  components: {},
  props: {
    group: String,
  },
  data() {
    return {
      minutes: i18n.MINUTES,
    };
  },
  computed: {},
})
export default class TimeController extends Vue {
  time: number = 10;
  group!: string;

  mounted() {
    this.updateTime();
  }

  updateTime() {
    eventEmitter.emit("timeChange", this.time, this.group);
  }
}
</script>
<style scoped lang="scss">
</style>