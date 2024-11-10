import { Component, inject } from '@angular/core';
import { PokeAPIService } from '../../service/poke-api.service';
import { TeamService } from '../../service/team.service';
import { Move } from '../../interface/move';
import { Pokemon} from '../../interface/pokemon';
import { tipos } from '../../interface/tipos';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  // Datos de la batalla
  pokemonJugador: Pokemon | null = null;
  pokemonRival: Pokemon | null = null;
  movimientosJugador: Move[] = [];
  mensajeBatalla: string = '';
  movimientosRival: Move[] = [];
  resultado: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.iniciarBatalla();
  }

  iniciarBatalla() {
        console.log("Iniciando batalla");
    // Asumimos que el primer Pokémon del entrenador es el que luchará
        this.cargarPokemonAleatorioEntrenador();
        this.generarPokemonRival();
  }

  generarPokemonRival() {
    console.log("Generando pokemon rival");
    const randomId = Math.floor(Math.random() * 150) + 1; // Generar ID aleatorio para un Pokémon
    this.pokeapi.getPokemonByID(randomId.toString()).subscribe((data) => {
      this.pokemonRival = {
        id: data.id,
        especie: data.name,
        tipos: data.types.map((tipo: any) => tipo.type.name),
        vidaActual: data.stats[0].base_stat,
        estadisticas: {
          hp: data.stats[0].base_stat,
          atk: data.stats[1].base_stat,
          def: data.stats[2].base_stat,
          satk: data.stats[3].base_stat,
          sdef: data.stats[4].base_stat,
          spd: data.stats[5].base_stat,
        },
        movimientos: this.generarMovimientosRival(data),
      };
      this.movimientosRival = this.pokemonRival.movimientos;
    });
  }

  generarMovimientosRival(data: any): Move[] {
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
  }

  iniciarTurno(movimientoJugador: Move) {
    // Compara las velocidades y decide el orden de ataque
    if (this.pokemonJugador!.estadisticas.spd >= this.pokemonRival!.estadisticas.spd) {
      // El Pokémon jugador ataca primero
      console.log("Jugador ataca primero");
      this.realizarAtaque(movimientoJugador, this.pokemonJugador!, this.pokemonRival!);
      if (this.pokemonRival!.vidaActual > 0) {
        setTimeout(() => this.turnoRival(), 2000);
      }
    } else {
      // El Pokémon rival ataca primero
      console.log("Rival ataca primero");
      this.turnoRival();
      if (this.pokemonJugador!.vidaActual > 0) {
        setTimeout(() => this.realizarAtaque(movimientoJugador, this.pokemonJugador!, this.pokemonRival!), 2000);
      }
    }
  }
  
  realizarAtaque(movimiento: Move, atacante: Pokemon, defensor: Pokemon) {
    console.log("Realizando ataque");
    const factor = this.calcularEfectividad(movimiento.tipo, defensor.tipos);
    const daño = Math.floor(
      ((2 * atacante.estadisticas.atk) / defensor.estadisticas.def) * movimiento.potencia * factor
    );
  console.log("Daño:", daño);
    defensor.vidaActual -= daño;
    if (defensor.vidaActual <= 0) {
      defensor.vidaActual = 0;
      this.finalizarBatalla(atacante);
    }

    // Muestra el mensaje de ataque
  let mensaje = (`${atacante.especie} usó ${movimiento.nombre}.`);

  if (factor > 1) {
    mensaje += `\n¡Fue supereficaz`;
  } else if (factor < 1) {
    mensaje += `\nNo fue muy eficaz...`;
  }

  this.mostrarMensajeBatalla(mensaje);
}


mostrarMensajeBatalla(mensaje: string) {
  this.mensajeBatalla = mensaje;
}


  turnoRival() {
    if (!this.pokemonRival || !this.pokemonJugador) return;
  
    // Selecciona un movimiento aleatorio del rival
    const movimientoAleatorio = this.movimientosRival[
      Math.floor(Math.random() * this.movimientosRival.length)
    ];
  
    // Realiza el ataque del rival al jugador
    this.realizarAtaque(movimientoAleatorio, this.pokemonRival!, this.pokemonJugador!);
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


  finalizarBatalla(ganador: Pokemon) {
    if (ganador === this.pokemonJugador) {
      this.resultado = 'victoria';
      // Guardar datos y redirigir a la sala de descanso
      setTimeout(() => {
        console.log('Guardando datos de batalla');
        window.location.reload();
      }, 3000)
    } else {
      this.resultado = 'Perdiste rey';
      alert(this.resultado);
      setTimeout(() => {
        this.router.navigate(['/menu']), 3000
      })
      
      // Redirigir a la pantalla de gameover
    }
  }
  
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


}
