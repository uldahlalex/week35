import {Component} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {FormBuilder} from "@angular/forms";
import axios, {AxiosError} from 'axios';
import {environment} from "../environments/environment";
import {GlobalState} from "../services/global.state";

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
      <form [formGroup]="articleForm" (ngSubmit)="submitForm()">
        <ion-item>
          <ion-input label="Headline" labelPlacement="floating" formControlName="headline"></ion-input>
          <div *ngIf="articleForm.controls.headline.invalid && articleForm.controls.headline.touched" class="error">Headline is required</div>
        </ion-item>
        <ion-item>
          <ion-input label="Author" labelPlacement="floating" formControlName="author"></ion-input>
          <div *ngIf="articleForm.controls.author.invalid && articleForm.controls.author.touched" class="error">Author is required</div>
        </ion-item>
        <ion-item>
          <ion-input label="Body" labelPlacement="floating" formControlName="body"></ion-input>
          <div *ngIf="articleForm.controls.body.invalid && articleForm.controls.body.touched" class="error">Body is required</div>
        </ion-item>
        <ion-item>
          <ion-input label="Article image" labelPlacement="floating" formControlName="articleImgUrl"></ion-input>
          <div *ngIf="articleForm.controls.articleImgUrl.invalid && articleForm.controls.articleImgUrl.touched" class="error">Image URL is required</div>
        </ion-item>
        <ion-item *ngIf="articleForm.controls.articleImgUrl.value">
          <ion-label>Image preview</ion-label>
          <div><img style="max-height: 100px; width: auto;" [src]="articleForm.controls.articleImgUrl.value"></div>
        </ion-item>

        <ion-button expand="full" [disabled]="articleForm.invalid" type="submit" >Insert article</ion-button>
      </form>
    </ion-content>
  `
})
export class NewArticleModalComponent {

  articleForm = this.fb.group({
    headline: [''],
    author: [''],
    body: [''],
    articleImgUrl: ['']
  })

  constructor(private modalController: ModalController,
              public state: GlobalState,
              public toastCtrl: ToastController,
              public fb: FormBuilder) {
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  submitForm() {
    axios.post(environment.baseUrl + '/articles', this.articleForm.getRawValue()).then(res => {
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
