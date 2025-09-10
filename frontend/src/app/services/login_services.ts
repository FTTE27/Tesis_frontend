import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// Estructura exacta de lo que esperamos del backend al iniciar sesión.
interface LoginResponse {
    access_token: string;
    token_type: string;
    rol : string;
  }

@Injectable({ 
    providedIn: 'root' // Registra el servicio a nivel raíz → instancia única (singleton) en toda la app
})

export class LoginService {
    private apiUrl = 'http://localhost:8000/auth'; // URL donde corre el backend FastAPI

     // Inyectamos HttpClient por constructor (DI de Angular)
    constructor(private http: HttpClient) {}

    // Método para hacer login usando FastAPI
    login(username: string, password: string): Observable<LoginResponse> {
        // Construimos el cuerpo en formato URL-encoded:
        const body = new URLSearchParams();
        body.set('username', username);
        body.set('password', password);

        // Cabeceras para indicar el Content-Type correcto que espera FastAPI
        // FastAPI usa OAuth2PasswordRequestForm, que espera 'application/x-www-form-urlencoded', no JSON.
    const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
    });
    // Hacemos la petición POST al backend y usamos catchError para mapear el error a un mensaje legible.
    // retorna un Observable tipado con LoginResponse.
    return this.http.post<LoginResponse>(this.apiUrl, body.toString(), { headers }).pipe(
      tap((res: LoginResponse) => {
        // Guardamos el token en localStorage
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('rol', res.rol);
      }),
      catchError(this.handleError)
      );
    } 

    //logout
    logout(): Observable<any> {
      return this.http.post(`${this.apiUrl}/logout`, {}, {}).pipe(
        tap(() => {
          // Limpiar storage del navegador
          localStorage.removeItem('token');
          localStorage.removeItem('rol');
        })
      );
    }

  
    // Manejo de error del login
    private handleError(error: HttpErrorResponse) {
      let msg = 'Usuario o contraseña incorrectos'; // Mensaje por defecto
      if (error.error && error.error.detail) {
        msg = error.error.detail; // Lo que devuelves en FastAPI (ej. "Usuario incorrecto" o "Contraseña incorrecta")
      }
      return throwError(() => msg);
    }
    
    // Métodos auxiliares para manejar el token y rol en localStorage
    getToken(): string | null {
      return localStorage.getItem('token');
    }
  
    getRol(): string | null {
      return localStorage.getItem('rol');
    }
  
    isLoggedIn(): boolean {
      return !!this.getToken();
    }
}