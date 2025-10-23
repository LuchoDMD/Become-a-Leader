import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideTranslateService, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader, TranslateHttpLoader } from '@ngx-translate/http-loader';


function initializeAppTranslation(translate: TranslateService): () => void {
  return () => {
    const defaultLang = 'es';
    const availableLangs = ['es', 'en'];

    translate.addLangs(availableLangs);
    translate.setDefaultLang(defaultLang);

    const savedLang = localStorage.getItem('appLang');

    if (savedLang && availableLangs.includes(savedLang)) {
      translate.use(savedLang);
    } else {
      const browserLang = translate.getBrowserLang();
      const initialLang = (browserLang && availableLangs.includes(browserLang)) ? browserLang : defaultLang;
      translate.use(initialLang);
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(), provideTranslateService({
    loader: provideTranslateHttpLoader({
      prefix: 'assets/i18n/',
      suffix: '.json'
    }),
    fallbackLang: 'es',
    lang: 'es'
  }),
  {
    provide: APP_INITIALIZER,
    useFactory: initializeAppTranslation,
    deps: [TranslateService],
    multi: true
  }]
};
