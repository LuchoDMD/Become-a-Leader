import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../service/user.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-partida',
  standalone: true,
  // Agregamos CommonModule para directivas (como *ngIf) y TranslateModule para el pipe | translate
  imports: [RouterModule, CommonModule, TranslateModule], 
  templateUrl: './partida.component.html',
  styleUrl: './partida.component.css'
})
export class PartidaComponent implements OnInit, OnDestroy {
  // Estado de la UI
  mensajeCompleto: boolean = false;
  mensajeActual: SafeHtml = ''; // Usamos SafeHtml para el binding [innerHTML]
  lineaIndex: number = 0;

  // Propiedades privadas para la lógica de traducción y construcción del mensaje
  private MESSAGE_KEY = 'intro.message';
  private lineas: string[] = [];
  private langChangeSubscription!: Subscription;
  private mensajeAcumuladoString: string = ''; // 🌟 NEW: Rastrea el contenido HTML sin sanitizar

  // Inyecciones
  us = inject(UserService);
  translate = inject(TranslateService);
  sanitizer = inject(DomSanitizer);

  constructor(private router: Router) {}

  ngOnInit() {
    // 1. Cargar el mensaje inicial al cargar el componente
    this.loadMessage();

    // 2. Suscribirse a los cambios de idioma para recargar el mensaje traducido automáticamente
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.loadMessage();
    });
  }

  ngOnDestroy() {
    // Desuscribirse para prevenir fugas de memoria
    this.langChangeSubscription?.unsubscribe();
  }

  loadMessage() {
    // Obtener la traducción de manera sincrónica usando instant()
    const mensajeLargo = this.translate.instant(this.MESSAGE_KEY);

    // Dividir el mensaje en frases por el separador ". "
    this.lineas = mensajeLargo.split('. ');
    
    // Resetear el estado
    this.mensajeCompleto = false;
    this.lineaIndex = 0;
    this.mensajeAcumuladoString = ''; // Resetear el string acumulado
    this.mensajeActual = this.sanitizer.bypassSecurityTrustHtml(''); // Limpiar el SafeHtml
    
    // Mostrar la primera frase
    this.mostrarMensajeProgresivo();
  }

  /**
   * Muestra la siguiente frase del mensaje progresivamente.
   */
  mostrarMensajeProgresivo() {
    if (this.lineaIndex < this.lineas.length) {
      let currentSegment = this.lineas[this.lineaIndex];

      // Re-agregar el punto al final de la frase (se perdió con el split)
      if (this.lineaIndex < this.lineas.length - 1) {
        currentSegment += '.';
      }

      // 1. Acumular el nuevo segmento al string interno
      this.mensajeAcumuladoString += currentSegment + '<br><br>';
      
      // 2. Usar DomSanitizer para crear el SafeHtml y actualizar la variable pública
      this.mensajeActual = this.sanitizer.bypassSecurityTrustHtml(
        this.mensajeAcumuladoString
      );
      
      this.lineaIndex++;

    } 
    
    if (this.lineaIndex >= this.lineas.length) {
      this.mensajeCompleto = true;
    }
  }

  navegarAMenu() {
    this.router.navigate(['/menu']);
  }

  logout() {
    this.us.logout();
    this.router.navigate(['']);
  }
}