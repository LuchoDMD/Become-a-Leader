import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokemonDetailComponent } from "./Pokemon/Components/pokemon-detail/pokemon-detail.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Become-a-Leader';
}
