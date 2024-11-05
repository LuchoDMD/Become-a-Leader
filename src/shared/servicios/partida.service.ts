import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartidaService {
  baseUrl:string = "http://localhost:3000/partidas";
  http:HttpClient = inject(HttpClient);
  constructor() { };
  verificarExistenciaPartida(id:string|null|undefined):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
}
