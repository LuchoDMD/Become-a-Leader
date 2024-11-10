
import { Ataque } from "./ataque";
import { Estadisticas } from "./estadisticas";

export interface Pokedex {
    id:number,
    especie:string,
    tipos:string[2],
    altura:number,
    peso:number,
    genero:Map<string,number>, //{ macho:number, hembra:number } //porcentaje,
    habilidades?:Map<string,string>, //{ nombre:string, efecto:string }
    estadisticasBase:Estadisticas,
    movimientos?:Map<number,Ataque>, //{ nivel:number, ataque:Ataque}
    evOtorgado?:Map<string,number>, //{ stat:string, valor:number}
}
