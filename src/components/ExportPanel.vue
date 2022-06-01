<template>
  <SideBar :id="'exportPanel'" :title="$t('LOAD_DATA')">
    <div class="content mt-5">
      <div class="columns">
        <div class="column">
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">{{ $t("FILE_NAME") }}</label>
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
                <label class="label">{{ $t("FORMAT") }}</label>
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
                {{ $t("LOAD_DATA") }}
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
import SideBar from "@/components/SideBar.vue";

import { dataExport } from "@/core/DataExport";

@Options({
  props: {},
  data() {
    return {
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
