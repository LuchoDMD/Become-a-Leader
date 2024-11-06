import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Partida } from '../../db/partidas_db/partida';
import { PartidaService } from '../../../shared/servicios/partida.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-pantalla-nueva-partida',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pantalla-nueva-partida.component.html',
  styleUrls: ['./pantalla-nueva-partida.component.css']
})
export class PantallaNuevaPartidaComponent implements OnInit{
  datos_partida:Partida = {
    nick:"",
    leader:"",
    tipo:""
  };
  selectedLider: string = '';
  constructor(
    private servicio:PartidaService,
    private activatedRoute:ActivatedRoute
  ){
  }
  ngOnInit(): void {
    this.datos_partida.id_usuario = this.activatedRoute.snapshot.paramMap.get('id');
  }
  seleccionarLider(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedLider = target.value;
  }

  crearPartida(){
    this.servicio.obtenerPartidaUsuario(this.datos_partida.id_usuario).pipe(
      switchMap (partidaExistente => {
        if (partidaExistente){
          return this.servicio.eliminarPartida(partidaExistente.id_usuario)
        }
        else{
          return this.servicio.postPartida(this.datos_partida);
        }
      })
    ).subscribe(
      {
        next: (nuevaPartida) => {
          console.log('Partida creada o reemplazada:',nuevaPartida);
        },
        error: (err) => {console.error(err);}
      }
    )
  }

}
