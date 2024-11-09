import { UUID } from "crypto";
import { Pokemon } from "./pokemon";

export interface Entrenador {
    id?:UUID,
    nombre:string,
    sprite?:string,
    equipo:Pokemon[], //Min:1 Max:6
}
