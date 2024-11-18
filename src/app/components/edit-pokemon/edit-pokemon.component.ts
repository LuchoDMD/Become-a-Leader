import { Component, inject, OnInit } from '@angular/core';
import { Pokemon } from '../../interface/pokemon';
import { PokeAPIService } from '../../service/poke-api.service';
import { TeamService } from '../../service/team.service';
import { Move } from '../../interface/move';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-pokemon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-pokemon.component.html',
  styleUrl: './edit-pokemon.component.css'
})
export class EditPokemonComponent implements OnInit
{
  //Variables
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
  pokeID:string='';     //Se utiliza en el ngOnInit para almacenar el ID de la ruta
  pokemonMoveID:number=-1; // almacena el id del arreglo de pokemonMovimientos
  moveListID:number=-1;   // almacena el id del arreglo de moveList

  //Injectables
  ps=inject(PokeAPIService);
  ts=inject(TeamService);
  route=inject(Router);
  aroute=inject(ActivatedRoute);

  //Metodos
  ngOnInit(): void
  {
    //Almaceno el id del pokemon obtenido desde la url
    this.aroute.paramMap.subscribe({
      next:(params)=>{
        if(params.get('id')){
          this.pokeID=params.get('id')??'';
        }
      },
      error:(err:Error)=>{
        console.log("ERROR: "+err.message);
      }
    });
    //Almaceno el pokemon para mostrar su informacion
    this.ts.getPokemonByID(this.pokeID).subscribe({
      next:(data:Pokemon)=>{
        this.pokemon=data;
      },
      error:(err:Error)=>{
        console.log("ERROR: "+err.message);
      }
    });
    //Obtengo la informacion del pokemon .
    this.ps.getPokemonByID(this.pokeID).subscribe({
      next:(poke:any)=>
      {
        if(poke){
          let j=0;
          for(let i=0;i<poke.moves.length;i++)
          {
            this.ps.getMoveByName(poke.moves[i].move.name).subscribe({
              next:(move)=>{
                if(move.damage_class.name!='status' && move.power>0){
                  let m:Move={
                    nombre:move.name,
                    tipo:move.type.name,
                    clase:move.damage_class.name,
                    potencia:move.power,
                    precision:move.accuracy,
                    usos:move.pp,
                    pp:move.pp,
                  }
                  this.movesList[j]=m;
                  j++
                }
              },
              error:(err:Error)=>{
                console.log("ERROR: "+err.message);
              }
            });
          }
          console.log(this.movesList);
        }
      },
      error:(err:Error)=>{ console.log("ERROR: "+err.message); }
    });
  }

  seleccionarMovimiento(id:number){
    this.pokemonMoveID=id;
  }

  volverALista()
  {
    this.route.navigate(['pokemon-list']);
  }

  //Intercambio de movimientos
  cambiarMovimientos(indexMovP:number, indexMoveList:number)
  {
    if(indexMovP!=undefined&&indexMoveList!=undefined){
      this.pokemon.movimientos[indexMovP]= this.movesList[indexMoveList];
      this.pokemonMoveID=-1;
      this.moveListID=-1;
    }
  }

  guardarCambios(){
    this.ts.updatePokemon(this.pokemon.id,this.pokemon).subscribe({
      next:()=>{
        console.log("Cambios Guardados, regresando a detalle pokemon");
        alert("Cambios Guardados, regresando a detalle pokemon");
        this.route.navigate(['pokemon-detail/'+this.pokemon.id]);
      },
      error:(err:Error)=>{
        console.log("ERROR: "+err.message);
      }
    });
  }

}




