import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';
import { ItemModel } from '../../models/item.model';

@IonicPage()
@Component({
  selector: 'page-inventory',
  templateUrl: 'inventory.html',
})
export class InventoryPage {

  items: Array<ItemModel>;

  searchbar_visible: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private playerService: PlayerServiceProvider) {
  }

  ionViewWillEnter() {
    this.items = this.playerService.player.items;
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
