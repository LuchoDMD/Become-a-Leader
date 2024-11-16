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
    this.desactivarAlertasClave();
    if (this.currentPassword === this.usuario.password) { ///Debe conocer su password actual...
      if (this.newPassword === this.confirmNewPassword &&
        this.newPassword !== this.currentPassword &&
        this.newPassword !== ""
      ) {
        this.usuario.password = this.newPassword;
        this.userService.updateUser(this.usuario.id, this.usuario).subscribe({
          next: () => {
            console.log("usuario actualizado...");
            this.mostrarCambioClave = false;
            this.cambioClave = true;
            setTimeout(() => {
              this.cambioClave = false;
            }, 3000);
          },
          error: (err) => { console.error("Error al actualizar el usuario: " + err + ".") },
        })
      }
      else {
        if (this.newPassword === this.currentPassword) {
          this.claveDistintaALaActualMsg = true;
        }
        else if (this.newPassword !== this.confirmNewPassword) {
          this.clavesNuevasNoCoincidenMsg = true;
        }
        else if (this.newPassword === "") {
          this.claveVaciaMsg = true;
        }
      }
    }
    else {
      this.claveActualIncorrectaMsg = true;

    }
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
  }
}
