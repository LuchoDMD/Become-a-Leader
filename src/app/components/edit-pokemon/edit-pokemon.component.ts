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
export class EditPokemonComponent implements OnInit
{
  // ... Variables sin cambios ...
  pokemon:Pokemon={
    id:'',
    especie:'',
    tipos:[],
    nivel:0,
    vidaActual:0,
    estadisticas:
    {
      hp:0,
      atk:0,
      def:0,
      satk:0,
      sdef:0,
      spd:0
    },
    movimientos:[],
    idEntrenador:''
  };
  movesList:Move[]=[];
  pokeID:string='';
  pokemonMoveID:number=-1;
  moveListID:number=-1;

  // ... Injectables sin cambios ...
  ps=inject(PokeAPIService);
  ts=inject(TeamService);
  route=inject(Router);
  aroute=inject(ActivatedRoute);
  translate = inject(TranslateService);

  // Metodos
  ngOnInit(): void
  {
    this.aroute.paramMap.subscribe({
      next:(params)=>{
        if(params.get('id')){
          this.pokeID=params.get('id')??'';
          this.loadPokemonData(this.pokeID);
        }
      },
      error:(err:Error)=>{
        // Usando traducción del servicio de traducción
        console.log(this.translate.instant("log.errorGeneral") + ": " + err.message); 
      }
    });
  }

  async loadPokemonData(id: string) {
    // 1. Cargar el Pokémon del entrenador
    this.ts.getPokemonByID(id).subscribe({
      next: async (data:Pokemon)=>{
        this.pokemon=data;
        // Localizar el Pokémon y sus movimientos actuales
        await this.localizePokemon(this.pokemon); 
      },
      error:(err:Error)=>{
        console.log(this.translate.instant("log.pokemonFetchError") + ": " + err.message);
      }
    });
    
    // 2. Obtener la lista COMPLETA de movimientos y localizarlos.
    this.ps.getPokemonByID(id).subscribe({
      next: async (poke:any) => 
      {
        if(poke){
          const movePromises: Promise<void>[] = [];
          
          for(let i=0; i < poke.moves.length; i++)
          {
            const movePromise = new Promise<void>((resolve, reject) => {
              this.ps.getMoveByName(poke.moves[i].move.name).subscribe({
                next: async (moveData)=>{
                  // moveData ya está localizado gracias a PokeAPIService.getMoveByName
                  if(moveData.damage_class.name!='status' && moveData.power>0){
                    let m:Move={
                      nombre:moveData.name, // Nombre ya localizado
                      tipo:moveData.type.name,
                      clase:this.transformarPrimeraLetra(moveData.damage_class.name),
                      potencia:moveData.power,
                      precision:moveData.accuracy,
                      usos:moveData.pp,
                      pp:moveData.pp,
                    };
                    
                    // Solo necesitamos localizar el tipo del movimiento, si no lo hizo getMoveByName
                    await this.localizeMoveType(m); 
                    this.movesList.push(m);
                  }
                  resolve();
                },
                error:(err:Error)=>{
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
      error:(err:Error)=>{ 
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

async forceRelocalizeCurrentMove(move: Move): Promise<void> {
    try {
        // Carga la información original del movimiento usando el nombre actualmente guardado (traducido o no).
        // El método getMoveByName de PokeAPIService devuelve un objeto con el nombre traducido
        // en el campo 'name', pero también contiene la estructura completa para buscar el nombre original.
        const originalMoveData = await this.ps.getMoveByName(move.nombre).toPromise(); 
        
        if (originalMoveData) {
            // El campo 'name' del objeto 'originalMoveData' ya está en el idioma actual
            // gracias a la lógica implementada en PokeAPIService.
            
            // Re-asigna el nombre traducido
            move.nombre = originalMoveData.name; 
            
            // Re-localiza el tipo (si es necesario)
            await this.localizeMoveType(move);
        }
    } catch (error) {
        // En caso de que el nombre guardado sea tan diferente del original que la API no lo encuentre,
        // o si hay un error de red.
        console.error(this.translate.instant("log.moveRelocalizationError"), move.nombre, error);
    }
}


async localizeMoveNameAndType(move: Move): Promise<void> {
    // El servicio getMoveLocalizedName ya hace la llamada a getMoveByName que traduce.
    const localizedName = await this.ps.getMoveLocalizedName(move.nombre).toPromise(); 
    if (localizedName) {
      move.nombre = localizedName;
    }
    
    // Localizar el tipo del movimiento
    await this.localizeMoveType(move);
}

// Localiza solo el tipo del movimiento 
async localizeMoveType(move: Move): Promise<void> {
    const localizedType = await this.ps.getLocalizedTypeName(move.tipo).toPromise(); 
    if (localizedType) {
      move.tipo = localizedType;
    }
}

  // 💡 Helper de capitalización (mantenido)
  transformarPrimeraLetra(nombre: string): string {
    if (!nombre) return nombre;
    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
  }

  seleccionarMovimiento(id:number){
    this.pokemonMoveID=id;
  }

  volverALista()
  {
    this.route.navigate(['pokemon-list']);
  }

  cambiarMovimientos(indexMovP:number, indexMoveList:number)
  {
    if(indexMovP!=undefined&&indexMoveList!=undefined){
      const newMove = this.movesList[indexMoveList];
      newMove.usos = newMove.pp; 
      this.pokemon.movimientos[indexMovP] = newMove;
      this.pokemonMoveID=-1;
      this.moveListID=-1;
    }
  }

  guardarCambios(){
    this.ts.updatePokemon(this.pokemon.id,this.pokemon).subscribe({
      next:()=>{
        const successMsg = this.translate.instant("editMoves.successMessage");
        console.log(successMsg);
        alert(successMsg);
        this.route.navigate(['pokemon-detail/'+this.pokemon.id]);
      },
      error:(err:Error)=>{
        console.log(this.translate.instant("log.saveChangesError") + ": " + err.message);
      }
    });
  }
}