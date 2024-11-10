
import { Pokemon } from "./pokemon";
import { Item } from "./item";

export interface Entrenador {
    id:string,
    nombre:string,
    equipo:Pokemon[], //Min:1 Max:6
}
