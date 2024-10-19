import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokedexService {
  private readonly API_URL = 'https://pokeapi.co/api/v2/';

  constructor(private http: HttpClient) {}

  // Obtener información detallada del Pokémon por su ID
  getPokemonInfo(id: number): Observable<any> {
    return new Observable((observer) => {
      this.http.get(`${this.API_URL}pokemon-species/${id}`).subscribe((speciesData: any) => {
        this.http.get(`${this.API_URL}pokemon/${id}`).subscribe((pokemonData: any) => {
          const pokemonInfo = {
            name: pokemonData.name,
            image: pokemonData.sprites.front_default,
            species: speciesData.genera.find(g => g.language.name === 'en').genus,
            weight: pokemonData.weight,
            height: pokemonData.height,
            genderRate: speciesData.gender_rate,
            abilities: pokemonData.abilities.map((ability: any) => ability.ability.name),
            evsGiven: pokemonData.stats
              .filter((stat: any) => stat.effort > 0)
              .map((stat: any) => ({ stat: stat.stat.name, effort: stat.effort })),
            movesByLevel: pokemonData.moves
              .filter((move: any) => move.version_group_details[0].move_learn_method.name === 'level-up')
              .map((move: any) => ({
                name: move.move.name,
                level: move.version_group_details[0].level_learned_at,
              })),
            movesByMachine: pokemonData.moves
              .filter((move: any) => move.version_group_details[0].move_learn_method.name === 'machine')
              .map((move: any) => move.move.name),
            evolutionMethod: this.getEvolutionMethod(speciesData),
            evolutionRoute: this.getEvolutionRoute(speciesData),
          };
          observer.next(pokemonInfo);
          observer.complete();
        });
      });
    });
  }

  // Obtener el método de evolución del Pokémon
  private getEvolutionMethod(speciesData: any): string {
    if (speciesData.evolution_chain) {
      return speciesData.evolves_from_species ? 'Nivel ' + 42 : 'Intercambio';
    }
    return 'No Evoluciona';
  }

  // Obtener la ruta evolutiva del Pokémon
  private getEvolutionRoute(speciesData: any): any[] {
    const evolutionChainUrl = speciesData.evolution_chain.url;
    return this.http.get(evolutionChainUrl).subscribe((evolutionChainData: any) => {
      return evolutionChainData.chain.evolves_to.map((evo: any) => ({
        species: evo.species.name,
        evolutionMethod: evo.evolution_details[0].trigger.name,
      }));
    });
  }
}

