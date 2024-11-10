
import { Pokemon } from "./pokemon";
import { Item } from "./item";

export interface Lider 
{
    id:string,
    nombre:string,
    genero:string, //chico - chica es mas que nada para que defina la imagen a renderizar
    rango:string, // D,C,B,A,S
    dinero:number,
    equipo:Pokemon[], //Min:2 Max:6
    mochila:Map<Item,number>, //{ espacioItem:Item, cantidad:number }
    
}
