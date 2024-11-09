import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class PokeAPIService {
  http=inject(HttpClient);
  url='https://pokeapi.co/api/v2/';
  //POKEMON
  getPokemonByID(id:string):Observable<any>{
    return this.http.get<any>(this.url+"pokemon/"+id);
  }
  //STATS
  getStatsByID(id:string):Observable<any>{
    return this.http.get<any>(this.url+"stat/"+id);
  }  
  //MOVES
  getMoveByName(name:string):Observable<any>{
    return this.http.get<any>(this.url+"move/"+name);
  }
  //SPRITES

}

/*
  Investigar la forma de buscar la informacion del pokemon por separado:
  INFO GENERAL
  ID - NOMBRE - TIPOS
  ESTADISTICAS BASE
  MOVIMIENTOS
  SPRITES
  Realizar los metodos get de esa informacion en la pokeAPIServices y luego pasarlos para ir probando la forma 
  de realizar el formulario.
*/

/*
  // Obtener naturaleza aleatoria
  private getNature(): string {
    const natures = ['Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty', 'Bold'];
    return natures[Math.floor(Math.random() * natures.length)];
  }

  // Generar IVs aleatorios
  private generateIVs(): any {
    return {
      hp: Math.floor(Math.random() * 32),
      attack: Math.floor(Math.random() * 32),
      defense: Math.floor(Math.random() * 32),
      special_attack: Math.floor(Math.random() * 32),
      special_defense: Math.floor(Math.random() * 32),
      speed: Math.floor(Math.random() * 32),
    };
  }

    private generateEVs(): any {
    return {
      hp: 0,
      attack: 0,
      defense: 0,
      special_attack: 0,
      special_defense: 0,
      speed: 0,
    };
  }

    incrementEV(evs: any, stat: string, value: number): any {
    evs[stat] = Math.min(252, evs[stat] + value);
    return evs;
  }

*/