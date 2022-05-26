<template>
  <SideBar :id="'exportPanel'" :title="i18n.EXPORT">
    <div class="content mt-5">
      <div class="columns">
        <div class="column">
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">{{ i18n.FILE_NAME }}</label>
                <div class="control">
                  <input
                    v-model="fileName"
                    class="input"
                    type="text"
                    placeholder="File name"
                  />
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
        </div>
      </div>
    </div>
  </SideBar>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { i18n } from "@/main";
import SideBar from "@/components/SideBar.vue";

import { dataExport } from "@/core/DataExport";

@Options({
  props: {},
  data() {
    return {
      i18n: i18n,
      fileName: "",
    };
  },
  components: {
    SideBar,
  },
})
export default class ExportPanel extends Vue {
  fileName!: string;

  exportData(): void {
    dataExport.export(this.fileName);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
