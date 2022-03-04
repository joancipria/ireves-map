<template>
  <div :class="{ open: visibility }" class="box details">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ i18n.EXPORT }}</p>
      <button @click="hide" class="delete" aria-label="close"></button>
    </header>
    <div class="content mt-5">
      <div class="columns">
        <!-- <div class="column">
          <h1 class="title is-5">Covered population</h1>
          <i class="fas fa-users"></i>
        </div> -->
        <div class="column">
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">{{ i18n.EXPORT }}</label>
                <div class="control">
                  <div class="select">
                    <select>
                      <option>{{ i18n.POPULATION }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">{{ i18n.FROM }}</label>
                <div class="control">
                  <div class="select">
                    <select>
                      <option>{{ i18n.BASES_INTERSECTION }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">{{ i18n.FILE_NAME }}</label>
                <div class="control">
                  <input class="input" type="text" placeholder="File name" />
                </div>
              </div>
            </div>

            <div class="column">
              <div class="field">
                <label class="label">{{ i18n.FORMAT }}</label>
                <div class="control">
                  <div class="select">
                    <select>
                      <option>JSON</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="field is-grouped">
            <div class="control">
              <button @click="exportData" class="button is-success">
                {{ i18n.EXPORT }}
              </button>
            </div>
          </div>

          <progress
            v-if="loading"
            class="progress is-small is-primary"
            max="100"
          >
            15%
          </progress>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { i18n } from "@/main";
import { dataExport } from "@/core/DataExport";

@Options({
  props: {},
  data() {
    return {
      i18n: i18n,
    };
  },
})
export default class ExportPanel extends Vue {
  visibility: boolean = false;
  loading: boolean = false;

  show() {
    this.visibility = true;
  }

  hide() {
    this.visibility = false;
  }

  async exportData() {
    this.loading = true;
    await dataExport.exportCoveredPopulation();
    this.loading = false;
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
