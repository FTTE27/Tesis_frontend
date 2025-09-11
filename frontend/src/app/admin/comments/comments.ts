import { Component, OnInit} from '@angular/core';
import { HeaderAdmin } from '../header-admin/header-admin';
import { CommonModule } from '@angular/common';
import { CommentService, CommentModel } from '../../services/comments_service';


@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [HeaderAdmin],
  templateUrl: './comments.html',
  styleUrl: './comments.css'
})


export class Comments implements OnInit {
// Lista de comentarios que se mostrarán en el panel izquierdo
  comments: CommentModel[] = [];
// Comentario actualmente seleccionado para mostrar en el panel derecho
  selectedComment: CommentModel | null = null;

  
  // Inyectamos el servicio de comentarios que se comunica con el backend
  constructor(private commentService: CommentService) {}

  //Ejucuta al iniciar el componente
  ngOnInit(): void {
    this.loadComments(); //cargamos los comentarios al iniciar
  }


  // Cargar todos los comentarios desde el backend
  loadComments() {
    this.commentService.getAllComments().subscribe({
      next: (data) => {
         // Cuando el backend responde correctamente, llenamos el array
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
}

