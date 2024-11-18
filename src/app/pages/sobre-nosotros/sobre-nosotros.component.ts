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
  fotos: { url: string, texto: string }[] = [
    { url: 'foto1.jpg', texto: 'Quimey Varela' },
    { url: 'foto2.jpg', texto: 'Luciano Buda' },
    { url: 'foto3.jpg', texto: 'Tomas Dallier' },
    { url: 'foto4.jpg', texto: 'Ignacio Malaguti' },
    { url: 'foto5.jpg', texto: 'Gonzalo Varela' }
  ];
}