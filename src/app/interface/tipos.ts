export interface Tipos {
    nombre:string,
    fortaleza:Map<string,number>, //{ tipo:string, valor:number } 0,0.5,1,2
    debilidad:Map<string,number>  //{ tipo:string, valor:number } 0,0.5,1,2
}
export interface Type 
{
    name:string;
    efectivity:[tipo: string, valor: number][],
}

export const tipos: Type[] = [
    {
        name: "steel",
        efectivity: [
            ["fairy", 2],
            ["ice", 2],
            ["rock", 2],
            ["water", 0.5],
            ["fire", 0.5],
            ["fighting", 0.5],
            ["ground", 0.5]
        ]
    },
    {
        name: "water",
        efectivity: [
            ["fire", 2],
            ["ground", 2],
            ["rock", 2],
            ["dragon", 0.5],
            ["grass", 0.5],
            ["electric", 0.5]
        ]
    },
    {
        name: "bug",
        efectivity: [
            ["grass", 2],
            ["psychic", 2],
            ["dark", 2],
            ["steel", 0.5],
            ["ghost", 0.5],
            ["fairy", 0.5],
            ["fire", 0.5],
            ["poison", 0.5],
            ["fighting", 0.5],
            ["flying", 0.5]
        ]
    },
    {
        name: "dragon",
        efectivity: [
            ["dragon", 2],
            ["steel", 0.5],
            ["fairy", 0]
        ]
    },
    {
        name: "electric",
        efectivity: [
            ["water", 2],
            ["flying", 2],
            ["dragon", 0.5],
            ["grass", 0.5],
            ["electric", 0.5],
            ["ground", 0]
        ]
    },
    {
        name: "fire",
        efectivity: [
            ["bug", 2],
            ["ice", 2],
            ["grass", 2],
            ["steel", 2],
            ["water", 0.5],
            ["dragon", 0.5],
            ["rock", 0.5],
            ["ground", 0.5]
        ]
    },
    {
        name: "ghost",
        efectivity: [
            ["ghost", 2],
            ["psychic", 2],
            ["dark", 0.5],
            ["normal", 0]
        ]
    },
    {
        name: "ice",
        efectivity: [
            ["dragon", 2],
            ["flying", 2],
            ["grass", 2],
            ["ground", 2],
            ["fire", 0.5],
            ["fighting", 0.5],
            ["steel", 0.5],
            ["water", 0.5]
        ]
    },
    {
        name: "fighting",
        efectivity: [
            ["normal", 2],
            ["ice", 2],
            ["rock", 2],
            ["steel", 2],
            ["dark", 2],
            ["flying", 0.5],
            ["psychic", 0.5],
            ["bug", 0.5],
            ["fairy", 0.5],
            ["poison", 0.5],
            ["ghost", 0]
        ]
    },
    {
        name: "normal",
        efectivity: [
            ["steel", 0.5],
            ["rock", 0.5],
            ["ghost", 0]
        ]
    },
    {
        name: "grass",
        efectivity: [
            ["water", 2],
            ["rock", 2],
            ["ground", 2],
            ["fire", 0.5],
            ["bug", 0.5],
            ["flying", 0.5],
            ["ice", 0.5],
            ["dragon", 0.5],
            ["grass", 0.5],
            ["poison", 0.5],
            ["steel", 0.5]
        ]
    },
    {
        name: "psychic",
        efectivity: [
            ["fighting", 2],
            ["poison", 2],
            ["dark", 0],
            ["bug", 0.5],
            ["ghost", 0.5]
        ]
    },
    {
        name: "dark",
        efectivity: [
            ["psychic", 2],
            ["ghost", 2],
            ["fighting", 0.5],
            ["fairy", 0.5],
            ["dark", 0.5],
        ]
    },
    {
        name: "poison",
        efectivity: [
            ["grass", 2],
            ["fairy", 2],
            ["psychic", 0.5],
            ["ground", 0.5],
            ["poison", 0.5],
            ["ghost", 0.5],
            ["steel", 0],
        ]
    },
    {
        name: "fairy",
        efectivity: [
            ["dragon", 2],
            ["dark", 2],
            ["fighting", 2],
            ["fire", 0.5],
            ["steel", 0.5],
            ["poison", 0.5]
        ]
    },
    {
        name: "flying",
        efectivity: [
            ["grass", 2],
            ["fighting", 2],
            ["bug", 2],
            ["electric", 0.5],
            ["rock", 0.5],
            ["steel", 0.5]
        ]
    },
    {
        name: "ground",
        efectivity: [
            ["fire", 2],
            ["electric", 2],
            ["poison", 2],
            ["rock", 2],
            ["steel", 2],
            ["grass", 0.5],
            ["bug", 0.5],
            ["flying", 0]  // Ground has no effect on flying types
        ]
    },
    {
        name: "rock",
        efectivity: [
            ["fire", 2],
            ["ice", 2],
            ["flying", 2],
            ["bug", 2],
            ["fighting", 0.5],
            ["ground", 0.5],
            ["steel", 0.5]
        ]
    }
];



//Cualquier fortaleza o debilidad no incluida en el arreglo de tipos se asume que es 1.
// 0 Nulo - 0.5 Poco Efectivo - 1 Efectivo - 2 Muy Efectivo - >2 Superefectivo 