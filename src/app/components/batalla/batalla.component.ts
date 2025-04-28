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
  rs = inject(RankingService);

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

  constructor(private router: Router, private route: ActivatedRoute) {}

  contadorSumar()
{
  this.contadorDeDuelos+=1;
}

verificarContador()
{
  if(this.contadorDeDuelos>3)
  {
    this.cambioPokemon=true;
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

  obtenerUrlSprites(pokemon: Pokemon): Promise<{front_default:string, back_default:string}> {
    return new Promise((resolve, reject) => {
      this.pokeapi.getSpriteByID(pokemon.id).subscribe({
        next: (data) => {
          resolve({
            front_default:data.front_default,
            back_default:data.back_default
          });
        },
        error: (error: Error) => { reject("Error al obtener el sprite"); }
      });
    });
  }

  async asignarSprites(equipo: Pokemon[] | undefined) {
    // Prueba para sprites
    for (const element of equipo || []) {
      try {
        const urls = await this.obtenerUrlSprites(element);
        element.backSprite=urls.back_default;
        element.frontSprite=urls.front_default;
      }
      catch {
        console.error("Error al obtener urls de los sprites.");
      }
    }
  }


  //Metodo para iniciar la batalla, este metodo genera el rival del entrenador y asigna los sprites a los pokemon del entrenador como tambien sus movimientos
  iniciarBatalla() {
    console.log("Iniciando batalla");
    this.asignarSprites(this.jugador?.equipo);
    this.pokemonJugador = this.jugador?.equipo[0];
    console.log("Pokemon jugador:", this.pokemonJugador);


    this.generarRival();
    this.movimientosJugador = this.jugador?.equipo[0].movimientos!;

  }


  //Metodo para generar un rival, Utiliza el servicio teamService para obtener todos los pokemons de la api
  //Luego con ese arreglo selecciona uno al azar y lo coloca en una constante pokemon
  //Se le asigna un id de entrenador al rival y se colocan los pokemons dentro del arreglo rival, esto lo repetira 6 veces
  //Se asignan los sprites y los movimientos a cada pokemon del arreglo rival
  generarRival() {
    console.log("Generando rival");
    this.teamService.getPokemons().subscribe(
      {
        next: (data) => {
          while (this.rival.length < 6) {
            const pokemon = data[Math.floor(Math.random() * (data.length - 1)) + 1];
            pokemon.idEntrenador = "rival";
            this.rival.push(pokemon);
          }
          this.asignarSprites(this.rival);
          this.pokemonRival = this.rival[0];
          this.movimientosRival = this.pokemonRival.movimientos!;
          console.log("Pokemon rival:", this.pokemonRival);
        },
        error: (error: Error) => {
          console.log("Error al cargar rival")
        }
      })
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
    console.log("Iniciando batalla");
    // Comparar las velocidades
    if (this.pokemonJugador!.estadisticas.spd >= this.pokemonRival!.estadisticas.spd) {
      // Si el jugador es igual o más rápido que el rival
      atacante = this.pokemonJugador!;
      defensor = this.pokemonRival!;
      chequearTurnoDefensor = this.pokemonRival!.id;
      movimientoAtacante = movimientoSeleccionado;
      console.log("Jugador es el atacante");
      console.log("Id del defensor:", chequearTurnoDefensor);
    } else {
      // Si el rival es más rápido
      atacante = this.pokemonRival!;
      defensor = this.pokemonJugador!;
      chequearTurnoDefensor = this.pokemonJugador!.id;
      movimientoAtacante = this.generarMovimientoRival();  // Generamos un movimiento aleatorio para el rival
      console.log("Rival es el atacante");
      console.log("Id del defensor:", chequearTurnoDefensor);
    }
    this.calcularAtaque(movimientoAtacante, atacante, defensor);
    console.log("Id del defensor original:", defensor.id);
    defensor = this.verificarCambio(defensor);
    console.log("Id del defensor luego de verificarCambio:", defensor.id);

    setTimeout(() => {
      // Si el defensor sigue en pie, realizar el siguiente ataque
      if (chequearTurnoDefensor === defensor.id) {
        console.log("Defensor sigue en pie");
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
    console.log(`${atacante.especie} atacó a ${defensor.especie} con ${movimiento.nombre} causando ${danio} de daño.`);
  }

  verificarCambio(defensor: Pokemon): Pokemon {
    if (defensor.vidaActual <= 0) {
      console.log(`${defensor.especie} ha sido derrotado!`);

      // Eliminar al defensor de su respectivo equipo (jugador o rival)
      if (defensor.idEntrenador === this.pokemonJugador?.idEntrenador) {
        this.jugador?.equipo.shift();
        if (this.jugador?.equipo.length === 0) {
          console.log("El equipo del jugador ha sido derrotado.");
          this.finalizarBatalla(false);
          this.contadorDeDuelos=0;
        }
        if(this.jugador!.equipo.length > 0){
          this.pokemonJugador = this.jugador!.equipo[0];
          this.movimientosJugador = this.pokemonJugador.movimientos!;
          defensor = this.pokemonJugador; // Siguiente Pokémon si hay alguno
        }
      } else {
        this.rival.shift();
        if (this.rival.length === 0) {
          console.log("El equipo del rival ha sido derrotado.");
          this.finalizarBatalla(true);
          this.contadorSumar();
          this.verificarContador();
        }
        if(this.rival.length > 0){
          this.pokemonRival = this.rival[0];
          this.movimientosRival = this.pokemonRival.movimientos!;
          defensor = this.pokemonRival; // Siguiente Pokémon si hay alguno
        }
      }
    }
    return defensor;
  }

  /*-------------------------------------------------------------------------------------------------------------------------*/
  calcularAtaque(movimiento: Move, atacante: Pokemon, defensor: Pokemon) {
    console.log(`${atacante.especie} está realizando ${movimiento.nombre}`);
    const factor = this.calcularEfectividad(movimiento.tipo, defensor.tipos);
    const daño = Math.floor(((2 * atacante.estadisticas.atk) / defensor.estadisticas.def) * movimiento.potencia * factor);
    defensor.vidaActual -= daño;
    const mensajeAtaque = `${this.transformarPrimeraLetra(atacante.especie)} usó ${this.transformarPrimeraLetra(movimiento.nombre)}. ` +
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
      puntajeNuevo = (this.partida?.puntuacion ?? 0) + 1;
      this.resultado = '¡Ganaste!';
      this.mensajeModal = 'Has ganado la batalla! Sumaste 1 punto. Puntaje total: ' + puntajeNuevo + '. Cargando siguiente batalla...';
      this.mostrarModal = true;
      this.ps.actualizarPuntaje(this.partida?.id!, puntajeNuevo).subscribe({
        next: (response) => {
          console.log('Puntaje actualizado:', response);
        },
        error: (error: Error) => {
          console.error('Error al actualizar el puntaje:', error);
        }
      });
    } else {
      const ranking = { nombre: '', usuario: '', puntaje: 0 };
      puntajeNuevo = this.partida?.puntuacion ?? 0;
      this.resultado = 'Perdiste la batalla';
      this.mensajeModal = 'Has perdido la batalla!. Se guardo tu puntaje final. Puntaje total: ' + puntajeNuevo ;
      this.mostrarModal = true;
      console.log(this.jugador?.nombre!);
      console.log(this.partida?.id!);
      ranking!.nombre = this.jugador?.nombre!;
      ranking!.usuario = this.partida?.id!;
      ranking!.puntaje = puntajeNuevo;
      this.rs.postRanking(ranking!).subscribe({
        next: (response) => {
          console.log('Ranking actualizado:', response);
        },
        error: (error: Error) => {
          console.error('Error al actualizar el ranking:', error);
        }
      }
      )
      this.ps.eliminarPartida(this.partida?.id!).subscribe({
        next: (response) => {
          console.log('Puntaje actualizado:', response);
        },
        error: (error: Error) => {
          console.error('Error al actualizar el puntaje:', error);
        }
      });
    }
  }

  cerrarModal() {
    this.mostrarModal = false; // Oculta el modal
    if (this.resultado === '¡Ganaste!') {
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

