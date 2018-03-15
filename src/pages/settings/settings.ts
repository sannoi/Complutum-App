import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SettingsServiceProvider } from '../../providers/settings-service/settings-service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  settings: {
    interfaz: {
      velocimetro: boolean,
      entorno: boolean
    }
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public settingsService: SettingsServiceProvider) {
    this.settingsService.getSettings().then(val => {
      if (!val || !val.interfaz) {
        this.settings = {
          interfaz: {
            velocimetro: false,
            entorno: false
          }
        };
        this.settingsService.setOpcion("interfaz", this.settings.interfaz);
      } else {
        this.settings = val;
      }
    });
  }

  toggleInterfaz() {
    this.settingsService.setOpcion("interfaz", this.settings.interfaz);
  }

  ionViewDidLoad() {
  }

}
