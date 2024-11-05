// alerta.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.css'],
  standalone:true,
  imports: [CommonModule]
})
export class AlertaComponent {
  @Input() mensaje: string = '¿Estás seguro de que deseas sobrescribir la partida existente?';
  @Input() mostrar: boolean = false;
  @Output() onConfirmar = new EventEmitter<void>();
  @Output() onCancelar = new EventEmitter<void>();

  confirmar() {
    this.onConfirmar.emit();
  }

  cancelar() {
    this.onCancelar.emit();
  }
}
