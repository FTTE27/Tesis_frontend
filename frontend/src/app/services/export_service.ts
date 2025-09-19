import { Injectable } from "@angular/core";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Registro } from '../services/records_service';


(pdfMake as any).vfs = (pdfFonts as any).vfs;

@Injectable({
  providedIn: "root",
})
export class ExportService {
  constructor() {}

  exportRecordsPDF(registros: Registro[]) {
    if (!registros || registros.length === 0) {
      console.log("No hay registros para exportar");
      return;
    }

    const tableHeader = [
      "ID",
      "Fecha",
      "Hora",
      "Estado",
      "Prob. Viral",
      "Prob. Bacteriana",
      "Prob. Sano",
      "Usuario",
    ];

    const tableBody = [
      tableHeader,
      ...registros.map((r) => [
        r.id,
        r.fecha,
        r.hora,
        r.estado,
        r.probabilidad_viral.toFixed(2),
        r.probabilidad_bacteriana.toFixed(2),
        r.probabilidad_sano.toFixed(2),
        r.username,
      ]),
    ];

    const documentDefinition: any = {
      pageOrientation: 'landscape',
      content: [
        { text: "Historial de Registros", style: "header" },
        {
          text: `Fecha de exportación: ${new Date().toLocaleString()}`,
          margin: [0, 0, 0, 20],
        },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "*", "*", "*", "*", "*", "*"],
            body: tableBody,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
      },
      defaultStyle: {
        fontSize: 10,
      },
    };

    pdfMake.createPdf(documentDefinition).download("registros.pdf");
  }
}
