import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root',
})
export class PokeAPIService {
  http = inject(HttpClient);
  url = 'https://pokeapi.co/api/v2/';
  private translate_service = inject(TranslateService);

  private getCurrentLang(): string {
    // Ensure we are getting the current active language, defaulting to 'en'
    return this.translate_service.currentLang || 'en';
  }

  //POKEMON
  getPokemonByID(id: string): Observable<any> {
    return this.http.get<any>(this.url + 'pokemon/' + id);
  }
  //STATS
  getStatsByID(id: string): Observable<any> {
    return this.http.get<any>(this.url + 'stat/' + id);
  }

  getPokemonDetails(idOrName: string | number): Observable<any> {
    return this.http.get<any>(`${this.url}pokemon/${idOrName}`).pipe(
      switchMap((pokemonData) => {
        const pokemonId = pokemonData.id;

        return this.getLocalizedSpeciesData(pokemonId).pipe(
          map((localizedData) => {
            return {
              ...pokemonData,
              ...localizedData,
              name: localizedData.localizedName,
              especie: localizedData.localizedName,
            };
          })
        );
      })
    );
  }
  //MOVES
  getMoveByName(name: string): Observable<any> {
    const currentLang = this.getCurrentLang();

    return this.http.get<any>(this.url + 'move/' + name).pipe(
      map((moveData) => {
        const localizedName = moveData.names.find(
          (n: any) => n.language.name === currentLang
        );

        const localizedEffect = moveData.effect_entries.find(
          (e: any) => e.language.name === currentLang
        );

        return {
          ...moveData,
          name: localizedName ? localizedName.name : moveData.name,
          effect: localizedEffect
            ? localizedEffect.effect
            : 'No effect description found.',
        };
      })
    );
  }

  getMoveLocalizedName(name: string): Observable<string> {
    return this.getMoveByName(name).pipe(
      map(localizedMoveData => {
        return localizedMoveData.name;
      })
    );
  }

  private getLocalizedSpeciesData(
    idOrName: string | number
  ): Observable<{ localizedName: string; flavor_text: string }> {
    const currentLang = this.getCurrentLang();

    return this.http.get<any>(`${this.url}pokemon-species/${idOrName}`).pipe(
      map((speciesData) => {
        const localizedNameEntry = speciesData.names.find(
          (name: any) => name.language.name === currentLang
        );
        const flavorEntry = speciesData.flavor_text_entries.find(
          (entry: any) => entry.language.name === currentLang
        );
        return {
          localizedName: localizedNameEntry
            ? localizedNameEntry.name
            : speciesData.name,
          flavor_text: flavorEntry
            ? flavorEntry.flavor_text.replace(/[\n\r\f]/g, ' ')
            : 'No description found.',
        };
      })
    );
  }

  getLocalizedTypeName(typeName: string): Observable<string> {
    const currentLang = this.getCurrentLang();

    return this.http.get<any>(`${this.url}type/${typeName}`).pipe(
      map(typeData => {
        const localizedNameEntry = typeData.names.find(
          (name: any) => name.language.name === currentLang
        );
        // Returns the localized name if found, otherwise transforms the API name (e.g., 'fire' -> 'Fire')
        return localizedNameEntry ? localizedNameEntry.name : this.transformarPrimeraLetra(typeName);
      })
    );
  }
  getPokemonLocalizedName(name: string): Observable<string> {
    return this.getLocalizedSpeciesData(name).pipe(
      map(data => data.localizedName)
    );
  }

  private transformarPrimeraLetra(nombre: string): string {
    if (!nombre) return nombre;
    return nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
  }
  //SPRITES
  getSpriteByID(id: string): Observable<any> {
    return this.http
      .get<any>(this.url + 'pokemon/' + id)
      .pipe(map((data: any) => data?.sprites));
  }
  //Lista de pokemon
  getPokemonList(limit: number = 20, offset: number = 0): Observable<any> {
    return this.http.get<any>(
      `${this.url}pokemon?limit=${limit}&offset=${offset}`
    );
  }
  // Especie de pokemon:
  getPokemonSpecies(idOrName: string | number): Observable<any> {
    return this.http.get<any>(`${this.url}pokemon-species/${idOrName}`);
  }
  // Tipo de pokemon:
  getTypeDetails(idOrName: string | number): Observable<any> {
    return this.http.get<any>(`${this.url}type/${idOrName}`);
  }
}