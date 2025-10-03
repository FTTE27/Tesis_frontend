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

  // Exportar un solo registro a PDF
  // Exportar un solo registro a PDF (mejorado con datos de /esp/{id})
exportSingleRecordPDF(record: Registro) {
  if (!record) {
    console.log("No hay registro para exportar");
    return;
  }

  // Convertir radiografía desde base64 (si existe)
  const radiografiaBase64 = record.radiografia
    ? `data:image/png;base64,${record.radiografia}`
    : null;

  // Tabla de probabilidades
  const tableBody = [
    ["Clase", "Probabilidad"],
    ["Sano", `${record.probabilidad_sano.toFixed(2)} %`],
    ["Viral", `${record.probabilidad_viral.toFixed(2)} %`],
    ["Bacteriana", `${record.probabilidad_bacteriana.toFixed(2)} %`],
  ];

  // Definición del documento
  const documentDefinition: any = {
    content: [
      { text: "Reporte Individual del Paciente", style: "header" },
      {
        text: `Fecha de exportación: ${new Date().toLocaleString()}`,
        margin: [0, 0, 0, 20],
      },

      { text: `Paciente: ${record.username}`, style: "subheader" },
      { text: `ID Registro: ${record.id}` },
      { text: `Nombre Archivo: ${record.nombre_archivo}` },
      { text: `Fecha: ${record.fecha}` },
      { text: `Hora: ${record.hora}` },

      {
        text: `Estado Predicho: ${record.estado}`,
        style: "subheader",
        margin: [0, 15, 0, 15],
      },

      {
        text: "Probabilidades Detalladas",
        style: "subheader",
        margin: [0, 10, 0, 10],
      },
      {
        table: {
          headerRows: 1,
          widths: ["*", "auto"],
          body: tableBody,
        },
        layout: "lightHorizontalLines",
      },

      // Radiografía / Heatmap
      { text: "Mapa de Calor (Radiografía)", style: "subheader", margin: [0, 20, 0, 10] },
      radiografiaBase64
        ? {
            image: radiografiaBase64,
            width: 400,
            alignment: "center",
            margin: [0, 0, 0, 20],
          }
        : {
            text: "No se encontró mapa de calor para este registro.",
            italics: true,
            color: "red",
            margin: [0, 0, 0, 20],
          },
    ],
    styles: {
      header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
    },
    defaultStyle: { fontSize: 11 },
  };

  // Descargar PDF con nombre personalizado
  pdfMake.createPdf(documentDefinition).download(
    `reporte_${record.username}_${record.id}.pdf`
  );
}

}

