import { Component, inject, OnInit } from '@angular/core';
import { Pokemon } from '../../interface/pokemon';
import { PokeAPIService } from '../../service/poke-api.service';
import { TeamService } from '../../service/team.service';
import { Move } from '../../interface/move';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-pokemon',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './edit-pokemon.component.html',
  styleUrl: './edit-pokemon.component.css'
})
export class EditPokemonComponent implements OnInit {
  // ... Variables sin cambios ...
  pokemon: Pokemon = {
    id: '',
    especie: '',
    tipos: [],
    nivel: 0,
    vidaActual: 0,
    estadisticas:
    {
      hp: 0,
      atk: 0,
      def: 0,
      satk: 0,
      sdef: 0,
      spd: 0
    },
    movimientos: [],
    idEntrenador: ''
  };
  movesList: Move[] = [];
  pokeID: string = '';
  pokemonMoveID: number = -1;
  moveListID: number = -1;

  // ... Injectables sin cambios ...
  ps = inject(PokeAPIService);
  ts = inject(TeamService);
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
        // Usando traducción del servicio de traducción
        console.log(this.translate.instant("log.errorGeneral") + ": " + err.message);
      }
    });
  }

  async loadPokemonData(id: string) {
    // 1. Cargar el Pokémon del entrenador
    this.ts.getPokemonByID(id).subscribe({
      next: async (data: Pokemon) => {
        this.pokemon = data;
        // Localizar el Pokémon y sus movimientos actuales
        await this.localizePokemon(this.pokemon);
      },
      error: (err: Error) => {
        console.log(this.translate.instant("log.pokemonFetchError") + ": " + err.message);
      }
    });

    // 2. Obtener la lista COMPLETA de movimientos y localizarlos.
    this.ps.getPokemonByID(id).subscribe({
      next: async (poke: any) => {
        if (poke) {
          const movePromises: Promise<void>[] = [];

          for (let i = 0; i < poke.moves.length; i++) {
            // El nombre en inglés/API es poke.moves[i].move.name
            const originalApiName = poke.moves[i].move.name;

            const movePromise = new Promise<void>((resolve, reject) => {
              this.ps.getMoveByName(originalApiName).subscribe({
                next: async (moveData) => {
                  // moveData.name ya está localizado, moveData.type.name es el nombre en inglés.
                  if (moveData.damage_class.name != 'status' && moveData.power > 0) {
                    let m: Move = {
                      nombre: moveData.name, // Nombre ya localizado
                      tipo: moveData.type.name, // Nombre del tipo en inglés, se localizará después
                      clase: this.transformarPrimeraLetra(moveData.damage_class.name),
                      potencia: moveData.power,
                      precision: moveData.accuracy,
                      usos: moveData.pp,
                      pp: moveData.pp,
                      // Guardamos el nombre y tipo original para el proceso de deslocalización
                      originalName: originalApiName,
                      originalType: moveData.type.name,
                    };

                    // Localizar el tipo para la UI
                    await this.localizeMoveType(m);
                    this.movesList.push(m);
                  }
                  resolve();
                },
                error: (err: Error) => {
                  console.log(this.translate.instant("log.moveFetchError") + ": " + err.message);
                  resolve();
                }
              });
            });
            movePromises.push(movePromise);
          }

          await Promise.all(movePromises);
          console.log(this.movesList);
        }
      },
      error: (err: Error) => {
        console.log(this.translate.instant("log.pokeAPIFetchError") + ": " + err.message);
      }
    });
  }

  async localizePokemon(pokemon: Pokemon): Promise<void> {

    const localizedPokemonName = await this.ps.getPokemonLocalizedName(pokemon.especie).toPromise();
    if (localizedPokemonName) {
      pokemon.especie = localizedPokemonName;
    }

    const localizationPromises: Promise<void>[] = [];

    localizationPromises.push(
      ...pokemon.tipos.map(async (tipo, index) => {
        const localizedType = await this.ps.getLocalizedTypeName(tipo).toPromise();
        if (localizedType) pokemon.tipos[index] = localizedType;
      })
    );

    localizationPromises.push(
      ...pokemon.movimientos.map(move => this.forceRelocalizeCurrentMove(move))
    );

    await Promise.all(localizationPromises);
  }

  // Actualizado: Guarda el nombre original antes de la traducción y utiliza el tipo original.
  async forceRelocalizeCurrentMove(move: Move): Promise<void> {
    try {
      // Al cargar desde Firestore, move.nombre y move.tipo son los nombres en inglés.
      // Los guardamos como originales antes de la traducción para poder deslocalizar SIN API calls.
      move.originalName = move.nombre;
      move.originalType = move.tipo;

      // Carga la información del movimiento usando el nombre original (en inglés)
      const originalMoveData = await this.ps.getMoveByName(move.originalName).toPromise();

      if (originalMoveData) {
        // move.nombre se sobrescribe con el nombre localizado para la UI.
        move.nombre = originalMoveData.name;

        // Re-localiza el tipo (que sigue siendo el nombre en inglés en move.tipo)
        await this.localizeMoveType(move);
      }
    } catch (error) {
      console.error(this.translate.instant("log.moveRelocalizationError"), move.nombre, error);
    }
  }


  async localizeMoveNameAndType(move: Move): Promise<void> {
    // Guardar el nombre original antes de la traducción
    move.originalName = move.nombre;

    // El servicio getMoveLocalizedName ya hace la llamada a getMoveByName que traduce.
    const localizedName = await this.ps.getMoveLocalizedName(move.nombre).toPromise();
    if (localizedName) {
      move.nombre = localizedName;
    }

    // Localizar el tipo del movimiento
    await this.localizeMoveType(move);
  }

  // Localiza solo el tipo del movimiento (y asume que move.tipo es el nombre en inglés)
  async localizeMoveType(move: Move): Promise<void> {
    // Guardar el tipo original antes de la traducción
    move.originalType = move.tipo;

    const localizedType = await this.ps.getLocalizedTypeName(move.tipo).toPromise();
    if (localizedType) {
      move.tipo = localizedType;
    }
  }

  // --- ACTUALIZADO: NUEVO MÉTODO PARA REVERTIR LA TRADUCCIÓN SIN LLAMADAS A LA API PARA MOVIMIENTOS ---
  async deslocalizePokemon(pokemon: Pokemon): Promise<Pokemon> {
    // 1. Crear una copia profunda para modificar el objeto de guardado, no el de la UI
    const pokemonToSave: Pokemon = JSON.parse(JSON.stringify(pokemon));

    // 2. Deslocalizar Especie (Nombre a inglés)
    try {
      // Esta API call sigue siendo necesaria para la especie
      const originalName = await this.ps.getPokemonOriginalName(pokemonToSave.especie).toPromise();
      if (originalName) {
        pokemonToSave.especie = originalName;
      }
    } catch (e) { /* Si falla la API, mantenemos el nombre existente */ }

    // 3. Deslocalizar Tipos (a inglés)
    pokemonToSave.tipos = await Promise.all(
      pokemonToSave.tipos.map(async (tipo) => {
        try {
          // Esta API call sigue siendo necesaria para los tipos de Pokémon
          const originalType = await this.ps.getOriginalTypeName(tipo).toPromise();
          return originalType || tipo;
        } catch (e) { return tipo; }
      })
    );

    // 4. Deslocalizar Movimientos (Nombre y Tipo a inglés)
    // Usamos los campos 'originalName' y 'originalType' para evitar llamadas a la API
    pokemonToSave.movimientos = pokemonToSave.movimientos.map((move) => {
      // Si 'originalName' existe (porque el movimiento fue cargado o reemplazado correctamente), 
      // lo usamos; si no, caemos en el nombre de la UI (que podría estar traducido, 
      // pero es el mejor intento)
      const nameToSave = move.originalName || move.nombre;
      const typeToSave = move.originalType || move.tipo;

      return {
        ...move,
        nombre: nameToSave,
        tipo: typeToSave
      } as Move;
    });

    return pokemonToSave;
  }
  // ---------------------------------------------------------------------

  // 💡 Helper de capitalización (mantenido)
  transformarPrimeraLetra(nombre: string): string {
    if (!nombre) return nombre;
    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
  }

  seleccionarMovimiento(id: number) {
    this.pokemonMoveID = id;
  }

  volverALista() {
    this.route.navigate(['pokemon-list']);
  }

  cambiarMovimientos(indexMovP: number, indexMoveList: number) {
    if (indexMovP != undefined && indexMoveList != undefined) {
      const newMove = this.movesList[indexMoveList];
      newMove.usos = newMove.pp;
      this.pokemon.movimientos[indexMovP] = newMove;
      this.pokemonMoveID = -1;
      this.moveListID = -1;
    }
  }

  guardarCambios() {
    this.deslocalizePokemon(this.pokemon).then(pokemonToSave => {
      // Guardamos el Pokémon con todos los nombres en su versión original (inglés)
      this.ts.updatePokemon(pokemonToSave.id, pokemonToSave).subscribe({
        next: () => {
          const successMsg = this.translate.instant("editMoves.successMessage");
          console.log(successMsg);
          // alert(successMsg); // Reemplazado por console.log para cumplir con las directrices.
          this.route.navigate(['pokemon-detail/' + this.pokemon.id]);
        },
        error: (err: Error) => {
          console.log(this.translate.instant("log.saveChangesError") + ": " + err.message);
        }
      });
    }).catch(error => {
      console.error(this.translate.instant("log.saveChangesError"), "Error al preparar datos para guardar:", error);
    });
  }
}