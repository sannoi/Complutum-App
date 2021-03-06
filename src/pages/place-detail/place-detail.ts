import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ToastServiceProvider } from '../../providers/toast-service/toast-service';
import { ItemsServiceProvider } from '../../providers/items-service/items-service';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { StatsServiceProvider } from '../../providers/stats-service/stats-service';
import { MapServiceProvider } from '../../providers/map-service/map-service';
import { WikidataServiceProvider } from '../../providers/wikidata-service/wikidata-service';

@IonicPage()
@Component({
  selector: 'page-place-detail',
  templateUrl: 'place-detail.html',
})
export class PlaceDetailPage {

  lugar: any;
  wikidata: any;
  coordenadas: any;

  sin_items: boolean = false;

  items: any;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public toastService: ToastServiceProvider,
    public itemsService: ItemsServiceProvider,
    public playerService: PlayerServiceProvider,
    public statsService: StatsServiceProvider,
    public configService: ConfigServiceProvider,
    public wikiService: WikidataServiceProvider,
    public mapService: MapServiceProvider) {
    this.lugar = navParams.get('lugar');
    this.coordenadas = navParams.get('coordenadas');
    itemsService.playerItemsSitio().then(data => {
      this.items = data;
    });
    if (this.lugar['wikidata']) {
      wikiService.getWikidataInfo(this.lugar.wikidata).then(info => {
        console.log(info);
        this.wikidata = info;
      });
    }
    if (!this.lugar['name']) {
      this.lugar.name ="Desconocido";
    }
    console.log(this.lugar, this.coordenadas, this.items);
  }

  recogerItems() {
    var distancia = this.mapService.getDistanciaEnKilometros(this.mapService.coordenadas, this.coordenadas);
    if (distancia > this.configService.config.mapa.radio_interaccion) {
      this.toastService.push('Acércate para interactuar con el sitio');
    } else if (this.sin_items) {
      this.toastService.push('Inténtalo más tarde');
    } else {
      for (var i = 0; i < this.items.length; i++) {
        var _item = this.configService.encontrarItem(this.items[i].item);
        if (_item) {
          this.itemsService.playerAnadirItem(_item, this.items[i].cantidad).then(res => {
            if (res) {
              this.toastService.push('+' + this.items[i].cantidad + ' ' + _item.nombre);
            } else {
              this.toastService.push("No tienes espacio en el inventario");
            }
          });
        }
      }
      this.sin_items = true;
      if (this.configService.config.sitios.xp_recoger_items > 0) {
        this.playerService.addXp(this.configService.config.sitios.xp_recoger_items).then(_exp => {
          this.toastService.push('+' + _exp + ' XP ' + this.playerService.player.nombre);
        });
      }
      this.statsService.anadirEstadistica('sitios_visitados', 1, 'number');
      this.statsService.anadirEstadistica(this.lugar.id + '_sitios_visitados', 1, 'number');

      var este = this;
      setTimeout(function(){
        este.sin_items = false;
      }, 60 * 1000);

    }
  }

  imagenMapa() {
    return 'https://api.mapbox.com/styles/v1/' + this.configService.config.mapa.mapbox_estilo + '/static/'+ this.coordenadas.lng +','+ this.coordenadas.lat +',16,0.00,0.00/300x200@2x?access_token=' + this.configService.config.mapa.mapbox_access_token;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
