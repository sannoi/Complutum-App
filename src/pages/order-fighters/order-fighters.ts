import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-order-fighters',
  templateUrl: 'order-fighters.html',
})
export class OrderFightersPage {

  constructor(public viewCtrl: ViewController) {
  }

  close(orden: any, dir_orden: any) {
    let data = {orden: orden, dir_orden: dir_orden};
    this.viewCtrl.dismiss(data);
  }

}
