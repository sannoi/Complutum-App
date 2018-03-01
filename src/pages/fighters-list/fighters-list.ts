import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';

@IonicPage()
@Component({
  selector: 'page-fighters-list',
  templateUrl: 'fighters-list.html',
})
export class FightersListPage {

  luchadores: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private playerService: PlayerServiceProvider) {
  }

  ionViewWillEnter() {
    this.luchadores = this.playerService.player.mascotas;
  }

}
