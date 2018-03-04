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

  constructor(public http: HttpClient, public events: Events, public configService: ConfigServiceProvider, public playerService: PlayerServiceProvider) { }

  public establecerCoordenadas(coordenadas: any) {
    this.coordenadas = coordenadas;
  }

  public iniciarObservableEnemigos() {
    let pos = this.coordenadas;
    this.origen = Observable.of(pos).flatMap(
      coordenadas => {
        let delay: number = 10000;

        if (delay <= 0) {
          delay = 1;
        }
        // Use the delay in a timer to
        // run the refresh at the proper time
        return Observable.interval(delay);
      });

    // Once the delay time from above is
    // reached, get a new JWT and schedule
    // additional refreshes
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

  encontrarNuevosEnemigos() {
    if (this.coordenadas) {
      var _url = this.configService.config.juego.url_base + this.configService.config.juego.url_realtime + '/?lat=' + this.coordenadas.lat + '&lng=' + this.coordenadas.lng + '&radio=' + this.configService.config.mapa.radio_vision;
      if (this.playerService.player && this.playerService.player.nivel) {
        _url += '&nivel=' + this.playerService.player.nivel;
      }
      return this.http.get(_url)
        .toPromise()
        .then(respuesta => {
          //let res_json = respuesta.json();
          if (respuesta.features && respuesta.features.length > 0) {
            return respuesta.features;
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
