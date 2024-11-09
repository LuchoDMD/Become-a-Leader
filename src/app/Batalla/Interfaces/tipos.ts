export interface Type 
{
    name:string;
    good:[tipo: string, valor: number][],
    bad:[tipo: string, valor: number][]
}

export const tipos: Type[] = [
    {
        name: "Steel",
        good: [
            ["Ice", 2],
            ["Rock", 2]
        ],
        bad: [
            ["Water", 0.5],
            ["Fire", 0.5],
            ["Fighting", 0.5],
            ["Ground", 0.5]
        ]
    },
    {
        name: "Water",
        good: [
            ["Fire", 2],
            ["Ground", 2],
            ["Rock", 2]
        ],
        bad: [
            ["Electric", 0.5],
            ["Grass", 0.5]
        ]
    },
    {
        name: "Bug",
        good: [
            ["Grass", 2],
            ["Psychic", 2],
            ["Dark", 2]
        ],
        bad: [
            ["Fire", 0.5],
            ["Fighting", 0.5],
            ["Flying", 0.5]
        ]
    },
    {
        name: "Dragon",
        good: [
            ["Dragon", 2]
        ],
        bad: [
            ["Ice", 0.5],
            ["Steel", 0.5],
            ["Dragon", 0.5]
        ]
    },
    {
        name: "Electric",
        good: [
            ["Water", 2],
            ["Flying", 2]
        ],
        bad: [
            ["Electric", 0.5],
            ["Ground", 0]
        ]
    },
    {
        name: "Fire",
        good: [
            ["Bug", 2],
            ["Ice", 2],
            ["Grass", 2],
            ["Steel", 2]
        ],
        bad: [
            ["Water", 0.5],
            ["Rock", 0.5],
            ["Ground", 0.5]
        ]
    },
    {
        name: "Ghost",
        good: [
            ["Ghost", 2],
            ["Psychic", 2]
        ],
        bad: [
            ["Ghost", 0.5],
            ["Dark", 0.5]
        ]
    },
    {
        name: "Ice",
        good: [
            ["Dragon", 2],
            ["Flying", 2],
            ["Grass", 2],
            ["Ground", 2]
        ],
        bad: [
            ["Fire", 0.5],
            ["Fighting", 0.5],
            ["Steel", 0.5]
        ]
    },
    {
        name: "Fighting",
        good: [
            ["Normal", 2],
            ["Ice", 2],
            ["Rock", 2],
            ["Steel", 2],
            ["Dark", 2]
        ],
        bad: [
            ["Flying", 0.5],
            ["Psychic", 0.5]
        ]
    },
    {
        name: "Normal",
        good: [],
        bad: [
            ["Fantasma", 0]
        ]
    },
    {
        name: "Grass",
        good: [
            ["Water", 2],
            ["Rock", 2],
            ["Ground", 2]
        ],
        bad: [
            ["Fire", 0.5],
            ["Bug", 0.5],
            ["Flying", 0.5],
            ["Ice", 0.5]
        ]
    },
    {
        name: "Psychic",
        good: [
            ["Fighting", 2],
            ["Poison", 2]
        ],
        bad: [
            ["Dark", 0.5],
            ["Bug", 0.5],
            ["Ghost", 0.5]
        ]
    },
    {
        name: "Dark",
        good: [
            ["Psychic", 2]
        ],
        bad: [
            ["Fighting", 0.5]
        ]
    },
    {
        name: "Poison",
        good: [
            ["Grass", 2],
        ],
        bad: [
            ["Psychic", 0.5],
            ["Ground", 0.5]
        ]
    }
];

//Cualquier fortaleza o debilidad no incluida en el arreglo de tipos se asume que es 1.
// 0 Nulo - 0.5 Poco Efectivo - 1 Efectivo - 2 Muy Efectivo - >2 Superefectivo 
