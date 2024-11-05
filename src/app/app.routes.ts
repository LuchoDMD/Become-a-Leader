import { Routes } from '@angular/router';
import { PantallaNuevaPartidaComponent } from './inicio/pantalla-nueva-partida/pantalla-nueva-partida.component';
import { PantallaInicioComponent } from './inicio/pantalla-inicio/pantalla-inicio.component';

export const routes: Routes = [
    {path: 'Inicio',component:PantallaInicioComponent},
    {path:'nuevaPartida', component:PantallaNuevaPartidaComponent}
];
