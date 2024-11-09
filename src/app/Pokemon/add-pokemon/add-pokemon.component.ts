import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PokeAPIService } from '../Services/poke-api.service';
import { Pokemon } from '../../Interfaces/pokemon';
import { Estadisticas } from '../../Batalla/Interfaces/estadisticas';

@Component({
  selector: 'app-add-pokemon',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-pokemon.component.html',
  styleUrl: './add-pokemon.component.css'
})
export class AddPokemonComponent {
  pokeID="";
  pas=inject(PokeAPIService);
  pokemon?:Pokemon;

  cleanBuffer(){
    this.pokemon={
      id:'',
      especie:'',
      genero:'',
      tipos:[],
      vidaActual:0,
      estadisticas?:Estadisticas[],
      movimientos:Movimientos[]

    }
  }
}
