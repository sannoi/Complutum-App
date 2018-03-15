import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class SettingsServiceProvider {

  settings: any;

  constructor(public storage: Storage) {
    this.getSettings();
  }

  getSettings() {
    return this.storage.get("settings").then(data => {
      if (data) {
        this.settings = data;
        return data;
      } else {
        this.settings = {};
        return this.settings;
      }
    });
  }

  getOpcion(clave: any) {
    if (this.settings) {
      var _val = this.settings.find(function(x){
        return x.clave === clave;
      });
      return _val;
    } else {
      return { clave: clave, valor: 0 };
    }
  }

  setOpcion(clave: any, valor: any) {
    this.settings[clave] = valor;
    this.storage.set("settings", this.settings);
  }

}
