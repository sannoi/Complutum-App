import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  settings: {
    interfaz: {
      velocimetro: boolean
    }
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public configService: ConfigServiceProvider) {
    this.settings = {
      interfaz: {
        velocimetro: false
      }
    };
    /*this.configService.getSettings().then(val => {
      if (!val) {
        this.settings = {
          interfaz: {
            velocimetro: false
          }
        };
      } else {
        this.settings = val;
      }
    });*/
  }

  toggleVelocidad() {
    console.log(this.settings);
    //this.configService.setOpcion("interfaz.velocimetro", this.velocimetro);
  }

  ionViewDidLoad() {
  }

}
