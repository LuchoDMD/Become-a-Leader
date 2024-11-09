import { Component, inject } from '@angular/core';
import { PokeAPIService } from '../../Services/poke-api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.css'
})
export class PokemonDetailComponent 
{
  pokeAPI:any=undefined;
  pokeID:string='';
  ps=inject(PokeAPIService);

  generatePokemon() {
    this.ps.getPokemonByID(this.pokeID).subscribe({
      next: (data) => {
        this.pokeAPI = data;
        console.log(this.pokeAPI?.name);
      },
      error: (err: Error) => {
        console.log("ERROR: " + err.message);
      }
    });
  }
}
