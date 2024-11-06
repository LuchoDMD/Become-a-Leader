import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartidaService } from '../../../shared/servicios/partida.service';
import { AlertaComponent } from '../alerta/alerta.component';

@Component({
  selector: 'app-pantalla-inicio',
  standalone: true,
  imports: [CommonModule, AlertaComponent],
  templateUrl: './pantalla-inicio.component.html',
  styleUrls: ['./pantalla-inicio.component.css']
})
export class PantallaInicioComponent {
  idUsuario?: string | null = "123"; //Harcodeado por el momento...
  tienePartida: boolean = false;
  mostrarAlerta: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute, //Falta implementar para recibir el id de usuario por la ruta.
    private servicio: PartidaService,
    private router:Router
  ) {
    this.verificarPartida();
  }

  verificarPartida() {
    if (this.idUsuario) {
      this.servicio.verificarExistenciaPartida(this.idUsuario).subscribe({
        next: (res) => {
          this.tienePartida = res;
        },
        error: (res) => {
          console.log(res);
          this.tienePartida = false;
        }
      });
    } else {
      alert('ID de usuario no encontrado.');
    }
  }

  creacionPartida() {
    if (this.tienePartida) {
      this.mostrarAlerta = true;
    } else {
      // Lógica para crear una nueva partida
      /**
       * La idea es utilizar el servicio de partidas.
       * 
       * Por un lado está claro que los datos de la partida existente deben dejar de existir.
       * 
       * Por el otro lado debemos de definir cómo vamos a actualizar los datos de la partida.
       * ¿Qué datos de la partida vamos a guardar?
       * Porque tambien hay que pensar que a medida que el jugador juega, los datos deben irse 
       * actualizando... por lo tanto... *la deja picando*
       * 
       * 
       */
      console.log('Crear nueva partida');
      this.crearPartida();
    }
  }

  confirmarSobrescribir() {
    this.mostrarAlerta = false;
    // Lógica para sobrescribir la partida existente
    this.crearPartida();
    console.log('Sobrescribir la partida existente');
  }

  cancelarSobrescribir() {
    this.mostrarAlerta = false;
  }

  crearPartida(){
    this.router.navigate(['/nuevaPartida', this.idUsuario]);
  }

  cargarPartida() { // Lógica para cargar la partida existente console.log('Cargar partida existente'); 
  }

}

