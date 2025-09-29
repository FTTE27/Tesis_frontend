import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface PredictionResult {
  predicted_class: string;
  probabilities: { [key: string]: number };
  heatmap?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClassificationService {
  private apiUrl = 'http://192.168.1.5:8000/models/predict_with_heatmap';
  private storageKey = 'predictionResult';

  constructor(private http: HttpClient, private router: Router) {}

  uploadXRay(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.apiUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  savePrediction(result: PredictionResult): void {
    sessionStorage.setItem(this.storageKey, JSON.stringify(result));
  }

  getPrediction(): PredictionResult | null {
    const data = sessionStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  mapPredictedClass(code: string): string {
    switch (code) {
      case 'VIR_PNEUMONIA': return 'Viral';
      case 'BAC_PNEUMONIA': return 'Bacterial';
      case 'NORMAL': return 'Normal';
      default: return 'Unknown';
    }
  }

  buildProbabilities(probs: { [key: string]: number }): { value: number; text: string }[] {
    return [
      { value: Math.round(probs['VIR_PNEUMONIA'] * 100), text: `Probability of Viral Pneumonia: ${Math.round(probs['VIR_PNEUMONIA'] * 100)}%` },
      { value: Math.round(probs['BAC_PNEUMONIA'] * 100), text: `Probability of Bacterial Pneumonia: ${Math.round(probs['BAC_PNEUMONIA'] * 100)}%` },
      { value: Math.round(probs['NORMAL'] * 100), text: `Probability of being Normal: ${Math.round(probs['NORMAL'] * 100)}%` }
    ];
  }
}
