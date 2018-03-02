import { Injectable } from '@angular/core';
import { ToastController, Toast } from 'ionic-angular';

@Injectable()
export class ToastServiceProvider {

  private toasts: Toast[] = [];

  constructor(public toastCtrl: ToastController) { }

  push(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      this.toasts.shift()
      if (this.toasts.length > 0) {
        this.show()
      }
    })

    this.toasts.push(toast)

    if (this.toasts.length === 1) {
      this.show()
    }
  }

  show() {
    this.toasts[0].present();
  }

}
