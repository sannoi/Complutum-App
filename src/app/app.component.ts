import { Component } from '@angular/core';
import { Platform, ModalController, AlertController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ConfigServiceProvider } from '../providers/config-service/config-service';
import { ToastServiceProvider } from '../providers/toast-service/toast-service';
import { PlayerServiceProvider } from '../providers/player-service/player-service';

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  tabs_visible: boolean = true;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public events: Events,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private configService: ConfigServiceProvider,
    private toastService: ToastServiceProvider,
    private playerService: PlayerServiceProvider) {
    this.checkEvents();
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.checkPlayer();
    });
  }

  checkEvents() {
    this.events.subscribe('player:nivel_conseguido', (data) => {
      let alert = this.alertCtrl.create({
        title: '¡Has subido de nivel!',
        subTitle: '¡Enhorabuena ' + data.player.nombre + '! Has alcanzado el nivel ' + data.nivel,
        buttons: ['Continuar']
      });
      alert.present();
      console.log('Evento player nivel conseguido', data);
    });

    this.events.subscribe('avatar:nivel_conseguido', (data) => {
      this.toastService.push(data.avatar.nombre + ' ha alcanzado el nivel ' + data.nivel);
      console.log('Evento avatar nivel conseguido', data);
    });

    this.events.subscribe('player:nueva_mascota', (data) => {
      if (data && data.mascota) {
        if ((this.configService.config.avatares.xp_nueva_mascota > 0 || data.xp_player) && this.playerService.player) {
          var _xp = data.xp_player ? data.xp_player : this.configService.config.avatares.xp_nueva_mascota;
          this.playerService.addXp(_xp);
          this.toastService.push('+' + _xp + ' XP ' + this.playerService.player.nombre);
        }
        let modal = this.modalCtrl.create('FighterDetailPage', { luchador: data.mascota, modal: true, titulo_custom: '¡Has conseguido un ' + data.mascota.nombre + '!' }, {
          enableBackdropDismiss: false
        });
        modal.present();
      }
    });

    this.events.subscribe('player:monedas_anadidas', (data) => {
      this.toastService.push('+' + data.monedas + ' Monedas');
    });

    this.events.subscribe('player:monedas_borradas', (data) => {
      this.toastService.push('-' + data.monedas + ' Monedas');
    });

    this.events.subscribe('interfaz:toggle_tabs', () => {
      var scrollContent = document.querySelector(".scroll-content")['style'];
      var fixedContent = document.querySelector(".fixed-content")['style'];
      var tabs = document.querySelector(".tabbar")['style'];
      var tabBarHeight = 56;

      if (this.tabs_visible) {
        tabs.display = 'none';
        scrollContent.marginBottom = 0;
        fixedContent.marginBottom = 0;
        this.tabs_visible = false;
      } else {
        tabs.display = 'flex';
        scrollContent.marginBottom = tabBarHeight + "px";
        fixedContent.marginBottom = tabBarHeight + "px";
        this.tabs_visible = true;
      }
    });
  }

  checkPlayer() {
    this.playerService.loadPlayer().then(res => {
      if (!res) {
        console.log('No se han encontrado datos de jugador');
        this.openNewPlayer();
      } else {
        console.log('Datos de jugador cargados');
      }
    });
  }

  openNewPlayer() {
    let modal = this.modalCtrl.create('PlayerNewPage', {}, {
      enableBackdropDismiss: false
    });
    modal.present();

    modal.onDidDismiss(data => {
      if (data && data.player && data.player.nombre) {
        this.playerService.newPlayer(data.player).then(res => {
          if (res) {
            this.playerService.setPlayer(res);
            let alert = this.alertCtrl.create({
              title: 'Bienvenida',
              subTitle: '¡Hola ' + res.nombre + '! Ahora empieza a luchar con todo lo que encuentres.',
              buttons: ['Adelante']
            });
            alert.present();
          } else {
            this.openNewPlayer();
          }
        });
      } else {
        this.openNewPlayer();
      }
    });
  }
}
