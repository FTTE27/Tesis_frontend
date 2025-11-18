import { Component, OnInit} from '@angular/core';
import { HeaderAdmin } from '../header-admin/header-admin';
import { CommonModule } from '@angular/common';
import { CommentService, CommentModel } from '../../services/comments_service';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [HeaderAdmin, CommonModule, FormsModule],
  templateUrl: './comments.html',
  styleUrl: './comments.css'
})


export class Comments implements OnInit {
  loading = true;
  isAdmin = false;

  comments: CommentModel[] = []; // Lista de comentarios
  selectedComment: CommentModel | null = null; // Comentario actualmente seleccionado para mostrar en el panel derecho
  searchTerm: string = ''; // Término de búsqueda para filtrar comentarios


  constructor(private commentService: CommentService, private login: LoginService, private router: Router) {}

  ngOnInit(): void {
  const rol = this.login.getRol();
  // Si no es admin, redirige al login
    if (rol !== 'admin') {
      this.router.navigate(['/upload']);
      return;  // para no ejecutar el resto de la pantalla
    }

  // si llegó aquí, significa que es admin
    this.isAdmin = true;
    this.loading = false;

  this.loadComments(); // Carga los comentarios

  }

  // Cargar todos los comentarios desde el backend
  loadComments() {
    this.commentService.getAllComments().subscribe({
      next: (data) => {
        this.comments = data;
      },
      error: (err) => {
        console.error('Error cargando comentarios', err);
      }
    });
  }

  // Método que se ejecuta al hacer clic en un comentario
  selectComment(item: CommentModel) {
    // aqui se dispara la acción de mostrar el detalle en el panel derecho
    console.log('Comentario seleccionado:', item);
    this.selectedComment = item;
  }

  // Filtra los comentarios según el término de búsqueda
  filteredComments(): CommentModel[] {
    if (!this.searchTerm.trim()) {
      return this.comments;
    }
    return this.comments.filter(c =>
      c.titulo?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.nombre?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.correo?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Elimina un comentario por su ID
  deleteComment(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este comentario?')) {
      return;
    }
    this.commentService.deleteComment(id).subscribe({
      next: () => {
        // Eliminar del array local
        this.comments = this.comments.filter(c => c.id !== id);

        // Si justo estaba seleccionado, limpiamos el panel derecho
        if (this.selectedComment && this.selectedComment.id === id) {
          this.selectedComment = null;
        }
        console.log('Comentario eliminado con éxito');
      },
      error: (err) => {
        console.error('Error eliminando comentario', err);
      }
    });
  }
}

