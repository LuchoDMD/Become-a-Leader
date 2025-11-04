import { Component, inject, OnInit } from '@angular/core';
import { Pokemon } from '../../interface/pokemon';
import { TeamService } from '../../service/team.service';
import { PokeAPIService } from '../../service/poke-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs'; // Necesario para el pipe async
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent implements OnInit {
  // Variables
  pokemon: Pokemon = {
    id: '',
    especie: '',
    tipos: [],
    nivel: 0,
    vidaActual: 0,
    estadisticas: { hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0 },
    movimientos: [],
    idEntrenador: ''
  };
  sprites: any;
  pokeID: string = '';

  // Injectables
  ts = inject(TeamService);
  ps = inject(PokeAPIService);
  route = inject(Router);
  aroute = inject(ActivatedRoute);
  translate = inject(TranslateService);

  // Metodos
  ngOnInit(): void {
    this.aroute.paramMap.subscribe({
      next: (params) => {
        if (params.get('id')) {
          this.pokeID = params.get('id') ?? '';
          this.loadPokemonData(this.pokeID);
        }
      },
      error: (err: Error) => {
        console.log("ERROR: " + err.message);
      }
    });
  }

  async loadPokemonData(id: string) {
    if (id) {
      this.ts.getPokemonPorId(id).subscribe({
        next: async (data: Pokemon) => {
          this.pokemon = data;
          await this.localizePokemonData(this.pokemon);
        },
        error: (err: Error) => {
          console.log("ERROR al cargar Pokémon: " + err.message);
        }
      });

      this.ps.getSpriteByID(id).subscribe({
        next: (data) => {
          this.sprites = data;
        },
        error: (err: Error) => {
          console.log("ERROR al cargar sprites: " + err.message);
        }
      });
    }
  }

async localizePokemonData(pokemon: Pokemon): Promise<void> {
    const localizedPokemonName = await this.ps.getPokemonDetails(pokemon.especie).toPromise();
    if (localizedPokemonName?.name) {
      pokemon.especie = localizedPokemonName.name;
    }

    const typePromises = pokemon.tipos.map(async (tipo) => {
      return await this.ps.getLocalizedTypeName(tipo).toPromise() ?? tipo;
    });

    pokemon.tipos = await Promise.all(typePromises);
    
    const movePromises = pokemon.movimientos.map(async (move) => {
      const localizedName = await this.ps.getMoveLocalizedName(move.nombre).toPromise();
      if (localizedName) {
        move.nombre = localizedName;
      }
      
      const localizedType = await this.ps.getLocalizedTypeName(move.tipo).toPromise();
      if (localizedType) {
        move.tipo = localizedType;
      }
    });

    await Promise.all(movePromises);
}
  
  transformarPrimeraLetra(nombre: string): string {
    if (!nombre) return nombre;
    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
  }
  
   
  getTranslatedTypeName(typeName: string): Observable<string> {
    return this.ps.getLocalizedTypeName(typeName);
  }

  volverALista() {
    this.route.navigate(['pokemon-list']);
  }

  irAModificar(id: string) {
    this.route.navigate(['pokemon-edit/' + id]);
  };

  borrarPokemon(id: string) {
    this.ts.deletePokemon(id).subscribe(
      {
        next: () => {
          this.route.navigate(['pokemon-list']);
        },
        error: (error: Error) => {
          console.log("Error al borrar pokemon: " + error.message);
        }
      }
    );
  }
}