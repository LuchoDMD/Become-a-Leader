import { Pokemon } from "./pokemon";

export interface Lider 
{
    id:string,
    nombre:string,
    equipo:Pokemon[] //Min:2 Max:6 almacena los id // nombres
}
