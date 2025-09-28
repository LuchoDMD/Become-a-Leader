
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TeamService } from '../../service/team.service';
import { PokeAPIService } from '../../service/poke-api.service';
import { Pokemon } from '../../interface/pokemon';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.css'
})

export class PokemonListComponent implements OnInit
{
    //Variables
    pokemons:Pokemon[]=[];
    pIcons:string[]=[];
  
    //Injectables
    ts= inject(TeamService);
    ps= inject(PokeAPIService);
    route= inject(Router);
    us = inject(UserService);

    //Metodos
    ngOnInit(): void {
      this.ts.getPokemons().subscribe(
      {
        next:(data:Pokemon[])=>
        {
          this.pokemons=data;
          this.loadIcons();
        },
        error:(err:Error)=>{
          console.log("ERROR: "+err.message)
        }
      });
    }

    //Carga los Icons
    loadIcons():void
    {
      if(this.pokemons.length>0){
        this.pIcons=[];
        for(let i=0;i<this.pokemons.length;i++)
        {
          this.ps.getSpriteByID(this.pokemons[i].id).subscribe({
            next:(data: any)=>{
              let icon = data.versions?.['generation-vii']?.icons?.front_default;
              if(icon){
                this.pIcons[i]=icon;
              }
              icon="";
            },
            error:(err:Error)=>{
              console.log("ERROR: "+err.message);
            }
          });
        }
      }
    }
    //Enviar a pokemon details
    enviarADetalles(id:string)
    {
      this.route.navigate(['detail/'+id]);
    }

    logout() {
      this.us.logoutAdmin();
      this.route.navigate(['']);
    }
}


 /*
          Mira Nica los metodos de los array se caen a pedazos si lees esto fijate porque jajaj
          this.pokemons.forEach((pokemon:Pokemon)=>{
          console.log("ID Poke: "+pokemon.id);
          this.ps.getSpritesByID(pokemon.id).subscribe({
            next:(data: any)=>{
              let icon = data.versions?.['generation-vii']?.icons?.front_default;
              if(icon){
                console.log("Icon: "+icon);
                this.pIcons.unshift(icon);
              }
              icon="";
            },
            error:(err:Error)=>{
              console.log("ERROR: "+err.message);
            }
          });
        });
*/