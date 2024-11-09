import { Stats } from "./estadisticas"
import { Move } from "./movimientos"

export interface Pokemon {
    id:string,
    especie:string,
    genero:string, //m o f
    tipos:string[], // Maximo 2
    vidaActual:number,
    estadisticas:Stats[], 
    movimientos:Move[] // Maximo 4 Solo almaceno sus id para bajarlos en el combate
}
