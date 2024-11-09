import { Pokemon } from "./pokemon";


export interface Entrenador 
{
    nombre:string,
    equipo:Pokemon[], //Maximo 6
}
