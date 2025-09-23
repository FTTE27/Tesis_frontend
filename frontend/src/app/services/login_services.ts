import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// Estructura exacta de lo que esperamos del backend al iniciar sesión.
interface LoginResponse {
  access_token: string;
  token_type: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = 'http://192.168.1.15:8000/auth'; // Base de la API

  constructor(private http: HttpClient) {}

  // Método para hacer login usando FastAPI
  login(username: string, password: string): Observable<LoginResponse> {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

   
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, body.toString(), { headers }).pipe(
      tap((res: LoginResponse) => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('rol', res.rol);
      }),
      catchError(this.handleError)
    );
  }

  // logout → sigue en /logout
  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}, {}).pipe(
      tap(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    let msg = 'Usuario o contraseña incorrectos';
    if (error.error && error.error.detail) {
      msg = error.error.detail;
    }
    return throwError(() => msg);
  }

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
