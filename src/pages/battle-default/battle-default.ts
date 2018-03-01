import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { BattleServiceProvider } from '../../providers/battle-service/battle-service';
import { AvatarModel } from '../../models/avatar.model';

@IonicPage()
@Component({
  selector: 'page-battle-default',
  templateUrl: 'battle-default.html',
})
export class BattleDefaultPage {

  luchador: AvatarModel;
  enemigo: AvatarModel;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public configService: ConfigServiceProvider,
    public battleService: BattleServiceProvider) {
      this.enemigo = navParams.get('enemigo');
  }

  ionViewDidLoad() {
    console.log('Batalla contra un ' + this.enemigo.nombre + ' de nivel ' + this.enemigo.nivel);
  }

}
