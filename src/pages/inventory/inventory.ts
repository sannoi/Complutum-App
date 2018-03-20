import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';
import { ItemsServiceProvider } from '../../providers/items-service/items-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { ToastServiceProvider } from '../../providers/toast-service/toast-service';
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
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private toastService: ToastServiceProvider,
    private configService: ConfigServiceProvider,
    private alertService: AlertServiceProvider,
    private playerService: PlayerServiceProvider,
    private itemsService: ItemsServiceProvider) {
  }

  ionViewWillEnter() {
    this.items = this.playerService.player.items;
  }

  disableItem(item: any) {
    if (item.tipo != 'modificador' && item.tipo != 'cambiar-ataque') {
      return 'disabled';
    } else {
      return '';
    }
  }

  borrarItem(item: any) {
    let buttons = [
      {
        text: 'Olvídalo',
        role: 'cancel',
        handler: () => {}
      },
      {
        text: 'Sí',
        handler: data => {
          if (data.cantidad >= item.cantidad) {
            let buttons2 = [
              {
                text: 'No',
                handler: () => {}
              },
              {
                text: 'Sí',
                handler: () => {
                  this.itemsService.playerBorrarItem(item.id, item.cantidad);
                }
              }
            ];
            this.alertService.push('Vaciar ' + item.nombre, 'Vas a tirar todas las unidades de ' + item.nombre + '. ¿Quieres continuar?', null, buttons2, false);
          } else {
            this.itemsService.playerBorrarItem(item.id, data.cantidad);
          }
        }
      }
    ];
    let inputs = [
      {
        name: 'cantidad',
        placeholder: 'Cantidad',
        value: 1,
        type: 'number'
      }
    ];
    let alert_obj = {
      title: null,
      subTitle: '¿Tirar ' + item.nombre + '?',
      message: null,
      backdropDismiss: false,
      inputs: inputs,
      buttons: buttons
    };
    this.alertService.push_obj(alert_obj);
  }

  clickItem(item: any) {
    if (item && item.tipo == "modificador") {
      var _mods_activos = this.playerService.player.modificadores_activos;
      if (_mods_activos && _mods_activos.length >= this.configService.config.jugador.modificadores.max_activos) {
        this.alertService.push('Límite de modificadores', 'No puedes usar más modificadores hasta que se consuman los que están activos.', null, ['Vale'], false);
      } else {
        let buttons = [
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
        ];
        this.alertService.push('Usar Objeto', null, '¿Seguro que quieres usar el objeto ' + item.nombre + '?', buttons, false);
      }
    } else if (item && item.tipo == "cambiar-ataque") {
      let modal = this.modalCtrl.create('FightersSelectPage');
      modal.present();

      modal.onDidDismiss((data) => {
        if (data) {
          this.itemsService.playerBorrarItem(item.id, 1).then(res => {
            if (res) {
              if (item.propiedades.tipo_ataque == 'rapido') {
                console.log('Cambiar ataque debil de ' + data.avatar.nombre + ' a ' + item.propiedades.ataque);
                var _ataque = this.configService.encontrarAtaque(item.propiedades.ataque, 'debil');
                if (_ataque && this.playerService.player.mascotas[data.avatar_idx]) {
                  this.playerService.player.mascotas[data.avatar_idx].ataque = _ataque;
                  this.playerService.savePlayer().then(res => {
                    this.toastService.push(data.avatar.nombre + ' ahora usa ' + _ataque.nombre);
                  });
                }
              } else if (item.propiedades.tipo_ataque == 'fuerte') {
                console.log('Cambiar ataque fuerte de ' + data.avatar.nombre + ' a ' + item.propiedades.ataque);
                var _ataque_fuerte = this.configService.encontrarAtaque(item.propiedades.ataque, 'fuerte');
                if (_ataque_fuerte && this.playerService.player.mascotas[data.avatar_idx]) {
                  this.playerService.player.mascotas[data.avatar_idx].especial = _ataque_fuerte;
                  this.playerService.savePlayer().then(res => {
                    this.toastService.push(data.avatar.nombre + ' ahora usa ' + _ataque_fuerte.nombre);
                  });
                }
              }
            }
          });
        }
      });
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

  contar() {
    var _c = 0;
    for (var i = 0; i < this.items.length; i++) {
      _c = _c + this.items[i].cantidad;
    }
    return _c.toString() + '/' + this.configService.config.jugador.inventario.max_items.toString();
  }

}
