import {Component} from "@angular/core";
import {GlobalState} from "../services/global.state";
import {HttpClient} from "@angular/common/http";
import {ToastController} from "@ionic/angular";
import {firstValueFrom} from "rxjs";
import {environment} from "../environments/environment";
import {Router} from "@angular/router";

@Component({
  selector: 'search-articles',
  template: `
    <ion-toolbar>
      <ion-title>Search articles</ion-title>
      <ion-buttons slot="end">

        <ion-input type="number" [(ngModel)]="pageSize">Max # of results:</ion-input>

      </ion-buttons>
    </ion-toolbar>
    <ion-content>

      <ion-list *ngIf="state.articleSearchResults.length>0">
        <ion-list-header>Search results</ion-list-header>
        <ion-item *ngFor="let article of state.articleSearchResults" (click)="goToArticle(article.articleId)">
          <b>{{article.headline}}</b>&nbsp;by&nbsp;<i>{{article.author}}</i>

          <ion-icon slot="end" name="open-outline"></ion-icon>


        </ion-item>
      </ion-list>

      <ion-title *ngIf="searchTerm.length<3 && state.articleSearchResults.length == 0">
      </ion-title>
      <ion-title *ngIf="searchTerm.length>2 && state.articleSearchResults.length == 0">No articles found using search term {{searchTerm}}</ion-title>

    </ion-content>

    <ion-item lines="none">
      <ion-searchbar animated="true" (ionInput)="getArticles()" [(ngModel)]="searchTerm"
                     placeholder="Search for an article"></ion-searchbar>
    </ion-item>


  `
})
export class SearchArticles {
  searchTerm = "";
  pageSize = 5;

  constructor(public state: GlobalState,
              public http: HttpClient,
              public router: Router,
              public toastCtrl: ToastController) {
  }

  async getArticles() {
    if(this.searchTerm.length>2) {
      return this.state.articleSearchResults = (await (firstValueFrom<any>(await this.http.get<any>(environment.baseUrl + '/articles', {
        params: {
          pageSize: this.pageSize,
          searchTerm: this.searchTerm
        }
      }))))
    }
    this.state.articleSearchResults = [];

  }

  goToArticle(articleId: any) {
    this.router.navigate(['./tabs/articles/'+articleId])
  }
}
