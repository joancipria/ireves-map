import { bases } from "@/main";
import * as Papa from "papaparse";

class DataExport {

    async exportCoveredPopulation() {
        const basesPop = [];

        for (const baseA of bases) {

            for (const baseB of bases) {
                if (baseA !== baseB) {
                    // Get pop of both bases
                    const baseApop = await baseA.getPopulation();
                    const baseBpop = await baseB.getPopulation();


                    // Calc overlap between both bases


                    basesPop.push(
                        [{
                            name: baseA.name,
                            position: baseA.position,
                            covered_pop: baseApop,
                        },
                        {
                            name: baseB.name,
                            position: baseB.position,
                            covered_pop: baseBpop,
                        },
                        {
                            name: "overlap",
                            covered_pop: null
                        }

                        ]
                    );
                }
            }
        }

        this.exportJSON(basesPop);
    }

    private exportJSON(data: any) {
        data = JSON.stringify(data);
        this.downloadFile(data, "ireves", "json");
    }

    private exportCSV() {
        //const csvData = Papa.unparse(data);
    }

    private downloadFile(data, fileName: string, fileType: string) {

        // Create CSV file object and feed
        // our csv_data into it
        const CSVFile = new Blob([data], {
            type: `text/${fileType}`
        });

        // Create to temporary link to initiate
        // download process
        const temp_link = document.createElement('a');

        // Download csv file
        temp_link.download = `${fileName}.${fileType}`;
        const url = window.URL.createObjectURL(CSVFile);
        temp_link.href = url;

        // This link should not be displayed
        temp_link.style.display = "none";
        document.body.appendChild(temp_link);

        // Automatically click the link to
        // trigger download
        temp_link.click();
        document.body.removeChild(temp_link);
    }
}

export const dataExport = new DataExport();