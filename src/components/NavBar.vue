<template>
  <nav class="navbar is-transparent">
    <div class="navbar-brand">
      <a class="navbar-item">
        <img
          src="../assets/ireves-logo.png"
          alt="iReves Map"
          width="112"
          height="28"
        />
      </a>
      <div class="navbar-burger" data-target="navbarExampleTransparentExample">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <div id="navbarExampleTransparentExample" class="navbar-menu">
      <div class="navbar-start">
        <!-- <a class="navbar-item" href="https://bulma.io/"> Home </a> -->
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link"> {{ i18n.DATA }} </a>
          <div class="navbar-dropdown">
            <a @click="showDataLoader" class="navbar-item">
              {{ i18n.LOAD_DATA }}
            </a>
            <a @click="showExport" class="navbar-item" href="#">{{ i18n.EXPORT }} </a>
            <!-- <a
              class="navbar-item"
              href="https://bulma.io/documentation/columns/basics/"
            >
              Columns
            </a>
            <a
              class="navbar-item"
              href="https://bulma.io/documentation/layout/container/"
            >
              Layout
            </a>
            <a
              class="navbar-item"
              href="https://bulma.io/documentation/form/general/"
            >
              Form
            </a>
            <hr class="navbar-divider" />
            <a
              class="navbar-item"
              href="https://bulma.io/documentation/elements/box/"
            >
              Elements
            </a>
            <a
              class="navbar-item is-active"
              href="https://bulma.io/documentation/components/breadcrumb/"
            >
              Components
            </a> -->
          </div>
        </div>
        <!-- <a class="navbar-item"> {{ i18n.ABOUT }} </a> -->
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="field is-grouped">
            <p class="control">
              <button @click="showSettings" class="button">
                <span class="icon">
                  <i class="fas fa-cog"></i>
                </span>
                <span>{{ i18n.SETTINGS }}</span>
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { i18n } from "@/main";

@Options({
  data() {
    return {
      i18n: i18n,
    };
  },
})
export default class NavBar extends Vue {
  showSettings() {
    this.$emit("showSettings");
  }

  showExport() {
    this.$emit("showExport");
  }

  showDataLoader() {
    this.$emit("showDataLoader");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
nav {
  height: 6vh;
}
div.navbar-brand .navbar-item {
  cursor: default;
}
</style>
