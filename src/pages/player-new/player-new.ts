import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';

@IonicPage()
@Component({
  selector: 'page-player-new',
  templateUrl: 'player-new.html',
})
export class PlayerNewPage {
  private playerData: FormGroup;
  private avatares: any;
  private bandos: any;

  private avatar_seleccionado: any;
  private bando_seleecionado: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public viewCtrl: ViewController,
    public alertService: AlertServiceProvider,
    public configService: ConfigServiceProvider) {
    this.avatares = configService.config.jugador.avatares;
    this.bandos = configService.equipos;
    this.playerData = this.formBuilder.group({
      nombre: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(12)])],
    });
  }

  cambiarAvatar(avatar: any) {
    this.avatar_seleccionado = avatar;
    return;
  }

  claseAvatar(avatar: any) {
    if (avatar && this.avatar_seleccionado && avatar['icono'] && avatar['icono'] == this.avatar_seleccionado['icono']) {
      return 'avatar-active';
    } else {
      return 'avatar-inactive';
    }
  }

  cambiarBando(bando: any) {
    this.bando_seleecionado = bando;
    return;
  }

  claseBando(bando: any) {
    if (bando && this.bando_seleecionado && bando['id'] && bando['id'] == this.bando_seleecionado['id']) {
      return 'bando-active';
    } else {
      return 'bando-inactive';
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  savePlayer() {
    if (!this.avatar_seleccionado) {
      this.alertService.push('Avatar no seleccionado', 'Debes elegir un avatar para crear una cuenta.', null, ['Vale'], false);
    } else if (!this.bando_seleecionado) {
      this.alertService.push('Bando no seleccionado', 'Debes elegir un bando para crear una cuenta.', null, ['Vale'], false);
    } else {
      let _data_player = this.playerData.value;
      _data_player['icono'] = this.avatar_seleccionado.icono;
      _data_player['equipo'] = this.bando_seleecionado;
      let data = { player: _data_player };
      this.viewCtrl.dismiss(data);
    }
  }

}
