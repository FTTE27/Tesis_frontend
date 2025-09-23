import { Component } from '@angular/core';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClassificationService } from '../../services/classification_service';
import { ExportClassifierService } from '../../services/export_classifier_service';

@Component({
  selector: 'app-classifier',
  templateUrl: './classifier.html',
  imports: [CommonModule, FormsModule, Footer, Header]
})
export class Classifier {
  probabilities: { value: number; text: string }[] = [];
  heatmapImage: string | null = null;
  showHeatmap: boolean = false;
  predictedClass: string = '';

  constructor(
    private classificationService: ClassificationService,
    private exportService: ExportClassifierService
  ) {}

  ngOnInit(): void {
    const prediction = this.classificationService.getPrediction();

    if (prediction) {
      this.predictedClass = this.classificationService.mapPredictedClass(prediction.predicted_class);
      this.probabilities = this.classificationService.buildProbabilities(prediction.probabilities);

      if (prediction.heatmap) {
        this.heatmapImage = 'data:image/png;base64,' + prediction.heatmap;
      }
    }
  }

  toggleHeatmap(): void {
    this.showHeatmap = !this.showHeatmap;
  }

  exportToPDF(): void {
    this.exportService.exportClassifierPDF({
      predictedClass: this.predictedClass,
      probabilities: this.probabilities,
      heatmapImage: this.heatmapImage
    });
  }
}
