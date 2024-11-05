import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pantalla-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pantalla-inicio.component.html',
  styleUrl: './pantalla-inicio.component.css'
})
export class PantallaInicioComponent {
  idUsuario?:string|null;
  // route=inject(Router);
  constructor(
    private activatedRoute:ActivatedRoute
  ){
    this.activatedRoute.paramMap.subscribe(
      (params) => {
        this.idUsuario = params.get("id");
      }
    )
  };
  // NavigateToNewPartida()
  // {
  //   this.route.navigate(['nuevaPartida']);
  // }
  verificarPartida():boolean{
    //Buscar en la db si el id tiene una partida creada.
    return false;
  }
}
