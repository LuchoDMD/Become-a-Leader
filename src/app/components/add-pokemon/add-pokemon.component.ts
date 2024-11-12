import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PokeAPIService } from '../../service/poke-api.service';
import { TeamService } from '../../service/team.service';
import { Pokemon } from '../../interface/pokemon';
import { Stats } from '../../interface/stats';
import { Move } from '../../interface/move';



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
  ts=inject(TeamService);
  pokeAPI:any;

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

  statsBase:Stats={
    hp:0,
    atk:0,
    def:0,
    satk:0,
    sdef:0,
    spd:0
  };

  iv: any;
  moves:Move[]=[];

  //Limpia los valores de la variable
  cleanBuffer(){
    this.pokeID="";
    this.pokeAPI=[];
    this.pokemon={
      id:'',
      especie:'',
      tipos:[],
      nivel:0,
      vidaActual:0,
      estadisticas: { hp:0, atk:0, def:0, satk:0, sdef:0, spd:0 },
      movimientos:[],
      idEntrenador:''
    }
    this.statsBase={
      hp:0,
      atk:0,
      def:0,
      satk:0,
      sdef:0,
      spd:0
    };
    this.iv=[];
    this.moves=[];
  }

  //Busca los datos de un pokemon en la pokeAPI a travez del servicio
  generarPokemon(id:string){
    this.ps.getPokemonByID(id).subscribe({
      next:(data)=>{
        this.pokeAPI=data;
        this.statsBase={
          hp:this.pokeAPI.stats[0].base_stat,
          atk:this.pokeAPI.stats[1].base_stat,
          def:this.pokeAPI.stats[2].base_stat,
          satk:this.pokeAPI.stats[3].base_stat,
          sdef:this.pokeAPI.stats[4].base_stat,
          spd:this.pokeAPI.stats[5].base_stat
        }
      },
      error:(err:Error)=>{
        console.log("ERROR: "+err.message);
      }
    });
  }
  
  //Agrega los movimientos a un arreglo de movimientos 
  agregarAtaque(moveName:string)
  {
    this.ps.getMoveByName(moveName).subscribe({
      next:(data)=>{
        if(data.damage_class.name!=='status'){
          if(this.moves.length<4){
            const move:Move={
              nombre:moveName,
              tipo:data.type.name,
              clase:data.damage_class.name,
              potencia:data.power,
              precision:data.accuracy,
              usos:data.pp,
              pp:data.pp
            }
            console.log(move);
            this.moves.push(move);
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

  //Genera estadisticas IV random entre 0 31
  private generateIVs(): Stats {
    const IV:Stats=
    {
      hp: Math.floor(Math.random() * 32),
      atk: Math.floor(Math.random() * 32),
      def: Math.floor(Math.random() * 32),
      satk: Math.floor(Math.random() * 32),
      sdef: Math.floor(Math.random() * 32),
      spd: Math.floor(Math.random() * 32),
    };
    return IV;
  }

  //Calcula las estadisticas maximas del pokemon a travez del nivel
  private calculateStats(base:number, iv:number, ev:number, level:number,isHP = false){
    if(isHP){
      return Math.floor((((2 * base + iv + (ev / 4)) * level) / 100) + level + 10);
    }else{
      return Math.floor((((2 * base + iv + (ev / 4)) * level) / 100) + 5);
    }
  }
  
  //Genera un numero random entre 0 y 84
  private generateEV(min:number,max:number){
    return Math.round(Math.floor(Math.random() * (max - min + 1)) + min);
  }

  //Agrega el pokemon a la db.json en el apartado pokemons
  addPokemonBD(){
    this.pokemon.id=this.pokeAPI.id;
    this.pokemon.especie=this.pokeAPI.name;
    for(let i=0;i<this.pokeAPI.types.length;i++){
      this.pokemon.tipos.push(this.pokeAPI.types[i].type.name); //Esto para obtener los tipos del pokemon 
    }
    this.pokemon.nivel=100;
    this.iv=this.generateIVs();
    this.pokemon.estadisticas=
    {
      hp: this.calculateStats(this.statsBase.hp, this.iv.hp, this.generateEV(1,84) ,this.pokemon.nivel,false),
      atk: this.calculateStats(this.statsBase.atk, this.iv.atk, this.generateEV(1,84) ,this.pokemon.nivel,true),
      def: this.calculateStats(this.statsBase.def, this.iv.def, this.generateEV(1,84) ,this.pokemon.nivel,true),
      satk: this.calculateStats(this.statsBase.satk, this.iv.satk, this.generateEV(1,84) ,this.pokemon.nivel,true),
      sdef: this.calculateStats(this.statsBase.sdef, this.iv.sdef, this.generateEV(1,84) ,this.pokemon.nivel,true),
      spd: this.calculateStats(this.statsBase.spd, this.iv.spd, this.generateEV(1,84) ,this.pokemon.nivel,true),
    }
    this.pokemon.vidaActual=this.pokemon.estadisticas.hp;
    this.pokemon.movimientos=this.moves;
    //Almacena en el db.json "pokemons":[]
    console.log(this.pokemon);
    this.ts.addPokemon(this.pokemon).subscribe({
      next:(data)=>{
        console.log('Exito en la carga');
      },
      error:(err:Error)=>{
        console.log("ERROR: "+err.message);
      }
    });
  };
  
  

  

}