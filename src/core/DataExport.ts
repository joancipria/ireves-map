import { bases } from "@/main";

class DataExport {

    export(fileName: string) {
        this.exportJSON(bases, fileName);
    }
    private exportJSON(data: any, fileName: string) {
        console.log(data)
        data = JSON.stringify(data);
        this.downloadFile(data, fileName, "json");
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