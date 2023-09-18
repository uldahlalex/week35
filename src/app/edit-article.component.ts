import {Component, Input, OnInit} from '@angular/core';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
import {FormBuilder, Validators} from "@angular/forms";
import axios, {AxiosError} from 'axios';
import {environment} from "../environments/environment";
import {Article, GlobalState} from "../services/global.state";
import {Router} from "@angular/router";

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
      <form [formGroup]="articleForm" (ngSubmit)="submitForm()">
        <ion-item>
          <ion-input label="Headline" labelPlacement="floating" formControlName="headline"></ion-input>
          <div *ngIf="articleForm.controls.headline.invalid && articleForm.controls.headline.touched" class="error">
            Headline is required
          </div>
        </ion-item>
        <ion-item>
          <ion-input label="Author" labelPlacement="floating" formControlName="author"></ion-input>
          <div *ngIf="articleForm.controls.author.invalid && articleForm.controls.author.touched" class="error">Author
            is required
          </div>
        </ion-item>
        <ion-item>
          <ion-input label="Body" labelPlacement="floating" formControlName="body"></ion-input>
          <div *ngIf="articleForm.controls.body.invalid && articleForm.controls.body.touched" class="error">Body is
            required
          </div>
        </ion-item>
        <ion-item>
          <ion-input label="Article image" labelPlacement="floating" formControlName="articleImgUrl"></ion-input>
          <div *ngIf="articleForm.controls.articleImgUrl.invalid && articleForm.controls.articleImgUrl.touched"
               class="error">Image URL is required
          </div>
        </ion-item>
        <ion-item *ngIf="articleForm.controls.articleImgUrl.value">
          <ion-label>Image preview</ion-label>
          <div><img style="max-height: 100px; width: auto;" [src]="articleForm.controls.articleImgUrl.value"></div>
        </ion-item>

        <ion-button expand="full" [disabled]="articleForm.invalid" type="submit">Update article</ion-button>
      </form>
    </ion-content>
  `
})
export class EditArticle implements OnInit {

  @Input() copyOfInjectedArticle!: Article;

  articleForm = this.fb.group({
    headline: ['', Validators.required],
    author: ['', Validators.required],
    body: ['', Validators.required],
    articleImgUrl: ['', Validators.required],
    articleId: [0, Validators.required]
  });


  constructor(private modalController: ModalController,
              public state: GlobalState,
              public toastCtrl: ToastController,
              public alertController: AlertController,
              public router: Router,
              public fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.articleForm.patchValue({
      headline: this.copyOfInjectedArticle.headline,
      author: this.copyOfInjectedArticle.author,
      body: this.copyOfInjectedArticle.body,
      articleImgUrl: this.copyOfInjectedArticle.articleImgUrl,
      articleId: this.copyOfInjectedArticle.articleId
    })
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  submitForm() {
    axios.put(environment.baseUrl + '/articles/' + this.copyOfInjectedArticle.articleId, this.articleForm.getRawValue()).then(res => {
      let index = this.state.articles.findIndex(b => b.articleId == this.copyOfInjectedArticle.articleId)
      this.state.articles[index] = this.articleForm.getRawValue() as Article;
      this.state.currentArticle = this.articleForm.getRawValue() as Article;
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
        console.log(e.response);
        this.toastCtrl.create({
          color: 'warning',
          duration: 2000,
          message: Object.values(e.response!.data.errors).toString()
        }).then(res => {
          res.present();
        })
      }
    });


  }

  deleteArticleAlert() {
    this.alertController.create({
      message: "Do you really want to delete " + this.copyOfInjectedArticle.headline + "?",
      buttons: [
        {
          role: "cancel",
          text: "No"
        },
        {
          role: "confirm",
          text: "Yes",
          handler: () => {
            axios.delete(environment.baseUrl + '/articles/' + this.copyOfInjectedArticle.articleId).then(res => {
              this.state.articles = this.state.articles.filter(e => e.articleId != this.copyOfInjectedArticle.articleId);
              this.state.currentArticle = {};
              this.router.navigate(['./tabs/articles'])
              this.toastCtrl.create({
                message: this.copyOfInjectedArticle.headline + ' successfully deleted',
                duration: 2000
              }).then(res => {
                res.present();
                this.modalController.dismiss();
              })
            }).catch(e => {
              if (e instanceof AxiosError) {
                console.log(e);
                console.log(e.response!.data.errors)
                this.toastCtrl.create({
                  color: 'warning',
                  duration: 2000,
                  message: Object.values(e.response!.data.errors).toString()
                }).then(res => {
                  res.present();
                })
              }
            })
          }
        }
      ]
    }).then(res => {
      res.present();
    })
  }


}
