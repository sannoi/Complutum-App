import { Injectable } from '@angular/core';
import { AlertController, Alert } from 'ionic-angular';

@Injectable()
export class AlertServiceProvider {

  private alerts: Alert[] = [];

  constructor(public alertCtrl: AlertController) { }

  push(title, subtitle, message, buttons, backdropDismiss?) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      message: message,
      enableBackdropDismiss: backdropDismiss,
      buttons: buttons
    });

    alert.onDidDismiss(() => {
      this.alerts.shift()
      if (this.alerts.length > 0) {
        this.show()
      }
    })

    this.alerts.push(alert)

    if (this.alerts.length === 1) {
      this.show()
    }
  }

  show() {
    this.alerts[0].present();
  }

}
