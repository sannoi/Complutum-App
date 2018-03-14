import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class StatsServiceProvider {

  stats: any;

  constructor(public storage: Storage) {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    return this.storage.get("estadisticas").then(data => {
      if (data) {
        this.stats = data;
      } else {
        this.stats = new Array<any> ();
      }
      return this.stats;
    });
  }

  guardarEstadisticas() {
    this.storage.set("estadisticas", this.stats);
  }

  anadirEstadistica(clave: string, valor: any, tipo?: string) {
    if (!tipo) {
      tipo = 'number';
    }
    var _stat = this.stats.find(function(x){
      return x.clave === clave;
    });
    if (_stat) {
      // La estadistica existe
      var _idx = this.stats.indexOf(_stat);
      if (_idx > -1) {
        if (tipo == 'number') {
          this.stats[_idx].valor = this.stats[_idx].valor + valor;
        } else {
          this.stats[_idx].valor = valor;
        }
      }
    } else {
      // La estadistica no existe
      let _new_stat = {
        clave: clave,
        valor: valor,
        tipo: tipo
      };
      this.stats.push(_new_stat);
    }
    this.guardarEstadisticas();
  }

  recuperarEstadistica(clave: string) {
    var _stat = this.stats.find(function(x){
      return x.clave === clave;
    });
    return _stat;
  }

}
