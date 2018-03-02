import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { BattleServiceProvider } from '../../providers/battle-service/battle-service';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';
import { AvatarModel } from '../../models/avatar.model';

@IonicPage()
@Component({
  selector: 'page-battle-default',
  templateUrl: 'battle-default.html',
})
export class BattleDefaultPage {

  batalla_iniciada: boolean = false;
  enfriamiento_debil: boolean = false;
  enfriamiento_fuerte: boolean = false;

  segundos_batalla: number = 60;
  segundos_debil: any;
  segundos_fuerte: any;
  countdown;
  countdown_debil;
  countdown_fuerte;

  luchador: AvatarModel;
  enemigo: AvatarModel;

  loadProgress: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public configService: ConfigServiceProvider,
    public battleService: BattleServiceProvider,
    public playerService: PlayerServiceProvider) {
    this.enemigo = navParams.get('enemigo');
    if (this.enemigo) {
      this.loadProgress = (this.enemigo.salud_actual / this.enemigo.propiedades_nivel().salud) * 100;
    }
    if (!this.luchador) {
      this.luchador = this.playerService.player.mascotas[0];
      this.segundos_debil = this.luchador.ataque.segundos_enfriamiento;
      this.segundos_fuerte = this.luchador.especial.segundos_enfriamiento;
    }
  }

  ionViewDidLoad() {
    console.log('Batalla contra un ' + this.enemigo.nombre + ' de nivel ' + this.enemigo.nivel);
  }

  comenzarBatalla() {
    this.batalla_iniciada = true;
    this.segundos_batalla = 60;
    this.countdown = Observable.timer(0, 1000)
      .take(this.segundos_batalla)
      .map(() => {
        --this.segundos_batalla;
        if (this.segundos_batalla <= 0) {
          this.batalla_iniciada = false;
        }
      });
  }

  ataqueDebil() {
    let resultado_ataque = this.battleService.calcularDano(this.luchador, this.enemigo, false);
    this.enemigo.salud_actual -= resultado_ataque;
    if (this.enemigo.salud_actual <= 0) {
      this.enemigo.salud_actual = 0;
      console.log(this.enemigo.nombre + " muerto");
    }
    this.loadProgress = (this.enemigo.salud_actual / this.enemigo.propiedades_nivel().salud) * 100;
    this.enfriamientoDebil();
  }

  ataqueFuerte() {
    let resultado_ataque = this.battleService.calcularDano(this.luchador, this.enemigo, true);
    this.enemigo.salud_actual -= resultado_ataque;
    if (this.enemigo.salud_actual <= 0) {
      this.enemigo.salud_actual = 0;
      console.log(this.enemigo.nombre + " muerto");
    }
    this.loadProgress = (this.enemigo.salud_actual / this.enemigo.propiedades_nivel().salud) * 100;
    this.enfriamientoFuerte();
  }

  enfriamientoDebil() {
    this.enfriamiento_debil = true;
    this.segundos_debil = this.luchador.ataque.segundos_enfriamiento;
    this.countdown_debil = Observable.timer(0, 1000)
      .take(this.segundos_debil)
      .map(() => {
        --this.segundos_debil;
        if (this.segundos_debil <= 0) {
          this.enfriamiento_debil = false;
        }
      });
  }

  enfriamientoFuerte() {
    this.enfriamiento_fuerte = true;
    this.segundos_fuerte = this.luchador.especial.segundos_enfriamiento;
    this.countdown_fuerte = Observable.timer(0, 1000)
      .take(this.segundos_fuerte)
      .map(() => {
        --this.segundos_fuerte;
        if (this.segundos_fuerte <= 0) {
          this.enfriamiento_fuerte = false;
        }
      });
  }

}
