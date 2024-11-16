import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pokemon } from '../../Interfaces/pokemon';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  http=inject(HttpClient);
  urlBase="http://localhost:3000/pokemons"
  
  //POST:
  addPokemon(pokemon:Pokemon):Observable<Pokemon>{
    return this.http.post<Pokemon>(this.urlBase, pokemon);
  }

  //GET:
  getPokemons():Observable<Pokemon[]>{
    return this.http.get<Pokemon[]>(this.urlBase);
  }
  
  getPokemonByID(id:string):Observable<Pokemon>{
    return this.http.get<Pokemon>(this.urlBase+"/"+id);
  }

  getPokemonsByType(type: string): Observable<Pokemon[]> {
    return this.getPokemons().pipe(
      map((pokemons: Pokemon[]) =>
        pokemons.filter(pokemon => pokemon.tipos.includes(type))
      )
    );
  }
  
  //PUT
  updatePokemon(pokemon: Pokemon): Observable<Pokemon> {
    return this.http.put<Pokemon>(this.urlBase+"/"+pokemon.id, pokemon);
  }

  //PATCH
  patchPokemon(id: string, partialData: Partial<Pokemon>): Observable<Pokemon> {
    return this.http.patch<Pokemon>(this.urlBase+"/"+id, partialData);
  }
  
  //DELETE
  deletePokemon(id: string): Observable<void> {
    return this.http.delete<void>(this.urlBase+"/"+id);
  }
}
