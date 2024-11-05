import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pantalla-nueva-partida',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pantalla-nueva-partida.component.html',
  styleUrls: ['./pantalla-nueva-partida.component.css']
})
export class PantallaNuevaPartidaComponent {
  selectedLider: string = '';

  seleccionarLider(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedLider = target.value;
    console.log('Líder seleccionado:', this.selectedLider); // Agrega un log para verificar
  }

  crearPartida(){}
}
