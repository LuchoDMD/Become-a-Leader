
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,CommonModule,TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  translate = inject(TranslateService);
  
  changeLang(lang:string){
    this.translate.use(lang);
    console.log("Language changed to: ",lang);
    localStorage.setItem('appLang', lang);
  }

  toogleLang(){
    const current_lang = this.translate.getCurrentLang();
    const new_lang = current_lang === 'en' ? 'es' : 'es';
    this.translate.use(new_lang);
  }




}
