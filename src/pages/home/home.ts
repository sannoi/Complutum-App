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

  comenzarBatalla(luchadorIdx: number, luchadorXp: number) {
    let enemigoRef = this.configService.luchadores[luchadorIdx];
    if (enemigoRef) {
      let enemigo = new AvatarModel();
      enemigo = enemigo.parse_reference(enemigoRef, luchadorXp);
      let modal = this.modalCtrl.create('BattleDefaultPage', { enemigo: enemigo }, {
        enableBackdropDismiss: false
      });
      modal.present();

      modal.onDidDismiss(data => {
        if (data) {
          console.log(data);
        }
      });
    }
  }

  comenzarBatallaRandom() {
    var idx = Math.floor(Math.random() * this.configService.luchadores.length);
    var xp = this.getRandomInt(1, this.playerService.player.xp);
    if (xp <= 0) {
      xp = 1;
    }
    console.log("Comenzar Batalla Random: " + idx + " " + xp);
    this.comenzarBatalla(idx, xp);
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

  test() {
    console.log("Funciona!");
  }

  actualizarRealtime() {
    if (!this.realtime) {
      this.realtime = leaflet.realtime(
        {
          url: this.configService.config.juego.url_base + this.configService.config.juego.url_realtime + '/?lat=' + this.center.lat + '&lon=' + this.center.lng + '&radio=' + this.configService.config.mapa.radio_vision,
          crossOrigin: true,
          type: 'json'
        }, {
          interval: 60 * 1000,
          onEachFeature: function(feature, layer) {
            console.log(feature);
            var extra_content = '<div><button ion-button block color="primary" [(click)]="test()">TEST</button></div>';
            layer.bindPopup(feature['properties'].content + extra_content);
          }
        }).addTo(this.map);

      this.realtime.on('update', function() {
        console.log('realtime actualizado');
      });
    } else if (this.realtime) {
      console.log("_url de realtime", this.realtime);
      this.realtime.setUrl(this.configService.config.juego.url_base + this.configService.config.juego.url_realtime + '/?lat=' + this.center.lat + '&lon=' + this.center.lng + '&radio=' + this.configService.config.mapa.radio_vision),
      //if (!this.realtime.isRunning()) {
        this.realtime.start();
      //}
      console.log("Cambiado _url de realtime", this.realtime);
    }
  }

}
