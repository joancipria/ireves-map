<template>
  <div class="modal" :class="{ 'is-active': visibility }">
    <div
      :class="{ 'custom-modal-background': !mode }"
      class="modal-background"
    ></div>
    <div :class="{ 'modal-content': mode, 'modal-card': mode == false }">
      <header v-if="!mode" class="modal-card-head">
        <p class="modal-card-title">{{ $t("LOAD_DATA") }}</p>
        <button @click="hide" class="delete" aria-label="close"></button>
      </header>
      <div v-if="mode" :class="{ box: mode }">
        <h1 class="title">{{ $t("WELCOME_MESSAGE") }}</h1>
        <h2 class="subtitle">{{ $t("WELCOME_INSTRUCTIONS") }}</h2>
        <div class="drag-area">
          <div class="file is-centered">
            <label v-if="!loading" class="file-label">
              <input
                @change="load"
                class="file-input"
                type="file"
                name="resume"
              />
              <span class="file-cta">
                <span class="file-icon">
                  <i class="fas fa-upload"></i>
                </span>
                <span class="file-label">{{ $t("BROWSE_FILE") }}</span>
              </span>
            </label>
            <div class="loading-box" v-else>
              <progress class="progress is-small is-primary" max="100">
                15%
              </progress>
              <h5 class="title is-6" style="">{{ $t("LOADING") }}...</h5>
            </div>
          </div>
        </div>
        <br />
        <p>
          {{ $t("NO_DATA") }}
          <a @click="load">{{ $t("TRY_DEMO") }}</a>
        </p>
      </div>

      <section v-if="!mode" class="modal-card-body">
        <h2 class="subtitle">{{ $t("WELCOME_INSTRUCTIONS") }}</h2>
        <div class="drag-area">
          <div class="file is-centered">
            <label v-if="!loading" class="file-label">
              <input
                @change="load"
                class="file-input"
                type="file"
                name="resume"
              />
              <span class="file-cta">
                <span class="file-icon">
                  <i class="fas fa-upload"></i>
                </span>
                <span class="file-label">{{ $t("BROWSE_FILE") }}</span>
              </span>
            </label>
            <div class="loading-box" v-else>
              <progress class="progress is-small is-primary" max="100">
                15%
              </progress>
              <h5 class="title is-6" style="">{{ $t("LOADING") }}...</h5>
            </div>
          </div>
        </div>
      </section>
      <footer v-if="!mode" class="modal-card-foot"></footer>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import DataLoader from "@/core/DataLoader";
import { eventEmitter, vehicles, bases } from "@/main";

@Options({
  components: {},
  props: {
    mode: Boolean,
  },
  data() {
    return {
    };
  },
  computed: {},
})
export default class FileLoader extends Vue {
  loading: boolean = false;
  visibility: boolean = true;
  dataLoader: DataLoader = new DataLoader(this);

  async load(event: Event) {
    // Show loading
    this.loading = true;

    let result;

    if (event.type == "click") {
      // Load demo data
      result = await this.dataLoader.loadDemo();
    } else {
      // Get file
      const file = (event.target! as HTMLInputElement).files![0];

      // Load file
      result = await this.dataLoader.loadLocalFile(file);
    }

    // Show possible errors
    if (result && result.type == "error") {
      this.loading = false;
      eventEmitter.emit("notification", result.message);
      return;
    }

    // Check each 200ms if all markers have been loaded
    const checkFinishedLoading = setInterval(() => {
      if (
        vehicles[vehicles.length - 1].marker.added &&
        bases[bases.length - 1].marker.added
      ) {
        // Then, hide modal & loading
        this.hide();
        this.loading = false;
        clearInterval(checkFinishedLoading);
      }
    }, 100);
  }

  show() {
    this.visibility = true;
  }

  hide() {
    this.visibility = false;
  }
}
</script>
<style scoped lang="scss">
.drag-area {
  padding: 20%;
  border: 2px dashed #dbdbdb;
}
.custom-modal-background {
  background-color: rgba(10, 10, 10, 0.6);
}
.loading-box {
  width: 100%;
  text-align: center;
}
</style>
