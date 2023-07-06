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
          </ion-tab-bar>
      </ion-tabs>

  `,
  standalone: true,
  imports: [IonicModule],
})
export class TabsPage {

  constructor() {}
}
