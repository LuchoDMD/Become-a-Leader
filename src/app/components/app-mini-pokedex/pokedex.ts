import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, catchError, of } from 'rxjs';
import { PokeAPIService } from '../../service/poke-api.service';
import { FormsModule } from '@angular/forms'; // Required for ngModel

@Component({
  selector: 'app-mini-pokedex',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule], // Added FormsModule
  templateUrl: './pokedex.html',
  styleUrls: ['./pokedex.css']
})
export class MiniPokedexComponent {
  pokeapi = inject(PokeAPIService);
  translate = inject(TranslateService);
  
  searchTerm: string = '';
  errorMessage: string = '';
  searchedPokemonData: { name: string, localizedName: string, types: string[], spriteUrl: string } | null = null;

  getTranslatedTypeName(typeName: string): Observable<string> {
    return this.pokeapi.getLocalizedTypeName(typeName);
  }

  obtenerClaseTipoMovimiento(tipo: string): string {
    return tipo.toLocaleLowerCase();
  }

  transformarPrimeraLetra(nombre: string): string {
    if (!nombre) return nombre;
    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
  }

  searchPokemon(): void {
    if (!this.searchTerm) return;

    this.errorMessage = '';
    this.searchedPokemonData = null;
    const searchKey = this.searchTerm.toLowerCase().trim();

    this.pokeapi.getPokemonDetails(searchKey).pipe(
      catchError(error => {
        this.errorMessage = this.translate.instant('batalla.pokemonNotFound');
        console.error('Search error:', error);
        return of(null);
      })
    ).subscribe(async details => {
      if (!details) return;

      const localizedName = details.localizedName || details.name;
      const spriteData = await this.pokeapi.getSpriteByID(details.id).toPromise();

      this.searchedPokemonData = {
        name: details.name,
        localizedName: localizedName,
        types: details.types.map((t: { type: { name: any; }; }) => t.type.name),
        spriteUrl: spriteData?.front_default || ''
      };
    });
  }
}