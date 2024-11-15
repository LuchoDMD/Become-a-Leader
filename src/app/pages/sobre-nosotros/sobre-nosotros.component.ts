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
    { url: 'foto1.jpg', texto: 'Texto para la foto 1' },
    { url: 'foto2.jpg', texto: 'Texto para la foto 2' },
    { url: 'foto3.jpg', texto: 'Texto para la foto 3' },
    { url: 'foto4.jpg', texto: 'Texto para la foto 4' },
    { url: 'foto5.jpg', texto: 'Texto para la foto 5' }
  ];
}