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
  mensajeLargo = "Bienvenido a Become a Leader. En este proyecto se simula una batalla de Lider Pokemon usando un equipo de un mismo tipo. Tu objetivo es pelear y acumular puntos. Buena Suerte!";
  mensajeActual = "";
  lineaIndex = 0;

  constructor(private router: Router) {}

  ngOnInit() { // Cambia aquí
    this.mostrarMensajeProgresivo();
  }

  mostrarMensajeProgresivo() {
    const lineas = this.mensajeLargo.split('. '); // Divide por puntos
    this.mensajeActual += lineas[this.lineaIndex] + ". ";
    this.lineaIndex++;

    if (this.lineaIndex < lineas.length) {
      setTimeout(() => this.mostrarMensajeProgresivo(), 1000); // Ajusta el tiempo si es necesario
    } else {
      this.mensajeCompleto = true;
      this.navegarAMenu();
    }
  }

  navegarAMenu() {
    this.router.navigate(['/menu']);
  }
}
