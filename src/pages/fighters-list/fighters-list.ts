import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';
import { AvatarModel } from '../../models/avatar.model';

@IonicPage()
@Component({
  selector: 'page-fighters-list',
  templateUrl: 'fighters-list.html',
})
export class FightersListPage {

  luchadores: Array<AvatarModel>;

  orden: any;
  dir_orden: any;

  searchbar_visible: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private playerService: PlayerServiceProvider,
    public popoverCtrl: PopoverController) {
      this.orden = 'fecha';
      this.dir_orden = 'DESC';
  }

  ionViewWillEnter() {
    this.luchadores = this.playerService.player.mascotas;
    this.ordenarLuchadores();
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create('OrderFightersPage');
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data => {
      if (data && data.orden && data.dir_orden) {
        this.cambiarOrden(data.orden, data.dir_orden);
      }
    });
  }

  toggleSearchBar() {
    if (this.searchbar_visible) {
      this.searchbar_visible = false;
    } else {
      this.searchbar_visible = true;
    }
  }

  detalleLuchador(luchador: AvatarModel) {
    this.navCtrl.push('FighterDetailPage', { luchador: luchador });
  }

  filtrarLuchadores(ev: any) {
    // Reset items back to all of the items
    let _luchadores = this.playerService.player.mascotas;
    this.luchadores = this.playerService.player.mascotas;
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.luchadores = _luchadores.filter((item) => {
        return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      return this.luchadores;
    }
  }

  cambiarOrden(orden: any, dir_orden: any) {
    this.orden = orden;
    this.dir_orden = dir_orden;
    this.ordenarLuchadores();
  }

  ordenarLuchadores() {
    var order = this.orden;
    var order_dir = this.dir_orden;
    var este = this;
    this.luchadores.sort(function(a, b) {
      let aDeep = este.goDeep(a, order);
      let bDeep = este.goDeep(b, order);
      if (aDeep > bDeep) {
        if (order_dir == 'DESC') {
          return -1;
        } else {
          return 1;
        }
      }
      if (aDeep < bDeep) {
        if (order_dir == 'DESC') {
          return 1;
        } else {
          return -1;
        }
      }
      return 0;
    });
  }

  goDeep(obj, desc) {
    var arr = desc.split(".");
    while (arr.length && (obj = obj[arr.shift()]));
    return obj;
  }

}
