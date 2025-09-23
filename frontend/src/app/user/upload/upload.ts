import { Component } from '@angular/core';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { Router } from '@angular/router';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ClassificationService } from '../../services/classification_service';

@Component({
  selector: 'app-upload',
  imports: [Header, Footer],
  templateUrl: './upload.html',
  styleUrl: './upload.css'
})
export class Upload {
  selectedFile: File | null = null;
  uploadProgress: number = 0;

  constructor(private router: Router, private classificationService: ClassificationService) {}

  onFileUpload(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      if (file.size > 200 * 1024 * 1024) {
        alert('El archivo no puede superar los 200MB');
        return;
      }

      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Sube una imagen PNG, JPG o JPEG');
        return;
      }

      this.selectedFile = file;
      console.log('Archivo seleccionado:', file.name);

      this.uploadFile(file);
    }
  }

  private uploadFile(file: File): void {
    this.classificationService.uploadXRay(file).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((event.loaded / event.total) * 100);
          console.log(`Progreso: ${this.uploadProgress}%`);
        }

        if (event.type === HttpEventType.Response) {
          console.log('Respuesta completa:', event.body);
          this.classificationService.savePrediction(event.body);
          this.router.navigate(['/classifier']);
        }
      },
      error: (err) => {
        console.error('Error al enviar la radiografía:', err);
        alert('Hubo un error al subir el archivo');
      }
    });
  }

  goToClassifier() {
    this.router.navigate(['/classifier']);
  }
}
