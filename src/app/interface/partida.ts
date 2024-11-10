import { Lider } from "./lider";

export interface Partida {
    id:string,
    fecha_inicio:Date,
    fecha_fin:Date,
    puntuacion:number,
    personaje:Lider
}
