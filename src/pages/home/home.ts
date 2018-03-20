import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, Events } from 'ionic-angular';
import * as L from 'leaflet';
import 'leaflet-realtime';
import 'mapbox-gl-leaflet/leaflet-mapbox-gl.js';
import { Geolocation } from '@ionic-native/geolocation';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';
import { MapServiceProvider } from '../../providers/map-service/map-service';
import { ItemsServiceProvider } from '../../providers/items-service/items-service';
import { ToastServiceProvider } from '../../providers/toast-service/toast-service';
import { AvatarModel } from '../../models/avatar.model'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: any;
  map_gl: any;
  marker: any;
  center: any;
  realtime: any;
  markers_enemigos: Array<any>;

  loading: any;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public events: Events,
    private geolocation: Geolocation,
    private configService: ConfigServiceProvider,
    private playerService: PlayerServiceProvider,
    private mapService: MapServiceProvider,
    private itemsService: ItemsServiceProvider,
    private toastService: ToastServiceProvider) {
    this.markers_enemigos = new Array<any>();
    this.checkEvents();
  }

  ionViewDidLoad() {
    this.center = new L.LatLng(40.5, -3.2);
    this.loadmap();
  }

  ionViewWillEnter() {
    this.actualizarRealtime();
  }

  ionViewCanLeave() {
    //document.getElementById("map").outerHTML = "";
    this.mapService.pararObservableEnemigos();

    if (this.realtime) {
      this.realtime.stop();
    }
  }

  checkEvents() {
    this.events.subscribe('mapa:nuevos_enemigos', (data) => {
      if (data && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          this.anadirEnemigoMapa(data[i]);
        }
      }
    });
  }

  anadirEnemigoMapa(feature: any) {
    var _avatar = this.configService.encontrarLuchador(feature.properties.id);
    if (_avatar) {
      var avatarIcon = L.icon({
        //iconUrl: 'assets/imgs/marker-icon2.png',
        iconUrl: _avatar.icono,
        iconSize: [80, 80], // size of the icon
        iconAnchor: [40, 79], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -78], // point from which the popup should open relative to the iconAnchor
        className: 'bot-icon'
      });
      var este = this;
      var enemigo_marker = new L.Marker(new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]), { icon: avatarIcon });
      enemigo_marker.on('click', function(e) {
        este.abrirFeature(feature);
      });
      var _marker = { id: feature.id, marker: enemigo_marker };
      this.markers_enemigos.push(_marker);
      var _added_marker = this.markers_enemigos.find(function(x) {
        return x.id === feature.id;
      });
      this.map.addLayer(_added_marker.marker);

      setTimeout(function() {
        este.borrarMarkerEnemigo(feature.id);
      }, this.configService.config.mapa.tiempo_desaparicion_enemigos * 1000);

    }
  }

  comenzarBatalla(luchadorId: any, luchadorXp: number, luchadorIdMarker: any) {
    let enemigoRef = this.configService.encontrarLuchador(luchadorId);
    if (enemigoRef) {
      let enemigo = new AvatarModel(this.configService);
      enemigo = enemigo.parse_reference(enemigoRef, luchadorXp);
      enemigo.id_marker = luchadorIdMarker;
      this.loading.dismiss();
      let modal = this.modalCtrl.create('BattleDefaultPage', { enemigo: enemigo }, {
        enableBackdropDismiss: false
      });
      modal.present();

      modal.onDidDismiss(data => {
        if (data) {
          if (data.resultado && data.resultado == 'ganador' && data.enemigo && data.enemigo.id_marker) {
            this.borrarMarkerEnemigo(data.enemigo.id_marker);
          }
        }
      });
    }
  }

  borrarMarkerEnemigo(id: any) {
    var _added_marker = this.markers_enemigos.find(function(x) {
      return x.id === id;
    });
    if (_added_marker) {
      var _idx_marker = this.markers_enemigos.indexOf(_added_marker);
      if (_added_marker) {
        this.map.removeLayer(_added_marker.marker);
      }
      if (_idx_marker > -1) {
          this.markers_enemigos.splice(_idx_marker, 1);
      }
    }
  }

  comprobarDistanciaEnemigos() {
    var _player_coords = this.mapService.coordenadas;
    for (var i = 0; i < this.markers_enemigos.length; i++) {
      console.log(this.markers_enemigos[i]);
      if (this.markers_enemigos[i].marker) {
        var _latlng_marker = this.markers_enemigos[i].marker.getLatLng();
        var dist = this.calcularDistancia(_player_coords.lat, _latlng_marker.lat, _player_coords.lng, _latlng_marker.lng);

        if (dist > this.configService.config.mapa.radio_interaccion) {
          console.log('Avatar lejando borrado');
          if (this.markers_enemigos[i].marker) {
            this.map.removeLayer(this.markers_enemigos[i].marker);
          }
          this.markers_enemigos.splice(i, 1);
        }
      }
    }
  }

  calcularDistancia(lat1:number,lat2:number,long1:number,long2:number){
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat1-lat2) * p) / 2 + c(lat2 * p) *c((lat1) * p) * (1 - c(((long1- long2) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    return dis;
  }

  anadirMascotaRandom() {
    var idx = Math.floor(Math.random() * this.configService.luchadores.length);
    var xp = this.getRandomInt(1, this.playerService.player.xp);
    if (xp <= 0) {
      xp = 1;
    }
    this.playerService.anadirMascota(this.configService.luchadores[idx].id, xp);
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
      } else {
        this.toastService.push("No tienes espacio en el inventario");
      }
    });
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  loadmap() {
    this.map = L.map("map", {
      center: this.center,
      zoom: 18
    });

    /*L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '',
      maxZoom: 22,
      minZoom: 12
    }).addTo(this.map);*/


    this.playerService.loadPlayer().then(res => {
      var redIcon = L.icon({
        //iconUrl: 'assets/imgs/marker-icon2.png',
        iconUrl: 'assets/imgs/player_default.png',
        shadowUrl: 'assets/imgs/marker-shadow.png',
        iconSize: [50, 50],
        iconAnchor: [25, 49],
        popupAnchor: [0, -47],
        className: 'player-icon'
      });
      if (res) {
        redIcon = L.icon({
          //iconUrl: 'assets/imgs/marker-icon2.png',
          iconUrl: res.icono,
          shadowUrl: 'assets/imgs/marker-shadow.png',
          iconSize: [50, 50],
          iconAnchor: [25, 49],
          popupAnchor: [0, -47],
          className: 'player-icon'
        });
      }

      this.mapService.establecerCoordenadas({ lat: this.center.lat, lng: this.center.lng });

        this.marker = new L.Marker(this.center, { icon: redIcon });
        this.map.addLayer(this.marker);

        //this.marker.bindPopup("<h6>" + res.nombre + "</h6><p><span ion-text color='primary'>N " + res.nivel + " (" + res.xp + " XP)</span></p>");

        this.geolocation.getCurrentPosition().then((resp) => {
          this.center = new L.LatLng(resp.coords.latitude, resp.coords.longitude);
          this.mapService.establecerCoordenadas({ lat: this.center.lat, lng: this.center.lng });
          this.map.setView(this.center);
          this.marker.setLatLng(this.center);
          this.comprobarDistanciaEnemigos();
          this.mapService.iniciarObservableEnemigos();
          //this.actualizarRealtime();
        }).catch((error) => {
          console.log('Error getting location', error);
        });

        let watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
          this.center = new L.LatLng(data.coords.latitude, data.coords.longitude);
          this.mapService.establecerCoordenadas({ lat: this.center.lat, lng: this.center.lng });
          this.map.setView(this.center);
          this.marker.setLatLng(this.center);
          this.comprobarDistanciaEnemigos();
          //this.actualizarRealtime();
          console.log("View setted", data.coords);
        });

        this.map_gl = L.mapboxGL({
            accessToken: 'pk.eyJ1Ijoic2Fubm9pIiwiYSI6ImNpeTgwcnBmeTAwMXgycXI3bTA5ZHZ0MjIifQ.4_oblhduvDc6UKdrdioMMQ',
            style: 'mapbox://styles/mapbox/streets-v9',
            pitch: 45,
            bearing: -17.6,
            hash: true
        }).addTo(this.map);

    });
  }

  abrirFeature(feature: any) {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    if (feature && feature.properties) {
      if (feature.properties.tipo == 'Bot') {
        var xp = this.getRandomInt(1, this.playerService.player.xp);
        if (xp <= 0) {
          xp = 1;
        }
        this.comenzarBatalla(feature.properties.id, xp, feature.id);
      } else {
        this.loading.dismiss();
      }
    } else {
      this.loading.dismiss();
    }
  }

  actualizarRealtime() {
    /*var _url = this.configService.config.juego.url_base + this.configService.config.juego.url_realtime + '/?lat=' + this.center.lat + '&lng=' + this.center.lng + '&radio=' + this.configService.config.mapa.radio_vision;
    if (this.playerService.player && this.playerService.player.nivel) {
      _url += '&nivel=' + this.playerService.player.nivel;
    }
    if (!this.realtime) {
      var este = this;
      this.realtime = L.realtime(
        {
          url: _url,
          crossOrigin: true,
          type: 'json'
        }, {
          interval: 15 * 1000,
          pointToLayer: function(feature, latlng) {
            var _avatar = este.configService.encontrarLuchador(feature.properties.id);
            return L.marker(latlng, {
                'icon': L.icon({
                    iconUrl:      _avatar.icono,
                    iconSize:     [80, 80], // size of the icon
                    iconAnchor:   [40, 79], // point of the icon which will correspond to marker's location
                    popupAnchor:  [0, -78], // point from which the popup should open relative to the iconAnchor
                    className:    'bot-icon'
                })
            });
          },
          onEachFeature: function(feature, layer) {
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
    }*/
  }

}
