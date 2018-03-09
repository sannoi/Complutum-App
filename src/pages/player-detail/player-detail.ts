import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { PlayerModel } from '../../models/player.model';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-player-detail',
  templateUrl: 'player-detail.html',
})
export class PlayerDetailPage {

  player: PlayerModel;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public playerService: PlayerServiceProvider,
    public configService: ConfigServiceProvider) { }

  ionViewDidLoad() {
    this.player = this.playerService.player;
  }

  tiempoRestante(tiempo: any) {
    var tempTime = moment.duration(tiempo * 1000);
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

  abrirDetallesTrampa(trampa: any) {
    let modal = this.modalCtrl.create('TrapDetailPage', { trampa: trampa }, {
      enableBackdropDismiss: false
    });
    modal.present();
  }

  xpPlayer() {
    var _acumulados = this.configService.xpAcumuladosNivel(this.player.nivel - 1);
    var _necesarios = this.configService.xpRelativosNivel(this.player.nivel);
    return ((this.player.xp - _acumulados) / _necesarios) * 100;
  }

  xpNivelText() {
    var _acumulados = this.configService.xpAcumuladosNivel(this.player.nivel - 1);
    var _necesarios = this.configService.xpRelativosNivel(this.player.nivel);

    return (this.player.xp - _acumulados).toString() + '/' + _necesarios.toString();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
