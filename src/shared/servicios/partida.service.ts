import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Partida } from '../../app/db/partidas_db/partida';

@Injectable({
  providedIn: 'root'
})
export class PartidaService {
  baseUrl:string = "http://localhost:3000/partidas";
  http:HttpClient = inject(HttpClient);
  constructor() { };
  verificarExistenciaPartida(id_usuario:string|null|undefined):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/${id_usuario}`);
  }
  obtenerPartidaUsuario(id_usuario:string|null|undefined): Observable<Partida|null>{
    return this.http.get<Partida[]>(`${this.baseUrl}/${id_usuario}`).pipe(
      map( (partidas) => {
        return partidas.length > 0 ? partidas[0] : null;
      })
    );
  }
  postPartida(partida:Partida):Observable<Partida>{
    return this.http.post<Partida>(this.baseUrl, partida);
  }
  eliminarPartida(id_usuario:string|null|undefined):Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/${id_usuario}`);
  }
}
