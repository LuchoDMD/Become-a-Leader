
import { Pokemon } from "./pokemon";

export interface Entrenador {
    id:string,
    nombre:string,
    tipo:string,
    equipo:Pokemon[], //Min:1 Max:6
}
