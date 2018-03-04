import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, PopoverController  } from 'ionic-angular';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';
import { AvatarModel } from '../../models/avatar.model';

@IonicPage()
@Component({
  selector: 'page-fighters-select',
  templateUrl: 'fighters-select.html',
})
export class FightersSelectPage {

  luchadores: Array<AvatarModel>;

  orden: any;
  dir_orden: any;

  searchbar_visible: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private playerService: PlayerServiceProvider,
    public viewCtrl: ViewController,
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
      });
      this.ordenarLuchadores();
    } else {
      this.ordenarLuchadores();
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
    this.luchadores.sort(function(a, b) {
      if (a[order] > b[order]) {
        if (order_dir == 'DESC') {
          return -1;
        } else {
          return 1;
        }
      }
      if (a[order] < b[order]) {
        if (order_dir == 'DESC') {
          return 1;
        } else {
          return -1;
        }
      }
      return 0;
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  elegirLuchador(luchador: AvatarModel) {
    let data = { avatar: luchador, avatar_idx: this.luchadores.indexOf(luchador) };
    this.viewCtrl.dismiss(data);
  }

}
