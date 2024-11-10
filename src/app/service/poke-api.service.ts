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
}

