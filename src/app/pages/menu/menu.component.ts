import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule para las directivas básicas como ngIf
import { UserService } from '../../service/user.service';  // Ajusta la ruta a tu servicio
import { Router } from '@angular/router'; // Para redirigir al componente adecuado
import { PartidaService } from '../../service/partida.service';  // Asumimos que tienes un servicio para las partidas
import { Partida } from '../../interface/partida.js';  // Ajusta la ruta a la interface de partida

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  usuario: any;  // Ajustar tipo según el servicio de usuario
  partida: Partida | null = null;
  tienePartida: boolean = false;

  constructor(
    private userService: UserService,
    private partidaService: PartidaService,  // Servicio de partida
    private router: Router
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      // Usamos el id del token para obtener el usuario
      this.userService.getUserByID(token).subscribe(usuario => {
        this.usuario = usuario;
        // Verificamos si existe una partida asociada al usuario
        if (this.usuario) {
          this.partidaService.getPartidaByUserId(this.usuario.id).subscribe(partida => {
            this.partida = partida;
            this.tienePartida = !!partida;  // Si la partida existe, tiene valor true
          });
        }
      });
    }
  }

  // Método para ir a la pantalla de nueva partida o cargar partida
  onSeleccionarPartida(): void {
    if (this.tienePartida) {
      this.router.navigate(['/batalla']);  // Redirige al componente de cargar partida
    } else {
      this.router.navigate(['/nueva-partida']);  // Redirige al componente de nueva partida
    }
  }

  onNuevaPartida(): void {
    if (this.tienePartida) {
      // Muestra una ventana emergente para confirmar la acción
      const confirmacion = confirm(
        "Ya tienes una partida guardada. ¿Deseas eliminarla para comenzar una nueva?"
      );
      if (confirmacion) {
        this.eliminarPartida();  // Llama a un método para eliminar la partida actual
      }
    } else {
      this.router.navigate(['/nueva-partida']);  // Si no hay partida, redirige a Nueva Partida
    }
  }
  
  // Método para eliminar la partida actual
  eliminarPartida(): void {
    if (this.partida && this.usuario) {
      this.partidaService.eliminarPartida(this.usuario.id).subscribe({
        next: () => {
          this.partida = null;
          this.tienePartida = false;
          this.router.navigate(['/nueva-partida']);  // Redirige a Nueva Partida después de eliminar
        },
        error: (error: Error) => console.error("Error al eliminar la partida:", error),
      });
    }
  }
  

}

