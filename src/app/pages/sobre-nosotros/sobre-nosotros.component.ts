import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sobre-nosotros.component.html',
  styleUrl: './sobre-nosotros.component.css'
})
export class SobreNosotrosComponent {
  fotos: { url: string, texto: string, urlGitHub?: string }[] = [
    { url: 'foto1.jpg', texto: 'Quimey Varela', urlGitHub: 'https://github.com/Varela97' },
    { url: 'foto2.jpg', texto: 'Luciano Buda', urlGitHub: 'https://github.com/LuchoDMD' },
    { url: 'foto3.jpeg', texto: 'Tomas Dallier', urlGitHub: 'https://github.com/Tomyyii' },
    { url: 'foto4.jpg', texto: 'Ignacio Malaguti', urlGitHub: 'https://github.com/igna2030' },
    { url: 'foto5.JPG', texto: 'Gonzalo Varela', urlGitHub: 'https://github.com/piragna1' }
  ];
}