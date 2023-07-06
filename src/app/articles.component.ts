import {Component, OnInit} from '@angular/core';
import {IonicModule, ModalController} from '@ionic/angular';

import {environment} from "../environments/environment";
import {Article, GlobalState} from "../services/global.state";
import {JsonPipe, NgForOf} from "@angular/common";
import {NewArticleModalComponent} from "./new-article.component";
import {EditArticle} from "./edit-book.component";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-articles',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
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
            <ion-button (click)="presentEdit(article)">
              <ion-icon name="cog-outline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ion-grid>
          <ion-row>
            <ion-col size="6"><img style="max-height: 100px; width: auto;" src="{{article.articleImgUrl}}">
            </ion-col>
            <ion-col size="6">
              <ion-text>by {{article.author}}</ion-text>
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

  `,
  standalone: true,
  imports: [IonicModule, NgForOf, JsonPipe, HttpClientModule],
})
export class ArticlesComponent implements OnInit {
  constructor(public state: GlobalState,
              private modalCtrl: ModalController,
              private http: HttpClient) {
  }

  async getArticles() {
    try {

      const res = await firstValueFrom<any>(this.http.get(environment.baseUrl + '/feed'));
      this.state.articles = res.responseData;
    } catch (error) {
      console.log(error);
    }

  }

  ngOnInit(): void {
    this.getArticles();
  }

  async openNewArticleComponent() {
    this.modalCtrl.create({
      component: 'NewArticleModalComponent'
    })
      .then(function(modal) {
        return modal.present();
      });
  }

  async presentEdit(article: Article) {

    const modal = await this.modalCtrl.create({
      component: 'EditArticle',
      componentProps: {
        article: {...article}
      }
    });

    return await modal.present();
  }
}
