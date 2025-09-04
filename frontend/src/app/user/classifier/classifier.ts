import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Verificamos que estamos en el navegador, no en SSR
    if (isPlatformBrowser(this.platformId)) {
      const predictionData = sessionStorage.getItem('predictionResult');

      if (predictionData) {
        const parsed = JSON.parse(predictionData);

        this.predictedClass = parsed.predicted_class;

        const probs = parsed.probabilities;

        this.probabilities = [
          { value: Math.round(probs['VIR_PNEUMONIA'] * 100), text: `Probability of Viral Pneumonia: ${Math.round(probs['VIR_PNEUMONIA'] * 100)}%` },
          { value: Math.round(probs['BAC_PNEUMONIA'] * 100), text: `Probability of Bacterial Pneumonia: ${Math.round(probs['BAC_PNEUMONIA'] * 100)}%` },
          { value: Math.round(probs['NORMAL'] * 100), text: `Probability of being Normal: ${Math.round(probs['NORMAL'] * 100)}%` }
        ];

        if (parsed.heatmap) {
          this.heatmapImage = 'data:image/png;base64,' + parsed.heatmap;
        }
      }
    }
  }

  toggleHeatmap(): void {
    this.showHeatmap = !this.showHeatmap;
  }
}
