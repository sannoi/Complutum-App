import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { AvatarModel } from '../../models/avatar.model';

@IonicPage()
@Component({
  selector: 'page-fighter-detail',
  templateUrl: 'fighter-detail.html',
})
export class FighterDetailPage {

  luchador: AvatarModel;
  saludLuchador: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private configService: ConfigServiceProvider) {
      this.luchador = navParams.get('luchador');
      if (this.luchador) {
        this.saludLuchador = (this.luchador.salud_actual/this.luchador.propiedades_nivel.salud) * 100;
      }
      console.log(this.luchador);
  }

  saludText() {
    return this.luchador.salud_actual + '/' + this.luchador.propiedades_nivel.salud;
  }

}
