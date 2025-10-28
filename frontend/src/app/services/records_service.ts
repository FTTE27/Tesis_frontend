import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Modelo de Registro (lo afinamos más abajo)
export interface Registro {
    id: number;
    fecha: string;                 
    hora: string;                  
    estado: string;                // DN.keras | CNN.keras | IN.keras
    probabilidad_viral: number;
    probabilidad_bacteriana: number;
    probabilidad_sano: number;
    username: string;
    radiografia: string;
    nombre_archivo: string;
}


@Injectable({
  providedIn: 'root'
})
export class RecordsService {
  private apiUrl = 'http://192.168.1.4:8000/registros';

  constructor(private http: HttpClient) {}

  getAllRecords(): Observable<Registro[]> {
    return this.http.get<Registro[]>(this.apiUrl);
  }

  getRecordById(id: number): Observable<Registro> {
    return this.http.get<Registro>(`${this.apiUrl}/${id}`);
  }

  getRegistroEsp(id: number): Observable<Registro> {
    return this.http.get<Registro>(`${this.apiUrl}/esp/${id}`);
  }

  createRecord(record: Registro): Observable<Registro> {
    return this.http.post<Registro>(this.apiUrl, record);
  }

  updateRecord(id: number, record: Registro): Observable<Registro> {
    return this.http.put<Registro>(`${this.apiUrl}/${id}`, record);
  }

  deleteRecord(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
