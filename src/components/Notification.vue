<template>
  <div
    :class="{ open: visibility, close: !visibility }"
    class="notification is-danger"
  >
    <button @click="hide" class="delete"></button>
    {{ message }}
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { i18n, eventEmitter } from "@/main";

@Options({
  data() {
    return {
      i18n: i18n,
    };
  },
})
export default class Notification extends Vue {
  visibility: boolean = false;
  message: string;

  mounted() {
    eventEmitter.on("notification", this.show);
  }

  show(message: string) {
    this.message = message;
    this.visibility = true;
  }

  hide() {
    this.visibility = false;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.notification {
  width: 15%;
  position: absolute;
  top: 7%;
  right: 2%;
  z-index: 9;
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
    0 0 0 1px rgba(10, 10, 10, 0.02);
}

.open {
  opacity: 100%;
  transition: opacity 0.5s;
}
.close {
  opacity: 0%;
  transition: opacity 0.5s;
}

@media only screen and (max-width: 600px) {
  .notification {
    width: 60%;
  }
}

@media only screen and (max-width: 1000px) {
  .notification {
    width: 40%;
  }
}
</style>
