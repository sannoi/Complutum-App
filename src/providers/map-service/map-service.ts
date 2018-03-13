import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';
import { ConfigServiceProvider } from '../config-service/config-service';
import { StatsServiceProvider } from '../stats-service/stats-service';
import { PlayerServiceProvider } from '../player-service/player-service';

@Injectable()
export class MapServiceProvider {

  origen: any;
  suscripcion: any;

  public coordenadas: any;

  origen_entorno: any;
  suscripcion_entorno: any;

  public entorno: any;

  private _earthRadiusInMeters: number = 6378137;
  private _earthRadiusInKilometers: number = 6371.01;

  constructor(
    public http: HttpClient,
    public storage: Storage,
    public events: Events,
    public statsService: StatsServiceProvider,
    public configService: ConfigServiceProvider,
    public playerService: PlayerServiceProvider) { }

  public establecerCoordenadas(coordenadas: any) {
    this.coordenadas = coordenadas;
    this.storage.get("ultima_posicion").then(pos => {
      if (pos && pos.lat && pos.lng) {
        var _distancia = this.getDistanciaEnMetros(pos, this.coordenadas);
        this.statsService.anadirEstadistica('distancia_recorrida', _distancia, 'number');
      }
      this.storage.set('ultima_posicion', this.coordenadas);
    });

  }

  public iniciarObservableEnemigos() {
    // Busqueda inicial
    this.encontrarNuevosEnemigos().then(resultado => {
      this.events.publish('mapa:nuevos_enemigos', resultado);
    });

    this.origen = Observable.interval(this.configService.config.mapa.tiempo_aparicion_enemigos * 1000);
    this.suscripcion = this.origen.subscribe(() => {
      this.encontrarNuevosEnemigos().then(resultado => {
        this.events.publish('mapa:nuevos_enemigos', resultado);
      });
    });
  }

  public pararObservableEnemigos() {
    if (this.suscripcion) {
      this.suscripcion.unsubscribe();
    }
  }

  public iniciarObservableEntorno() {
    // Busqueda inicial
    this.actualizarEntorno().then(resultado => {
      this.entorno = resultado;
    });

    this.origen_entorno = Observable.interval(this.configService.config.mapa.tiempo_refresco_entorno * 1000);
    this.suscripcion_entorno = this.origen_entorno.subscribe(() => {
      this.actualizarEntorno().then(resultado => {
        this.entorno = resultado;
      });
    });
  }

  public pararObservableEntorno() {
    if (this.suscripcion_entorno) {
      this.suscripcion_entorno.unsubscribe();
    }
  }

  public actualizarEntorno() {
    if (this.coordenadas) {
      var _url = this.configService.config.juego.url_base + this.configService.config.juego.url_info_entorno + '/?lat=' + this.coordenadas.lat + '&lng=' + this.coordenadas.lng + '&radio=' + this.configService.config.mapa.radio_interaccion;
      return this.http.get(_url)
        .toPromise()
        .then(respuesta => {
          if (respuesta) {
            console.log(respuesta);
            return respuesta;
          } else {
            return false;
          }
        });
    } else {
      return new Promise((response, fail) => {
        return response(false);
      });
    }
  }

  encontrarNuevosEnemigos() {
    if (this.coordenadas) {
      if (this.configService.config.juego.online) {
        return this.encontrarEnemigosOnline();
      } else {
        return this.encontrarEnemigosOffline();
      }
    } else {
      return new Promise((response, fail) => {
        return response(false);
      });
    }
  }

  encontrarEnemigosOffline() {
    if (this.entorno) {
      var este = this;
      var avatares = this.configService.luchadores.filter(function(x) {
        var tipo_obj = este.configService.encontrarTipo(x.tipo);
        var some_terreno = tipo_obj.terreno.some(function(y) {
          return este.entorno.terreno.indexOf(y) > -1;
        });
        var some_meteo = tipo_obj.meteo.some(function(y) {
          return este.entorno.meteo_id === y;
        });
        return (!tipo_obj.terreno || tipo_obj.terreno.length == 0 || some_terreno) && (!tipo_obj.meteo || tipo_obj.meteo.length == 0 || some_meteo);
      });

      if (avatares && avatares.length > 0) {
        var rareza_minima = Math.random() * 100;
        var avatares_filtrados = avatares.filter(function(x) {
          return x.rareza >= rareza_minima;
        });
        if (avatares_filtrados && avatares_filtrados.length > 0) {
          var avatar = avatares_filtrados[Math.floor(Math.random() * avatares_filtrados.length)];
          var _punto = this.generarPuntoAleatorio([this.coordenadas.lat, this.coordenadas.lng], this.configService.config.mapa.radio_interaccion);
          let feature = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [_punto[1], _punto[0]]
            },
            properties: {
              id: avatar.id,
              tipo: 'Bot'
            },
            id: this.generarId()
          };
          let features = [feature];
          return new Promise((response, fail) => {
            return response(features);
          });
        }
      }
    } else {
      console.log("entorno no cargado");
    }

    return new Promise((response, fail) => {
      return response(false);
    });
  }

  encontrarEnemigosOnline() {
    var _url = this.configService.config.juego.url_base + this.configService.config.juego.url_realtime + '/?lat=' + this.coordenadas.lat + '&lng=' + this.coordenadas.lng + '&radio=' + this.configService.config.mapa.radio_interaccion;
    if (this.playerService.player && this.playerService.player.nivel) {
      _url += '&nivel=' + this.playerService.player.nivel;
    }
    return this.http.get(_url)
      .toPromise()
      .then(respuesta => {
        if (respuesta && respuesta['features'] && respuesta['features'].length > 0) {
          return respuesta['features'];
        } else {
          return false;
        }
      });
  }

  generarId() {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 8)).toUpperCase();
  }

  generarPunto(center: any, distance: any) {
    let centre_rads = new Array<any>(this._toRadians(center[0]), this._toRadians(center[1]));
    var lat_rads = (Math.PI / 2) - distance / this._earthRadiusInKilometers;
    var lng_rads = Math.random() * 2 * Math.PI;
    var x1 = Math.cos(lat_rads) * Math.sin(lng_rads);
    var y1 = Math.cos(lat_rads) * Math.cos(lng_rads);
    var z1 = Math.sin(lat_rads);
    var rot = (Math.PI / 2) - centre_rads[0];
    var x2 = x1;
    var y2 = y1 * Math.cos(rot) + z1 * Math.sin(rot);
    var z2 = (y1 * -1) * Math.sin(rot) + z1 * Math.cos(rot);
    var rot2 = centre_rads[1];
    var x3 = x2 * Math.cos(rot2) + y2 * Math.sin(rot2);
    var y3 = (x2 * -1) * Math.sin(rot2) + y2 * Math.cos(rot2);
    var z3 = z2;

    lng_rads = Math.atan2(x3, y3);
    lat_rads = Math.asin(z3);

    let return_coords = new Array<any>(lat_rads * 180 / Math.PI, lng_rads * 180 / Math.PI);

    return return_coords;
  }

  generarDistanciaAleatoria(radio: any) {
    return Math.random() * radio;
  }

  generarPuntoAleatorio(centro: any, radio: any) {
    var distancia = this.generarDistanciaAleatoria(radio);

    return this.generarPunto(centro, distancia);
  }

  private _getDistance(coord1: any, coord2: any): number {
        let φ1 = this._toRadians(coord1.lat);
        let φ2 = this._toRadians(coord2.lat);
        let Δφ = this._toRadians(coord2.lat - coord1.lat);
        let Δλ = this._toRadians(coord2.lng - coord1.lng);
        // a = sin²(Δφ / 2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ / 2)
        let a = Math.pow(Math.sin(Δφ / 2), 2) +
                Math.cos(φ1) *
                Math.cos(φ2) *
                Math.pow(Math.sin(Δλ / 2), 2);
        // c = 2 ⋅ atan2(√a, √(1−a))
        return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    private _toRadians(value: number): number {
        return value * Math.PI / 180;
    }

    getDistanciaEnMetros(coord1: any, coord2: any): number {
        let c = this._getDistance(coord1, coord2);
        // d = R ⋅ c
        return this._earthRadiusInMeters * c;
    }

    getDistanciaEnKilometros(coord1: any, coord2: any): number {
        let c = this._getDistance(coord1, coord2);
        // d = R ⋅ c
        return this._earthRadiusInKilometers * c;
    }

}
