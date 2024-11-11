import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Partida } from '../interface/partida.js';  // Ajusta la ruta a la interface de partida

@Injectable({
  providedIn: 'root'
})
export class PartidaService {
  private urlBase = 'http://localhost:3000/partidas';  // Ruta donde obtienes las partidas

  constructor(private http: HttpClient) {}

  // Obtener partida por el id de usuario
  getPartidaByUserId(id_usuario: string): Observable<Partida | null> {
    return this.http.get<Partida[]>(`${this.urlBase}?id_usuario=${id_usuario}`).pipe(
      map(partidas => partidas.length ? partidas[0] : null)  // Devuelve la primera partida o null
    );
  }

  // Crear o actualizar partida
  postPartida(partida: Partida): Observable<Partida> {
    return this.http.post<Partida>(this.urlBase, partida);
  }
  eliminarPartida(id: string): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`);
  }

  actualizarPuntaje(id: string, puntuacion: number): Observable<any> {
  return this.http.patch(`${this.urlBase}/${id}`, { puntuacion: puntuacion });
}

}


