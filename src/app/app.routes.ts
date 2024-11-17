import { Routes } from '@angular/router';
import { PokemonListComponent } from './Pokemon/Components/pokemon-list/pokemon-list.component';
import { AddPokemonComponent } from './Pokemon/Components/add-pokemon/add-pokemon.component';
import { PokemonDetailComponent } from './Pokemon/Components/pokemon-detail/pokemon-detail.component';
import { EditPokemonComponent } from './Pokemon/Components/edit-pokemon/edit-pokemon.component';

export const routes: Routes = 
[
    { path:'', component:PokemonListComponent },
    { path:'list', component:PokemonListComponent},
    { path:'add', component:AddPokemonComponent },
    { path:'detail/:id', component:PokemonDetailComponent },
    { path:'edit/:id', component:EditPokemonComponent },
];
