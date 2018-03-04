import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import * as leaflet from 'leaflet';
import 'leaflet-realtime';
import { Geolocation } from '@ionic-native/geolocation';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';
import { ItemsServiceProvider } from '../../providers/items-service/items-service';
import { ToastServiceProvider } from '../../providers/toast-service/toast-service';
import { AvatarModel } from '../../models/avatar.model'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: any;
  marker: any;
  center: any;
  realtime: any;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private geolocation: Geolocation,
    private configService: ConfigServiceProvider,
    private playerService: PlayerServiceProvider,
    private itemsService: ItemsServiceProvider,
    private toastService: ToastServiceProvider) {

  }

  ionViewDidLoad() {
    this.center = new leaflet.LatLng(40.5, -3.2);
    this.loadmap();
  }

  comenzarBatalla(luchadorId: any, luchadorXp: number) {
    let enemigoRef = this.configService.encontrarLuchador(luchadorId);
    if (enemigoRef) {
      let enemigo = new AvatarModel(this.configService);
      enemigo = enemigo.parse_reference(enemigoRef, luchadorXp);
      let modal = this.modalCtrl.create('BattleDefaultPage', { enemigo: enemigo }, {
        enableBackdropDismiss: false
      });
      modal.present();

      modal.onDidDismiss(data => {
        if (data) {
          console.log(data);
          this.actualizarRealtime();
        }
      });
    }
  }

  recogerItemRandom() {
    var idx = Math.floor(Math.random() * this.configService.items.length);
    var cantidad = this.getRandomInt(1, 10);
    if (cantidad <= 0) {
      cantidad = 1;
    }
    this.itemsService.playerAnadirItem(this.configService.items[idx], cantidad).then(res => {
      if (res) {
        this.toastService.push('+' + cantidad + ' ' + this.configService.items[idx].nombre);
      }
    });
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  ionViewWillEnter() {
    this.actualizarRealtime();
  }

  ionViewCanLeave() {
    //document.getElementById("map").outerHTML = "";

    if (this.realtime) {
      this.realtime.stop();
    }
  }

  loadmap() {
    this.map = leaflet.map("map", {
      center: this.center,
      zoom: 18
    });
    leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '',
      maxZoom: 22,
      minZoom: 12
    }).addTo(this.map);

    this.playerService.loadPlayer().then(res => {
      if (res) {
        var redIcon = leaflet.icon({
          //iconUrl: 'assets/imgs/marker-icon2.png',
          iconUrl: res.icono,
          shadowUrl: 'assets/imgs/marker-shadow.png',
          iconSize: [50, 50],
          iconAnchor: [25, 49],
          popupAnchor: [0, -47],
          className: 'player-icon'
        });

        this.marker = new leaflet.Marker(this.center, { icon: redIcon });
        this.map.addLayer(this.marker);

        this.marker.bindPopup("<h6>" + res.nombre + "</h6><p><span ion-text color='primary'>N " + res.nivel + " (" + res.xp + " XP)</span></p>");

        this.geolocation.getCurrentPosition().then((resp) => {
          this.center = new leaflet.LatLng(resp.coords.latitude, resp.coords.longitude);
          this.map.setView(this.center);
          this.marker.setLatLng(this.center);
          this.actualizarRealtime();
        }).catch((error) => {
          console.log('Error getting location', error);
        });

        let watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
          this.center = new leaflet.LatLng(data.coords.latitude, data.coords.longitude);
          this.map.setView(this.center);
          this.marker.setLatLng(this.center);
          this.actualizarRealtime();
          console.log("View setted", data.coords);
        });
      }
    });
  }

  abrirFeature(feature: any) {
    if (feature && feature.properties) {
      if (feature.properties.tipo == 'Bot') {
        var xp = this.getRandomInt(1, this.playerService.player.xp);
        if (xp <= 0) {
          xp = 1;
        }
        this.comenzarBatalla(feature.properties.id, xp);
      }
    }
  }

  actualizarRealtime() {
    var _url = this.configService.config.juego.url_base + this.configService.config.juego.url_realtime + '/?lat=' + this.center.lat + '&lng=' + this.center.lng + '&radio=' + this.configService.config.mapa.radio_vision;
    if (this.playerService.player && this.playerService.player.nivel) {
      _url += '&nivel=' + this.playerService.player.nivel;
    }
    if (!this.realtime) {
      var este = this;
      this.realtime = leaflet.realtime(
        {
          url: _url,
          crossOrigin: true,
          type: 'json'
        }, {
          interval: 60 * 1000,
          pointToLayer: function(feature, latlng) {
            var _avatar = este.configService.encontrarLuchador(feature.properties.id);
            return leaflet.marker(latlng, {
                'icon': leaflet.icon({
                    iconUrl:      _avatar.icono,
                    iconSize:     [80, 80], // size of the icon
                    iconAnchor:   [40, 79], // point of the icon which will correspond to marker's location
                    popupAnchor:  [0, -78], // point from which the popup should open relative to the iconAnchor
                    className:    'bot-icon'
                })
            });
          },
          onEachFeature: function(feature, layer) {
            console.log(feature);
            //var extra_content = '<div><button ion-button block color="primary" [(click)]="test()">TEST</button></div>';
            //layer.bindPopup(feature['properties'].content + extra_content);
            layer.on('click', function(e) {
              este.abrirFeature(feature);
            });
          }
        }).addTo(this.map);

      this.realtime.on('update', function() {
        console.log('realtime actualizado');
      });
    } else if (this.realtime) {
      this.realtime.setUrl(_url);
    }
  }

}
