import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { ToastServiceProvider } from '../../providers/toast-service/toast-service';
import { ItemsServiceProvider } from '../../providers/items-service/items-service';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';

@IonicPage()
@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html',
})
export class ShopPage {

  player: any;

  items: any;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public configService: ConfigServiceProvider,
    public itemsService: ItemsServiceProvider,
    public playerService: PlayerServiceProvider,
    public toastService: ToastServiceProvider) {
    this.player = navParams.get("player");
    this.items = configService.tienda.items;
  }

  comprarItem(item: any) {
    let alert = this.alertCtrl.create({
      title: 'Comprar ' + item.nombre + ' x' + item.cantidad,
      subTitle: 'Vas a adquirir ' + item.cantidad + ' ' + item.nombre,
      buttons: [
        {
          text: 'En otro momento',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Comprar por ' + item.precio + ' monedas',
          handler: () => {
            this.comprar(item);
          }
        }
      ]
    });
    alert.present();
  }

  comprar(item: any) {
    if (this.player.monedas < item.precio) {
      this.toastService.push('No tienes suficiente dinero');
    } else {
      this.playerService.borrarMonedas(item.precio).then(res => {
        if (res) {
          var _item = this.configService.encontrarItem(item.item_id);
          if (_item) {
            this.itemsService.playerAnadirItem(_item, item.cantidad).then(result => {
              if (result) {
                this.toastService.push('+' + item.cantidad + ' ' + _item.nombre);
              } else {
                this.playerService.anadirMonedas(item.precio);
              }
            });
          } else {
            this.playerService.anadirMonedas(item.precio);
          }
        }
      });
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
