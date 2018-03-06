import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { PlayerModel } from '../../models/player.model';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';

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
    public navParams: NavParams,
    public playerService: PlayerServiceProvider,
    public configService: ConfigServiceProvider) { }

  ionViewDidLoad() {
    this.player = this.playerService.player;
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
