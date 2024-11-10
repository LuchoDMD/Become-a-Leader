export interface Item {
    id?:number,
    nombre:string,
    categoria:string,
    efecto:string,
    precio:Map<string,number>, //{ compra:number, venta:number }
}
