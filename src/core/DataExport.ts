import { bases, vehicles } from "@/main";
import { saveAs } from "file-saver";
import domtoimage from "dom-to-image-more";
import { PDFDocument, PDFPage, StandardFonts } from "pdf-lib";
import { i18n, locale } from "@/i18n"

class DataExport {

    /**
     * Exports (downloads) a JSON file with all app data
     *
     * @param {string} fileName
     * @memberof DataExport
     */
    export(fileName: string): void {

        if (!fileName) {
            fileName = "Reves Map data";
        }

        // Build file structure
        const data = {
            bases: bases,
            vehicles: vehicles
        }

        // Creat cleaned blob
        const blob = new Blob([JSON.stringify(data, this.customReplacer())], { type: "text/json;charset=utf-8" });

        // Save file
        saveAs(blob, `${fileName}.json`);
    }

    /**
     * Custom replacer for JSON.stringify(). See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
     *
     * @memberof DataExport
     */
    customReplacer = () => {
        return (key, value) => {
            // Drop internal properties and all leaflet visual stuff
            if (key === "marker" || key === "activeVehicles" || key === "active" || key === "time" || key === "isochroneLayer" || key === "polygon" || key === "population" || key === "color" || key === "popup" || key === "id") {
                return;
            }
            return value;
        };
    };

    /**
     * Generates and downloads a PDF report with given data
     *
     * @param {string} region
     * @param {*} population
     * @return {*}  {Promise<void>}
     * @memberof DataExport
     */
    async exportReport(region: string, population: any): Promise<void> {
        // Generate map image
        const image = await this.takeMapSnapshot();

        // Reves map logo
        const logo = await fetch("/img/ireves-logo.png");
        const logoArrayBuffer = await logo.arrayBuffer();

        // Current date using locale format
        const date = new Date().toLocaleDateString(locale);

        // Report title
        const title = `${i18n.REVES_MAP_REPORT} - ${date}`;

        // Create a new PDFDocument
        const pdfDoc = await PDFDocument.create();

        // Add a blank page to the document
        const page = pdfDoc.addPage();

        // Draw reves map logo
        await this.drawImage(pdfDoc, page, logoArrayBuffer, 0.4, 230, 400)

        // Draw map image 
        await this.drawImage(pdfDoc, page, image, 0.5, 75, 0);

        /* Draw report data */
        // Title
        await this.drawText(pdfDoc, page, title, 20, 50, 6);

        // Region
        await this.drawText(pdfDoc, page, `${i18n.REGION}: ${region}`, 14, 50, 10)

        // Covered population
        await this.drawText(pdfDoc, page, `${i18n.COVERED_POPULATION}: ${population}`, 12, 50, 14)

        // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save();

        // Create blob
        const blob = new Blob([pdfBytes], { type: "application/pdf" });

        // Save file
        saveAs(blob, `${title}.pdf`);
    }

    /**
     * Returns an encoded Base64 string image of the current map view
     *
     * @private
     * @return {*}  {Promise<string>}
     * @memberof DataExport
     */
    private async takeMapSnapshot(): Promise<string> {
        const base64Image = await domtoimage.toPng(document.getElementById("map"));
        return base64Image;
    }


    private async drawText(pdfDoc: PDFDocument, page: PDFPage, text: string, fontSize: number = 12, x: number, y: number) {
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        const { width, height } = page.getSize();
        page.drawText(
            text,
            {
                x: x,
                y: height - y * fontSize,
                size: fontSize,
                font: timesRomanFont,
            }
        );
    }

    private async drawImage(pdfDoc: PDFDocument, page: PDFPage, image: string | ArrayBuffer, scale: number, x?: number, y?: number) {
        const pngImage = await pdfDoc.embedPng(image);
        const pngDims = pngImage.scale(scale);
        page.drawImage(pngImage, {
            x: page.getWidth() / 2 - pngDims.width / 2 + x,
            y: page.getHeight() / 2 - pngDims.height + y,
            width: pngDims.width,
            height: pngDims.height,
        });
    }
}

export const dataExport = new DataExport();