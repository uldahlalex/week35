import {Component, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../environments/environment";
import {firstValueFrom} from "rxjs";
import {GlobalState} from "../services/global.state";
import {ModalController} from "@ionic/angular";
import {EditArticle} from "./edit-article.component";
import {Location} from "@angular/common";

@Component({
  template: `
    <ion-card>
      <ion-toolbar>
        <ion-buttons>
          <ion-button (click)="location.back()">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>
          {{state.currentArticle.headline}}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="openEditModal()">
            <ion-icon name="cog-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <img [src]="state.currentArticle.articleImgUrl">

      <ion-item lines="none">
        <i>{{state.currentArticle.body}}</i>
      </ion-item>
    </ion-card>

  `,
  selector: 'article-detail',
})
export class ArticleDetailComponent implements OnInit {

  constructor(public httpClient: HttpClient,
              public location: Location,
              public modalCtrl: ModalController,
              public state: GlobalState,
              public route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.getArticle()
  }

  async getArticle() {
    const id = (await firstValueFrom(this.route.paramMap)).get('id');
    this.state.currentArticle = (await firstValueFrom(this.httpClient.get<any>(environment.baseUrl + '/articles/' + id)));
  }

  openEditModal() {
    this.modalCtrl.create({
      component: EditArticle,
      componentProps: {
        copyOfInjectedArticle: {...this.state.currentArticle}
      }
    }).then(res => {
      res.present()
    })
  }
}
