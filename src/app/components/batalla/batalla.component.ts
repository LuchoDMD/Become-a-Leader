import { UserService } from './../../service/user.service';
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
  UserService = inject(UserService);

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
      this.calcularAtaque(movimientoJugador, this.pokemonJugador, this.pokemonRival);
  
      if (this.pokemonRival.vidaActual <= 0) {
        console.log(`${this.pokemonRival.especie} se ha desmayado!`);
        this.removerPokemonRival();
        cambiarPokemonRival = true;
      }
      if (this.pokemonJugador.vidaActual <= 0) {
        console.log(`${this.pokemonJugador.especie} se ha desmayado!`);
        this.removerPokemonJugador();
          cambiarPokemonJugador = true; 
      }
  
    if (cambiarPokemonRival || cambiarPokemonJugador) {
      setTimeout(() => {
        if (cambiarPokemonRival) {
          this.cambiarPokemonRival();
        }
        if (cambiarPokemonJugador) {
          this.cambiarPokemonJugador();
        }
      }, 2000);
    } else {
      setTimeout(() => {
          this.turnoRival();
          if (this.pokemonJugador && this.pokemonJugador.vidaActual <= 0) {
          console.log(`${this.pokemonJugador.especie} está desmayado! Realizando el cambio de Pokémon...`);
          this.removerPokemonJugador();
          console.log("El turno sigue normalmente...");
        }
      }
        , 2000);
    }
    } else {
      this.turnoRival();
  
      if (this.pokemonJugador.vidaActual <= 0) {
        console.log(`${this.pokemonJugador.especie} se ha desmayado!`);
        this.removerPokemonJugador();
        cambiarPokemonJugador = true;
      }

     if (this.pokemonRival.vidaActual <= 0) {
       console.log(`${this.pokemonRival.especie} se ha desmayado!`);
       this.removerPokemonRival();
        cambiarPokemonRival = true;
      }
  
       if (cambiarPokemonRival || cambiarPokemonJugador) {
        setTimeout(() => {
          if (cambiarPokemonRival) {
            this.cambiarPokemonRival();
          }
          if (cambiarPokemonJugador) {
            this.cambiarPokemonJugador();
          }
        }, 2000);
      } else {
        setTimeout(() => {
          this.calcularAtaque(movimientoJugador, this.pokemonJugador!, this.pokemonRival!)
          if (this.pokemonRival && this.pokemonRival.vidaActual <= 0) {
            console.log(`${this.pokemonRival.especie} está desmayado! Realizando el cambio de Pokémon...`);
            this.removerPokemonRival();
          } else {
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
    defensor.vidaActual -= daño;
    const mensajeAtaque=`${this.transformarPrimeraLetra(atacante.especie)} usó ${this.transformarPrimeraLetra(movimiento.nombre)}. ` +
      (factor > 1 ? '¡Fue supereficaz!' : (factor === 0 ? 'No tuvo ningún efecto...' : (factor < 1 ? 'No fue muy eficaz...' : '')))
    
    this.mostrarMensajeBatalla(mensajeAtaque);
    
    if (defensor.vidaActual < 0) {
      this.mostrarMensajeBatalla(mensajeAtaque + ` ${this.transformarPrimeraLetra(defensor.especie)} se ha desmayado!`);
    defensor.vidaActual = 0;
  }
}

mostrarMensajeBatalla(mensaje: string) {
  this.mensajeBatalla = mensaje;
}

removerPokemonJugador() {
  if (this.jugador && this.jugador.equipo.length > 0) {
    this.jugador.equipo.shift();
    if (this.jugador.equipo.length > 0) {
      this.pokemonJugador = this.jugador.equipo[0];
      this.pokemonJugador.vidaActual = this.pokemonJugador.estadisticas.hp;
      console.log(`${this.pokemonJugador.especie} ha sido activado con vida completa.`);
    } else {
      this.pokemonJugador = null;
      console.log("No hay más Pokémon disponibles en el equipo.");
      this.finalizarBatalla(false);
    }
  }
}

removerPokemonRival() {
  if (this.rival && this.rival.length > 0) {
    this.rival.shift(); 
    if (this.rival.length > 0) {
      this.pokemonRival = this.rival[0];
      this.pokemonRival.vidaActual = this.pokemonRival.estadisticas.hp;
      this.movimientosRival = this.pokemonRival.movimientos!;
      console.log(`${this.pokemonRival.especie} ha sido activado con vida completa.`);
    } else {
      this.pokemonRival = null;
      console.log("El rival no tiene más Pokémon disponibles.");
      this.finalizarBatalla(true);
    }
  }
}

cambiarPokemonJugador() {
  if (this.pokemonJugador) {
    if (this.jugador!.equipo.length > 0) {
      this.pokemonJugador = this.jugador!.equipo[0];
      this.pokemonJugador.vidaActual = this.pokemonJugador.estadisticas.hp;
      this.movimientosJugador = this.pokemonJugador.movimientos!;
      console.log(`${this.pokemonJugador.especie} ha sido activado con vida completa.`);
    } else {
      console.log("No hay más Pokémon en tu equipo.");
      this.finalizarBatalla(false);
    }
  }
}

cambiarPokemonRival() {
  if (this.pokemonRival) {
    if (this.rival.length > 0) {
      this.pokemonRival = this.rival[0];
      this.pokemonRival.vidaActual = this.pokemonRival.estadisticas.hp;
      this.movimientosRival = this.pokemonRival.movimientos!;
      console.log(`${this.pokemonRival.especie} ha sido activado con vida completa.`);
    } else {
      console.log("El rival no tiene más Pokémon.");
      this.finalizarBatalla(true);
    }
  }
}

  turnoRival() {
    if (!this.pokemonRival || !this.pokemonJugador) return;

    const movimientoAleatorio = this.movimientosRival[
      Math.floor(Math.random() * this.movimientosRival.length)
    ];

    this.calcularAtaque(movimientoAleatorio, this.pokemonRival!, this.pokemonJugador!);
  }


  calcularEfectividad(tipoAtaque: string, tiposDefensor: string[]): number {
    console.log("Calculando efectividad");
    console.log("Tipo ataque:", tipoAtaque);
    let efectividadTotal = 1;
    
    const tipoAtacante = tipos.find(t => t.name === tipoAtaque.toLowerCase());
    if (!tipoAtacante) return efectividadTotal;

    for (const tipoDefensor of tiposDefensor) {
      console.log("Tipo defensor:", tipoDefensor);
      const efectividad = tipoAtacante.efectivity.find(([tipo, _]) => tipo === tipoDefensor.toLowerCase());
      if (efectividad) {
          efectividadTotal *= efectividad[1];
      } else {
          efectividadTotal *= 1;
      }
  }
  console.log("Efectividad:", efectividadTotal);
  return efectividadTotal;
  }

pokemonJugadorRestantes(): number {
  return this.jugador?.equipo.filter(pokemon => pokemon.vidaActual > 0).length || 0;
}

pokemonRivalRestantes(): number {
  return this.rival?.filter(pokemon => pokemon.vidaActual > 0).length || 0;
}

transformarPrimeraLetra(nombre: string): string {
  if (!nombre) return nombre;
  return nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
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
          this.router.navigate(['/menu']);
        });
      }, 3000);
    }
  }

  navegarMenu() {
    this.router.navigate(['/menu']);
  }
  logout()
  {
    this.UserService.logout();
    this.router.navigate(['']);
  }
}

