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
    },
    mapa: {
      estilo: string
    }
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public settingsService: SettingsServiceProvider) {
    this.settingsService.getSettings().then(val => {
      if (!val || !val.interfaz || !val.mapa) {
        this.settings = {
          interfaz: {
            velocimetro: false,
            entorno: false
          },
          mapa: {
            estilo: 'mapbox/streets-v10'
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

  changeMapa() {
    this.settingsService.setOpcion("mapa", this.settings.mapa);
  }

  ionViewDidLoad() {
  }

}
