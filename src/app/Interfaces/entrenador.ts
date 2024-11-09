import { UUID } from "crypto";
import { Pokemon } from "./pokemon";

export interface Entrenador {
    id:string,
    nombre:string,
    equipo:Pokemon[], //Min:1 Max:6
}
