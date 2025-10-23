import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [RouterModule, CommonModule,TranslateModule],
  templateUrl: './sobre-nosotros.component.html',
  styleUrl: './sobre-nosotros.component.css'
})
export class SobreNosotrosComponent {
  translate = inject(TranslateService);
  fotos: { url: string, texto: string, urlGitHub?: string }[] = [
    { url: 'foto1.jpg', texto: 'Quimey Varela', urlGitHub: 'https://github.com/Varela97' },
    { url: 'foto2.jpg', texto: 'Luciano Buda', urlGitHub: 'https://github.com/LuchoDMD' },
    { url: 'foto3.jpeg', texto: 'Tomas Dallier', urlGitHub: 'https://github.com/Tomyyii' },
    { url: 'foto4.jpg', texto: 'Ignacio Malaguti', urlGitHub: 'https://github.com/igna2030' },
    { url: 'foto5.JPG', texto: 'Gonzalo Varela', urlGitHub: 'https://github.com/piragna1' }
  ];
}