import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-trap-detail',
  templateUrl: 'trap-detail.html',
})
export class TrapDetailPage {

  trampa: any;

  tiempo_restante: number = 0;

  cuenta: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public configService: ConfigServiceProvider) {
    this.trampa = navParams.get("trampa");
    console.log(this.trampa);
  }

  ionViewDidLoad() { }

  imagenMapa() {
    return 'https://api.mapbox.com/styles/v1/' + this.configService.config.mapa.mapbox_estilo + '/static/'+ this.trampa.coordenadas.lng +','+ this.trampa.coordenadas.lat +',14,0.00,0.00/300x200@2x?access_token=' + this.configService.config.mapa.mapbox_access_token;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  tiempoRestante() {
    var tempTime = moment.duration(this.trampa.tiempo_restante * 1000);
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
