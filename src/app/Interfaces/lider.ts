import { UUID } from "crypto";
import { Pokemon } from "./pokemon";

export interface Lider 
{
    id:string,
    nombre:string,
    genero:string, //chico - chica es mas que nada para que defina la imagen a renderizar
    equipo:Pokemon[] //Min:2 Max:6
}