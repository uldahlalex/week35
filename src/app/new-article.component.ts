

import {Component} from '@angular/core';
import {IonicModule, ModalController, ToastController} from '@ionic/angular';
import {FormsModule} from "@angular/forms";
import axios, {AxiosError} from 'axios';
import {environment} from "../environments/environment";
import {GlobalState} from "../services/global.state";
import {NgIf} from "@angular/common";

@Component({
  selector: 'new-article-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>New Article</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismissModal()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <form (ngSubmit)="submitForm()">
        <ion-item>
          <ion-label>Headline</ion-label>
          <ion-input [(ngModel)]="headline"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>Author</ion-label>
          <ion-input [(ngModel)]="author"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>Body</ion-label>
          <ion-textarea [(ngModel)]="body"></ion-textarea>
        </ion-item>
        <ion-item>
          <ion-label>Article image</ion-label>
          <ion-input [(ngModel)]="articleImgUrl"></ion-input>

        </ion-item>
        <ion-item *ngIf=" articleImgUrl!= undefined && articleImgUrl!=''">
          <ion-label>Image preview</ion-label>
          <div><img style="max-height: 100px; width: auto;" [src]="articleImgUrl"></div>
        </ion-item>
        <ion-button expand="full" type="submit">Create article</ion-button>
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
export class NewArticleModalComponent {
  headline: string = "";
  author: string = "";
  body: string = "";
  articleImgUrl: string = "";

  constructor(private modalController: ModalController,
              public state: GlobalState,
              public toastCtrl: ToastController) {
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  submitForm() {
    let dto = {
      headline: this.headline,
      author: this.author,
      body: this.body,
      articlmgUrl: this.articleImgUrl
    }
    axios.post(environment.baseUrl + '/articles', dto).then(res => {
      this.state.articles.push(res.data.responseData);
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
          message: e.response!.data.messageToClient
        }).then(res => {
          res.present();
        })
      }
    });


  }
}
