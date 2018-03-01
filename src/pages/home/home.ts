import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as leaflet from 'leaflet';
import 'leaflet-realtime';
import { Geolocation } from '@ionic-native/geolocation';
import { BattleServiceProvider } from '../../providers/battle-service/battle-service';
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
    private geolocation: Geolocation,
    private battleService: BattleServiceProvider) {

  }

  ionViewDidLoad() {
    this.center = new leaflet.LatLng(40.5, -3.2);
    this.loadmap();
    this.checkBattle();
  }

  checkBattle() {
    let atacante = new AvatarModel();
    atacante.nombre = "Mewtwo";
    atacante.nivel = 30;
    atacante.salud = 193;
    atacante.propiedades = { ataque: 300, defensa: 182 };
    atacante.ataque = { nombre: "Golpe", puntos_dano: 10, segundos_enfriamiento: 5 };
    atacante.especial = { nombre: "Psíquico", puntos_dano: 100, segundos_enfriamiento: 35 };

    let defensor = new AvatarModel();
    defensor.nombre = "Bulbasur";
    defensor.nivel = 17;
    defensor.salud = 90;
    defensor.propiedades = { ataque: 118, defensa: 118 };
    defensor.ataque = { nombre: "Mirada Cuqui", puntos_dano: 5, segundos_enfriamiento: 2 };
    defensor.especial = { nombre: "Bomba Lodo", puntos_dano: 80, segundos_enfriamiento: 22 };

    let resultado_ataque = this.battleService.calcularDano(defensor, atacante);

    console.log("Resultado ataque " + defensor.ataque.nombre + " de " + defensor.nombre + " a " + atacante.nombre + ": " + resultado_ataque);
  }

  ionViewCanLeave() {
    document.getElementById("map").outerHTML = "";

    if (this.realtime) {
      this.realtime.stop();
    }
  }

  loadmap() {
    this.map = leaflet.map("map", {
      center: this.center,
      zoom: 13
    });
    leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '',
      maxZoom: 18
    }).addTo(this.map);

    /*if (!this.realtime && this.authService.getUsr()) {
      this.realtime = leaflet.realtime({
        url: this.configService.apiUrl() + '/shop/pedido/realtimePedidos.json/?solo_usuario_actual=1&solo_disponibles=0&usuario_id=' + this.authService.getUsr().id,
        crossOrigin: true,
        type: 'json'
      }, {
          interval: 15 * 1000,
          onEachFeature: function(feature, layer) {
            console.log(feature);
            layer.bindPopup(feature['properties'].content);
          }
        }).addTo(this.map);

      var map1 = this.map;
      var rt = this.realtime;
      var loc = this.locationService;
      var geo_ext_opt = this.configService.cfg.extensions.geolocation.active;

      this.realtime.on('update', function() {
        if (geo_ext_opt) {
          let result = loc.GPSStatus();
          if (result == true) {
            console.log("Realtime geolocation true");
          } else if (rt.features && rt.features.length > 0) {
            map1.fitBounds(rt.getBounds());
          }
        } else {
          map1.fitBounds(rt.getBounds());
        }
      });
    } else if (this.realtime) {
      this.realtime.start();
    }*/

	var redIcon = leaflet.icon({
	  iconUrl: 'assets/imgs/marker-icon2.png',
	  shadowUrl: 'assets/imgs/marker-shadow.png',
	  iconSize: [25, 41],
	  iconAnchor: [12, 40],
	  popupAnchor: [0, -38]
	});

	this.marker = new leaflet.Marker(this.center, { icon: redIcon });
	this.map.addLayer(this.marker);

	this.marker.bindPopup("<p>Tu localización</p>");

	this.geolocation.getCurrentPosition().then((resp) => {
		this.map.setView(new leaflet.LatLng(resp.coords.latitude, resp.coords.longitude), 15);
		this.marker.setLatLng(new leaflet.LatLng(resp.coords.latitude, resp.coords.longitude));
	}).catch((error) => {
	  console.log('Error getting location', error);
	});

	let watch = this.geolocation.watchPosition();
	watch.subscribe((data) => {
		this.marker.setLatLng(new leaflet.LatLng(data.coords.latitude, data.coords.longitude));
		console.log("View setted: " + data.coords);
	});

    /*if (this.configService.cfg.extensions.geolocation.active) {
      let result = this.locationService.GPSStatus();
      this.gps = result;
      if (result == true) {

      }
    }*/
  }

}
