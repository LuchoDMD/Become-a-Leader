import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../service/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../interface/user.interface';

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

  cambioNickname: boolean = false;
  editarNickname = false;
  nickNameCopy: string = "";
  nickNameErrorMsg: string = "";
  showNickNameErrorMsg: boolean = false;

  mostrarCambioClave = false;
  currentPassword = '';
  newPassword = '';
  confirmNewPassword = '';
  passwordCopy: string = "";
  claveActualIncorrectaMsg: boolean = false;
  claveDistintaALaActualMsg: boolean = false;
  clavesNuevasNoCoincidenMsg: boolean = false;
  claveVaciaMsg: boolean = false;


  editarEmail = false; // Habilitación a la edición.
  emailEnUso = false; // Nuevo estado para el mensaje de error
  emailCopy: string = "";
  emailDistintoAlActualMsg: boolean = false;
  emailEnUsoMsg: boolean = false;
  cambioEmail: boolean = false;
  cambioClave: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    if (this.userId) {
      this.userService.getUserByID(this.userId).subscribe({
        next: (res) => {
          this.usuario = res;
          this.emailCopy = this.usuario.email; // Copiar el email inicial
          this.nickNameCopy = this.usuario.nick;
        },
        error: (err) => {
          console.error('Error al obtener el usuario: ' + err + '.');
        }
      });
    } else {
      console.error("Error al encontrar el usuario.");
    }
  }

  cambiarClave(): void {
    // Desactivar todas las alertas de error antes de la validación
    this.desactivarAlertasClave();
  
    // Eliminar espacios extra (trim) en las contraseñas
    const currentPasswordTrimmed = this.currentPassword.trim();
    const newPasswordTrimmed = this.newPassword.trim();
  
    // Imprimir las contraseñas para verificar sus valores
    console.log('Contraseña actual ingresada:', this.currentPassword);
    console.log('Contraseña actual sin espacios:', currentPasswordTrimmed);
    console.log('Nueva contraseña ingresada:', this.newPassword);
    console.log('Nueva contraseña sin espacios:', newPasswordTrimmed);
    console.log('Confirmar nueva contraseña:', this.confirmNewPassword);
  
    // Verificar si la contraseña actual es correcta
    if (currentPasswordTrimmed !== this.usuario.password) {
      console.log('La contraseña actual es incorrecta');
      this.claveActualIncorrectaMsg = true;
      return; // Detener la ejecución si la contraseña actual es incorrecta
    }
  
    // Verificar que la nueva contraseña sea diferente de la actual
    if (newPasswordTrimmed === currentPasswordTrimmed) {
      console.log('La nueva contraseña es igual a la actual');
      this.claveDistintaALaActualMsg = true;
      return;
    }
  
    // Verificar que las nuevas contraseñas coincidan
    if (newPasswordTrimmed !== this.confirmNewPassword.trim()) {
      console.log('Las nuevas contraseñas no coinciden');
      this.clavesNuevasNoCoincidenMsg = true;
      return;
    }
  
    // Verificar que la nueva contraseña no esté vacía
    if (newPasswordTrimmed === "") {
      console.log('La nueva contraseña está vacía');
      this.claveVaciaMsg = true;
      return;
    }
  
    // Si todas las validaciones pasaron, proceder con la actualización
    console.log('Todas las validaciones pasaron, se actualizará la contraseña');
  
    this.usuario.password = newPasswordTrimmed;
    this.userService.updateUser(this.usuario.id, this.usuario).subscribe({
      next: () => {
        console.log("Contraseña actualizada exitosamente.");
        this.mostrarCambioClave = false;
        this.cambioClave = true;
        setTimeout(() => {
          this.cambioClave = false;
        }, 3000);
      },
      error: (err) => {
        console.error("Error al actualizar la contraseña: " + err);
      }
    });
  }


  cambiarNickName(): void {
    this.showNickNameErrorMsg = false;
    if (this.nickNameCopy !== this.usuario.nick &&
      this.nickNameCopy !== "") {
        this.usuario.nick = this.nickNameCopy;
        this.userService.updateUser(this.usuario.id, this.usuario).subscribe({
          next: () => {
            console.log("usuario actualizado...");
            this.cambioNickname = true;
            this.editarNickname = false;
            setTimeout(() => {
              this.cambioNickname = false;
            }, 3000);
          },
          error: (err) => {
            console.error("error al actualizar el usuario: " + err + ".");
          }
        });
    }
    else {
      if (this.nickNameCopy === "")
        this.nickNameErrorMsg = "No puedes dejar al campo vacío."
      else if (this.nickNameCopy === this.usuario.nick)
        this.nickNameErrorMsg = "Ya tienes este nickname";
      this.showNickNameErrorMsg = true;
      this.editarNickname=true;
    }
  }

  verificarUsoEmail(): void {
    this.desactivarAlertasMail();
    // Verificar si el email está en uso
    if (this.emailCopy === this.usuario.email) {
      this.alertMailDistintoAlActual();
    }
    else {
      this.userService.getUserByEmail(this.emailCopy).subscribe({
        next: (res: Usuario | null) => {
          if (res) {
            this.emailEnUso = true;
            this.alertaMailEnUso();
          } else {
            this.emailEnUso = false;
          }
        },
        error: (err) => {
          console.error("Error al verificar el uso del mail: " + err + ",");
        }
      });
    }
  }

  cambiarEmail(): void {
    this.desactivarAlertasMail();
    if (!this.emailEnUso &&
      (this.emailCopy !== this.usuario.email)
    ) {
      // Actualizar usuario
      this.usuario.email = this.emailCopy;
      // ACtualizar los datos
      this.userService.updateUser(this.usuario.id, this.usuario).subscribe({
        next: () => {
          console.log("usuario actualizado...");
          this.editarEmail = false;
          this.cambioEmail = true;
          setTimeout(() => {
            this.cambioEmail = false;
          }, 3000);
        },
        error: (err) => {
          console.error(err.message);
        }
      });
    } else {
      if (this.emailCopy === this.usuario.email) {
        //El usuario ya posee esta dirección.
        this.alertMailDistintoAlActual();
      }
      else {
        //La dirección está siendo utilizada por otro usuario.
        this.alertaMailEnUso();
      }
    }
  }

  desactivarAlertasClave() {
    this.claveActualIncorrectaMsg = false;
    this.claveDistintaALaActualMsg = false;
    this.clavesNuevasNoCoincidenMsg = false;
    this.claveVaciaMsg = false;
  }

  desactivarAlertasMail() {
    this.emailDistintoAlActualMsg = false;
    this.emailEnUsoMsg = false;
  }

  alertMailDistintoAlActual(): void {
    //Desactivar las otras alertas.
    this.emailEnUsoMsg = false;

    this.emailDistintoAlActualMsg = true;

  }

  alertaMailEnUso(): void {
    this.emailDistintoAlActualMsg = false;

    this.emailEnUsoMsg = true;

  }

  onVolver(): void {
    this.volver.emit();
    console.log("hola");
  }
  
}
