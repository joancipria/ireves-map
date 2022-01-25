<template>
  <div class="modal" :class="{ 'is-active': modalActive }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <h1 class="title">{{ i18n.WELCOME_MESSAGE }}</h1>
        <h2 class="subtitle">{{ i18n.WELCOME_INSTRUCTIONS }}</h2>
        <div class="drag-area">
          <div class="file is-centered">
            <label v-if="!loading" class="file-label">
              <input
                @change="loadCSV"
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
        <p>{{i18n.NO_DATA}} <a @click="loadCSV(null, true)">{{i18n.TRY_DEMO}}</a></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import * as Papa from "papaparse";
import Vehicle from "@/core/Vehicle";
import Base from "@/core/Base";
import { vehicles, i18n } from "@/main";
import { VehicleType } from "@/core/VehicleProperties";

@Options({
  components: {},
  data() {
    return {
      i18n: i18n,
    };
  },
  computed: {},
})
export default class CSVLoader extends Vue {
  modalActive: boolean = true;
  loading: boolean = false;

  loadCSV(event: Event, demo: boolean = false) {
    this.loading = true;
    // File
    let file;
    let mode: any = false;

    // TODO: Fix https://stackoverflow.com/questions/61573872/typescript-object-is-possibly-null-when-getting-files-from-event
    if (demo) {
      file = "demo_data.csv";
      mode = true;
    } else {
      file = (event.target! as HTMLInputElement).files![0];

      // Check extension (.csv)
      const extension = file.name.split(".").pop();

      if (extension !== "csv") {
        // TODO: Mensaje de error (implmentar notificaciones?)
        alert(i18n.FILE_EXTENSION_ERROR);
        //setErrorMessageExtensionFichero(true, 'mensajeAlertaExtension');
        this.loading = false;
        return;
      }
    }

    // Parse CSV
    Papa.parse(file, {
      download: mode,
      header: true,
      complete: (res: Papa.ParseResult<Papa.ParseError>,) => {
        if (res.errors.length > 0) {
          res.errors.forEach((error) => {
            console.error(error);
          });
          // TODO: Reimplementar mensaje de alerta /error y demás
          alert(i18n.FILE_PARSE_ERROR);
          //setErrorMessageExtensionFichero(true, 'mensajeAlertaExtension');
          this.loading = false;
           return;
        }

        //resetPage();
        //activarControles();

        let data: any = res.data;

        // For each, create new Vehicle
        let id = 0;
        const bases: Base[] = [];
        data.forEach((row: any) => {
          // Clean data
          if (
            row &&
            row.Base != "" &&
            row.x != "" &&
            row.y != "" &&
            row.Nombre != "" &&
            (row.Tipo == VehicleType.SAMU || row.Tipo == VehicleType.SVB)
          ) {
            // Create vehicle
            const vehicle = new Vehicle(
              id,
              row.Nombre,
              row.x,
              row.y,
              VehicleType[row.Tipo],
              row.horario
            );

            // Check if base already exists
            const found = bases.some((base) => base.name === row.Base);

            if (found) {
              // exists
              const index = bases.findIndex((base) => {
                if (base.name === row.Base) {
                  return true;
                }
              });

              // same address?
              if (bases[index].address === row.Dirección) {
                // Yes
                bases[index].vehicles.push(vehicle);
              } else {
                // No, extract vehicle?
                vehicle.extract();
                // const base = new Base(row.Base, row.x, row.y, row.Dirección);
                // base.marker.addEventListener("click", () => {
                //   this.$emit("baseSelected", base);
                // });
                // base.vehicles.push(vehicle);
                // bases.push(base);
              }
            } else {
              // doesn't exists

              // Create bew base
              const base = new Base(row.Base, row.x, row.y, row.Dirección);
              base.marker.addEventListener("click", () => {
                this.$emit("baseSelected", base);
                base.showIsochrone();
              });

              // Add vehicle to base
              base.vehicles.push(vehicle);

              // Push base
              bases.push(base);
            }
            // Push vehicle
            vehicles.push(vehicle);
          }
          id++;
        });

        // Hide modal
        this.modalActive = false;
      },
    });
  }
}
</script>
<style scoped lang="scss">
.box {
  height: 50vh;
}
.drag-area {
  padding: 20%;
  border: 2px dashed #dbdbdb;
}
</style>