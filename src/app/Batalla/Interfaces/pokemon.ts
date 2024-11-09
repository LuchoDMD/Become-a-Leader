import { Estadisticas } from "./estadisticas"
import { Movimientos } from "./movimientos"

export interface Pokemon {
    id:string,
    especie:string,
    genero:string, //m o f
    mote:string, //Especie pokemon
    tipos:string[], // Maximo 2
    vidaActual:number,
    estadisticas:Estadisticas, 
    movimientos:Movimientos[] // Maximo 4 Solo almaceno sus id para bajarlos en el combate
}
