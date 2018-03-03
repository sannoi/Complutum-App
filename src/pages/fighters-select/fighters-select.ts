import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';
import { AvatarModel } from '../../models/avatar.model';

@IonicPage()
@Component({
  selector: 'page-fighters-select',
  templateUrl: 'fighters-select.html',
})
export class FightersSelectPage {

  luchadores: Array<AvatarModel>;

  searchbar_visible: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private playerService: PlayerServiceProvider,
    public viewCtrl: ViewController) {
  }

  ionViewWillEnter() {
    this.luchadores = this.playerService.player.mascotas;
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
      })
    } else {
      return this.luchadores;
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  elegirLuchador(luchador: AvatarModel) {
    let data = { avatar: luchador, avatar_idx: this.luchadores.indexOf(luchador) };
    this.viewCtrl.dismiss(data);
  }

}
