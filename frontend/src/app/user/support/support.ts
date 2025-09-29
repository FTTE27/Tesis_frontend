import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login_services';
import { Router } from '@angular/router';
import { CommentService, CommentModel } from '../../services/comments_service';

@Component({
  selector: 'app-support',
  imports: [Header, Footer, CommonModule, ReactiveFormsModule],
  templateUrl: './support.html',
  styleUrl: './support.css'
})
export class Support implements OnInit {
  contactForm!: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: LoginService,
    private router: Router,
    private commentService: CommentService   
  ) {}

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

    const comment: CommentModel = {
      nombre: this.contactForm.get('name')?.value,
      titulo: this.contactForm.get('title')?.value,
      correo: this.contactForm.get('email')?.value,
      mensaje: this.contactForm.get('message')?.value
    };

    this.commentService.createComment(comment).subscribe({
      next: (res) => {
        console.log('Comentario enviado:', res);
        alert('Comentario enviado correctamente');
        this.contactForm.reset();
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('Error al enviar comentario:', err);
        alert('Hubo un problema al enviar el comentario');
      }
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        console.error('Error en logout:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        this.router.navigate(['/']);
      }
    });
  }
}
