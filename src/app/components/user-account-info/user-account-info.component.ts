import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../service/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-account-info',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-account-info.component.html',
  styleUrls: ['./user-account-info.component.css']
})
export class UserAccountInfoComponent implements OnInit {
  @Input() userId: string | null = null;
  @Output() volver = new EventEmitter<void>();

  usuario: any = {};
  mostrarCambioClave = false;
  editarNickname = false;
  editarEmail = false;
  currentPassword = '';
  newPassword = '';
  confirmNewPassword = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.userService.getUserByID(this.userId).subscribe({
        next: (res) => {
          this.usuario = res;
        },
        error: (err) => {
          console.error('Error al obtener el usuario: ' + err + '.');
        }
      });
    }
  }

  cambiarClave(): void {
    if (this.newPassword === this.confirmNewPassword) {
      this.userService.changePassword(this.userId, this.currentPassword, this.newPassword).subscribe({
        next: () => {
          alert('Contraseña cambiada exitosamente.');
        },
        error: (err) => {
          console.error('Error al cambiar la contraseña: ' + err + '.');
        }
      });
    } else {
      alert('Las nuevas contraseñas no coinciden.');
    }
  }

  onVolver(): void {
    this.volver.emit();
  }
}
