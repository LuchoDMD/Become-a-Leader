import { Component, OnInit , inject} from '@angular/core';
import { UserAccountInfoComponent } from '../user-account-info/user-account-info.component';
import { CommonModule } from '@angular/common';
import { Partida } from '../../interface/partida';
import { PartidaService } from '../../service/partida.service';
import { PokeAPIService } from '../../service/poke-api.service';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-perfil-gim',
  standalone: true,
  imports: [UserAccountInfoComponent, CommonModule],
  templateUrl: './ver-perfil-gim.component.html',
  styleUrl: './ver-perfil-gim.component.css'
})
export class VerPerfilGimComponent implements OnInit{

  usuario: any;
    verConfigCuenta: boolean = true;
    verInfoPartidas: boolean = true;
    userService = inject(UserService);
    partidaService = inject(PartidaService);
    pokeApiService = inject(PokeAPIService);
    partida: Partida = {
      id: '',
      fecha_inicio: new Date,
      puntuacion: 0,
      personaje: {
        id: '',
        nombre: '',
        tipo: '',
        equipo: []
      }
    };
    sprites: string[] = [];

    constructor(
      private router: Router,
      private us: UserService
    ) { }

    ngOnInit(): void {
      console.log('token: ' + localStorage.getItem('token'));
      const token = localStorage.getItem('token');
      if (token) {
        this.us.getUserByID(token).subscribe({
          next: (res) => this.usuario = res,
          error: (err) => console.error('Error al obtener el usuario: ' + err + '.')
        })
        this.partidaService.getPartidaByUserId(token).subscribe({
          next: (data: Partida | null) => {
            if(data){
              this.partida = data!;
            }
            //console.log(this.partida);
          },
          error() {
          }
        })
      }
    }

    onVolver(): void {
      this.verConfigCuenta = true;
      this.verInfoPartidas = true;
    }

    activarConfigCuenta(): void {
      this.verInfoPartidas = false;
      this.verConfigCuenta = true;
    }

    activarInfoPartidas(): void {
      this.verConfigCuenta = false;
      this.verInfoPartidas = true;
    }

    onSalir(): void {
      this.router.navigate(['/gimnasio']);
    }


    eliminarUsuario() {
      if (this.usuario) {
        if(this.partida){
          this.partidaService.eliminarPartida(this.partida.id).subscribe({
            next: () => {
              console.log('Partida eliminada');
            },
            error: (err: Error) => {
              console.log("Error al eliminar la partida: " + err.message);
            }
          })
        }
        this.userService.deleteUser(this.usuario.id).subscribe({
          next: () => {
            alert("Se elimino el usuario exitosamente");
            this.userService.logout();
            this.router.navigate(['']);
          },
          error: (err: Error) => {
            console.log(err.message);
          }
        })
      }
    }
}
