<template>
  <div class="modal" :class="{ 'is-active': visibility }">
    <div
      :class="{ 'custom-modal-background': !mode }"
      class="modal-background"
    ></div>
    <div :class="{ 'modal-content': mode, 'modal-card': mode == false }">
      <header v-if="!mode" class="modal-card-head">
        <p class="modal-card-title">{{ i18n.LOAD_DATA }}</p>
        <button @click="hide" class="delete" aria-label="close"></button>
      </header>
      <div v-if="mode" :class="{ box: mode }">
        <h1 class="title">{{ i18n.WELCOME_MESSAGE }}</h1>
        <h2 class="subtitle">{{ i18n.WELCOME_INSTRUCTIONS }}</h2>
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
                <span class="file-label">{{ i18n.BROWSE_FILE }}</span>
              </span>
            </label>
            <progress v-else class="progress is-small is-primary" max="100">
              15%
            </progress>
          </div>
        </div>
        <br />
        <p>
          {{ i18n.NO_DATA }}
          <a @click="load">{{ i18n.TRY_DEMO }}</a>
        </p>
      </div>

      <section v-if="!mode" class="modal-card-body">
        <h2 class="subtitle">{{ i18n.WELCOME_INSTRUCTIONS }}</h2>
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
                <span class="file-label">{{ i18n.BROWSE_FILE }}</span>
              </span>
            </label>
            <progress v-else class="progress is-small is-primary" max="100">
              15%
            </progress>
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
import { i18n } from "@/main";

@Options({
  components: {},
  props: {
    mode: Boolean,
  },
  data() {
    return {
      i18n: i18n,
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

    if (result.error) {
      this.loading = false;
      // TODO: Mensaje de error (implmentar notificaciones?)
      alert(result.error);
      return;
    }

    // Hide modal & loading
    this.hide();
    this.loading = false;
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
</style>