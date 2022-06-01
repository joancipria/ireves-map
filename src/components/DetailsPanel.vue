<template>
  <div :class="{ open: visibility }" class="box details">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ title }}</p>
      <button @click="hide" class="delete" aria-label="close"></button>
    </header>
    <div class="content mt-5">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { eventEmitter } from "@/main";

@Options({
  props: {
    id: String,
    title: String,
  },
  data() {
    return {};
  },
})
export default class DetailsPanel extends Vue {
  title!: string;
  id!: string;
  visibility: boolean = false;
  loading: boolean = false;

  mounted() {
    eventEmitter.on("toggle-details", (target) => {
      if (target == this.id) {
        this.show();
      } else {
        //this.hide();
      }
    });
  }

  private show() {
    this.visibility = true;
  }

  private hide() {
    this.visibility = false;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.details {
  z-index: 10;
  position: fixed;
  left: -20%;
  height: 100%;
  width: 20%;
  transition: all ease-in-out 0.3s;

  header {
    background: #fff;
    padding: 10px;
  }
}

.open {
  transform: translate3d(100%, 0, 0);
  animation-timing-function: 1s ease-in;
  -webkit-box-shadow: -3px 0px 5px 0px rgba(0, 0, 0, 0.2);
  box-shadow: -3px 0px 5px 0px rgba(0, 0, 0, 0.2);
}

.box {
  border-top: 1px solid #dbdbdb;
  border-radius: 0px;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .details {
    left: -100%;
    width: 100%;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .details {
    left: -50%;
    width: 50%;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .details {
    left: -40%;
    width: 40%;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .details {
    left: -30%;
    width: 30%;
  }
}

/* Large devices (laptops/desktops, 1100px and up) */
@media only screen and (min-width: 1100px) {
  .details {
    left: -20%;
    width: 20%;
  }
}
</style>
