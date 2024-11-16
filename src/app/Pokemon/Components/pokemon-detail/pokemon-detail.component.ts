import { Component, inject, OnInit } from '@angular/core';
import { Pokemon } from '../../../Interfaces/pokemon';
import { TeamService } from '../../Services/team.service';
import { PokeAPIService } from '../../Services/poke-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.css'
})
export class PokemonDetailComponent implements OnInit
{
  //Variables
  pokemon?:Pokemon;
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
    this.ts.getPokemonByID(this.pokeID).subscribe({
      next:(data:Pokemon)=>{
        this.pokemon=data; //Almaceno el pokemon para mostrar su informacion
      },
      error:(err:Error)=>{
        console.log("ERROR: "+err.message);
      }
    })
    this.ps.getSpritesByID(this.pokeID).subscribe({
      next:(data)=>{
        this.sprites=data; //Almaceno los sprites desde el servicio pokeAPI
      },
      error:(err:Error)=>{
        console.log("ERROR: "+err.message);
      }
    })
  }

  volverALista(){
    this.route.navigate([''])
  }
  
  borrarPokemon(id:string){

  }
}
