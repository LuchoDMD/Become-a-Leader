import { Component, OnInit } from '@angular/core';
import { PartidaService } from '../../service/partida.service'; // Asegúrate de tener este servicio creado
import { UserService } from '../../service/user.service';
import { Partida } from '../../interface/partida.js';  // Asegúrate de tener esta interfaz creada
import { Lider } from '../../interface/lider.js';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-nueva-partida',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './nueva-partida.component.html',
  styleUrl: './nueva-partida.component.css'
})
export class NuevaPartidaComponent implements OnInit {

  ngOnInit(): void {
    this.id = localStorage.getItem('token')!;
  }
  // Datos del formulario
  datos_partida: any = {
    nick: '',
    leader: '',
    tipo: '',
  };

  // Variables de control
  selectedLider: string = '';
  lideres: Lider[] = []; // Puedes cargar los lideres desde un servicio si es necesario
  id: string = '';
  constructor(private partidaService: PartidaService, private userService: UserService) {}

  // Método que se ejecuta cuando el formulario es enviado
  crearPartida() {
    const nuevaPartida: Partida = {
      id: this.id,  // Este debería ser el ID del usuario logueado, deberías obtenerlo desde el servicio
      fecha_inicio: new Date(),
      fecha_fin: new Date(),
      puntuacion: 0,  // Esto debería ser dinámico
      personaje: {
        id: 'uuid-1234',  // Asigna un UUID o un valor adecuado
        nombre: this.datos_partida.nick,
        genero: this.selectedLider === 'lider1' ? 'chico' : 'chica', // Se puede ajustar según el lider seleccionado
        rango: 'C',  // Debería definirse según el lider
        dinero: 1000,  // Puede variar según la partida
        equipo: [],  // Llenar según el tipo de Pokémon que seleccione
        mochila: new Map(),  // Llenar según los ítems
      },
    };

    // Aquí se crea la partida a través del servicio
    this.partidaService.postPartida(nuevaPartida).subscribe({
      next:(respuesta) => {
        console.log('Partida creada', respuesta);
      },
      error:(error: Error) => {
        console.error('Error creando la partida', error);
      }
    });
  }

  // Seleccionar el líder y actualizar la interfaz
  seleccionarLider(event: any) {
    this.selectedLider = event.target.value;
  }
}
