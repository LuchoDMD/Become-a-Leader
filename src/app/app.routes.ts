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
import { SobreNosotrosComponent } from './pages/sobre-nosotros/sobre-nosotros.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { AuthGuard } from './service/auth-guard.service';

export const routes: Routes = [
  { path: '', component:HomeComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: 'sobre-nosotros', component: SobreNosotrosComponent},
  { path: 'ranking', component: RankingComponent, canActivate: [AuthGuard] },
  { path: 'Partida', component: PartidaComponent, canActivate: [AuthGuard] },
  { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
  { path: 'nueva-partida', component: NuevaPartidaComponent, canActivate: [AuthGuard] },
  { path: 'batalla', component: BatallaComponent, canActivate: [AuthGuard] },
  { path: 'add-pokemon', component: AddPokemonComponent, canActivate: [AuthGuard] }, 
];
