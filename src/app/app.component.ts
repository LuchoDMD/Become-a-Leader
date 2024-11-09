import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokemonDetailComponent } from "./Pokemon/Components/pokemon-detail/pokemon-detail.component";
import { AddPokemonComponent } from "./Pokemon/Components/add-pokemon/add-pokemon.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PokemonDetailComponent, AddPokemonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Become-a-Leader';
}
