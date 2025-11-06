import { Partida } from './../../interface/partida';
import { UserService } from './../../service/user.service';
import { Component, inject } from '@angular/core';
import { PokeAPIService } from '../../service/poke-api.service';
import { TeamService } from '../../service/team.service';
import { RankingService } from '../../service/ranking.service';
import { Move } from '../../interface/move';
import { Pokemon } from '../../interface/pokemon';
import { tipos } from '../../interface/tipos';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PartidaService } from '../../service/partida.service';
import { Entrenador } from '../../interface/entrenador';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { MiniPokedexComponent } from "../app-mini-pokedex/pokedex";

@Component({
  selector: 'app-batalla',
  standalone: true,
  imports: [CommonModule, TranslateModule, MiniPokedexComponent],
  templateUrl: './batalla.component.html',
  styleUrls: ['./batalla.component.css']
})

export class BatallaComponent {
  pokeapi = inject(PokeAPIService);
  teamService = inject(TeamService);
  ps = inject(PartidaService);
  rs = inject(RankingService);
  translate = inject(TranslateService);

  // Datos de la batalla
  cambioPokemon: boolean = false;
  contadorDeDuelos: number = 0;
  idPartida: string = '';
  partida: Partida | null = null;
  jugador?: Entrenador;
  rival: Pokemon[] = [];
  pokemonJugador?: Pokemon | null = null;
  pokemonRival?: Pokemon | null = null;
  movimientosJugador: Move[] = [];
  mensajeBatalla: string = '';
  movimientosRival: Move[] = [];
  resultado: string = '';
  mostrarModal: boolean = false;
  mensajeModal: string = '';
  UserService = inject(UserService);

  constructor(private router: Router, private route: ActivatedRoute) { }

  // 💡 HELPER: Obtiene el nombre del tipo traducido (usado en HTML con pipe async)
  getTranslatedTypeName(typeName: string): Observable<string> {
    return this.pokeapi.getLocalizedTypeName(typeName);
  }

  contadorSumar() {
    this.contadorDeDuelos += 1;
  }

  verificarContador() {
    if (this.contadorDeDuelos > 3) {
      this.cambioPokemon = true;
    }
  }

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

  /**
   * Convierte el tipo de un movimiento en una clase CSS de tipo de movimiento (en minúsculas).
   * @param tipo El tipo de movimiento.
   * @returns La clase de tipo de movimiento.
   */
  obtenerClaseTipoMovimiento(tipo: string): string {
    return tipo.toLocaleLowerCase();
  }

  obtenerUrlSprites(pokemon: Pokemon): Promise<{ front_default: string, back_default: string }> {
    return new Promise((resolve, reject) => {
      this.pokeapi.getSpriteByID(pokemon.id).subscribe({
        next: (data) => {
          resolve({
            front_default: data.front_default,
            back_default: data.back_default
          });
        },
        error: (error: Error) => {
          reject(this.translate.instant('batalla.errorSpriteFetch'));
        }
      });
    });
  }

  async asignarSprites(equipo: Pokemon[] | undefined) {
    for (const element of equipo || []) {
      try {
        const urls = await this.obtenerUrlSprites(element);
        element.backSprite = urls.back_default;
        element.frontSprite = urls.front_default;
      }
      catch {
        console.error(this.translate.instant('log.spriteUrlError'));
      }
    }
  }

 
  async localizePokemon(pokemon: Pokemon): Promise<void> {
    const localizedData = await this.pokeapi.getPokemonDetails(pokemon.especie).toPromise();
    if (localizedData?.name) {
      pokemon.especie = localizedData.name; 
      pokemon.localizedName = localizedData.name; 
    }
    
    const movePromises = pokemon.movimientos.map(async (move) => {
      const localizedName = await this.pokeapi.getMoveLocalizedName(move.nombre).toPromise();
      if (localizedName) {
        move.nombre = localizedName; 
        move.localizedName = localizedName;
      }
    });

    await Promise.all(movePromises);
  }

  async iniciarBatalla() { 
    console.log(this.translate.instant('batalla.status.loadingBattle'));
    
    await this.asignarSprites(this.jugador?.equipo);
    
    this.pokemonJugador = this.jugador?.equipo[0];
    
    if (this.pokemonJugador) {
      await this.localizePokemon(this.pokemonJugador);
    }
    
    console.log(this.translate.instant('batalla.status.pokemonPlayer'), this.pokemonJugador);

    // Generar y localizar al rival
    await this.generarRival();
    
    this.movimientosJugador = this.pokemonJugador?.movimientos!;
  }

  generarRival(): Promise<void> {
    console.log(this.translate.instant('batalla.status.generatingRival'));
    return new Promise((resolve, reject) => {
      this.teamService.getPokemons().subscribe(
        {
          next: async (data) => {
            while (this.rival.length < 6) {
              const pokemon = data[Math.floor(Math.random() * (data.length - 1)) + 1];
              pokemon.idEntrenador = "rival";
              this.rival.push(pokemon);
            }
            
            // 💡 Localizar nombres y movimientos de todo el equipo rival
            const localizationPromises = this.rival.map(p => this.localizePokemon(p));
            await Promise.all(localizationPromises);

            // Esperamos a que los sprites del equipo rival se asignen
            await this.asignarSprites(this.rival);
            
            this.pokemonRival = this.rival[0];
            this.movimientosRival = this.pokemonRival.movimientos!;
            console.log(this.translate.instant('batalla.status.pokemonRival'), this.pokemonRival);
            resolve();
          },
          error: (error: Error) => {
            console.log(this.translate.instant('batalla.status.errorRivalLoad'), error);
            reject(error);
          }
        })
    });
  }

  /*---------------------------------------------------------------------------------------------------------------------------------------- */

  //METODO GENERAL DE BATALLA, utiliza variables para asignar el pokemon atacante y el pokemon defensor, ademas del movimiento atacante
  //Dependiendo de la velocidad del pokemon del entrenador y del rival se decidira cual sera el pokemon atacante y el defensor
  //Luego se calcula el daño del ataque dependiendo del pokemon atacante y defensor y del movimiento que utilice el atacante
  //Se verifica si el pokemon rival sigue con vida, si es asi se genera un ataque con ese pokemon
  batalla(movimientoSeleccionado: Move): void {
    let atacante: Pokemon;
    let defensor: Pokemon;
    let movimientoAtacante: Move;
    let chequearTurnoDefensor: string;
    console.log(this.translate.instant('batalla.status.loadingBattle'));
    // Comparar las velocidades
    if (this.pokemonJugador!.estadisticas.spd >= this.pokemonRival!.estadisticas.spd) {
      // Si el jugador es igual o más rápido que el rival
      atacante = this.pokemonJugador!;
      defensor = this.pokemonRival!;
      chequearTurnoDefensor = this.pokemonRival!.id;
      movimientoAtacante = movimientoSeleccionado;
      console.log(this.translate.instant('batalla.status.attackingPlayer'));
      console.log(this.translate.instant('batalla.status.defenderId'), chequearTurnoDefensor);
    } else {
      // Si el rival es más rápido
      atacante = this.pokemonRival!;
      defensor = this.pokemonJugador!;
      chequearTurnoDefensor = this.pokemonJugador!.id;
      movimientoAtacante = this.generarMovimientoRival();  // Generamos un movimiento aleatorio para el rival
      console.log(this.translate.instant('batalla.status.attackingRival'));
      console.log(this.translate.instant('batalla.status.defenderId'), chequearTurnoDefensor);
    }
    this.calcularAtaque(movimientoAtacante, atacante, defensor);
    console.log(this.translate.instant('batalla.status.originalDefenderId'), defensor.id);
    defensor = this.verificarCambio(defensor);
    console.log(this.translate.instant('batalla.status.newDefenderId'), defensor.id);

    setTimeout(() => {
      // Si el defensor sigue en pie, realizar el siguiente ataque
      if (chequearTurnoDefensor === defensor.id) {
        console.log(this.translate.instant('batalla.status.defenderStanding'));
        // Si es el jugador, usa su movimiento seleccionado
        if (defensor === this.pokemonJugador) {
          movimientoAtacante = movimientoSeleccionado;
        } else {
          movimientoAtacante = this.generarMovimientoRival();
        }

        // Realizar el siguiente ataque
        this.calcularAtaque(movimientoAtacante, defensor, atacante);

        // Verificar si el atacante ha sido derrotado
        this.verificarCambio(atacante);
      }
    }, 2000)
  }

  //
  generarMovimientoRival(): Move {
    const movimientosPosibles = this.pokemonRival?.movimientos || [];
    const indiceAleatorio = Math.floor(Math.random() * movimientosPosibles.length);
    return movimientosPosibles[indiceAleatorio];
  }
  realizarAtaque2(movimiento: Move, atacante: Pokemon, defensor: Pokemon): void {
    let danio = 0;

    // El cálculo del daño dependerá de la clase del movimiento (físico, especial, estado)
    if (movimiento.clase === 'Fisico') {
      danio = Math.max(atacante.estadisticas.atk - defensor.estadisticas.def, 1);
    } else if (movimiento.clase === 'Especial') {
      danio = Math.max(atacante.estadisticas.satk - defensor.estadisticas.sdef, 1);
    }

    // Aplicamos el daño
    defensor.vidaActual = Math.max(defensor.vidaActual - danio, 0);

    // Mostrar el daño en consola o UI
    console.log(`${atacante.especie} ${this.translate.instant('batalla.usedMove')} ${defensor.especie} con ${movimiento.nombre} causando ${danio} de daño.`);
  }

  verificarCambio(defensor: Pokemon): Pokemon {
    if (defensor.vidaActual <= 0) {

      // Mensaje: {Pokemon} has been defeated!
      this.mensajeBatalla = `${this.transformarPrimeraLetra(defensor.especie)} ${this.translate.instant('batalla.isDefeated')}`;
      console.log(this.mensajeBatalla);

      // Eliminar al defensor de su respectivo equipo (jugador o rival)
      if (defensor.idEntrenador === this.pokemonJugador?.idEntrenador) {
        this.jugador?.equipo.shift();
        if (this.jugador?.equipo.length === 0) {
          console.log(this.translate.instant('batalla.status.playerTeamDefeated'));
          this.finalizarBatalla(false);
          this.contadorDeDuelos = 0;
        }
        if (this.jugador!.equipo.length > 0) {
          this.pokemonJugador = this.jugador!.equipo[0];
          this.movimientosJugador = this.pokemonJugador.movimientos!;
          defensor = this.pokemonJugador; // Siguiente Pokémon si hay alguno
          this.localizePokemon(defensor); // Localizar el nuevo Pokémon
        }
      } else {
        this.rival.shift();
        if (this.rival.length === 0) {
          console.log(this.translate.instant('batalla.status.rivalTeamDefeated'));
          this.finalizarBatalla(true);
          this.contadorSumar();
          this.verificarContador();
        }
        if (this.rival.length > 0) {
          this.pokemonRival = this.rival[0];
          this.movimientosRival = this.pokemonRival.movimientos!;
          defensor = this.pokemonRival; // Siguiente Pokémon si hay alguno
          this.localizePokemon(defensor); // Localizar el nuevo Pokémon
        }
      }
    }
    return defensor;
  }

  /*-------------------------------------------------------------------------------------------------------------------------*/
  calcularAtaque(movimiento: Move, atacante: Pokemon, defensor: Pokemon) {
    console.log(`${this.transformarPrimeraLetra(atacante.especie)} ${this.translate.instant('batalla.status.performingMove')} ${this.transformarPrimeraLetra(movimiento.nombre)}`);
    const factor = this.calcularEfectividad(movimiento.tipo, defensor.tipos);
    const daño = Math.floor(((2 * atacante.estadisticas.atk) / defensor.estadisticas.def) * movimiento.potencia * factor);
    defensor.vidaActual -= daño;

    let efectoMensaje = '';
    if (factor > 1) {
      efectoMensaje = this.translate.instant('batalla.superEffective');
    } else if (factor === 0) {
      efectoMensaje = this.translate.instant('batalla.noEffect');
    } else if (factor < 1) {
      efectoMensaje = this.translate.instant('batalla.notVeryEffective');
    }

    // Mensaje: {Attacker} used {Move}.
    // Note: Since 'especie' and 'nombre' are now localized, this works correctly.
    const baseAtaque = `${this.transformarPrimeraLetra(atacante.especie)} ${this.translate.instant('batalla.usedMove')} ${this.transformarPrimeraLetra(movimiento.nombre)}.`;

    let mensajeAtaque = baseAtaque + (efectoMensaje ? ` ${efectoMensaje}` : '');

    this.mostrarMensajeBatalla(mensajeAtaque);

    if (defensor.vidaActual < 0) {
      defensor.vidaActual = 0;
      // Mensaje: {Pokemon} has fainted!
      const faintedMsg = `${this.transformarPrimeraLetra(defensor.especie)} ${this.translate.instant('batalla.fainted')}`;
      this.mostrarMensajeBatalla(mensajeAtaque + ` ${faintedMsg}`);
    }
  }

  mostrarMensajeBatalla(mensaje: string) {
    this.mensajeBatalla = mensaje;
  }

  calcularEfectividad(tipoAtaque: string, tiposDefensor: string[]): number {
    console.log(this.translate.instant('batalla.status.calculatingEffectiveness'));
    console.log(this.translate.instant('batalla.status.attackType'), tipoAtaque);
    let efectividadTotal = 1;

    const tipoAtacante = tipos.find(t => t.name === tipoAtaque.toLowerCase());
    if (!tipoAtacante) return efectividadTotal;

    for (const tipoDefensor of tiposDefensor) {
      console.log(this.translate.instant('batalla.status.defenderType'), tipoDefensor);
      const efectividad = tipoAtacante.efectivity.find(([tipo, _]) => tipo === tipoDefensor.toLowerCase());
      if (efectividad) {
        efectividadTotal *= efectividad[1];
      } else {
        efectividadTotal *= 1;
      }
    }
    console.log(this.translate.instant('batalla.status.effectiveness'), efectividadTotal);
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
    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
  }

  finalizarBatalla(ganador: boolean) {
    let puntajeNuevo = 0;

    // Usamos subscribe para los mensajes del modal que pueden ser más complejos y se muestran al usuario
    if (ganador) {
      puntajeNuevo = (this.partida?.puntuacion ?? 0) + 1;
      this.resultado = this.translate.instant('batalla.title'); // Establece 'You Won!' o '¡Ganaste!'

      // victoryMsg: "You won the battle! You gained {{puntosGanados}} point. Total score: {{puntajeNuevo}}. Loading next battle..."
      this.translate.get('batalla.victoryMsg', { puntajeNuevo: puntajeNuevo, puntosGanados: 1 }).subscribe(msg => {
        this.mensajeModal = msg;
        this.mostrarModal = true;
      });

      this.ps.actualizarPuntaje(this.partida?.id!, puntajeNuevo).subscribe({
        next: (response) => {
          console.log(this.translate.instant('log.scoreUpdated'), response);
        },
        error: (error: Error) => {
          console.error(this.translate.instant('log.scoreUpdateError'), error);
        }
      });
    } else {
      const ranking = { nombre: '', usuario: '', puntaje: 0 };
      puntajeNuevo = this.partida?.puntuacion ?? 0;
      this.resultado = this.translate.instant('batalla.defeatTitle'); // Establece 'Battle Lost' o 'Perdiste la batalla'

      // defeatMsg: "You lost the battle! Your final score was saved. Total score: {{puntajeNuevo}}"
      this.translate.get('batalla.defeatMsg', { puntajeNuevo: puntajeNuevo }).subscribe(msg => {
        this.mensajeModal = msg;
        this.mostrarModal = true;
      });

      console.log(this.jugador?.nombre!);
      console.log(this.partida?.id!);
      ranking!.nombre = this.jugador?.nombre!;
      ranking!.usuario = this.partida?.id!;
      ranking!.puntaje = puntajeNuevo;

      this.rs.postRanking(ranking!).subscribe({
        next: (response) => {
          console.log(this.translate.instant('log.rankingUpdated'), response);
        },
        error: (error: Error) => {
          console.error(this.translate.instant('log.rankingUpdateError'), error);
        }
      });

      this.ps.eliminarPartida(this.partida?.id!).subscribe({
        next: (response) => {
          console.log(this.translate.instant('log.gameDeleted'), response);
        },
        error: (error: Error) => {
          console.error(this.translate.instant('log.gameDeleteError'), error);
        }
      });
    }
  }

  cerrarModal() {
    const isWin = this.resultado === this.translate.instant('batalla.title');

    // Limpiamos el estado del modal antes de cerrar o navegar
    this.mostrarModal = false;
    this.resultado = '';
    this.mensajeModal = '';

    if (isWin) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/batalla']); // Navegar de nuevo a la ruta deseada
      });
    }
    else {
      this.navegarMenu();
    }
  }

  navegarMenu() {
    this.router.navigate(['/menu']);
  }

  logout() {
    this.UserService.logout();
    this.router.navigate(['']);
  }
}