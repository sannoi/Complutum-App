import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { BattleServiceProvider } from '../../providers/battle-service/battle-service';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';
import { ToastServiceProvider } from '../../providers/toast-service/toast-service';
import { AvatarModel } from '../../models/avatar.model';

@IonicPage()
@Component({
  selector: 'page-battle-default',
  templateUrl: 'battle-default.html',
})
export class BattleDefaultPage {

  batalla_iniciada: boolean = false;
  batalla_ganada: boolean = false;
  batalla_perdida: boolean = false;
  batalla_tiempo_agotado: boolean = false;
  enfriamiento_debil: boolean = false;
  enfriamiento_fuerte: boolean = false;
  especial_cargado: boolean = false;

  segundos_batalla: number = 60;
  segundos_debil: any;
  segundos_fuerte: any;
  countdown;
  countdown_debil;
  countdown_fuerte;

  enfriamiento_debil_enemigo: boolean = false;
  enfriamiento_fuerte_enemigo: boolean = false;
  especial_cargado_enemigo: boolean = false;

  segundos_debil_enemigo: any;
  segundos_fuerte_enemigo: any;
  countdown_debil_enemigo;
  countdown_fuerte_enemigo;
  timer_rutina_enemigo;

  luchador: AvatarModel;
  enemigo: AvatarModel;

  luchador_idx: number = 0;

  saludEnemigo: number = 0;
  energiaEnemigo: number = 0;
  saludLuchador: number = 0;
  energiaLuchador: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastService: ToastServiceProvider,
    public configService: ConfigServiceProvider,
    public battleService: BattleServiceProvider,
    public playerService: PlayerServiceProvider) {
    this.enemigo = navParams.get('enemigo');
    this.segundos_batalla = this.configService.config.batalla.tiempo_batalla;
    if (this.enemigo) {
      this.segundos_debil_enemigo = this.enemigo.ataque.segundos_enfriamiento;
      this.segundos_fuerte_enemigo = this.enemigo.especial.segundos_enfriamiento;
      this.saludEnemigo = (this.enemigo.salud_actual / this.enemigo.propiedades_nivel().salud) * 100;
      this.energiaEnemigo = (this.enemigo.energia / this.configService.config.avatares.energia_maxima) * 100;
    }
    if (!this.luchador) {
      //Seleccion aleatoria de avatar
      this.luchador_idx = Math.floor(Math.random() * this.playerService.player.mascotas.length);
      this.luchador = this.playerService.player.mascotas[this.luchador_idx];
      this.segundos_debil = this.luchador.ataque.segundos_enfriamiento;
      this.segundos_fuerte = this.luchador.especial.segundos_enfriamiento;
      this.saludLuchador = (this.luchador.salud_actual / this.luchador.propiedades_nivel().salud) * 100;
      this.energiaLuchador = (this.luchador.energia / this.configService.config.avatares.energia_maxima) * 100;
    }
  }

  ionViewDidLoad() {
    console.log('Batalla contra un ' + this.enemigo.nombre + ' de nivel ' + this.enemigo.nivel);

    if (this.luchador && this.enemigo) {
      this.alertaInicial();
    }
  }

  alertaInicial() {
    let alert = this.alertCtrl.create({
      title: 'Pelear contra ' + this.enemigo.nombre,
      message: 'Vas a luchar contra un ' + this.enemigo.nombre + ' de nivel ' + this.enemigo.nivel + ' con tu ' + this.luchador.nombre + ' de nivel ' + this.luchador.nivel + '. ¿Qué quieres hacer?',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Huir',
          role: 'cancel',
          handler: () => {
            this.huir();
          }
        },
        {
          text: 'Cambiar luchador',
          handler: () => {
            this.cambiarLuchador();
          }
        },
        {
          text: '¡Pelear!',
          handler: () => {
            this.comenzarBatalla();
          }
        }
      ]
    });
    alert.present();
  }

  cambiarLuchador() {
    let modal = this.modalCtrl.create('FightersSelectPage', {}, {
      enableBackdropDismiss: false
    });
    modal.present();

    modal.onDidDismiss(data => {
      if (data && data.avatar && data.avatar_idx >= 0) {
        this.luchador_idx = data.avatar_idx;
        this.luchador = this.playerService.player.mascotas[this.luchador_idx];
        this.segundos_debil = this.luchador.ataque.segundos_enfriamiento;
        this.segundos_fuerte = this.luchador.especial.segundos_enfriamiento;
        this.saludLuchador = (this.luchador.salud_actual / this.luchador.propiedades_nivel().salud) * 100;
        this.energiaLuchador = (this.luchador.energia / this.configService.config.avatares.energia_maxima) * 100;
        this.alertaInicial();
      } else {
        this.alertaInicial();
      }
    });
  }

  comenzarBatalla() {
    this.batalla_iniciada = true;
    this.rutinaEnemigoBatalla();
    this.segundos_batalla = this.configService.config.batalla.tiempo_batalla;
    this.countdown = Observable.timer(0, 1000)
      .take(this.segundos_batalla)
      .map(() => {
        if (this.batalla_iniciada && !this.batalla_ganada && !this.batalla_perdida) {
          --this.segundos_batalla;
          if (this.segundos_batalla <= 0) {
            this.batallaTiempoAgotado();
          }
        }
      });
  }

  ataqueDebil() {
    let resultado_ataque = this.battleService.calcularDano(this.luchador, this.enemigo, false);
    this.enemigo.salud_actual -= resultado_ataque;
    this.luchador.energia += this.luchador.ataque.incremento_energia;
    if (this.luchador.energia > this.configService.config.avatares.energia_maxima) {
      this.luchador.energia = this.configService.config.avatares.energia_maxima;
    }
    this.energiaLuchador = (this.luchador.energia / this.configService.config.avatares.energia_maxima) * 100;
    if (this.luchador.energia < this.luchador.especial.gasto_energia) {
      this.especial_cargado = false;
    } else {
      this.especial_cargado = true;
    }
    this.playerService.player.mascotas[this.luchador_idx] = this.luchador;
    this.playerService.savePlayer();
    if (this.enemigo.salud_actual <= 0) {
      this.enemigo.salud_actual = 0;
      this.batallaGanada();
      console.log(this.enemigo.nombre + " muerto");
    }
    this.saludEnemigo = (this.enemigo.salud_actual / this.enemigo.propiedades_nivel().salud) * 100;
    this.enfriamientoDebil();
  }

  ataqueFuerte() {
    let resultado_ataque = this.battleService.calcularDano(this.luchador, this.enemigo, true);
    this.enemigo.salud_actual -= resultado_ataque;
    this.luchador.energia -= this.luchador.especial.gasto_energia;
    if (this.luchador.energia < 0) {
      this.luchador.energia = 0;
    }
    this.energiaLuchador = (this.luchador.energia / this.configService.config.avatares.energia_maxima) * 100;
    if (this.luchador.energia < this.luchador.especial.gasto_energia) {
      this.especial_cargado = false;
    } else {
      this.especial_cargado = true;
    }
    this.toastService.push(this.luchador.nombre + " ha usado " + this.luchador.especial.nombre);
    this.playerService.player.mascotas[this.luchador_idx] = this.luchador;
    this.playerService.savePlayer();
    if (this.enemigo.salud_actual <= 0) {
      this.enemigo.salud_actual = 0;
      this.batallaGanada();
      console.log(this.enemigo.nombre + " muerto");
    }
    this.saludEnemigo = (this.enemigo.salud_actual / this.enemigo.propiedades_nivel().salud) * 100;
    this.enfriamientoFuerte();
  }

  enfriamientoDebil() {
    this.enfriamiento_debil = true;
    this.segundos_debil = parseInt((this.luchador.ataque.segundos_enfriamiento * 100).toString());
    this.countdown_debil = Observable.timer(0, 10)
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
    this.segundos_fuerte = parseInt((this.luchador.especial.segundos_enfriamiento * 100).toString());
    this.countdown_fuerte = Observable.timer(0, 10)
      .take(this.segundos_fuerte)
      .map(() => {
        --this.segundos_fuerte;
        if (this.segundos_fuerte <= 0) {
          this.enfriamiento_fuerte = false;
        }
      });
  }

  /* Acciones de enemigo */

  rutinaEnemigoBatalla() {
    console.log("rutina de enemigo");
    this.timer_rutina_enemigo = Observable.timer(1000, 10)
      .take(this.segundos_batalla * 100)
      .subscribe(() => {
        if (this.batalla_iniciada && !this.batalla_ganada && !this.batalla_perdida && !this.batalla_tiempo_agotado) {
          if (!this.enfriamiento_fuerte_enemigo && this.especial_cargado_enemigo) {
            this.ataqueFuerteEnemigo();
          } else if (!this.enfriamiento_debil_enemigo) {
            this.ataqueDebilEnemigo();
          }
        }
      });
  }

  ataqueDebilEnemigo() {
    let resultado_ataque = this.battleService.calcularDano(this.enemigo, this.luchador, false);
    this.luchador.salud_actual -= resultado_ataque;
    this.enemigo.energia += this.enemigo.ataque.incremento_energia;
    if (this.enemigo.energia > this.configService.config.avatares.energia_maxima) {
      this.enemigo.energia = this.configService.config.avatares.energia_maxima;
    }
    console.log("Ataque debil enemigo: Daño -> " + resultado_ataque + " | Ataque -> " + this.enemigo.ataque.nombre + " | Energia total -> " + this.enemigo.energia);
    this.energiaEnemigo = (this.enemigo.energia / this.configService.config.avatares.energia_maxima) * 100;
    if (this.enemigo.energia < this.enemigo.especial.gasto_energia) {
      this.especial_cargado_enemigo = false;
    } else {
      this.especial_cargado_enemigo = true;
    }
    this.playerService.player.mascotas[this.luchador_idx] = this.luchador;
    this.playerService.savePlayer();
    if (this.luchador.salud_actual <= 0) {
      this.luchador.salud_actual = 0;
      this.batallaPerdida();
      console.log(this.luchador.nombre + " ha muerto");
    }
    this.saludLuchador = (this.luchador.salud_actual / this.luchador.propiedades_nivel().salud) * 100;
    this.enfriamientoDebilEnemigo();
  }

  ataqueFuerteEnemigo() {
    let resultado_ataque = this.battleService.calcularDano(this.enemigo, this.luchador, true);
    this.luchador.salud_actual -= resultado_ataque;
    this.enemigo.energia -= this.enemigo.especial.gasto_energia;
    if (this.enemigo.energia < 0) {
      this.enemigo.energia = 0;
    }
    console.log("Ataque fuerte enemigo: Daño -> " + resultado_ataque + " | Ataque -> " + this.enemigo.especial.nombre + " | Energia total -> " + this.enemigo.energia);
    this.energiaEnemigo = (this.enemigo.energia / this.configService.config.avatares.energia_maxima) * 100;
    if (this.enemigo.energia < this.enemigo.especial.gasto_energia) {
      this.especial_cargado_enemigo = false;
    } else {
      this.especial_cargado_enemigo = true;
    }
    this.toastService.push(this.enemigo.nombre + " ha usado " + this.enemigo.especial.nombre);

    if (this.enemigo.salud_actual <= 0) {
      this.enemigo.salud_actual = 0;
      this.playerService.player.mascotas[this.luchador_idx] = this.luchador;
      this.playerService.savePlayer();
      this.batallaPerdida();
      console.log(this.luchador.nombre + " ha muerto");
    }
    this.playerService.player.mascotas[this.luchador_idx] = this.luchador;
    this.playerService.savePlayer();
    this.saludLuchador = (this.luchador.salud_actual / this.luchador.propiedades_nivel().salud) * 100;
    this.enfriamientoFuerteEnemigo();
  }

  enfriamientoDebilEnemigo() {
    this.enfriamiento_debil_enemigo = true;
    this.segundos_debil_enemigo = parseInt((this.enemigo.ataque.segundos_enfriamiento * 100).toString());

    this.countdown_debil_enemigo = Observable.timer(0, 10)
      .take(this.segundos_debil_enemigo)
      .subscribe(() => {
        if (this.enfriamiento_debil_enemigo) {
          --this.segundos_debil_enemigo;
          if (this.segundos_debil_enemigo <= 0) {
            this.enfriamiento_debil_enemigo = false;
            this.countdown_debil_enemigo.unsubscribe();
          }
        }
      });
  }

  enfriamientoFuerteEnemigo() {
    this.enfriamiento_fuerte_enemigo = true;
    this.segundos_fuerte_enemigo = parseInt((this.enemigo.especial.segundos_enfriamiento * 100).toString());
    this.countdown_fuerte_enemigo = Observable.timer(0, 10)
      .take(this.segundos_fuerte_enemigo)
      .subscribe(() => {
        if (this.enfriamiento_fuerte_enemigo) {
          --this.segundos_fuerte_enemigo;
          if (this.segundos_fuerte_enemigo <= 0) {
            this.enfriamiento_fuerte_enemigo = false;
            this.countdown_fuerte_enemigo.unsubscribe();
          }
        }
      });
  }

  /* Eventos de batalla */

  batallaGanada() {
    this.batalla_iniciada = false;
    this.batalla_ganada = true;

    let alert = this.alertCtrl.create({
      title: '¡Victoria!',
      subTitle: '¡Enhorabuena! Has derrotado a ' + this.enemigo.nombre + '!',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.addXp(this.configService.config.batalla.xp_avatar_gana, this.configService.config.batalla.xp_player_gana);
            this.viewCtrl.dismiss({ resultado: 'ganador', enemigo: this.enemigo, luchador: this.luchador });
          }
        }
      ]
    });
    alert.present();
  }

  batallaPerdida() {
    this.batalla_perdida = true;
    this.batalla_iniciada = false;

    let alert = this.alertCtrl.create({
      title: '¡Has perdido!',
      subTitle: 'Tu ' + this.luchador.nombre + ' se ha rendido y has perdido la pelea.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Otra vez será',
          handler: () => {
            this.addXp(this.configService.config.batalla.xp_avatar_pierde, this.configService.config.batalla.xp_player_pierde);
            this.viewCtrl.dismiss({ resultado: 'perdedor', enemigo: this.enemigo, luchador: this.luchador });
          }
        }
      ]
    });
    alert.present();
  }

  batallaTiempoAgotado() {
    this.batalla_tiempo_agotado = true;
    this.batalla_iniciada = false;

    let alert = this.alertCtrl.create({
      title: 'Tiempo agotado!',
      subTitle: 'Se ha agotado el tiempo de la batalla',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.addXp(this.configService.config.batalla.xp_avatar_tiempo_agotado, this.configService.config.batalla.xp_player_tiempo_agotado);
            this.viewCtrl.dismiss({ resultado: 'tiempo_agotado', enemigo: this.enemigo, luchador: this.luchador });
          }
        }
      ]
    });
    alert.present();
  }

  addXp(xp_avatar: number, xp_player: number) {
    if (xp_player && xp_player > 0) {
      this.playerService.addXp(xp_player);
      this.toastService.push('+' + xp_player + ' XP ' + this.playerService.player.nombre);
    }
    if (xp_avatar && xp_avatar > 0) {
      this.luchador = this.playerService.avatarAddXp(xp_avatar, this.luchador, this.luchador_idx);
      this.playerService.player.mascotas[this.luchador_idx] = this.luchador;
      this.toastService.push('+' + xp_avatar + ' XP ' + this.luchador.nombre);
    }
    if (xp_player || xp_avatar) {
      this.playerService.savePlayer();
    }
  }

  huir() {
    this.viewCtrl.dismiss();
  }

}
