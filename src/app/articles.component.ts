import {Component, OnInit} from '@angular/core';
import {IonicModule, ModalController} from '@ionic/angular';

import {environment} from "../environments/environment";
import {Article, GlobalState} from "../services/global.state";
import {JsonPipe, NgForOf} from "@angular/common";
import {NewArticleModalComponent} from "./new-article.component";
import {EditArticle} from "./edit-article.component";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-articles',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons>
          <img style="max-height: 25px; width: auto" src="https://packroff.dk/wp-content/uploads/EASV-med-ramme.jpg">
        </ion-buttons>
        <ion-title>
          The news feed <b style="font-size: 30px">📰</b>

        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">

      <ion-card *ngFor="let article of state.articles">
        <ion-toolbar>
          <ion-title>{{article.headline}}</ion-title>
          <ion-buttons slot="end">
            <ion-button (click)="goToArticle(article.articleId)">
              <ion-icon name="open-outline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ion-grid>
          <ion-row>
            <ion-col size="3"><img style="max-height: 100px; width: auto;" src="{{article.articleImgUrl}}">
            </ion-col>
            <ion-col size="9">
              <i>{{article.body}} ... </i>
            </ion-col>
          </ion-row>
        </ion-grid>


      </ion-card>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button (click)="openNewArticleComponent()">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>

  `
})
export class ArticlesComponent implements OnInit {
  constructor(public state: GlobalState,
              private modalCtrl: ModalController,
              private http: HttpClient, public router: Router) {
  }

  async getArticles() {
    try {

      const res = await firstValueFrom<any>(this.http.get(environment.baseUrl + '/feed'));
      this.state.articles = res;
    } catch (error) {
      console.log(error);
    }

  }

  ngOnInit(): void {
    this.getArticles();
  }

  async openNewArticleComponent() {
    this.modalCtrl.create({
      component: NewArticleModalComponent
    })
      .then(function(modal) {
        return modal.present();
      });
  }

  async goToArticle(articleId: number | undefined) {
    this.router.navigate(['./tabs/articles/'+articleId]);
  }
}
