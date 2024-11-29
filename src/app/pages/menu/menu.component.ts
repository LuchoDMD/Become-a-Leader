import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { PartidaService } from '../../service/partida.service';
import { Partida } from '../../interface/partida.js';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  usuario: any;
  partida: Partida | null = null;
  tienePartida: boolean = false;

  constructor(
    private userService: UserService,
    private partidaService: PartidaService,
    private router: Router
  ) { }

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
  
  onSeleccionarPartida(): void {
    if (this.tienePartida) {
      alert("Cargando batalla...");
      this.router.navigate(['/batalla']);
    } else {
      this.router.navigate(['/nueva-partida']);
    }
  }

  onNuevaPartida(): void {
    if (this.tienePartida) {    
      const confirmacion = confirm(
        "Ya tienes una partida guardada. ¿Deseas eliminarla para comenzar una nueva?"
      );
      if (confirmacion) {
        this.eliminarPartida();
      }
    } else {
      this.router.navigate(['/nueva-partida']);
    }
  }
  verRanking(): void {
    this.router.navigate(['/ranking']);
  }

  verPerfil():void{
    this.router.navigate(['/perfil']);
  }

  eliminarPartida(): void {
    if (this.partida && this.usuario) {
      this.partidaService.eliminarPartida(this.usuario.id).subscribe({
        next: () => {
          this.partida = null;
          this.tienePartida = false;
          this.router.navigate(['/nueva-partida']);
        },
        error: (error: Error) => {
          console.error("Error al eliminar la partida:", error);
          this.router.navigate(['/nueva-partida']) // El juego debe permitir la creación de una partida en caso de que no exista una.
        },
      });
    }
  }

  logout()
  {
    this.userService.logout();
    this.router.navigate(['']);
  }


}

