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
  mensajeLargo = "Hola! Bienvenido al Proyecto Lincoln. Este trabajo fue realizado por Varela, Varela, Buda, Dallier y Malagutti para las materias de Laboratorio 4 y Metodologia en sistemas. Este proyecto se trata sobre simular un juego de Pokemon donde tu eres el lider de Gimnasio de una ciudad y debes enfrentarte a tantos entrenadores como sea posible. Cada victoria te da dinero y cada derrota te restara dinero. Cuando te quedes sin dinero, se acaba el juego y tu puntaje de victorias se sube a una tabla de clasificaciones. Puedes elegir el tipo que quieras para el gimnasio. Empezemos!";
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
      setTimeout(() => this.mostrarMensajeProgresivo(), 2000); // Ajusta el tiempo si es necesario
    } else {
      this.mensajeCompleto = true;
      this.navegarAMenu();
    }
  }

  navegarAMenu() {
    this.router.navigate(['/menu']);
  }
}
