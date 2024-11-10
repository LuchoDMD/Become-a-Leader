import { Stats } from "./estadisticas"
import { Move } from "./moves"

export interface Pokemon 
{
    id:string,
    especie:string,
    tipos:string[],
    nivel:number, 
    vidaActual:number,
    estadisticas:Stats, 
    movimientos:Move[] // Maximo 4 Solo almaceno sus id para bajarlos en el combate
}
