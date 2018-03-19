import { Injectable } from '@angular/core';
import * as AppConfig from '../../config/config';
import * as AppLuchadores from '../../config/luchadores';
import * as AppAtaques from '../../config/ataques';
import * as AppTipos from '../../config/tipos';
import * as AppItems from '../../config/items';
import * as AppShop from '../../config/tienda';
import * as AppTorneos from '../../config/torneos';
import * as AppEquipos from '../../config/equipos';

@Injectable()
export class ConfigServiceProvider {

  public config: any;
  public luchadores: any;
  public equipos: any;
  public ataques: any;
  public tipos: any;
  public items: any;
  public tienda: any;
  public torneos: any;

  constructor() {
    this.config = AppConfig.config;
    this.luchadores = AppLuchadores.luchadores;
    this.equipos = AppEquipos.equipos;
    this.ataques = AppAtaques.ataques;
    this.tipos = AppTipos.tipos;
    this.items = AppItems.items;
    this.tienda = AppShop.tienda;
    this.torneos = AppTorneos.torneos;
  }

  nivelXp(xp: number) {
    var acumulados = 0;
    var _last_nivel = 1;
    for (var i = 0; i < this.config.jugador.niveles_xp.length; i++) {
      var nivel = this.config.jugador.niveles_xp[i];
      if (xp >= acumulados && xp < (acumulados + nivel.xp_necesaria)) {
        return nivel.id;
      }
      acumulados += nivel.xp_necesaria;
      _last_nivel = nivel.id;
    }
    return _last_nivel;
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

  ConvertHexToRGBA(hex: string, opacity?: number): string {
    opacity = opacity || 1;

    opacity < 0 ? opacity = 0 : opacity = opacity;
    opacity > 1 ? opacity = 1 : opacity = opacity;

    hex = hex.replace('#', '');

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';

  }
}
