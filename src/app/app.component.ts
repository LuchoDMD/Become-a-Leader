import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PantallaInicioComponent } from './inicio/pantalla-inicio/pantalla-inicio.component';
import { PantallaNuevaPartidaComponent } from './inicio/pantalla-nueva-partida/pantalla-nueva-partida.component';
import { NavbarComponent } from "../shared/navbar/navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PantallaInicioComponent, PantallaNuevaPartidaComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Become-a-Leader';
}
