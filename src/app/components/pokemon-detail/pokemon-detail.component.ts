import { Component, inject, OnInit } from '@angular/core';
import { Pokemon } from '../../interface/pokemon';
import { TeamService } from '../../service/team.service';
import { PokeAPIService } from '../../service/poke-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent implements OnInit
{
  //Variables
  pokemon:Pokemon={
    id:'',
    especie:'',
    tipos:[],
    nivel:0,
    vidaActual:0,
    estadisticas: {hp:0,atk:0,def:0,satk:0,sdef:0,spd:0},
    movimientos:[],
    idEntrenador:''
};
  sprites:any;
  pokeID:string='';

  //Injectables
  ts=inject(TeamService);
  ps=inject(PokeAPIService);
  route= inject(Router);
  aroute=inject(ActivatedRoute);

  //Metodos
  ngOnInit(): void
  {
    this.aroute.paramMap.subscribe({
      next:(params)=>{
        if(params.get('id')){
          this.pokeID=params.get('id')??''; //Almaceno el id del pokemon obtenido desde la url
        }
      },
      error:(err:Error)=>{
        console.log("ERROR: "+err.message);
      }
    });
    console.log(this.pokeID);
    if(this.pokeID != undefined){
      this.ts.getPokemonPorId(this.pokeID).subscribe({
        next:(data:Pokemon)=>{
          this.pokemon=data; //Almaceno el pokemon para mostrar su informacion
        },
        error:(err:Error)=>{
          console.log("ERROR: "+err.message);
        }
      });
      this.ps.getSpriteByID(this.pokeID).subscribe({
        next:(data)=>{
          this.sprites=data; //Almaceno los sprites desde el servicio pokeAPI
        },
        error:(err:Error)=>{
          console.log("ERROR: "+err.message);
        }
      })
    }

  }

  volverALista(){
    this.route.navigate(['pokemon-list']);
  }

  irAModificar(id:string){
    this.route.navigate(['pokemon-edit/'+id]);
  };

  borrarPokemon(id:string){
    const confirmacion = confirm(
      "¿Deseas eliminarla el Pokemon de la Base de Datos?"
    );
    if (confirmacion) {
      this.ts.deletePokemon(id).subscribe(
        {
          next:()=>{
            alert("Pokemon borrado exitosamente");
            this.route.navigate(['pokemon-list']);
          },
          error:(error:Error)=>{
            console.log("Error al borrar pokemon: "+error.message);
          }
        }
      ); 
    }
  }
}
