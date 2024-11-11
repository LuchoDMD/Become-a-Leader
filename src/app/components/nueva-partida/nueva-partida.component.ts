import { Entrenador } from './../../interface/entrenador';
import { Component, inject, OnInit } from '@angular/core';
import { PartidaService } from '../../service/partida.service'; // Asegúrate de tener este servicio creado
import { UserService } from '../../service/user.service';
import { Partida } from '../../interface/partida.js';  // Asegúrate de tener esta interfaz creada
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Pokemon } from '../../interface/pokemon';
import { TeamService } from '../../service/team.service';

@Component({
  selector: 'app-nueva-partida',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './nueva-partida.component.html',
  styleUrl: './nueva-partida.component.css'
})
export class NuevaPartidaComponent implements OnInit {
  ts= inject(TeamService);
  ngOnInit(): void {
    this.id = localStorage.getItem('token')!;
  }
  // Datos del formulario
  datos_partida: any = {
    nick: '',
    leader: '',
    tipo: '',
  };

  nuevaPartida: Partida = {
    id: '',
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
    puntuacion: 0,
    personaje: {
      id: '',
      nombre: '',
      tipo: '',
      equipo:[]
    }
  }

  // Variables de control
  selectedLider: string = '';
  id: string = '';
  constructor(private partidaService: PartidaService, private userService: UserService) {}
  router = inject(Router);

  // Método que se ejecuta cuando el formulario es enviado
  crearPartida() {
    const cargarEquipo: Pokemon[] = [];
    this.ts.getPokemonsByType(this.datos_partida.tipo).subscribe({
      next: (pokemons: Pokemon[]) => {
        console.log('Pokemons obtenidos', pokemons);
        cargarEquipo.push(...pokemons.slice(0, 6));
        this.nuevaPartida.personaje.equipo = cargarEquipo;
        this.nuevaPartida.personaje.id = this.id;
        this.nuevaPartida.id = this.id;
        this.nuevaPartida.personaje.nombre = this.datos_partida.nick;
        this.nuevaPartida.personaje.tipo = this.datos_partida.tipo;
        this.guardarPartidaEnBD(this.nuevaPartida);
      },
      error: (error: Error) => {
        console.error('Error obteniendo Pokemons', error);
      }
    })
  }

  guardarPartidaEnBD(partida: Partida) {
    this.partidaService.postPartida(partida).subscribe({
      next: (partida) => {
        console.log('Partida creada en la BD', partida);
        this.router.navigate(['/batalla']);
      },
      error: (error: Error) => {
        console.error('Error al crear la partida en la BD', error);
      }
    })
  }

  // Seleccionar el líder y actualizar la interfaz
  seleccionarLider(event: any) {
    this.selectedLider = event.target.value;
  }
}
