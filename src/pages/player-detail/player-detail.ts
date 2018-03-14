import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { PlayerModel } from '../../models/player.model';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { StatsServiceProvider } from '../../providers/stats-service/stats-service';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-player-detail',
  templateUrl: 'player-detail.html',
})
export class PlayerDetailPage {

  player: PlayerModel;
  stats: any;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public statsService: StatsServiceProvider,
    public playerService: PlayerServiceProvider,
    public configService: ConfigServiceProvider) { }

  ionViewDidLoad() {
    this.player = this.playerService.player;
    this.statsService.cargarEstadisticas().then(data => {
      this.stats = data;
    });
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

  abrirDetallesMod(mod: any) {
    let modal = this.modalCtrl.create('ModifierDetailPage', { modificador: mod }, {
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

  estadistica(clave: any) {
    var _stat = this.stats.find(function(x){
      return x.clave === clave;
    });
    if (_stat) {
      return _stat.valor;
    } else {
      return 0;
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
