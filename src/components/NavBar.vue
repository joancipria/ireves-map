<template>
  <nav class="navbar is-transparent">
    <div class="navbar-brand">
      <a class="navbar-item">
        <img
          src="/img/reves-map-logo.png"
          alt="iReves Map"
          width="112"
          height="28"
          draggable="false"
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
          <a class="navbar-link"> {{ $t("DATA") }} </a>
          <div class="navbar-dropdown">
            <a @click="showDataLoader" class="navbar-item">
              <span class="icon">
                <i class="fas fa-upload" aria-hidden="true"></i>
              </span>
              {{ $t("LOAD_DATA") }}
            </a>
            <a
              @click="toggleSidebar('exportPanel')"
              class="navbar-item"
              href="#"
            >
              <span class="icon">
                <i class="fas fa-file-export" aria-hidden="true"></i>
              </span>
              {{ $t("LOAD_DATA") }}
            </a>
          </div>
        </div>

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link"> {{ $t("QUERIES") }} </a>
          <div class="navbar-dropdown">
            <a @click="toggleSidebar('newQuery')" class="navbar-item">
              <span class="icon">
                <i class="fas fa-search" aria-hidden="true"></i>
              </span>
              {{ $t("NEW_QUERY") }}
            </a>
            <!-- <a @click="showExport" class="navbar-item" href="#">{{ $t("SAVED_QUERIES") }} </a> -->
          </div>
        </div>
        <!-- <a class="navbar-item"> {{ $t("ABOUT") }} </a> -->
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="field is-grouped">
            <p class="control">
              <button @click="showSettings" class="button">
                <span class="icon">
                  <i class="fas fa-cog"></i>
                </span>
                <span>{{ $t("SETTINGS") }}</span>
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
import { eventEmitter} from "@/main";

@Options({
  data() {
    return {
    };
  },
})
export default class NavBar extends Vue {
  showSettings() {
    this.$emit("showSettings");
  }

  showDataLoader() {
    this.$emit("showDataLoader");
  }

  toggleSidebar(target: string) {
    eventEmitter.emit("toggle-sidebar", target);
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
.navbar-dropdown .icon {
  margin-right: 0;
}
</style>
