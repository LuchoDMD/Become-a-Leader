import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokeAPIService 
{
  http=inject(HttpClient);
  url='https://pokeapi.co/api/v2/';
  //POKEMON
  getPokemonByID(id:string):Observable<any>{
    return this.http.get<any>(this.url+"pokemon/"+id);
  }
  //STATS

  //MOVES

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