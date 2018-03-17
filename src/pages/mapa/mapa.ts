import { Component } from '@angular/core';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import { Storage } from '@ionic/storage';
import { NavController, ModalController, LoadingController, Events, AlertController, FabContainer,Platform } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { SettingsServiceProvider } from '../../providers/settings-service/settings-service';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';
import { StatsServiceProvider } from '../../providers/stats-service/stats-service';
import { MapServiceProvider } from '../../providers/map-service/map-service';
import { ItemsServiceProvider } from '../../providers/items-service/items-service';
import { ToastServiceProvider } from '../../providers/toast-service/toast-service';
import { AvatarModel } from '../../models/avatar.model'
import * as moment from 'moment';

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {

  Coordinates: any;
  map: any;
  marker: any;
  markers_enemigos: Array<any>;
  markers_trampas: Array<any>;

  centrado_marker: boolean = true;

  observable_iniciado: boolean = false;

  cuentas_trampas: Array<any> = new Array<any>();

  url_statics: any;

  loading: any;

  settings: any;

  private intervalo: any;
  private estilo_actual: any;
  private edificios_visibles: any;

  private map_inicializado: boolean;

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public events: Events,
    public platform: Platform,
    private geolocation: Geolocation,
    private settingsService: SettingsServiceProvider,
    private configService: ConfigServiceProvider,
    private playerService: PlayerServiceProvider,
    private statsService: StatsServiceProvider,
    private mapService: MapServiceProvider,
    private itemsService: ItemsServiceProvider,
    private toastService: ToastServiceProvider) {
    this.markers_enemigos = new Array<any>();
    this.markers_trampas = new Array<any>();
    this.checkEvents();
  }

  ionViewWillEnter() {
    if (this.map_inicializado) {
      this.settingsService.getSettings().then(data => {
        this.settings = data;
        if (this.map && this.estilo_actual != this.settings.mapa.estilo) {
          this.estilo_actual = this.settings.mapa.estilo;
          this.map.setStyle('mapbox://styles/' + this.settings.mapa.estilo);
        } else if (this.map && this.edificios_visibles != this.settings.mapa.edificios) {
          this.edificios();
        }
      });
    }
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.storage.get('ultima_posicion').then(pos => {
        if (pos && pos.lat && pos.lng) {
          this.Coordinates = { latitude: pos.lat, longitude: pos.lng };
        } else {
          this.Coordinates = { latitude: 40.5, longitude: -3.2 };
        }
        this.settingsService.getSettings().then(data => {
          this.settings = data;
          this.executemap();
        });
      });
    });
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
    this.events.subscribe('player:trampa_plantada', (data) => {
      if (data && data.trampa) {
        this.anadirTrampaMapa(data.trampa);
      }
    });
  }

  toggleTabs() {
    this.events.publish('interfaz:toggle_tabs');
  }

  mostrarMeteo() {
    let alert = this.alertCtrl.create({
      title: 'Meteorología',
      subTitle: 'El tiempo atmosférico es: <b>' + this.mapService.entorno.meteo + '</b>',
      message: '<div align="center"><img src="' + this.mapService.entorno.icono + '"></div>Temperatura: <b>' + this.mapService.entorno.temp + 'ºC</b><br>Localización: <b>' + this.mapService.entorno.localizacion.poblacion + ', ' + this.mapService.entorno.localizacion.pais + '</b><br>Terreno: <b>' + this.mapService.entorno.terreno.join(', ') + '</b>',
      buttons: ['Vale']
    });
    alert.present();
  }

  abrirTienda() {
    let modal = this.modalCtrl.create('ShopPage', { player: this.playerService.player }, {
      enableBackdropDismiss: false
    });
    modal.present();
  }

  trampasIniciales() {
    if (this.playerService.player && this.playerService.player.trampas_activas && this.playerService.player.trampas_activas.length > 0) {
      for (var i = 0; i < this.playerService.player.trampas_activas.length; i++) {
        this.anadirTrampaMapa(this.playerService.player.trampas_activas[i]);
      }
    }
  }

  anadirTrampaMapa(trampa: any) {
    if (trampa && trampa.obj && trampa.coordenadas && trampa.avatar && trampa.tiempo_restante) {
      var _fecha_expiracion = moment(trampa.fecha).add(trampa.obj.propiedades.tiempo * trampa.multiplicador_tiempo, "seconds");
      var _fecha_actual = moment();

      var _timeout = parseInt(_fecha_expiracion.format('X')) - parseInt(_fecha_actual.format('X'));

      if (_timeout > 0) {
        var este = this;

        let feature = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [trampa.coordenadas.lng, trampa.coordenadas.lat]
          },
          properties: {
            id: trampa.obj.id,
            tipo: 'Trampa'
          },
          id: this.generarId()
        };

        // create a HTML element for each feature
        var el = document.createElement('div');
        el.className = 'marker-trampa';
        el.style.backgroundImage = 'url(' + trampa.obj.icono + ')';

        el.addEventListener('click', function() {
          este.abrirFeature(feature);
        });

        // make a marker for each feature and add to the map
        var trampa_marker = new mapboxgl.Marker(el)
          .setLngLat(feature.geometry.coordinates)
          .addTo(this.map);

        var _exp = parseInt(moment(trampa.fecha).add(trampa.obj.propiedades.tiempo * trampa.multiplicador_tiempo, "seconds").format('X'));
        var _act = parseInt(moment().format('X'));
        trampa.tiempo_restante = _exp - _act;

        var _marker = { id: feature.id, marker: trampa_marker, element: trampa };
        this.markers_trampas.push(_marker);

        var cuentas_trampa = setInterval(function() {
          var _marker = este.markers_trampas.find(function(x) {
            return x.id === feature.id;
          });
          if (_marker && _marker.element) {
            _marker.element.tiempo_restante = _marker.element.tiempo_restante - 1;
            if (_marker.element.tiempo_restante <= 0) {
              clearInterval(cuentas_trampa);
              //counter ended, do something here
              return;
            }
          }
        }, 1000);

        setTimeout(function() {
          este.anadirRecompensaTrampa(trampa);
          este.borrarMarkerTrampa(feature.id);
        }, _timeout * 1000);

      } else {
        this.anadirRecompensaTrampa(trampa);
      }
    }
  }

  anadirRecompensaTrampa(trampa: any) {
    let alert = this.alertCtrl.create({
      title: '¡Has capturado una nueva mascota!',
      message: 'Parece que una de tus trampas ha conseguido atrapar algo.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: '¡Quiero verlo!',
          handler: () => {
            var xp = this.configService.xpAcumuladosNivel(this.configService.config.jugador.mascota_nueva.nivel_maximo - 1);
            if (xp <= 0) {
              xp = 1;
            } else if (xp > this.playerService.player.xp) {
              xp = this.configService.xpAcumuladosNivel(this.playerService.player.nivel - 1);
            }

            var _idx_trampa_activa = this.playerService.player.trampas_activas.indexOf(trampa);
            if (_idx_trampa_activa > -1) {
              this.playerService.anadirMascota(trampa.avatar.id, xp, null, trampa.obj.propiedades.xp, trampa.obj.propiedades.iv_rango);
              this.playerService.player.trampas_activas.splice(_idx_trampa_activa, 1);
              this.playerService.savePlayer();
            }
          }
        }
      ]
    });
    alert.present();
  }

  borrarMarkerTrampa(id: any) {
    var _added_marker = this.markers_trampas.find(function(x) {
      return x.id === id;
    });
    if (_added_marker) {
      var _idx_marker = this.markers_trampas.indexOf(_added_marker);
      if (_added_marker) {
        _added_marker.marker.remove();
      }
      if (_idx_marker > -1) {
        this.markers_trampas.splice(_idx_marker, 1);
      }
    }
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
    console.log(feature);
    if (feature && feature.properties) {
      if (feature.properties.tipo == 'Bot') {
        this.loading = this.loadingCtrl.create();
        this.loading.present();
        this.comenzarBatalla(feature.properties.id, feature.properties.xp, feature.id).then(data => {
          if (data && data['resultado'] && data['enemigo']) {
            if (data['resultado'] && data['resultado'] == 'ganador' && data['enemigo'] && data['enemigo'].id_marker) {
              this.borrarMarkerEnemigo(data['enemigo'].id_marker);
            }
          }
        });

      } else if (feature.properties.type == 'tourism' || feature.properties.type == 'place') {
        if (feature.properties.obj) {
          feature.properties.obj = JSON.parse(feature.properties.obj);
        }
        if (feature.properties.type == 'tourism') {
          if (feature.properties.imagenes) {
            feature.properties.imagenes = JSON.parse(feature.properties.imagenes);
          }
          let modal = this.modalCtrl.create('PlaceDetailPage', { lugar: feature.properties, coordenadas: { lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] } }, {
            enableBackdropDismiss: false
          });
          modal.present();
        } else if (feature.properties.type == 'place') {
          let modal = this.modalCtrl.create('TournamentDefaultPage', { torneo: feature }, {
            enableBackdropDismiss: false
          });
          modal.present();
        }
        /*if (feature.properties.obj && feature.properties.obj.parametros.tipo == "torneo") {
          let modal = this.modalCtrl.create('TournamentDefaultPage', { torneo: feature.properties.obj }, {
            enableBackdropDismiss: false
          });
          modal.present();
        } else {
          feature.properties.imagenes = JSON.parse(feature.properties.imagenes);
          let modal = this.modalCtrl.create('PlaceDetailPage', { lugar: feature.properties, coordenadas: { lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] } }, {
            enableBackdropDismiss: false
          });
          modal.present();
        }*/
      } else if (feature.properties.tipo == 'Trampa') {
        var trampa = this.markers_trampas.find(function(x) {
          return x.id === feature.id;
        });
        if (trampa) {
          let modal = this.modalCtrl.create('TrapDetailPage', { trampa: trampa.element }, {
            enableBackdropDismiss: false
          });
          modal.present();
        }
      }
    }
  }

  perfilPlayer(fab: FabContainer) {
    fab.close();
    let modal = this.modalCtrl.create('PlayerDetailPage', {}, {
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
      return new Promise((response, error) => {
        return modal.onDidDismiss(data => {
          if (data && data['resultado'] && data['luchador']) {
            var _luchador = this.playerService.player.mascotas.find(function(x) {
              return x.id === data['luchador'].id;
            });
            var _idx_luchador = this.playerService.player.mascotas.indexOf(_luchador);
            if (data['resultado'] == 'ganador') {
              if (_idx_luchador > -1) {
                this.playerService.player.mascotas[_idx_luchador].anadirEstadistica('batallas_ganadas', 1, 'number');
                this.playerService.savePlayer();
              }
              this.statsService.anadirEstadistica('batallas_ganadas', 1, 'number');
              this.statsService.anadirEstadistica(data['enemigo']['id_original'] + '_derrotados', 1, 'number')
            } else if (data['resultado'] == 'perdedor') {
              if (_idx_luchador > -1) {
                this.playerService.player.mascotas[_idx_luchador].anadirEstadistica('batallas_perdidas', 1, 'number');
                this.playerService.savePlayer();
              }
              this.statsService.anadirEstadistica('batallas_perdidas', 1, 'number');
            }
          }
          response(data);
        });
      });
    }

    return new Promise((response, error) => {
      response(false);
    });
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

  plantarTrampa() {
    let modal = this.modalCtrl.create('InventorySelectPage', { tipo: 'trampa' }, {
      enableBackdropDismiss: false
    });
    modal.present();

    modal.onDidDismiss(data => {
      if (data && data.item) {
        if (data.item.tipo == 'trampa') {
          let alert = this.alertCtrl.create({
            title: 'Colocar trampa',
            message: '¿Seguro que quieres colocar una ' + data.item.nombre + ' en tu ubicación actual?',
            enableBackdropDismiss: false,
            buttons: [
              {
                text: 'No',
                role: 'cancel',
                handler: () => { }
              },
              {
                text: 'Sí',
                handler: () => {
                  this.itemsService.playerBorrarItem(data.item.id, 1).then(res => {
                    if (res) {
                      this.playerService.plantarTrampa(data.item, this.mapService.coordenadas, this.mapService.entorno).then(trampa => {
                        if (trampa && trampa['obj'] && trampa['coordenadas']) {
                          let alrt = this.alertCtrl.create({
                            title: 'Trampa colocada',
                            message: 'Has colocado una ' + trampa['obj'].nombre + ' en las coordenadas (' + trampa['coordenadas'].lat + ', ' + trampa['coordenadas'].lng + '). Comprueba si has cazado algo dentro de un tiempo.',
                            enableBackdropDismiss: false,
                            buttons: ['Vale']
                          });
                          alrt.present();
                        } else {
                          this.itemsService.playerAnadirItem(data.item, 1);
                        }
                      });
                    }
                  });
                }
              }
            ]
          });
          alert.present();
        }
      }
    });
  }

  anadirMascotaRandom(fab: FabContainer) {
    fab.close();
    var idx = Math.floor(Math.random() * this.configService.luchadores.length);
    //var xp = this.getRandomInt(1, this.playerService.player.xp);
    var xp = this.configService.xpAcumuladosNivel(this.configService.config.jugador.mascota_nueva.nivel_maximo - 1);
    if (xp <= 0) {
      xp = 1;
    } else if (xp > this.playerService.player.xp) {
      xp = this.configService.xpAcumuladosNivel(this.playerService.player.nivel - 1);
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

  realtime() {
    if (this.map && !this.map.hasImage('sitio') && !this.map.getSource('drone')) {
      var este = this;
      var _loaded = false;

      if (this.intervalo) {
        clearInterval(this.intervalo);
        _loaded = true;
      }

      this.intervalo = window.setInterval(function() {
        var _source = este.map.getSource('drone');
        if (_source) {
          _source.setData(este.url_statics);
        }
      }, 10000);

      this.map.loadImage(this.configService.config.mapa.iconos.sitio, function(error, image) {

        if (error) throw error;

        este.map.loadImage(este.configService.config.mapa.iconos.torneo, function(error1, image1) {

          if (error1) throw error1;

          if (!este.map.hasImage('sitio') && !este.map.hasImage('torneo') && !este.map.getSource('drone')) {
            este.map.addImage('sitio', image);
            este.map.addImage('torneo', image1);

            este.map.addSource('drone', { type: 'geojson', data: este.url_statics });
            este.map.addLayer({
              "id": "drone",
              "type": "symbol",
              "source": "drone",
              "layout": {
                "symbol-spacing": 100,
                "icon-image": "sitio",
                "icon-anchor": "bottom",
                "icon-size": 0.2
              },
              "filter": ["==", "type", "tourism"]
            });

            este.map.addLayer({
              "id": "drone2",
              "type": "symbol",
              "source": "drone",
              "layout": {
                "symbol-spacing": 100,
                "icon-image": "torneo",
                "icon-anchor": "bottom",
                "icon-size": 0.2
              },
              "filter": ["==", "type", "place"]
            });

            if (!_loaded) {
              // Center the map on the coordinates of any clicked symbol from the 'symbols' layer.
              este.map.on('click', 'drone2', function(e) {
                este.map.flyTo({ center: e.features[0].geometry.coordinates });
                este.abrirFeature(e.features[0]);
                return false;
              });

              // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
              este.map.on('mouseenter', 'drone2', function() {
                este.map.getCanvas().style.cursor = 'pointer';
              });

              // Change it back to a pointer when it leaves.
              este.map.on('mouseleave', 'drone2', function() {
                este.map.getCanvas().style.cursor = '';
              });

              // Center the map on the coordinates of any clicked symbol from the 'symbols' layer.
              este.map.on('click', 'drone', function(e) {
                este.map.flyTo({ center: e.features[0].geometry.coordinates });
                este.abrirFeature(e.features[0]);
                return false;
              });

              // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
              este.map.on('mouseenter', 'drone', function() {
                este.map.getCanvas().style.cursor = 'pointer';
              });

              // Change it back to a pointer when it leaves.
              este.map.on('mouseleave', 'drone', function() {
                este.map.getCanvas().style.cursor = '';
              });
            }
          }
        });
      });

    }
  }

  edificios() {
    if (this.configService.config.mapa.edificios.activo && this.settings.mapa.edificios && !this.map.getLayer('3d-buildings')) {
      this.map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': this.configService.config.mapa.edificios.zoom_minimo,
        'paint': {
          'fill-extrusion-color': this.configService.config.mapa.edificios.color,
          'fill-extrusion-height': [
            "interpolate", ["linear"], ["zoom"],
            this.configService.config.mapa.edificios.zoom_minimo, 0,
            (this.configService.config.mapa.edificios.zoom_minimo + 0.05), ["get", "height"]
          ],
          'fill-extrusion-base': [
            "interpolate", ["linear"], ["zoom"],
            this.configService.config.mapa.edificios.zoom_minimo, 0,
            (this.configService.config.mapa.edificios.zoom_minimo + 0.05), ["get", "min_height"]
          ],
          'fill-extrusion-opacity': this.configService.config.mapa.edificios.opacidad
        }
      });
    } else if (this.map.getLayer('3d-buildings')) {
      this.map.removeLayer('3d-buildings');
    }
  }

  executemap() {
    /*Initializing Map*/
    if (!this.map) {
      mapboxgl.accessToken = this.configService.config.mapa.mapbox_access_token;
      this.estilo_actual = this.settings.mapa.estilo;
      this.map = new mapboxgl.Map({
        //style: 'mapbox://styles/' + this.configService.config.mapa.mapbox_estilo,
        style: 'mapbox://styles/' + this.settings.mapa.estilo,
        center: [this.Coordinates.longitude, this.Coordinates.latitude],
        zoom: this.configService.config.mapa.zoom.inicial,
        pitch: this.configService.config.mapa.perspectiva.inclinacion,
        bearing: this.configService.config.mapa.perspectiva.rotacion,
        minZoom: this.configService.config.mapa.zoom.minimo, //restrict map zoom - buildings not visible beyond 13
        maxZoom: this.configService.config.mapa.zoom.maximo,
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
      this.url_statics = this.configService.config.juego.url_base + this.configService.config.juego.url_statics + '/?lat=' + this.Coordinates.latitude + '&lng=' + this.Coordinates.longitude + '&radio=' + this.configService.config.mapa.radio_vision;
      if (this.playerService.player && this.playerService.player.nivel) {
        this.url_statics += '&nivel=' + this.playerService.player.nivel;
      }
      console.log(this.url_statics);

      this.map.on('load', function() {
        este.edificios();
        este.trampasIniciales();
        este.realtime();
      });

      this.map.on('move', function(e) {
        if (e['originalEvent']) {
          este.centrado_marker = false;
        }
      });

      var loadSource = () => {
        if (este.map.isStyleLoaded()) {
          este.edificios();
          este.realtime();
          este.map.off('data', loadSource);
        }
      }

      this.map.on('styledataloading', function(styledata) {
        console.log("style map loaded!", styledata);
        este.map.on('data', loadSource);
      });

      this.map.on('data', loadSource);

      this.mapService.establecerCoordenadas({ lat: this.Coordinates.latitude, lng: this.Coordinates.longitude });

      let watch = this.geolocation.watchPosition(this.configService.config.mapa.config_gps);
      watch.subscribe((position: Geoposition) => {
        var _pos = this.parsePosicion(position);
        if (_pos && _pos['coords']) {
          this.Coordinates = _pos['coords'];
          this.mapService.establecerCoordenadas({ lat: this.Coordinates.latitude, lng: this.Coordinates.longitude });
          //this.map.setCenter([this.Coordinates.longitude, this.Coordinates.latitude]);
          if (this.centrado_marker) {
            this.map.easeTo({ center: [this.Coordinates.longitude, this.Coordinates.latitude], zoom: this.map.getZoom() });
          }
          this.marker.setLngLat([this.Coordinates.longitude, this.Coordinates.latitude]);
          this.comprobarDistanciaEnemigos();
          if (!this.observable_iniciado) {
            this.mapService.iniciarObservableEnemigos();
            this.observable_iniciado = true;
          }
          this.url_statics = this.configService.config.juego.url_base + this.configService.config.juego.url_statics + '/?lat=' + this.Coordinates.latitude + '&lng=' + this.Coordinates.longitude + '&radio=' + this.configService.config.mapa.radio_vision;
          if (this.playerService.player && this.playerService.player.nivel) {
            this.url_statics += '&nivel=' + this.playerService.player.nivel;
          }
          if (!this.mapService.origen_entorno) {
            this.mapService.iniciarObservableEntorno();
          }
        } else {
          console.log(this.parsePosicion(position));
          alert("Error de geolocalización: " + JSON.stringify(this.parsePosicion(position)));
        }
      });
    }
  }

  parsePosicion(position: any) {
    var positionObject = {};

    if ('coords' in position) {
        positionObject['coords'] = {};

        if ('latitude' in position.coords) {
            positionObject['coords'].latitude = position.coords.latitude;
        }
        if ('longitude' in position.coords) {
            positionObject['coords'].longitude = position.coords.longitude;
        }
        if ('accuracy' in position.coords) {
            positionObject['coords'].accuracy = position.coords.accuracy;
        }
        if ('altitude' in position.coords) {
            positionObject['coords'].altitude = position.coords.altitude;
        }
        if ('altitudeAccuracy' in position.coords) {
            positionObject['coords'].altitudeAccuracy = position.coords.altitudeAccuracy;
        }
        if ('heading' in position.coords) {
            positionObject['coords'].heading = position.coords.heading;
        }
        if ('speed' in position.coords) {
            positionObject['coords'].speed = position.coords.speed;
        }
    }

    if ('timestamp' in position) {
        positionObject['timestamp'] = position.timestamp;
    }

    return positionObject;
  }

  centrarMapa() {
    if (this.map) {
      this.centrado_marker = true;
      this.map.easeTo({ center: [this.Coordinates.longitude, this.Coordinates.latitude], zoom: this.map.getZoom() });
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generarId() {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 8)).toUpperCase();
  }

}
