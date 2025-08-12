import { Component } from '@angular/core';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

@Component({
  selector: 'app-upload',
  imports: [Header, Footer],
  templateUrl: './upload.html',
  styleUrl: './upload.css'
})
export class Upload {
  
  selectedFile: File | null = null;
  
  constructor() { }

  ngOnInit(): void {
  }
  
  onFileUpload(): void {
    // Trigger the hidden file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }
  
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    
    if (file) {
      // Validate file size (200MB = 200 * 1024 * 1024 bytes)
      if (file.size > 200 * 1024 * 1024) {
        alert('File size cannot exceed 200MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PNG, JPG, or JPEG file');
        return;
      }
      
      this.selectedFile = file;
      console.log('File selected:', file.name);
      
      // Aquí puedes agregar la lógica para procesar el archivo
      this.processXRay(file);
    }
  }
  
  private processXRay(file: File): void {
    // Aquí implementarías la lógica para enviar el archivo al backend
    // o procesarlo según tus necesidades
    console.log('Processing x-ray file:', file.name);
    
    // Ejemplo de FormData para envío al backend:
    const formData = new FormData();
    formData.append('xray', file);
    
    // Llamada al servicio (ejemplo)
    // this.pneumoniaService.classifyXRay(formData).subscribe(result => {
    //   console.log('Classification result:', result);
    // });
  }
}