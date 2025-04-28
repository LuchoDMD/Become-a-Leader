import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import { PartidaService } from '../service/partida.service';
import { Partida } from '../interface/partida.js';


@Component({
  selector: 'app-gimnasio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gimnasio.component.html',
  styleUrl: './gimnasio.component.css'
})
export class GimnasioComponent {

  //CLASE PIVOT, LA IDEA ES MOSTRAR LAS ESTADISTICAS DEL USUARIO, LA CANTIDAD DE POKEMONS VIVOS, SU EXPERIENCIA, NIVEL, OBJETOS, ETC.
  //PODER ACCEDER A CADA POKEMON PARA VER LOS MOVIMIENTOS DISPONIBLES DE ESE POKEMON
  //UTILIZAR UN TIMESET PARA SIMULAR EL EMPAREJAMIENTO DE LOS RIVALES, PODER CREAR UN SIMULADOR DE BATALLAS POR OLEADAS, PONIENDO RANDOM EL TIEMPO DE EMPAREJAMIENTO,
  //EL NIVEL DE LOS POKEMON RIVAL Y SU CANTIDAD, TAMBIEN UTILIZAR EL SPRITE DEL LIDER DE GIMNASIO PARA USARLO EN ALGO

  usuario: any;
    partida: Partida | null = null;
    tienePartida: boolean = false;

    constructor(
      private userService: UserService,
      private partidaService: PartidaService,
      private router: Router
    ) {}

    ngOnInit(): void {
      const token = localStorage.getItem('token');
      if (token) {
        this.userService.getUserByID(token).subscribe(usuario => {
          this.usuario = usuario;
          if (this.usuario) {
            this.partidaService.getPartidaByUserId(this.usuario.id).subscribe( {
              next: (partida: Partida | null) => {
                this.partida = partida;
                this.tienePartida = !!partida;
              },
              error: () => {
              }

            });
          }
        });
      }
    }

    batallaPokemon()
    {
      this.router.navigate(['/batalla']);
    }

    verPerfil()
    {
      this.router.navigate(['/perfil-gim'])
    }

    logout()
  {
    this.userService.logout();
    this.router.navigate(['']);
  }

  volverAtras()
  {
    this.router.navigate(['/mapa']);
  }

}
