import { Router } from '@angular/router';
import { Component, inject, Inject } from '@angular/core';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent {


  //COMPONENTE MAPA PARA MANEJAR LAS RUTAS Y MOVERSE A LOS DISTINTOS LUGARES DEL CENTRO POKEMON
  router = inject(Router);

  irCentroPokemon()
  {
    this.router.navigate(['/centro-pokemon']);
  }

  irAruta()
  {
    this.router.navigate(['/ruta']);
  }

  irAgimnasio()
  {
    this.router.navigate(['/gimnasio']);
  }

}
