import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html',
})
export class ShopPage {

  player: any;

  items: Array<any> = new Array<any>(
    {
      icono: "assets/imgs/items/Item_0104.png",
      nombre: "Medicina Total",
      precio: 450,
      cantidad: 5
    },
    {
      icono: "assets/imgs/items/Item_0104.png",
      nombre: "Medicina Total",
      precio: 2500,
      cantidad: 25
    }
  );

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams) {
    this.player = navParams.get("player");
  }

  ionViewDidLoad() { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
