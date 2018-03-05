import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';
import { ConfigServiceProvider } from '../config-service/config-service';
import { PlayerServiceProvider } from '../player-service/player-service';

@Injectable()
export class MapServiceProvider {

  origen: any;
  suscripcion: any;

  public coordenadas: any;

  public entorno: any;

  constructor(public http: HttpClient, public events: Events, public configService: ConfigServiceProvider, public playerService: PlayerServiceProvider) { }

  public establecerCoordenadas(coordenadas: any) {
    this.coordenadas = coordenadas;
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

  public actualizarEntorno() {
    if (this.coordenadas) {
      var _url = this.configService.config.juego.url_base + this.configService.config.juego.url_info_entorno + '/?lat=' + this.coordenadas.lat + '&lng=' + this.coordenadas.lng;
      return this.http.get(_url)
        .toPromise()
        .then(respuesta => {
          if (respuesta) {
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
    } else {
      return new Promise((response, fail) => {
        return response(false);
      });
    }
  }

}
