// alerta.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.css']
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
