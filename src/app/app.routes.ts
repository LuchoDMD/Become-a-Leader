import { Routes } from '@angular/router';
import { PantallaNuevaPartidaComponent } from './inicio/pantalla-nueva-partida/pantalla-nueva-partida.component';
import { PantallaInicioComponent } from './inicio/pantalla-inicio/pantalla-inicio.component';

export const routes: Routes = [
    {path: 'inicio/:id',component:PantallaInicioComponent},
    {path:'nuevaPartida/:id', component:PantallaNuevaPartidaComponent}
];
