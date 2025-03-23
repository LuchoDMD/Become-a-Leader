import { Component, OnInit  } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-partida',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './partida.component.html',
  styleUrl: './partida.component.css'
})
export class PartidaComponent implements OnInit {
  mensajeCompleto = false;
  mensajeLargo = "Bienvenido a Become a Leader. En este proyecto se simulan batallas de Lider Pokemon contra entrenadores, usando un equipo de un mismo tipo. Tu objetivo es acumular la mayor cantidad victorias y sumar puntos. Recuerda que cuando pierdes, tu partida se elimina y tu puntaje se guarda en la tabla de puntajes. Entrando al juego... ";
  mensajeActual = "";
  lineaIndex = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    this.mostrarMensajeProgresivo();
  }

  mostrarMensajeProgresivo() {
    const lineas = this.mensajeLargo.split('. '); // Divide por puntos
    this.mensajeActual = lineas[this.lineaIndex] + ".<br>";
    this.lineaIndex++;

    if (this.lineaIndex < lineas.length) {
      setTimeout(() => this.mostrarMensajeProgresivo(), 3000); // Ajusta el tiempo si es necesario
    } else {
      this.mensajeCompleto = true;
      this.navegarAMenu();
    }
  }

  navegarAMenu() {
    this.router.navigate(['/menu']);
  }
}
