import { Component, inject } from '@angular/core';
import { PokeAPIService } from '../../service/poke-api.service';
import { TeamService } from '../../service/team.service';
import { Move } from '../../interface/move';
import { Pokemon} from '../../interface/pokemon';
import { tipos } from '../../interface/tipos';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Partida } from '../../interface/partida.js';
import { PartidaService } from '../../service/partida.service';
import { Entrenador } from '../../interface/entrenador';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-batalla',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './batalla.component.html',
  styleUrls: ['./batalla.component.css']
})
export class BatallaComponent {
  pokeapi = inject(PokeAPIService);
  teamService = inject(TeamService);
  ps = inject(PartidaService);

  // Datos de la batalla
  idPartida: string = '';
  partida: Partida | null = null;
  jugador?: Entrenador;
  rival:Pokemon[] = [];
  pokemonJugador?: Pokemon | null = null;
  pokemonRival?: Pokemon | null = null;
  movimientosJugador: Move[] = [];
  mensajeBatalla: string = '';
  movimientosRival: Move[] = [];
  resultado: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.idPartida = localStorage.getItem('token')!;
    this.ps.getPartidaByUserId(this.idPartida).subscribe({
      next: (partida) => {
        this.partida = partida;
        console.log('Partida obtenida:', partida);
        this.jugador = partida?.personaje;
        console.log('Entrenador obtenido:', this.jugador);
        this.iniciarBatalla();
      },
      error: (error) => {
        console.error('Error al obtener la partida', error);
      }
    })
  }

  iniciarBatalla() {
        console.log("Iniciando batalla");
        this.pokemonJugador = this.jugador?.equipo[0];
        console.log("Pokemon jugador:", this.pokemonJugador);
        this.generarRival();
        this.movimientosJugador=this.jugador?.equipo[0].movimientos!;

  }

  generarRival() {
    console.log("Generando rival");
    this.teamService.getPokemons().subscribe(
      {
        next: (data) => {
          while(this.rival.length<6)
          {
            this.rival.push(data[Math.floor(Math.random() * (data.length-1)) + 1]);
          }
          this.pokemonRival = this.rival[0];
          this.movimientosRival=this.pokemonRival.movimientos!;
          console.log("Pokemon rival:", this.pokemonRival);
        },
        error: (error :Error) => {
          console.log("Error al cargar rival")
        }
      })
  }

  realizarAtaque(movimientoJugador: Move) {
    if (!this.pokemonJugador || !this.pokemonRival || this.pokemonJugador.vidaActual <= 0 || this.pokemonRival.vidaActual <= 0) {
      return;
    }
  
    console.log("Equipo jugador:", this.jugador?.equipo);
    console.log("Equipo rival:", this.rival);
  
    let cambiarPokemonJugador = false;
    let cambiarPokemonRival = false;
  
    if (this.pokemonJugador.estadisticas.spd >= this.pokemonRival.estadisticas.spd) {
      // El Pokémon jugador ataca primero
      this.calcularAtaque(movimientoJugador, this.pokemonJugador, this.pokemonRival);
  
      // Verifica si el Pokémon rival se desmayó
      if (this.pokemonRival.vidaActual <= 0) {
        console.log(`${this.pokemonRival.especie} se ha desmayado!`);
        this.removerPokemonRival();
        cambiarPokemonRival = true;
      }
      // Verifica si el Pokémon jugador se desmayó
      if (this.pokemonJugador.vidaActual <= 0) {
        console.log(`${this.pokemonJugador.especie} se ha desmayado!`);
        this.removerPokemonJugador(); // Remueve el Pokémon jugador desmayado
          cambiarPokemonJugador = true;  // Marcar para cambiar el Pokémon jugador
      }
  
      // Si hay cambio de Pokémon, hacemos el reemplazo
    if (cambiarPokemonRival || cambiarPokemonJugador) {
      setTimeout(() => {
        if (cambiarPokemonRival) {
          this.cambiarPokemonRival();
        }
        if (cambiarPokemonJugador) {
          this.cambiarPokemonJugador();
        }
      }, 2000);  // Esperamos un poco para cambiar el Pokémon y continuar
    } else {
      // Si no hay cambio de Pokémon, el turno sigue
      setTimeout(() => {
          this.turnoRival();
          if (this.pokemonJugador && this.pokemonJugador.vidaActual <= 0) {
          console.log(`${this.pokemonJugador.especie} está desmayado! Realizando el cambio de Pokémon...`);
          this.removerPokemonJugador(); // Cambiar al siguiente Pokémon del jugador
        } else {
          // Si el Pokémon del jugador sigue en pie, se puede proceder con el siguiente turno
          console.log("El turno sigue normalmente...");
        }
      }
        , 2000);
    }
    } else {
      // El Pokémon rival ataca primero
      this.turnoRival();
  
      // Verifica si el Pokémon jugador se desmayó
      if (this.pokemonJugador.vidaActual <= 0) {
        console.log(`${this.pokemonJugador.especie} se ha desmayado!`);
        this.removerPokemonJugador();
        cambiarPokemonJugador = true;
      }

      // Verifica si el Pokémon rival se desmayó
    if (this.pokemonRival.vidaActual <= 0) {
      console.log(`${this.pokemonRival.especie} se ha desmayado!`);
      this.removerPokemonRival(); // Remueve el Pokémon rival desmayado
      cambiarPokemonRival = true;  // Marcar para cambiar el Pokémon rival
    }
  
       // Si el jugador se desmaya, no permite que ataque
       if (cambiarPokemonRival || cambiarPokemonJugador) {
        setTimeout(() => {
          if (cambiarPokemonRival) {
            this.cambiarPokemonRival();
          }
          if (cambiarPokemonJugador) {
            this.cambiarPokemonJugador();
          }
        }, 2000);  // Esperamos un poco para cambiar el Pokémon y continuar
      } else {
        // Si no hay cambio de Pokémon, el turno sigue
        setTimeout(() => {
          this.calcularAtaque(movimientoJugador, this.pokemonJugador!, this.pokemonRival!)
          if (this.pokemonRival && this.pokemonRival.vidaActual <= 0) {
            console.log(`${this.pokemonRival.especie} está desmayado! Realizando el cambio de Pokémon...`);
            this.removerPokemonRival();// Cambiar al siguiente Pokémon del jugador
          } else {
            // Si el Pokémon del jugador sigue en pie, se puede proceder con el siguiente turno
            console.log("El turno sigue normalmente...");
          }
        },
           2000);
      }
    }
  }

  calcularAtaque(movimiento: Move, atacante: Pokemon, defensor: Pokemon) {
    console.log(`${atacante.especie} está realizando ${movimiento.nombre}`);
    const factor = this.calcularEfectividad(movimiento.tipo, defensor.tipos);
    const daño = Math.floor(((2 * atacante.estadisticas.atk) / defensor.estadisticas.def) * movimiento.potencia * factor);

    this.mostrarMensajeBatalla(`${atacante.especie} usó ${movimiento.nombre}. ${factor > 1 ? '¡Fue supereficaz!' : (factor < 1 ? 'No fue muy eficaz...' : '')}`);
    defensor.vidaActual -= daño;

    if (defensor.vidaActual < 0) {
    defensor.vidaActual = 0; // Evita valores negativos
  }
}

mostrarMensajeBatalla(mensaje: string) {
  this.mensajeBatalla = mensaje;
}

removerPokemonJugador() {
  // Remueve el primer Pokémon del equipo del jugador (el activo)
  if (this.jugador && this.jugador.equipo.length > 0) {
    this.jugador.equipo.shift();  // Remueve el Pokémon desmayado
    if (this.jugador.equipo.length > 0) {
      // Asigna el siguiente Pokémon del equipo
      this.pokemonJugador = this.jugador.equipo[0];
      this.pokemonJugador.vidaActual = this.pokemonJugador.estadisticas.hp; // Restablece vida completa
      this.movimientosJugador = this.pokemonJugador.movimientos!;
      console.log(`${this.pokemonJugador.especie} ha sido activado con vida completa.`);
    } else {
      this.pokemonJugador = null;  // Si no hay más Pokémon, dejamos el equipo vacío
      console.log("No hay más Pokémon disponibles en el equipo.");
      this.finalizarBatalla(false);
    }
  }
}

removerPokemonRival() {
  // Remueve el primer Pokémon del equipo del rival (el activo)
  if (this.rival && this.rival.length > 0) {
    this.rival.shift();  // Remueve el Pokémon desmayado
    if (this.rival.length > 0) {
      // Asigna el siguiente Pokémon del equipo rival
      this.pokemonRival = this.rival[0];
      this.pokemonRival.vidaActual = this.pokemonRival.estadisticas.hp; // Restablece vida completa
      this.movimientosRival = this.pokemonRival.movimientos!;
      console.log(`${this.pokemonRival.especie} ha sido activado con vida completa.`);
    } else {
      this.pokemonRival = null;  // Si no hay más Pokémon, dejamos el equipo vacío
      console.log("El rival no tiene más Pokémon disponibles.");
      this.finalizarBatalla(true);
    }
  }
}

cambiarPokemonJugador() {
  if (this.pokemonJugador) {
    // Si ya no hay Pokémon disponibles, muestra mensaje de fin de batalla
    if (this.jugador!.equipo.length > 0) {
      this.pokemonJugador = this.jugador!.equipo[0];  // Asigna el siguiente Pokémon del jugador
      this.pokemonJugador.vidaActual = this.pokemonJugador.estadisticas.hp;  // Vida completa
      this.movimientosJugador = this.pokemonJugador.movimientos!;
      console.log(`${this.pokemonJugador.especie} ha sido activado con vida completa.`);
    } else {
      console.log("No hay más Pokémon en tu equipo.");
      this.finalizarBatalla(false);
      // Aquí puedes agregar lógica para manejar fin de batalla si no hay más Pokémon
    }
  }
}

cambiarPokemonRival() {
  if (this.pokemonRival) {
    // Si ya no hay Pokémon disponibles, muestra mensaje de fin de batalla
    if (this.rival.length > 0) {
      this.pokemonRival = this.rival[0];  // Asigna el siguiente Pokémon del rival
      this.pokemonRival.vidaActual = this.pokemonRival.estadisticas.hp;  // Vida completa
      this.movimientosRival = this.pokemonRival.movimientos!;
      console.log(`${this.pokemonRival.especie} ha sido activado con vida completa.`);
    } else {
      console.log("El rival no tiene más Pokémon.");
      this.finalizarBatalla(true);
      // Aquí también puedes manejar el fin de batalla si el rival ya no tiene Pokémon
    }
  }
}

  turnoRival() {
    if (!this.pokemonRival || !this.pokemonJugador) return;

    // Selecciona un movimiento aleatorio del rival
    const movimientoAleatorio = this.movimientosRival[
      Math.floor(Math.random() * this.movimientosRival.length)
    ];

    // Realiza el ataque del rival al jugador
    this.calcularAtaque(movimientoAleatorio, this.pokemonRival!, this.pokemonJugador!);
  }


  calcularEfectividad(tipoAtaque: string, tiposDefensor: string[]): number {
    console.log("Calculando efectividad");
    console.log("Tipo ataque:", tipoAtaque);
    let efectividadTotal = 1;
    // Busca el tipo de ataque en el array de tipos
    const tipoAtacante = tipos.find(t => t.name === tipoAtaque.toLowerCase());
    if (!tipoAtacante) return efectividadTotal; // Si no se encuentra, efectividad es neutra (1)

    // Calcula la efectividad para cada tipo del defensor
    for (const tipoDefensor of tiposDefensor) {
      console.log("Tipo defensor:", tipoDefensor);
      const efectividad = tipoAtacante.efectivity.find(([tipo, _]) => tipo === tipoDefensor.toLowerCase());
      if (efectividad) {
          efectividadTotal *= efectividad[1];
      } else {
          efectividadTotal *= 1; // Si no está en la lista, es neutral
      }
  }
  console.log("Efectividad:", efectividadTotal);
  return efectividadTotal;
  }

  // Función para contar Pokémon restantes del jugador
pokemonJugadorRestantes(): number {
  return this.jugador?.equipo.filter(pokemon => pokemon.vidaActual > 0).length || 0;
}

// Función para contar Pokémon restantes del rival
pokemonRivalRestantes(): number {
  return this.rival?.filter(pokemon => pokemon.vidaActual > 0).length || 0;
}


  finalizarBatalla(ganador: boolean) {
    let puntajeNuevo = 0;
    if (ganador) {
      this.resultado = '¡Ganaste!';
      puntajeNuevo = (this.partida?.puntuacion ?? 0) + 1;
      setTimeout(() => {
        this.ps.actualizarPuntaje(this.partida?.id!, puntajeNuevo).subscribe(
          {
            next: (response) => {
              console.log('Puntaje actualizado:', response);
              window.location.reload();
            },
            error: (error: Error) => {
              console.error('Error al actualizar el puntaje:', error);
            }
          }
        );
        alert("Has ganado la batalla!");
      }, 3000);
    } else {
      this.resultado = 'Perdiste la batalla';
      setTimeout(() => {
        alert("Has perdido la batalla!");
        this.ps.eliminarPartida(this.partida?.id!).subscribe(() => {
          this.router.navigate(['/menu']); // Redirige sin recargar
        });
      }, 3000);
    }
  }
}
  /*realizarAtaque(movimiento: Move, atacante: Pokemon, defensor: Pokemon) {
    console.log("Realizando ataque");
    const factor = this.calcularEfectividad(movimiento.tipo, defensor.tipos);
    const daño = Math.floor(
      ((2 * atacante.estadisticas.atk) / defensor.estadisticas.def) * movimiento.potencia * factor
    );
    console.log("Dano:", daño);
    defensor.vidaActual -= daño;
    if (defensor.vidaActual <= 0) {
      defensor.vidaActual = 0;
      this.finalizarBatalla(atacante);
    }
  }*/
  /*
  async cambiarPokemon() {
    // Esperamos a que la promesa se resuelva y obtenga el array de Pokémon
    const equipo = await this.teamService.getPokemons().toPromise();
    if (equipo) {
      const siguientePokemon = equipo.find((poke) => poke.vidaActual > 0);
      if (siguientePokemon) {
        this.pokemonJugador = siguientePokemon;
        this.movimientosJugador = this.pokemonJugador.movimientos;
      } else {
        this.finalizarBatalla(this.pokemonRival!);
      }
    } else {
      console.log("No se pudo obtener el equipo.");
    }
}
*/

/*
  cargarPokemonAleatorioEntrenador() {
    console.log("Cargando pokemon aleatorio");
    // Genera un ID aleatorio entre 1 y 151 (para los primeros Pokémon como ejemplo)
    const randomId = Math.floor(Math.random() * 151) + 1;

    this.pokeapi.getPokemonByID(randomId.toString()).subscribe(pokemonData => {
      // Asigna los datos del Pokémon al equipo del entrenador
      this.pokemonJugador = {
        id: pokemonData.id,
        especie: pokemonData.name,
        tipos: pokemonData.types.map((tipo: any) => tipo.type.name),
        vidaActual: pokemonData.stats.find((stat: any) => stat.stat.name === 'hp').base_stat,
        estadisticas: {
          hp: pokemonData.stats.find((stat: any) => stat.stat.name === 'hp').base_stat,
          atk: pokemonData.stats.find((stat: any) => stat.stat.name === 'attack').base_stat,
          def: pokemonData.stats.find((stat: any) => stat.stat.name === 'defense').base_stat,
          satk: pokemonData.stats.find((stat: any) => stat.stat.name === 'special-attack').base_stat,
          sdef: pokemonData.stats.find((stat: any) => stat.stat.name === 'special-defense').base_stat,
          spd: pokemonData.stats.find((stat: any) => stat.stat.name === 'speed').base_stat,
        },
        movimientos: pokemonData.moves.slice(0, 4).map((move: any) => ({
          nombre: move.move.name,
          tipo: 'fighting', // Este valor se puede cargar con otro servicio si es necesario
          clase: 'Physical', // Clase de ejemplo; debe ajustarse con el servicio correspondiente
          potencia: 10, // Potencia de ejemplo
          precision: 100,
          pp: 10 // PP de ejemplo
        }))
      };
      this.movimientosJugador = this.pokemonJugador.movimientos;
    });
  }
*/

  /*generarMovimientosRival(data: any): Move[] {
    console.log("Generando movimientos rival");
    // Seleccionar movimientos aleatorios del Pokémon rival
    return data.moves.slice(0, 4).map((move: any) => ({
      nombre: move.move.name,
      tipo: 'fighting', // Deberás obtener el tipo real desde la API
      clase: 'Fisico', // Según sea el caso
      potencia: 10,
      precision: 100,
      pp: 10
    }));
  }*/

     /*inciarRonda(movimientoJugador: Move)
  {
    if(this.rival.length>0 && this.jugador?.equipo.length!>0)
    {
      this.realizarAtaque(movimientoJugador);
      if(this.rival[0].vidaActual===0)
      {
        this.rival.unshift();
        console.log(this.rival);
      }
      else if(this.jugador?.equipo[0].vidaActual===0)
      {
        this.jugador.equipo.unshift();
      }
    }

    if(this.rival.length===0)
    {
      this.finalizarBatalla(true);
    }
    else if(this.jugador?.equipo.length===0)
    {
      this.finalizarBatalla(false);
    }

  }*/
