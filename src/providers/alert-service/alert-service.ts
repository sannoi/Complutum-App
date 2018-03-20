import { Injectable } from '@angular/core';
import { AlertController, Alert } from 'ionic-angular';

@Injectable()
export class AlertServiceProvider {

  private alerts: Alert[] = [];

  constructor(public alertCtrl: AlertController) { }

  push(title, subtitle, message, buttons, backdropDismiss?, inputs?) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      message: message,
      enableBackdropDismiss: backdropDismiss,
      inputs: inputs,
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

  push_obj(obj) {
    let alert = this.alertCtrl.create({
      title: obj['title'],
      subTitle: obj['subTitle'],
      message: obj['message'],
      enableBackdropDismiss: obj['backdropDismiss'],
      inputs: obj['inputs'],
      buttons: obj['buttons']
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
