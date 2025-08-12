import { Component } from '@angular/core';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  imports: [Header, Footer],
  templateUrl: './upload.html',
  styleUrl: './upload.css'
})
export class Upload {
  
  selectedFile: File | null = null;
  
  constructor(private router: Router) {}

  ngOnInit(): void {
  }
  
  onFileUpload(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }
  
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    
    if (file) {
      if (file.size > 200 * 1024 * 1024) {
        alert('File size cannot exceed 200MB');
        return;
      }
      
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PNG, JPG, or JPEG file');
        return;
      }
      
      this.selectedFile = file;
      console.log('File selected:', file.name);
      this.processXRay(file);
    }
  }
  
  private processXRay(file: File): void {
    console.log('Processing x-ray file:', file.name);
    const formData = new FormData();
    formData.append('xray', file);
  }

  goToClassifier() {
    this.router.navigate(['/classifier']);
  }
}