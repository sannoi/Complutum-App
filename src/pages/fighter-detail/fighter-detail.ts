import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';
import { AvatarModel } from '../../models/avatar.model';

@IonicPage()
@Component({
  selector: 'page-fighter-detail',
  templateUrl: 'fighter-detail.html',
})
export class FighterDetailPage {

  luchador: AvatarModel;
  saludLuchador: any;

  esModal: boolean;

  titulo_custom: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    private configService: ConfigServiceProvider,
    private playerService: PlayerServiceProvider) {
      this.luchador = navParams.get('luchador');
      this.esModal = navParams.get('modal');
      if (navParams.get('titulo_custom')) {
        this.titulo_custom = navParams.get('titulo_custom');
      }
      if (this.luchador) {
        this.saludLuchador = (this.luchador.salud_actual/this.luchador.propiedades_nivel.salud) * 100;
      }
  }

  tituloPagina() {
    if (this.titulo_custom) {
      return this.titulo_custom;
    } else {
      return this.luchador.nombre;
    }
  }

  saludText() {
    return this.luchador.salud_actual + '/' + this.luchador.propiedades_nivel.salud;
  }

  elegirItem() {
    let modal = this.modalCtrl.create('InventorySelectPage', { tipo: 'salud' }, {
      enableBackdropDismiss: false
    });
    modal.present();

    modal.onDidDismiss(data => {
      if (data && data.item) {
        if (data.item.tipo == 'salud') {
          if (this.luchador.salud_actual != this.luchador.propiedades_nivel.salud) {
            var _luchador_idx = this.playerService.player.mascotas.indexOf(this.luchador);
            var _item_idx = this.playerService.player.items.indexOf(data.item);
            if (_luchador_idx > -1 && _item_idx > -1) {
              this.luchador.salud_actual += data.item.propiedades.restaurar_salud;
              if (this.luchador.salud_actual > this.luchador.propiedades_nivel.salud) {
                this.luchador.salud_actual = this.luchador.propiedades_nivel.salud;
              }
              this.saludLuchador = (this.luchador.salud_actual/this.luchador.propiedades_nivel.salud) * 100;
              this.playerService.player.items[_item_idx].cantidad -= 1;
              if (this.playerService.player.items[_item_idx].cantidad <= 0) {
                this.playerService.player.items.splice(_item_idx, 1);
              }
              this.playerService.player.mascotas[_luchador_idx] = this.luchador;
              this.playerService.savePlayer();
            }
          }
        }
      }
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
