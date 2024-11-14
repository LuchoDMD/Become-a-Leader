import { Stats } from "./stats";
import { Move } from "./move";

export interface Pokemon
{
    id:string,
    especie:string,
    tipos:string[], // Maximo 2
    nivel?:number,
    vidaActual:number,
    estadisticas:Stats,
    movimientos:Move[] // Maximo 4 Solo almaceno sus id para bajarlos en el combate
    idEntrenador:string;
    frontSprite?:string;
    backSprite?:string;
}
