import { Estadisticas } from "./estadisticas";

export interface Pokemon {
    mote:string,
    vidaActual:number,
    estadisticasActuales:Estadisticas,
    nivel:number,
    expTotal:number,
    expActual:number,
    expSignivel:number,
}
