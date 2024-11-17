import { Entrenador } from './../../interface/entrenador';
import { Partida } from './../../interface/partida';
import { UserService } from './../../service/user.service';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAccountInfoComponent } from '../../components/user-account-info/user-account-info.component';
import { CommonModule } from '@angular/common';
import { PartidaService } from '../../service/partida.service';
import { PokeAPIService } from '../../service/poke-api.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [UserAccountInfoComponent, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
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
    const token = localStorage.getItem('token');
    if (token) {
      this.us.getUserByID(token).subscribe({
        next: (res) => this.usuario = res,
        error: (err) => console.error('Error al obtener el usuario: ' + err + '.')
      })
      this.partidaService.getPartidaByUserId(token).subscribe({
        next: (data: Partida | null) => {
          this.partida = data!;
          //console.log(this.partida);
        },
        error(err: Error) {
          console.log(err.message);
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
    this.router.navigate(['/menu']);
  }
  eliminarUsuario() {
    if (this.usuario) {
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
