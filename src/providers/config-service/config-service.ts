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

  xpAcumuladosNivel(nivel: number) {
    var acumulados = 0;
    for (var i = 0; i < nivel; i++) {
      acumulados += this.config.jugador.niveles_xp[i].xp_necesaria;
    }
    return acumulados;
  }

  xpRelativosNivel(nivel: number) {
    return this.config.jugador.niveles_xp[nivel - 1].xp_necesaria;
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
      var ataque = this.ataques.debiles.find(function(x) {
         return x.id === id;
       });
       var id_tipo = ataque.tipo;
       if (id_tipo['id']) {
         id_tipo = id_tipo['id'];
       }
      var tipo = this.encontrarTipo(id_tipo);
      ataque.tipo = tipo;

      return ataque;
    } else if (tipo_ataque === 'fuerte') {
      var especial = this.ataques.fuertes.find(function(x) {
         return x.id === id;
       });
       var id_tipo_especial = especial.tipo;
       if (id_tipo_especial['id']) {
         id_tipo_especial = id_tipo_especial['id'];
       }
       var tipo_especial = this.encontrarTipo(id_tipo_especial);
       especial.tipo = tipo_especial;
      return especial;
    } else {
      return null;
    }
  }
}
