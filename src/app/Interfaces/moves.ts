export interface Move
{
    nombre:string,
    tipo:string,
    clase:string, //Fisico - Especial - Estado
    potencia:number,
    precision:number,
    usos:number, //Usos Restantes
    pp:number //Cantidad de Usos
}
