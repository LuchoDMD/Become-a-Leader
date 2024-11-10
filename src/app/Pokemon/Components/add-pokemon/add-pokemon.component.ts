import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PokeAPIService } from '../../Services/poke-api.service';
import { Pokemon } from '../../../Interfaces/pokemon';
import { Move } from '../../../Interfaces/moves';


@Component({
  selector: 'app-add-pokemon',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-pokemon.component.html',
  styleUrl: './add-pokemon.component.css'
})
export class AddPokemonComponent{
  pokeID="";
  ps=inject(PokeAPIService);
  pokeAPI:any;

  pokemon:Pokemon={
      id:'',
      especie:'',
      genero:'',
      tipos:[],
      vidaActual:0,
      estadisticas: {hp:0,atk:0,def:0,satk:0,sdef:0,spd:0},
      movimientos:[]
  };

  cleanBuffer(){
    this.pokemon={
      id:'',
      especie:'',
      genero:'',
      tipos:[],
      vidaActual:0,
      estadisticas: {hp:0,atk:0,def:0,satk:0,sdef:0,spd:0},
      movimientos:[]
    }
  }

  generarPokemon(id:string){
    this.ps.getPokemonByID(id).subscribe({
      next:(data)=>{
        this.pokeAPI=data;
      },
      error:(err:Error)=>{
        console.log("ERROR: "+err.message);
      }
    });
  }
  
  agregarAtaque(moveName:string)
  {
    this.ps.getMoveByName(moveName).subscribe({
      next:(data)=>{
        if(data.damage_class.name!=='status'){
          if(this.pokemon.movimientos.length<4){
            const move:Move={
              nombre:moveName,
              tipo:data.type.name,
              clase:data.damage_class.name,
              potencia:data.power,
              precision:data.accuracy,
              pp:data.pp
            }
            console.log(move);
            this.pokemon.movimientos.push(move);
          }else{
            console.log("El pokemon ya posee 4 movimientos");
          }
        }
      },
      error:(err:Error)=>{
        console.log('ERROR: '+err.message);
      }
    });
  } 

  

}

        /*const tipos= this.pokeAPI.types;
        for(let i=0;i<tipos.length;i++){
          console.log(tipos[i].type.name); //Esto para obtener los tipos del pokemon 
        }*/