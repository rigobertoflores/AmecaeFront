import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideLottieOptions } from 'ngx-lottie';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),importProvidersFrom(HttpClientModule), provideAnimationsAsync(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"clinicaolivera-83a02","appId":"1:879808668178:web:7ae7133b8499b46b86eecb","storageBucket":"clinicaolivera-83a02.appspot.com","apiKey":"AIzaSyD2SJiVB9w5dI8LjdF_ehSWjoRkKpEZ4Sk","authDomain":"clinicaolivera-83a02.firebaseapp.com","messagingSenderId":"879808668178"}))), importProvidersFrom(provideAuth(() => getAuth())),
  provideLottieOptions({
    player: () => import('lottie-web'),
  }),
]
};

