import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ToastServiceProvider } from '../../providers/toast-service/toast-service';
import { ItemsServiceProvider } from '../../providers/items-service/items-service';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';

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
    public configService: ConfigServiceProvider) {
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
    if (this.sin_items) {
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
        this.playerService.addXp(this.configService.config.sitios.xp_recoger_items);
        this.toastService.push('+' + this.configService.config.sitios.xp_recoger_items + ' XP ' + this.playerService.player.nombre);
      }

      var este = this;
      setTimeout(function(){
        este.sin_items = false;
      }, 60 * 1000);

    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
