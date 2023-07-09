import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  template: `
      <ion-tabs>
          <ion-tab-bar slot="bottom">
              <ion-tab-button tab="articles">
                  <ion-label style="font-size: 40px;">🗞️</ion-label>
              </ion-tab-button>
            <ion-tab-button tab="search">
              <ion-label><ion-icon size="large" name="search-outline"></ion-icon></ion-label>
            </ion-tab-button>
          </ion-tab-bar>
      </ion-tabs>

  `
})
export class TabsPage {

  constructor() {}
}
