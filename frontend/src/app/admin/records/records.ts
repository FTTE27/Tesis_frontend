import { Component, OnInit } from '@angular/core';
import { HeaderAdmin } from '../header-admin/header-admin';
import { RecordsService, Registro } from '../../services/records_service';
import { CommonModule } from '@angular/common';
import { ExportService } from '../../services/export_service';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [HeaderAdmin, CommonModule],
  templateUrl: './records.html',
  styleUrl: './records.css'
})
export class Records implements OnInit {
  registrosOriginal: Registro[] = [];   // todos los registros del backend
  registrosFiltrados: Registro[] = [];  // los que se muestran tras filtrar

    // Estos son los registros que el HTML espera
    get records(): Registro[] {
      return this.registrosFiltrados;
    }

  // Valores posibles de estado
  estados: string[] = ['DN.keras', 'CNN.keras', 'IN.keras'];

  activeFilter: string = 'daily'; // Por defecto el primero

  // Datos para el gráfico de barras
  chartLabels: string[] = [];
  chartCounts: number[] = [];
  chartMax: number = 1; // valor máximo para normalizar

  // Filtros
  filtroEstado: string = '';
  filtroYear: string = '';
  filtroMonth: string = '';
  filtroDay: string = '';

  //Filtros de probabilidad
  probMinViral: number | null = null;
  probMaxViral: number | null = null;
  probMinBacterial: number | null = null;
  probMaxBacterial: number | null = null;
  probMinNormal: number | null = null;
  probMaxNormal: number | null = null;

  constructor(private recordsService: RecordsService, private exportService: ExportService) {}


  ngOnInit(): void {
    this.recordsService.getAllRecords().subscribe({
      next: (data) => {

        this.registrosOriginal = data.map(r => ({...r,  diagnostico: this.getDiagnosis(r) }));
        this.registrosFiltrados = [...data]; // arranque sin filtros
      },
      error: (err) => console.error('Error cargando registros', err)
    });
  }

  // Aplica los filtros actuales
  applyFilters() {
    this.registrosFiltrados = this.registrosOriginal.filter(r => {
      const [y, m, d] = r.fecha.split('-'); // formato: YYYY-MM-DD

      const filtroEstadoOk = !this.filtroEstado || r.estado === this.filtroEstado;
      const filtroYearOk = !this.filtroYear || y === this.filtroYear;
      const filtroMonthOk = !this.filtroMonth || m === this.filtroMonth;
      const filtroDayOk = !this.filtroDay || d === this.filtroDay;

      const filtroProbViralOk =
      (this.probMinViral === null || r.probabilidad_viral >= this.probMinViral) &&
      (this.probMaxViral === null || r.probabilidad_viral <= this.probMaxViral);

      const filtroProbBacterialOk =
      (this.probMinBacterial === null || r.probabilidad_bacteriana >= this.probMinBacterial) &&
      (this.probMaxBacterial === null || r.probabilidad_bacteriana <= this.probMaxBacterial);

      const filtroProbNormalOk =
      (this.probMinNormal === null || r.probabilidad_sano >= this.probMinNormal) &&
      (this.probMaxNormal === null || r.probabilidad_sano <= this.probMaxNormal);


        return filtroEstadoOk &&
        filtroYearOk &&
        filtroMonthOk &&
        filtroDayOk &&
        filtroProbViralOk &&
        filtroProbBacterialOk &&
        filtroProbNormalOk;
});
  }

  // Limpia filtros y muestra todo
  clearFilters() {
    this.filtroEstado = '';
    this.filtroYear = '';
    this.filtroMonth = '';
    this.filtroDay = '';
    this.probMinViral = null;
    this.probMaxViral = null;
    this.probMinBacterial = null;
    this.probMaxBacterial = null;
    this.probMinNormal = null;
    this.probMaxNormal = null;

    this.registrosFiltrados = [...this.registrosOriginal];
  }
  // Exporta todos los registros a PDF
  exportRecords() {
    this.exportService.exportRecordsPDF(this.registrosOriginal);
  }
  // Exporta el registro seleccionado a PDF
  descargarRegistroPaciente(record: Registro) {
    console.log("Clic en registro:", record);
    this.recordsService.getRegistroEsp(record.id).subscribe({
      next: (registroCompleto) => {
        console.log("Registro completo recibido:", registroCompleto);
        this.exportService.exportSingleRecordPDF(registroCompleto);
      },
      error: (err) => console.error("Error obteniendo registro completo", err)
    });
  }

  // Elimina todos los registros
  deleteAll() {
    this.registrosOriginal = [];
    this.registrosFiltrados = [];
    this.chartLabels = [];
    this.chartCounts = [];
    this.chartMax = 1;
  }

  // Función auxiliar para evitar desfase UTC
  private parseLocalDate(dateString: string): Date {
    // Formato: YYYY-MM-DD
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // Local sin problemas de UTC
  }

  // función que determina el diagnóstico más probable
  getDiagnosis(record: Registro): string {
    const probs = {
      Normal: record.probabilidad_sano,
      Viral: record.probabilidad_viral,
      Bacterial: record.probabilidad_bacteriana
    };

    type DiagnosisKey = keyof typeof probs; // "Normal" | "Viral" | "Bacterial"

    const maxKey = (Object.keys(probs) as DiagnosisKey[]).reduce((a, b) =>
      probs[a] > probs[b] ? a : b
    );

    return maxKey.toUpperCase(); // Ej: "NORMAL", "VIRAL", "BACTERIAL"
  }

  // Filtra los registros por día, semana, mes o año y actualiza el gráfico
filterBy(period: 'daily' | 'weekly' | 'monthly' | 'yearly'): void {
  const now = new Date();
  let labels: string[] = [];
  let counts: number[] = [];
  this.activeFilter = period;

  if (period === 'daily') {
    // últimos 7 días (índice 6 = hoy, 0 = hace 6 días)
    counts = new Array(7).fill(0);
    labels = new Array(7);

    this.registrosOriginal.forEach(r => {
      const fecha = this.parseLocalDate(r.fecha);
      const diffDays = Math.floor((+now - +fecha) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 7) {
        counts[6 - diffDays]++;   // <-- usar 6 - diffDays
      }
    });

    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      labels[i] = d.toLocaleDateString('es-ES', { weekday: 'short' }); // ej "lun", "mar"
    }
  }

  if (period === 'weekly') {
    // últimos 7 semanas (índice 6 = semana actual)
    counts = new Array(7).fill(0);
    labels = new Array(7);

    this.registrosOriginal.forEach(r => {
      const fecha = this.parseLocalDate(r.fecha);
      const diffWeeks = Math.floor((+now - +fecha) / (1000 * 60 * 60 * 24 * 7));
      if (diffWeeks >= 0 && diffWeeks < 7) {
        counts[6 - diffWeeks]++;  // <-- usar 6 - diffWeeks
      }
    });

    for (let i = 0; i < 7; i++) {
      labels[i] = `Semana ${i + 1}`; // o personaliza según prefieras
    }
  }

  if (period === 'monthly') {
    // últimos 7 meses (índice 6 = mes actual)
    const monthNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    counts = new Array(7).fill(0);
    labels = new Array(7);

    this.registrosOriginal.forEach(r => {
      const fecha = this.parseLocalDate(r.fecha);
      const diffMonths = (now.getFullYear() - fecha.getFullYear()) * 12 + (now.getMonth() - fecha.getMonth());
      if (diffMonths >= 0 && diffMonths < 7) {
        counts[6 - diffMonths]++;  // <-- usar 6 - diffMonths
      }
    });

    for (let i = 0; i < 7; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1);
      labels[i] = monthNames[date.getMonth()];
    }
  }

  if (period === 'yearly') {
    // últimos 7 años (índice 6 = año actual)
    counts = new Array(7).fill(0);
    labels = new Array(7);

    this.registrosOriginal.forEach(r => {
      const fecha = this.parseLocalDate(r.fecha);
      const diffYears = now.getFullYear() - fecha.getFullYear();
      if (diffYears >= 0 && diffYears < 7) {
        counts[6 - diffYears]++;  // <-- usar 6 - diffYears
      }
    });

    for (let i = 0; i < 7; i++) {
      labels[i] = (now.getFullYear() - (6 - i)).toString();
    }
  }

  // actualizar gráfico
  this.updateChart(labels, counts);
}


  private updateChart(labels: string[], counts: number[]): void {
    this.chartLabels = labels;
    this.chartCounts = counts;
    this.chartMax = Math.max(...counts, 1);
  }


}
