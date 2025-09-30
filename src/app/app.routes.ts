
import { Routes, CanActivate } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { PartidaComponent } from './pages/partida/partida.component';
import { MenuComponent } from './pages/menu/menu.component';
import { NuevaPartidaComponent } from './pages/nueva-partida/nueva-partida.component';  // Ajusta la ruta según tu estructura
import { BatallaComponent } from './components/batalla/batalla.component';
import { AddPokemonComponent } from './components/add-pokemon/add-pokemon.component';
import { SobreNosotrosComponent } from './pages/sobre-nosotros/sobre-nosotros.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { AuthGuard } from './service/auth-guard.service';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonDetailComponent } from './components/pokemon-detail/pokemon-detail.component';
import { EditPokemonComponent } from './components/edit-pokemon/edit-pokemon.component';
import { LoginAdminComponent } from './pages/login-admin/login-admin.component';
import { AuthAdmin } from './service/auth-admin.service';
import { MapaComponent } from './components/mapa/mapa.component';
import { CentroPokemonComponent } from './components/centro-pokemon/centro-pokemon.component';
import { GimnasioComponent } from './components/gimnasio/gimnasio.component';
import { VerPerfilGimComponent } from './components/ver-perfil-gim/ver-perfil-gim.component';
import { TiendaPokemonComponent } from './components/tienda-pokemon/tienda-pokemon';


export const routes: Routes = [
  { path: '', component:HomeComponent},
  { path: 'register', component: RegisterComponent}, //ok
  { path: 'login', component: LoginComponent}, //ok
  { path: 'sobre-nosotros', component: SobreNosotrosComponent},
  { path: 'ranking', component: RankingComponent, canActivate: [AuthGuard] }, //ok
  { path: 'Partida', component: PartidaComponent, canActivate: [AuthGuard] }, //ok
  { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] }, //ok
  { path: 'nueva-partida', component: NuevaPartidaComponent, canActivate: [AuthGuard] }, //ok
  { path: 'mapa', component: MapaComponent}, //ok
  { path: 'centro-pokemon', component: CentroPokemonComponent}, //falta completar el codigo
  { path: 'tienda-pokemon', component: TiendaPokemonComponent}, //falta completar el codigo
  { path: 'gimnasio', component: GimnasioComponent}, //falta completar el codigo
  { path: 'batalla', component: BatallaComponent, canActivate: [AuthGuard] }, //modificar para visualizar al jugador y a los entrenadores
  { path: 'login-admin', component: LoginAdminComponent }, //ok
  { path: 'add-pokemon', component: AddPokemonComponent, canActivate: [AuthAdmin]}, //ok
  { path: 'perfil', component: UserProfileComponent, canActivate: [AuthGuard]}, //ok
  { path: 'perfil-gim', component: VerPerfilGimComponent}, //aun no se que hace
  { path: 'pokemon-list', component:PokemonListComponent, canActivate: [AuthAdmin]}, //puede ser util para el jugador
  { path: 'pokemon-detail/:id', component:PokemonDetailComponent, canActivate: [AuthAdmin] }, //puede ser util para el jugador
  { path: 'pokemon-edit/:id', component:EditPokemonComponent, canActivate: [AuthAdmin] }, //puede ser util para el jugador
];

/*
  El orden de los componentes
      '' -> login
      login <-> register
      login -> menu
      menu -> n.partida
      menu <-> perfil
      n.partida -> mapa
      mapa -> batalla
      mapa -> centro-pokemon
      centro-pokemon -> curar
      centro-pokemon -> editar-equipo <-> pokemon-edit.
      tienda-pokemon -> comprar pack pokemon.
      tienda-pokemon -> comprar totem.
      mapa -> tienda-pokemon.
      mapa -> gimnasio.
      mapa -> perfil.
      gimnasio -> batalla.
 */

/*
      gimnasio previsualiza un combate como sucede en pokemon
      y luego entra a la batalla. 
      Con un totem puedes curar al equipo completo o a un pokemon durante la horda.
      Precio a definir. Quizas haya 2 objetos unicos.(No mas).
*/