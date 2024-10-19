import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PokedexService } from './pokedex.service';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly API_URL = 'https://pokeapi.co/api/v2/';

  constructor(private http: HttpClient, private pokedexService: PokedexService) {}

  // Método principal para generar un Pokémon
  getPokemon(id: number, level: number, heldItem?: string): Observable<any> {
    return new Observable((observer) => {
      this.http.get(`${this.API_URL}pokemon/${id}`).subscribe((pokemonData: any) => {
        // Obtener la información adicional desde el PokedexService
        this.pokedexService.getPokemonInfo(id).subscribe((pokedexData: any) => {
          const pokemon = {
            species: pokemonData.name,
            mote: pokemonData.name,
            gender: this.getGender(),
            nature: this.getNature(),
            baseStats: this.getBaseStats(pokemonData.stats),
            evs: this.generateEVs(),
            ivs: this.generateIVs(),
            level: level,
            attacks: this.getAttacks(pokedexData.movesByLevel, pokedexData.movesByMachine, level),
            ability: this.getAbility(pokemonData.abilities),
            baseExperience: pokemonData.base_experience,
            nextLevelExperience: this.getNextLevelExperience(level),
            evolutionMethod: pokedexData.evolutionMethod,
            evolutionRoute: pokedexData.evolutionRoute,
            canEvolve: this.canEvolve(pokedexData.evolutionMethod, level, id, heldItem),
            image: pokedexData.image,
            weight: pokedexData.weight,
            height: pokedexData.height,
            evsGiven: pokedexData.evsGiven,
            abilities: pokedexData.abilities,
            heldItem: heldItem,
          };
          observer.next(pokemon);
          observer.complete();
        });
      });
    });
  }

  // Verificar si el Pokémon puede evolucionar
  private canEvolve(evolutionMethod: string, currentLevel: number, id: number, heldItem?: string): boolean {
    if (evolutionMethod.startsWith('Nivel')) {
      const requiredLevel = parseInt(evolutionMethod.split(' ')[1]);
      return currentLevel >= requiredLevel;
    }

    // Evoluciones por intercambio (requiere nivel 42 y objeto específico)
    if (evolutionMethod === 'Intercambio') {
      if (currentLevel >= 42) {
        const requiredItem = this.getRequiredItemForEvolution(id);
        if (requiredItem && heldItem === requiredItem) {
          return true;
        } else if (!requiredItem) {
          return true; // Sin objeto, como Gengar
        }
      }
    }

    // Evoluciones de cadenas como Porygon
    if (evolutionMethod === 'Porygon Chain') {
      if (id === 137 && currentLevel >= 20) {
        return true;
      }
      if (id === 233 && currentLevel >= 42) {
        return true;
      }
    }

    return false;
  }

  // Obtener género aleatorio
  private getGender(): string {
    return Math.random() > 0.5 ? 'Male' : 'Female';
  }

  // Obtener naturaleza aleatoria
  private getNature(): string {
    const natures = ['Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty', 'Bold'];
    return natures[Math.floor(Math.random() * natures.length)];
  }

  // Generar las estadísticas base del Pokémon
  private getBaseStats(stats: any[]): any {
    return stats.map(stat => ({
      name: stat.stat.name,
      base: stat.base_stat,
    }));
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

  // Generar EVs iniciales
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

  // Obtener ataques que el Pokémon puede aprender por nivel y por MT/MO
  private getAttacks(movesByLevel: any[], movesByMachine: any[], level: number): any[] {
    const availableMoves = movesByLevel.filter(move => move.level <= level);
    return availableMoves.length > 4 ? availableMoves.slice(0, 4) : availableMoves;
  }

  // Obtener la habilidad del Pokémon
  private getAbility(abilities: any[]): string {
    return abilities.length > 0 ? abilities[0].ability.name : 'Unknown';
  }

  // Calcular la experiencia necesaria para el siguiente nivel
  private getNextLevelExperience(level: number): number {
    return Math.pow(level + 1, 3);
  }

  // Método para incrementar los EVs
  incrementEV(evs: any, stat: string, value: number): any {
    evs[stat] = Math.min(252, evs[stat] + value);
    return evs;
  }

  // Método para subir de nivel
  levelUp(pokemon: any): any {
    pokemon.level++;
    pokemon.nextLevelExperience = this.getNextLevelExperience(pokemon.level);
    return pokemon;
  }

  // Obtener el objeto requerido para la evolución por intercambio
  private getRequiredItemForEvolution(id: number): string | null {
    const tradeEvolutionsWithItems = {
      66: 'Cinturón Negro',  // Machamp
      63: 'Cuchara Torcida',  // Alakazam
      208: 'Revestimiento Metálico',  // Steelix
      212: 'Revestimiento Metálico',  // Scizor
      186: 'Roca del Rey',  // Politoed
      230: 'Escama Dragón',  // Kingdra
      233: 'Disco Extraño',  // Porygon-Z
      604: 'Escama Marina'   // Electivire
    };
    return tradeEvolutionsWithItems[id] || null;
  }
}

