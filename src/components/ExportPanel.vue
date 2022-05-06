<template>
  <SideBar :id="'exportPanel'" :title="i18n.EXPORT">
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

          <progress v-if="loading" class="progress is-small is-primary" max="100">
            15%
          </progress>
        </div>
      </div>
    </div>
  </SideBar>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { i18n } from "@/main";
import SideBar from "@/components/SideBar.vue"

import { dataExport } from "@/core/DataExport";


@Options({
  props: {},
  data() {
    return {
      i18n: i18n,
    };
  },
  components: {
    SideBar
  }
})
export default class ExportPanel extends Vue {
  loading: boolean = false;

  async exportData() {
    this.loading = true;
    await dataExport.exportCoveredPopulation();
    this.loading = false;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
