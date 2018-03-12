import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ToastServiceProvider } from '../../providers/toast-service/toast-service';
import { ItemsServiceProvider } from '../../providers/items-service/items-service';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { MapServiceProvider } from '../../providers/map-service/map-service';

@IonicPage()
@Component({
  selector: 'page-place-detail',
  templateUrl: 'place-detail.html',
})
export class PlaceDetailPage {

  lugar: any;
  coordenadas: any;

  sin_items: boolean = false;

  items: Array<any>;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public toastService: ToastServiceProvider,
    public itemsService: ItemsServiceProvider,
    public playerService: PlayerServiceProvider,
    public configService: ConfigServiceProvider,
    public mapService: MapServiceProvider) {
    this.lugar = navParams.get('lugar');
    this.coordenadas = navParams.get('coordenadas');
    this.items = new Array(
      { item: { id: 'medicina-sm' }, cantidad: 3 },
      { item: { id: 'medicina-md' }, cantidad: 1 }
    );
  }

  ionViewDidLoad() {
  }

  recogerItems() {
    var distancia = this.calcularDistancia(this.mapService.coordenadas.lat, this.coordenadas.lat, this.mapService.coordenadas.lng, this.coordenadas.lng);
    if (distancia > this.configService.config.mapa.radio_interaccion) {
      this.toastService.push('Acércate para interactuar con el sitio');
    } else if (this.sin_items) {
      this.toastService.push('Inténtalo más tarde');
    } else {
      for (var i = 0; i < this.items.length; i++) {
        var _item = this.configService.encontrarItem(this.items[i].item.id);
        if (_item) {
          this.itemsService.playerAnadirItem(_item, this.items[i].cantidad);
          this.toastService.push('+' + this.items[i].cantidad + ' ' + _item.nombre);
        }
      }
      this.sin_items = true;
      if (this.configService.config.sitios.xp_recoger_items > 0) {
        this.playerService.addXp(this.configService.config.sitios.xp_recoger_items).then(_exp => {
          this.toastService.push('+' + _exp + ' XP ' + this.playerService.player.nombre);
        });
      }

      var este = this;
      setTimeout(function(){
        este.sin_items = false;
      }, 60 * 1000);

    }
  }

  calcularDistancia(lat1: number, lat2: number, long1: number, long2: number) {
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat1 - lat2) * p) / 2 + c(lat2 * p) * c((lat1) * p) * (1 - c(((long1 - long2) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    return dis;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
