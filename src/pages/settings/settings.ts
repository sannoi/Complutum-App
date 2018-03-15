import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SettingsServiceProvider } from '../../providers/settings-service/settings-service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  settings: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public settingsService: SettingsServiceProvider) {
    this.settingsService.getSettings().then(val => {
        this.settings = val;
    });
  }

  changeInterfaz() {
    this.settingsService.setOpcion("interfaz", this.settings.interfaz);
  }

  changeMapa() {
    this.settingsService.setOpcion("mapa", this.settings.mapa);
  }

  ionViewDidLoad() {
  }

}
