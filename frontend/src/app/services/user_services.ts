import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface User {
  id?: number;        // lo maneja backend
  nombre: string;
  username: string;
  password?: string;  // solo se envía al crear
  rol: string;      // backend lo setea en "user"
  disabled: boolean; // backend lo setea en false
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://192.168.1.4:8000/usuarios'; // ajusta al endpoint real

  constructor(private http: HttpClient) {}

  // Crear usuario
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user)
      .pipe(catchError(this.handleError));
  }

  // Obtener todos los usuarios (filtraremos en el front los que sean role=user)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }
  

  // Actualizar usuario
  updateUser(id: number, user: User): Observable<User> {
    const body: any = {
      nombre: user.nombre,
      username: user.username
    };
    
    // Solo enviamos password si el admin escribió una nueva
    if (user.password && user.password.trim() !== '') {
        body.password = user.password;
      }
  
      return this.http.put<User>(`${this.apiUrl}/${id}`, body)
        .pipe(catchError(this.handleError));
    }

  // Eliminar usuario
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }
    // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let msg = 'Error en la solicitud';
    if (error.error && error.error.detail) {
      msg = error.error.detail;
    }
    return throwError(() => msg);
  }
}
