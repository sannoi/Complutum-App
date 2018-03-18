import { Component } from '@angular/core';
import { Platform, ModalController, AlertController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ConfigServiceProvider } from '../providers/config-service/config-service';
import { StatsServiceProvider } from '../providers/stats-service/stats-service';
import { ToastServiceProvider } from '../providers/toast-service/toast-service';
import { PlayerServiceProvider } from '../providers/player-service/player-service';
import { ItemsServiceProvider } from '../providers/items-service/items-service';

import { TabsPage } from '../pages/tabs/tabs';

import * as moment from 'moment';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  tabs_visible: boolean = true;

  private velocidad_notificada: boolean = false;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public events: Events,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private configService: ConfigServiceProvider,
    private statsService: StatsServiceProvider,
    private toastService: ToastServiceProvider,
    private playerService: PlayerServiceProvider,
    private itemsService: ItemsServiceProvider) {
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
          this.playerService.addXp(_xp).then(_exp => {
            this.toastService.push('+' + _exp + ' XP ' + this.playerService.player.nombre);
          });

        }
        let modal = this.modalCtrl.create('FighterDetailPage', { luchador: data.mascota, modal: true, titulo_custom: '¡Has conseguido un ' + data.mascota.nombre + '!' }, {
          enableBackdropDismiss: false
        });
        modal.present();
      }
    });

    this.events.subscribe('player:despedir_mascota', (data) => {
      if (data && data.mascota) {
        if (this.configService.config.avatares.despedir_mascota.xp > 0 && this.playerService.player) {
          var _xp = this.configService.config.avatares.despedir_mascota.xp;
          this.playerService.addXp(_xp).then(_exp => {
            this.toastService.push('+' + _exp + ' XP ' + this.playerService.player.nombre);
            if (this.configService.config.avatares.despedir_mascota.monedas > 0) {
              this.playerService.anadirMonedas(this.configService.config.avatares.despedir_mascota.monedas);
              if (data.mascota.id_original) {
                var ref = this.configService.luchadores.find(function(x){
                  return x.id === data.mascota.id_original;
                });
                if (ref && ref.items_despedir && ref.items_despedir.length > 0) {
                  for (var i = 0; i < ref.items_despedir.length; i++) {
                    var refItem = this.configService.items.find(function(x){
                      return x.id === ref.items_despedir[i].id;
                    });

                    if (refItem) {
                      var _cantidad = ref.items_despedir[i].cantidad;
                      this.itemsService.playerAnadirItem(refItem, ref.items_despedir[i].cantidad).then(res1 => {
                        if (res1) {
                          this.toastService.push("+" + _cantidad + " " + refItem.nombre);
                        }
                      });
                    }
                  }
                }
              }
            }
          });
        }
      }
    });

    this.events.subscribe('player:limite_velocidad_alcanzado', (data) => {
      if (data && data['velocidad'] && !this.velocidad_notificada) {
        this.velocidad_notificada = true;
        let alert = this.alertCtrl.create({
          title: "Demasiado rápido",
          message: "Vas demasiado rápido y no es recomendable jugar mientras conduces.",
          buttons: [{
            text: "Soy el copiloto",
            handler: () => {
              var este = this;
              setTimeout(function(){
                este.velocidad_notificada = false;
              }, 10 * 60 * 1000)
            }
          }]
        });
        alert.present();
      }

    });

    this.events.subscribe('player:monedas_anadidas', (data) => {
      this.toastService.push('+' + data.monedas + ' Monedas');
    });

    this.events.subscribe('player:monedas_borradas', (data) => {
      this.toastService.push('-' + data.monedas + ' Monedas');
    });

    this.events.subscribe('player:modificador_anadido', (data) => {
      this.toastService.push('Has usado el objeto ' + data.modificador.item.nombre);
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
            this.statsService.anadirEstadistica("fecha_inicio", moment().format(), "date");
            let alert = this.alertCtrl.create({
              title: 'Bienvenida',
              subTitle: '¡Hola ' + res.nombre + '! Ahora empieza a luchar con todo lo que encuentres.',
              message: 'Un <b>Mew</b> es ahora tu compañero de aventuras. Úsalo para pelear contra otros luchadores.',
              buttons: [
                {
                  text: 'Adelante',
                  handler: () => {
                    this.playerService.mascotasIniciales();
                  }
                }
              ]
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
