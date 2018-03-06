import { Injectable } from '@angular/core';
import * as AppConfig from '../../config/config';
import * as AppLuchadores from '../../config/luchadores';
import * as AppAtaques from '../../config/ataques';
import * as AppTipos from '../../config/tipos';
import * as AppItems from '../../config/items';

@Injectable()
export class ConfigServiceProvider {

  public config: any;
  public luchadores: any;
  public ataques: any;
  public tipos: any;
  public items: any;

  constructor() {
    this.config = AppConfig.config;
    this.luchadores = AppLuchadores.luchadores;
    this.ataques = AppAtaques.ataques;
    this.tipos = AppTipos.tipos;
    this.items = AppItems.items;
  }

  nivelXp(xp: number) {
    var acumulados = 0;
    for (var i = 0; i < this.config.jugador.niveles_xp.length; i++) {
      var nivel = this.config.jugador.niveles_xp[i];
      if (xp >= acumulados && xp < (acumulados + nivel.xp_necesaria)) {
        return nivel.id;
      }
      acumulados += nivel.xp_necesaria;
    }
    return 1;
  }

  encontrarLuchador(id: any) {
    return this.luchadores.find(x => x.id === id);
  }

  encontrarTipo(id: any) {
    return this.tipos.find(x => x.id === id);
  }

  encontrarItem(id: any) {
    return this.items.find(x => x.id === id);
  }

  encontrarAtaque(id: any, tipo_ataque: any) {
    if (tipo_ataque === 'debil') {
      return this.ataques.debiles.find(x => x.id === id);
    } else if (tipo_ataque === 'fuerte') {
      return this.ataques.fuertes.find(x => x.id === id);
    } else {
      return null;
    }
  }
}
