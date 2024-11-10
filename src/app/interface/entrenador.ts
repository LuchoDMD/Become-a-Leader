import { UUID } from "crypto";
import { Pokemon } from "./pokemon";
import { Item } from "./item";

export interface Entrenador {
    id?:UUID,
    nombre:string,
    rango:string, // D,C,B,A,S
    dinero:number, // Basado en el rango
    equipo:Pokemon[], //Min:1 Max:6
    inventario:Item[], //Min:1 Max:6
}
