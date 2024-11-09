import { Lider } from "./lider";

export interface Partida {
    id_usuario:number,
    fecha_inicio:Date,
    fecha_fin:Date,
    puntuacion:number,
    personaje:Lider
}
