import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';
import { ToastServiceProvider } from '../../providers/toast-service/toast-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { ItemsServiceProvider } from '../../providers/items-service/items-service';
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
    private alertService: AlertServiceProvider,
    private toastService: ToastServiceProvider,
    private configService: ConfigServiceProvider,
    private itemsService: ItemsServiceProvider,
    private playerService: PlayerServiceProvider) {
    this.luchador = navParams.get('luchador');
    this.esModal = navParams.get('modal');
    if (navParams.get('titulo_custom')) {
      this.titulo_custom = navParams.get('titulo_custom');
    }
    if (this.luchador) {
      this.saludLuchador = (this.luchador.salud_actual / this.luchador.propiedades_nivel.salud) * 100;
    }
  }

  dpsAtaque() {
    return parseInt((this.luchador.ataque.puntos_dano / this.luchador.ataque.segundos_enfriamiento).toString());
  }

  epsAtaque() {
    return parseInt((this.luchador.ataque.incremento_energia / this.luchador.ataque.segundos_enfriamiento).toString());
  }

  dpsEspecial() {
    return parseInt((this.luchador.especial.puntos_dano / this.luchador.especial.segundos_enfriamiento).toString());
  }

  epsEspecial() {
    return parseInt((this.luchador.especial.gasto_energia / this.luchador.especial.segundos_enfriamiento).toString());
  }

  tituloPagina() {
    if (this.titulo_custom) {
      return this.titulo_custom;
    } else {
      return this.luchador.nombre;
    }
  }

  xpAvatar() {
    var _acumulados = this.configService.xpAcumuladosNivel(this.luchador.nivel - 1);
    var _necesarios = this.configService.xpRelativosNivel(this.luchador.nivel);
    return ((this.luchador.xp - _acumulados) / _necesarios) * 100;
  }

  xpNivelText() {
    var _acumulados = this.configService.xpAcumuladosNivel(this.luchador.nivel - 1);
    var _necesarios = this.configService.xpRelativosNivel(this.luchador.nivel);

    return (this.luchador.xp - _acumulados).toString() + '/' + _necesarios.toString();
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
              this.saludLuchador = (this.luchador.salud_actual / this.luchador.propiedades_nivel.salud) * 100;
              this.itemsService.playerBorrarItem(data.item.id, 1).then(res => {
                if (res) {
                  this.playerService.player.mascotas[_luchador_idx] = this.luchador;
                  this.playerService.savePlayer();
                }
              });

            }
          }
        }
      }
    });
  }

  despedirMascota() {
    let buttons = [
      {
        text: 'No',
        handler: () => { }
      },
      {
        text: 'Sí',
        handler: () => {
          var _luchador_idx = this.playerService.player.mascotas.indexOf(this.luchador);
          if (_luchador_idx > -1) {
            this.playerService.borrarMascota(_luchador_idx).then(res => {
              if (res) {
                this.toastService.push('Has despedido a ' + this.luchador.nombre);
                if (this.esModal) {
                  this.viewCtrl.dismiss();
                } else {
                  this.navCtrl.pop();
                }
              }
            });
          }
        }
      }
    ];
    this.alertService.push('Despedir a ' + this.luchador.nombre, null, '¿Seguro que quieres despedir a ' + this.luchador.nombre + '? No podrás deshacer esta acción', buttons, false);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
