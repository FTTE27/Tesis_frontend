import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// Estructura de lo que esperamos del backend.
interface LoginResponse {
  access_token: string;
  token_type: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = 'http://localhost:8000/auth';

  constructor(private http: HttpClient) {}

  private safeGetLocalStorageItem(key: string): string | null {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null;
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private safeSetLocalStorageItem(key: string, value: string): void {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
      localStorage.setItem(key, value);
    } catch {

    }
  }

  private safeRemoveLocalStorageItem(key: string): void {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
      localStorage.removeItem(key);
    } catch {

    }
  }


  // Login
  login(username: string, password: string): Observable<LoginResponse> {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, body.toString(), { headers }).pipe(
      tap((res: LoginResponse) => {
        // Usar setters seguros
        this.safeSetLocalStorageItem('token', res.access_token);
        this.safeSetLocalStorageItem('rol', res.rol);
      }),
      catchError(this.handleError)
    );
  }

  // logout
  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}, {}).pipe(
      tap(() => {
        this.safeRemoveLocalStorageItem('token');
        this.safeRemoveLocalStorageItem('rol');
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

  // Intenta decodificar JWT y devolver el objeto,
  private parseJwt(token: string | null): any | null {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = parts[1];
      if (typeof window === 'undefined' || typeof atob === 'undefined') {
        return null;
      }
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const pad = base64.length % 4;
      const padded = base64 + (pad ? '='.repeat(4 - pad) : '');
      const json = decodeURIComponent(escape(atob(padded)));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return this.safeGetLocalStorageItem('token');
  }

  getRol(): string | null {
    return this.safeGetLocalStorageItem('rol');
  }

  // Comprueba si hay token y que no esté expirado.
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.parseJwt(token);
    if (payload && payload.exp) {
      try {
        return payload.exp * 1000 > Date.now();
      } catch {
        return true;
      }
    }

    // Si no se pudo decodificar pero existe token, considerarlo logueado
    return true;
  }
}
