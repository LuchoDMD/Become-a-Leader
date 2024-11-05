import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartidaService } from '../../../shared/servicios/partida.service';

@Component({
  selector: 'app-pantalla-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pantalla-inicio.component.html',
  styleUrl: './pantalla-inicio.component.css'
})
export class PantallaInicioComponent {
  idUsuario?:string|null="123";
  tienePartida:boolean=false;
  // route=inject(Router);
  constructor(
    private activatedRoute:ActivatedRoute,
    private servicio:PartidaService
  ){
    // this.activatedRoute.paramMap.subscribe(
    //   (params) => {
    //     this.idUsuario = params.get("id");
    //   }
    // )
    this.verificarPartida();
  };
  // NavigateToNewPartida()
  // {
  //   this.route.navigate(['nuevaPartida']);
  // }
  verificarPartida(){
    //Buscar en la db si el id tiene una partida creada.
    if (this.idUsuario){
      this.servicio.verificarExistenciaPartida(this.idUsuario).subscribe({
        next:(res)=>{
          this.tienePartida=res;
        },
        error:(res)=>{
          console.log(res);
          this.tienePartida=false;
        }
      });
    }
    else{
      alert('ID de usuario no encontrado.');
    }
  };
  mensajePregunta(){
    if (this.tienePartida){
      
    }
  }
}
