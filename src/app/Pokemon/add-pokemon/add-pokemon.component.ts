import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PokeAPIService } from '../Services/poke-api.service';
import { Pokemon } from '../../Interfaces/pokemon';


@Component({
  selector: 'app-add-pokemon',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-pokemon.component.html',
  styleUrl: './add-pokemon.component.css'
})
export class AddPokemonComponent {
  pokeID="";
  ps=inject(PokeAPIService);
  pokemon?:Pokemon;
  pokeAPI:any;
  
  cleanBuffer(){
    this.pokemon={
      id:'',
      especie:'',
      genero:'',
      tipos:[],
      vidaActual:0
    }
  }
  
  generatePokemon(id:string){
    this.ps.getPokemonByID(id).subscribe({
      next:(data)=>{
        this.pokeAPI=data;
        console.log(this.pokeAPI);
      },
      error:(err:Error)=>{
        console.log("ERROR: "+err.message);
      }
    });
  }

}
