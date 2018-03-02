import { Injectable } from '@angular/core';
import * as AppConfig from '../../config/config';
import * as AppLuchadores from '../../config/luchadores';

@Injectable()
export class ConfigServiceProvider {

  public config: any;
  public luchadores: any;

  constructor() {
    this.config = AppConfig.config;
    this.luchadores = AppLuchadores.luchadores;
  }

  nivelXp(xp: number) {
    var acumulados = 0;
    for (var i = 0; i < this.config.jugador.niveles_xp.length; i++) {
      var nivel = this.config.jugador.niveles_xp[i];
      if (xp > acumulados && xp < (acumulados + nivel.xp_necesaria)) {
        console.log("nivel " + nivel.id + " " + xp);
        return nivel.id;
      }
      acumulados += nivel.xp_necesaria;
    }
    return false;
  }
}
