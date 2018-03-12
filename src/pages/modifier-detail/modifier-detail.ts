import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-modifier-detail',
  templateUrl: 'modifier-detail.html',
})
export class ModifierDetailPage {

  modificador: any;

  tiempo_restante: number = 0;

  cuenta: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public configService: ConfigServiceProvider) {
    this.modificador = navParams.get("modificador");
  }

  ionViewDidLoad() { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  tiempoRestante() {
    var tempTime = moment.duration(this.modificador.tiempo_restante * 1000);
    var out = '';
    var h = tempTime.hours();
    if (h != 0) {
      out += h + ':';
    }
    var m = tempTime.minutes().toString();
    if (m.length == 1){
      m = '0' + m;
    }
    out += m + ':';
    var s = tempTime.seconds().toString();
    if (s.length == 1){
      s = '0' + s;
    }
    out += s;
    return out;
  }

}
