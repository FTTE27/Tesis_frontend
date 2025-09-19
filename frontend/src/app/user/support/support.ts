import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-support',
  imports: [Header, Footer, CommonModule, ReactiveFormsModule],
  templateUrl: './support.html',
  styleUrl: './support.css'
})
export class Support implements OnInit {
  contactForm!: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      title: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
  if (this.contactForm.invalid) return;

  const formData = {
    nombre: this.contactForm.get('name')?.value,
    titulo: this.contactForm.get('title')?.value,
    correo: this.contactForm.get('email')?.value,
    mensaje: this.contactForm.get('message')?.value
  };
/*
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
*/
  this.http.post('http://192.168.1.4:8000/comentarios', formData).subscribe({
    next: (res) => {
      console.log('Formulario enviado:', res);
      alert('Formulario enviado correctamente');
      this.contactForm.reset();
      this.selectedFile = null;
    },
    error: (err) => {
      console.error('Error al enviar:', err);
      alert('Hubo un problema al enviar el formulario');
    }
  });
}

}
