
import {Component, Input} from '@angular/core';
import {AlertController, IonicModule, ModalController, ToastController} from '@ionic/angular';
import {FormsModule} from "@angular/forms";
import axios, {AxiosError} from 'axios';
import {environment} from "../environments/environment";
import {Article, GlobalState} from "../services/global.state";
import {NgIf} from "@angular/common";

@Component({
  selector: 'edit-article-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-button color="danger" (click)="deleteArticleAlert()">Delete Article</ion-button>
        </ion-buttons>
        <ion-title>Edit Article</ion-title>
        <ion-buttons slot="end">

          <ion-button (click)="dismissModal()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <form (ngSubmit)="submitForm()">
        <ion-item>
          <ion-label>Headline</ion-label>
          <ion-input [(ngModel)]="article.headline"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>Author</ion-label>
          <ion-input [(ngModel)]="article.author"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>Body</ion-label>
          <ion-input [(ngModel)]="article.body"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>Article Image</ion-label>
          <ion-input [(ngModel)]="article.articleImgUrl"></ion-input>

        </ion-item>
        <ion-item *ngIf=" article.articleImgUrl!= undefined && article.articleImgUrl!=''">
          <ion-label>Image preview</ion-label>
          <div><img style="max-height: 100px; width: auto;" [src]="article.articleImgUrl"></div>
        </ion-item>

        <ion-button expand="full" type="submit">Update article</ion-button>
      </form>
    </ion-content>
  `,
  imports: [
    IonicModule,
    FormsModule,
    NgIf
  ],
  standalone: true
})
export class EditArticle {

  @Input() article: Article = {};

  constructor(private modalController: ModalController,
              public state: GlobalState,
              public toastCtrl: ToastController,
              public alertController: AlertController) {
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  submitForm() {
    axios.put(environment.baseUrl + '/articles/' + this.article.articleId, this.article).then(res => {
      let index = this.state.articles.findIndex(b => b.articleId == this.article.articleId)
      this.state.articles[index] = this.article;
      this.toastCtrl.create({
        color: 'success',
        duration: 2000,
        message: "Success"
      }).then(res => {
        res.present();
        this.dismissModal();
      })
    }).catch(e => {
      if (e instanceof AxiosError) {
        this.toastCtrl.create({
          color: 'warning',
          duration: 2000,
          message: e.message
        }).then(res => {
          res.present();
        })
      }
    });


  }

  deleteArticleAlert() {
    this.alertController.create({
      message: "Do you really want to delete " + this.article.headline + "?",
      buttons: [
        {
          role: "cancel",
          text: "No"
        },
        {
          role: "confirm",
          text: "Yes",
          handler: () => {
            axios.delete(environment.baseUrl + '/articles/' + this.article.articleId).then(res => {
              this.state.articles = this.state.articles.filter(e => e.articleId != this.article.articleId);
              this.toastCtrl.create({message: this.article.headline + ' successfully deleted'}).then(res => {
                res.present();
                this.modalController.dismiss();
              })
            })
          }
        }
      ]
    }).then(res => {
      res.present();
    })
  }
}
