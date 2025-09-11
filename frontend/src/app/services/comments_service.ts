import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//Estructura que tendrá un comentario:
export interface CommentModel {
  id?: number;
  titulo: string;
  nombre: string;
  mensaje: string;
  correo: string;
}

//Indica que este servicio es inyectable y estará disponible en toda la aplicación
@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8000/comentarios';

  constructor(private http: HttpClient) {}

  createComment(comment: CommentModel): Observable<CommentModel> {
    return this.http.post<CommentModel>(`${this.apiUrl}/`, comment);
  }

  getComment(id: number): Observable<CommentModel> {
    return this.http.get<CommentModel>(`${this.apiUrl}/${id}`);
  }

  getAllComments(): Observable<CommentModel[]> {
    return this.http.get<CommentModel[]>(`${this.apiUrl}/`);
  }

  updateComment(id: number, comment: CommentModel): Observable<CommentModel> {
    return this.http.put<CommentModel>(`${this.apiUrl}/${id}`, comment);
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
