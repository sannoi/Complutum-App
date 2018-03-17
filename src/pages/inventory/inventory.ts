import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';
import { ItemsServiceProvider } from '../../providers/items-service/items-service';
import { ItemModel } from '../../models/item.model';

@Component({
  selector: 'page-inventory',
  templateUrl: 'inventory.html',
})
export class InventoryPage {

  items: Array<ItemModel>;

  searchbar_visible: boolean = false;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    private playerService: PlayerServiceProvider,
    private itemsService: ItemsServiceProvider) {
  }

  ionViewWillEnter() {
    this.items = this.playerService.player.items;
  }

  disableItem(item: any) {
    if (item.tipo != 'modificador') {
      return 'disabled';
    } else {
      return '';
    }
  }

  clickItem(item: any) {
    if (item && item.tipo == "modificador") {
      let alert = this.alertCtrl.create({
        title: "Usar Objeto",
        message: "¿Seguro que quieres usar el objeto " + item.nombre + "?",
        buttons: [
          {
            text: "No",
            role: "cancel",
            handler: () => {}
          },
          {
            text: "Sí",
            handler: () => {
              this.itemsService.playerUsarItem(item);
            }
          }
        ]
      });
      alert.present();
    }
  }

  toggleSearchBar() {
    if (this.searchbar_visible) {
      this.searchbar_visible = false;
    } else {
      this.searchbar_visible = true;
    }
  }

  filtrarItems(ev: any) {
    // Reset items back to all of the items
    let _items = this.playerService.player.items;
    this.items = this.playerService.player.items;
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = _items.filter((item) => {
        return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1) || (item.descripcion.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      return this.items;
    }
  }

}
