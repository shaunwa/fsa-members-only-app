import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import firebase from 'firebase/app';
import 'firebase/auth';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

var firebaseConfig = {
    apiKey: "AIzaSyA8vxWyRRsnOfFSOCO3_4qlDh6I2nLPsmw",
    authDomain: "fsa-members-only-key.firebaseapp.com",
    projectId: "fsa-members-only-key",
    storageBucket: "fsa-members-only-key.appspot.com",
    messagingSenderId: "273629851600",
    appId: "1:273629851600:web:2ea4eb7aeefa52ed8d13d5"
};

firebase.initializeApp(firebaseConfig);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
