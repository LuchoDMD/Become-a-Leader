import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { PartidaComponent } from './pages/partida/partida.component';
import { MenuComponent } from './pages/menu/menu.component';
import { NuevaPartidaComponent } from './components/nueva-partida/nueva-partida.component';  // Ajusta la ruta según tu estructura
import { BatallaComponent } from './components/batalla/batalla.component';  
import { AddPokemonComponent } from './components/add-pokemon/add-pokemon.component';

export const routes: Routes = [
  {path: '', component:HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'Partida',component: PartidaComponent},
  {path: 'menu',component: MenuComponent},
  {path: 'nueva-partida', component: NuevaPartidaComponent },
  {path: 'batalla', component: BatallaComponent },
  {path: 'add-pokemon', component: AddPokemonComponent },
];
