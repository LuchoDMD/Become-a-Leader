export interface Type 
{
    name:string;
    efectivity:[tipo: string, valor: number][] //Efectividad
}

export const tipos: Type[] = [
    {
        name: "Steel",
        efectivity: 
        [
            ["Fairy",2],
            ["Ice", 2],
            ["Rock", 2],
            ["Water", 0.5],
            ["Fire", 0.5],
            ["Fighting", 0.5],
            ["Ground", 0.5]
        ]
    },
    {
        name: "Water",
        efectivity: 
        [
            ["Fire", 2],
            ["Ground", 2],
            ["Rock", 2],
            ["Dragon", 0.5],
            ["Grass",0.5],
            ["Electric", 0.5],
            ["Grass", 0.5]
        ]
    },
    {
        name: "Bug",
        efectivity: 
        [
            ["Grass", 2],
            ["Psychic", 2],
            ["Dark", 2],
            ["Fire", 0.5],
            ["Fighting", 0.5],
            ["Flying", 0.5]
        ]
    },
    {
        name: "Dragon",
        efectivity: [
            ["Dragon", 2],
            ["Steel", 0.5],
            ["Ice", 0.5],
            ["Steel", 0.5],
            ["Dragon", 0.5],
            ["Fairy", 0]
        ]
    },
    {
        name: "Electric",
        efectivity: [
            ["Water", 2],
            ["Flying", 2],
            ["Electric", 0.5],
            ["Ground", 0]
        ]
    },
    {
        name: "Fire",
        efectivity: [
            ["Bug", 2],
            ["Ice", 2],
            ["Grass", 2],
            ["Steel", 2],
            ["Water", 0.5],
            ["Rock", 0.5],
            ["Ground", 0.5]
        ]
    },
    {
        name: "Ghost",
        efectivity: [
            ["Ghost", 2],
            ["Psychic", 2],
            ["Dark", 0.5],
            ["Normal", 0]
        ],

    },
    {
        name: "Ice",
        efectivity: [
            ["Dragon", 2],
            ["Flying", 2],
            ["Grass", 2],
            ["Ground", 2],
            ["Fire", 0.5],
            ["Fighting", 0.5],
            ["Steel", 0.5]
        ]
    },
    {
        name: "Fighting",
        efectivity: [
            ["Normal", 2],
            ["Ice", 2],
            ["Rock", 2],
            ["Steel", 2],
            ["Dark", 2],
            ["Flying", 0.5],
            ["Psychic", 0.5]
        ]
    },
    {
        name: "Normal",
        efectivity: 
        [
            ["Steel",0.5],
            ["Rock",0.5],
            ["Ghost", 0]
        ]
    },
    {
        name: "Grass",
        efectivity:
        [
            ["Water", 2],
            ["Rock", 2],
            ["Ground", 2],
            ["Fire", 0.5],
            ["Bug", 0.5],
            ["Flying", 0.5],
            ["Ice", 0.5]
        ]
    },
    {
        name: "Psychic",
        efectivity: [
            ["Fighting", 2],
            ["Poison", 2],
            ["Dark", 0.5],
            ["Bug", 0.5],
            ["Ghost", 0.5]
        ],
 
    },
    {
        name: "Dark",
        efectivity: 
        [
            ["Psychic", 2],
            ["Fighting", 0.5],
            ["Fairy", 0.5]
        ]
    },
    {
        name: "Poison",
        efectivity: 
        [
            ["Grass", 2],
            ["Psychic", 0.5],
            ["Ground", 0.5]
        ],

    },
    {
        name: "Fairy",
        efectivity: 
        [
            ["Dragon" , 2],
            ["Dark" , 2],
            ["Fighting", 2],
            ["Fire", 0.5],
            ["Steel", 0.5],
            ["Poison", 0.5],
        ]
    }
];

//Cualquier fortaleza o debilidad no incluida en el arreglo de tipos se asume que es 1.
// 0 Nulo - 0.5 Poco Efectivo - 1 Ef>ectivo - 2 Muy Efectivo - 2 Superefectivo 
