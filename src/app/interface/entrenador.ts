import { Pokemon } from "./pokemon";

export interface Entrenador 
{
    id:string,
    nombre:string,
    dinero:number,
    equipo:Pokemon[], //Min:1 Max:6
}

