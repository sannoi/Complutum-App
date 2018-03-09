import { Component } from '@angular/core';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import { NavController, ModalController, LoadingController, Events, AlertController, FabContainer } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';
import { MapServiceProvider } from '../../providers/map-service/map-service';
import { ItemsServiceProvider } from '../../providers/items-service/items-service';
import { ToastServiceProvider } from '../../providers/toast-service/toast-service';
import { AvatarModel } from '../../models/avatar.model'

@IonicPage()
@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {

  Coordinates: any;
  map: any;
  marker: any;
  markers_enemigos: Array<any>;

  observable_iniciado: boolean = false;

  url_statics: any;

  loading: any;

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
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
    this.Coordinates = { latitude: 40.5, longitude: -3.2 };
    this.executemap();
  }

  ionViewCanLeave() {
    this.mapService.pararObservableEnemigos();
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

  toggleTabs() {
    this.events.publish('interfaz:toggle_tabs');
  }

  mostrarMeteo() {
    let alert = this.alertCtrl.create({
      title: 'Meteorología',
      subTitle: 'El tiempo atmosférico es: ' + this.mapService.entorno.meteo,
      buttons: ['Vale']
    });
    alert.present();
  }

  anadirEnemigoMapa(feature: any) {
    var _avatar = this.configService.encontrarLuchador(feature.properties.id);
    if (_avatar && this.playerService.player) {
      var este = this;

      // create a HTML element for each feature
      var el = document.createElement('div');
      el.className = 'marker-enemigo';
      el.style.backgroundImage = 'url(' + _avatar.icono + ')';

      var xp = this.getRandomInt(1, this.playerService.player.xp);
      if (xp <= 0) {
        xp = 1;
      }
      feature.properties['xp'] = xp;

      el.addEventListener('click', function() {
        este.abrirFeature(feature);
      });

      // make a marker for each feature and add to the map
      var enemigo_marker = new mapboxgl.Marker(el)
        .setLngLat(feature.geometry.coordinates)
        .addTo(this.map);

      var _marker = { id: feature.id, marker: enemigo_marker };
      this.markers_enemigos.push(_marker);

      setTimeout(function() {
        este.borrarMarkerEnemigo(feature.id);
      }, this.configService.config.mapa.tiempo_desaparicion_enemigos * 1000);

    }
  }

  borrarMarkerEnemigo(id: any) {
    var _added_marker = this.markers_enemigos.find(function(x) {
      return x.id === id;
    });
    if (_added_marker) {
      var _idx_marker = this.markers_enemigos.indexOf(_added_marker);
      if (_added_marker) {
        _added_marker.marker.remove();
      }
      if (_idx_marker > -1) {
        this.markers_enemigos.splice(_idx_marker, 1);
      }
    }
  }

  abrirFeature(feature: any) {
    if (feature && feature.properties) {
      if (feature.properties.tipo == 'Bot') {
        this.loading = this.loadingCtrl.create();
        this.loading.present();
        /*var xp = this.getRandomInt(1, this.playerService.player.xp);
        if (xp <= 0) {
          xp = 1;
        }*/
        this.comenzarBatalla(feature.properties.id, feature.properties.xp, feature.id);
      } else if (feature.properties.tipo == 'Item') {
        feature.properties.imagenes = JSON.parse(feature.properties.imagenes);
        let modal = this.modalCtrl.create('PlaceDetailPage', { lugar: feature.properties, coordenadas: { lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] } }, {
          enableBackdropDismiss: false
        });
        modal.present();
      }
    }
  }

  perfilPlayer(fab: FabContainer) {
    fab.close();
    let modal = this.modalCtrl.create('PlayerDetailPage', { }, {
      enableBackdropDismiss: false
    });
    modal.present();
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

  comprobarDistanciaEnemigos() {
    var _player_coords = this.mapService.coordenadas;
    for (var i = 0; i < this.markers_enemigos.length; i++) {
      if (this.markers_enemigos[i].marker) {
        var _latlng_marker = this.markers_enemigos[i].marker.getLngLat();
        var dist = this.calcularDistancia(_player_coords.lat, _latlng_marker.lat, _player_coords.lng, _latlng_marker.lng);

        if (dist > this.configService.config.mapa.radio_interaccion) {
          console.log('Avatar lejando borrado');
          if (this.markers_enemigos[i].marker) {
            this.markers_enemigos[i].marker.remove();
          }
          this.markers_enemigos.splice(i, 1);
        }
      }
    }
  }

  calcularDistancia(lat1: number, lat2: number, long1: number, long2: number) {
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat1 - lat2) * p) / 2 + c(lat2 * p) * c((lat1) * p) * (1 - c(((long1 - long2) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    return dis;
  }

  anadirMascotaRandom(fab: FabContainer) {
    fab.close();
    var idx = Math.floor(Math.random() * this.configService.luchadores.length);
    var xp = this.getRandomInt(1, this.playerService.player.xp);
    if (xp <= 0) {
      xp = 1;
    }
    this.playerService.anadirMascota(this.configService.luchadores[idx].id, xp);
  }

  recogerItemRandom(fab: FabContainer) {
    fab.close();
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

  executemap() {
    /*Initializing Map*/
    if (!this.map) {
      mapboxgl.accessToken = 'pk.eyJ1Ijoic2Fubm9pIiwiYSI6ImNpeTgwcnBmeTAwMXgycXI3bTA5ZHZ0MjIifQ.4_oblhduvDc6UKdrdioMMQ';
      this.map = new mapboxgl.Map({
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [this.Coordinates.longitude, this.Coordinates.latitude],
        zoom: 16,
        pitch: 260,
        minZoom: 12, //restrict map zoom - buildings not visible beyond 13
        maxZoom: 22,
        container: 'map'
      });
      // create a HTML element for each feature
      var el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = 'url(assets/imgs/player_default.png)';

      // make a marker for each feature and add to the map
      this.marker = new mapboxgl.Marker(el)
        .setLngLat([this.Coordinates.longitude, this.Coordinates.latitude])
        .addTo(this.map);

      var este = this;
      this.url_statics = this.configService.config.juego.url_base + this.configService.config.juego.url_statics + '/?lat=' + this.Coordinates.latitude + '&lon=' + this.Coordinates.longitude + '&radio=' + this.configService.config.mapa.radio_vision + '&categorias=192';
      if (this.playerService.player && this.playerService.player.nivel) {
        this.url_statics += '&nivel=' + this.playerService.player.nivel;
      }

      this.map.on('load', function() {
        este.map.addLayer({
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#ffff00',
            'fill-extrusion-height': [
              "interpolate", ["linear"], ["zoom"],
              15, 0,
              15.05, ["get", "height"]
            ],
            'fill-extrusion-base': [
              "interpolate", ["linear"], ["zoom"],
              15, 0,
              15.05, ["get", "min_height"]
            ],
            'fill-extrusion-opacity': .2
          }
        });

        window.setInterval(function() {
          este.map.getSource('drone').setData(este.url_statics);
        }, 10000);

        este.map.loadImage('assets/imgs/places/specialbox.png', function(error, image) {
          if (error) throw error;
          este.map.addImage('sitio', image);

          este.map.addSource('drone', { type: 'geojson', data: este.url_statics });
          este.map.addLayer({
            "id": "drone",
            "type": "symbol",
            "source": "drone",
            "layout": {
              "icon-image": "sitio",
              "icon-size": 0.3
            }
          });

          // Center the map on the coordinates of any clicked symbol from the 'symbols' layer.
          este.map.on('click', 'drone', function(e) {
            este.map.flyTo({ center: e.features[0].geometry.coordinates });
            este.abrirFeature(e.features[0]);
          });

          // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
          este.map.on('mouseenter', 'drone', function() {
            este.map.getCanvas().style.cursor = 'pointer';
          });

          // Change it back to a pointer when it leaves.
          este.map.on('mouseleave', 'drone', function() {
            este.map.getCanvas().style.cursor = '';
          });
        });

      });
      this.mapService.establecerCoordenadas({ lat: this.Coordinates.latitude, lng: this.Coordinates.longitude });

      /*Initializing geolocation*/
      let options = {
        frequency: 3000,
        enableHighAccuracy: true
      };

      let watch = this.geolocation.watchPosition(options);
      watch.subscribe((position: Geoposition) => {
        if (position && position.coords) {
          this.Coordinates = position.coords;
          this.mapService.establecerCoordenadas({ lat: this.Coordinates.latitude, lng: this.Coordinates.longitude });
          //this.map.setCenter([this.Coordinates.longitude, this.Coordinates.latitude]);
          this.map.easeTo({ center: [this.Coordinates.longitude, this.Coordinates.latitude], zoom: this.map.getZoom() });
          this.marker.setLngLat([this.Coordinates.longitude, this.Coordinates.latitude]);
          this.comprobarDistanciaEnemigos();
          if (!this.observable_iniciado) {
            this.mapService.iniciarObservableEnemigos();
            this.observable_iniciado = true;
          }
          this.url_statics = this.configService.config.juego.url_base + this.configService.config.juego.url_statics + '/?lat=' + this.Coordinates.latitude + '&lon=' + this.Coordinates.longitude + '&radio=' + this.configService.config.mapa.radio_vision + '&categorias=192';
          if (this.playerService.player && this.playerService.player.nivel) {
            this.url_statics += '&nivel=' + this.playerService.player.nivel;
          }
          if (!this.mapService.origen_entorno) {
            this.mapService.iniciarObservableEntorno();
          }
        } else {
          alert("Error de geolocalización: " + JSON.stringify(position));
        }
      });
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
