import {enableProdMode, NgModule} from '@angular/core';
import {environment} from './environments/environment';
import {PreloadAllModules, Route, RouteReuseStrategy, RouterModule} from "@angular/router";
import {TabsPage} from "./app/tabs.page";
import {ArticlesComponent} from "./app/articles.component";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {IonicModule, IonicRouteStrategy} from "@ionic/angular";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AppComponent} from "./app/app.component";
import {EditArticle} from "./app/edit-article.component";
import {NewArticleModalComponent} from "./app/new-article.component";
import {HttpClientModule} from "@angular/common/http";
import {ArticleDetailComponent} from "./app/article-detail.component";
import {SearchArticles} from "./app/search-articles";

if (environment.production) {
  enableProdMode();
}
const routes: Route[] = [
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
            path: 'articles/:id',
            component: ArticleDetailComponent
          },
          {
            path: 'search',
            component: SearchArticles
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
      }
    ]
  }];

@NgModule({
  declarations: [SearchArticles, AppComponent,ArticleDetailComponent, ArticlesComponent, EditArticle, NewArticleModalComponent, TabsPage],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    IonicModule.forRoot({
      mode: 'ios', animated: true
    }),
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}),
    NgOptimizedImage,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [

    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
