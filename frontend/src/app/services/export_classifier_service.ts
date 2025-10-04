import { Injectable } from "@angular/core";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

(pdfMake as any).vfs = (pdfFonts as any).vfs;

export interface ClassifierExportData {
  predictedClass: string;
  probabilities: { value: number; text: string }[];
  heatmapImage?: string | null;
}

@Injectable({
  providedIn: "root",
})
export class ExportClassifierService {
  constructor() {}

  exportClassifierPDF(data: ClassifierExportData) {
    if (!data) {
      console.log("No hay datos para exportar");
      return;
    }

    // Construir tabla de probabilidades
    const tableHeader = ["Clase", "Probabilidad"];
    const tableBody = [
      tableHeader,
      ...data.probabilities.map((p) => [
        p.text.split(":")[0], // Nombre de la clase (ej: "Probability of Viral Pneumonia")
        `${p.value}%`,       // Probabilidad en %
      ]),
    ];

    // Definición del documento
    const documentDefinition: any = {
      content: [
        { text: "Resultados de clasificación", style: "header" },
        {
          text: `Fecha: ${new Date().toLocaleString()}`,
          margin: [0, 0, 0, 20],
        },
        {
          text: `Predicción: ${data.predictedClass}`,
          style: "subheader",
          margin: [0, 0, 0, 15],
        },
        {
          table: {
            headerRows: 1,
            widths: ["*", "auto"],
            body: tableBody,
          },
          layout: "lightHorizontalLines",
        },
        ...(data.heatmapImage
          ? [
              { text: "Mapa de calor", style: "subheader", margin: [0, 20, 0, 10] },
              {
                image: data.heatmapImage,
                width: 400,
                alignment: "center",
                margin: [0, 0, 0, 20],
              },
            ]
          : []),
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
        },
      },
      defaultStyle: {
        fontSize: 11,
      },
    };

    // Descargar PDF
    pdfMake.createPdf(documentDefinition).download("classification.pdf");
  }
}
