import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-place-detail',
  templateUrl: 'place-detail.html',
})
export class PlaceDetailPage {

  lugar: any;
  coordenadas: any;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams) {
    this.lugar = navParams.get('lugar');
    this.coordenadas = navParams.get('coordenadas');
  }

  ionViewDidLoad() {
    console.log(this.lugar);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
