import {enableProdMode, importProvidersFrom} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppComponent} from './app/app.component';
import {environment} from './environments/environment';
import {TabsPage} from "./app/tabs.page";
import {ArticlesComponent} from "./app/articles.component";

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [provideRouter([
    {
      path: '',
      children: [
        {
          path: 'tabs',
          component: TabsPage,
          children: [
            {
              path: 'articles',
              component: ArticlesComponent
            },
            {
              path: '',
              redirectTo: '/tabs/articles',
              pathMatch: 'full',
            },
          ],
        },
        {
          path: '',
          redirectTo: '/tabs/articles',
          pathMatch: 'full',
        },
      ]
    },
  ]),
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    importProvidersFrom(IonicModule.forRoot({mode: 'ios'})),
  ],

});
