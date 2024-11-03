import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PantallaInicioComponent } from './inicio/pantalla-inicio/pantalla-inicio.component';
import { PantallaNuevaPartidaComponent } from './inicio/pantalla-nueva-partida/pantalla-nueva-partida.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PantallaInicioComponent, PantallaNuevaPartidaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Become-a-Leader';
}
