import { Injectable } from '@angular/core';
import { ConfigServiceProvider } from '../config-service/config-service';
import { StatsServiceProvider } from '../stats-service/stats-service';
import { PlayerServiceProvider } from '../player-service/player-service';
import { ItemModel } from '../../models/item.model';

@Injectable()
export class ItemsServiceProvider {

  constructor(private playerService: PlayerServiceProvider, private statsService: StatsServiceProvider, private configService: ConfigServiceProvider) { }

  playerAnadirItem(item: any, cantidad: number) {
    return this.playerService.getPlayer().then(player => {
      if (player.items && player.items.length > 0) {

        var total = this.contarItems(player);

        if (total >= this.configService.config.jugador.inventario.max_items) {
          return false;
        }

        var found = false;

        for (var i = 0; i < player.items.length; i++) {
          if (player.items[i].id == item.id) {
            found = true;
            player.items[i].cantidad += cantidad;
          }
        }

        if (found === true) {
          this.playerService.setPlayer(player);
          this.playerService.savePlayer();
        } else {
          let item_nuevo = new ItemModel();
          item_nuevo = item_nuevo.parse_reference(item, cantidad);
          player.items.push(item_nuevo);
          this.playerService.setPlayer(player);
          this.playerService.savePlayer();
        }

      } else {
        let item_nuevo = new ItemModel();
        item_nuevo = item_nuevo.parse_reference(item, cantidad);
        player.items = new Array<ItemModel>();
        player.items.push(item_nuevo);
        this.playerService.setPlayer(player);
        this.playerService.savePlayer();
      }

      this.statsService.anadirEstadistica('items_conseguidos', cantidad, 'number');
      this.statsService.anadirEstadistica(item.id + '_items_conseguidos', cantidad, 'number');

      return true;
    });
  }

  playerBorrarItem(id_item: any, cantidad: number) {
    return this.playerService.getPlayer().then(player => {
      var _item = player.items.find(function(x){
        return x.id === id_item;
      });

      if (_item) {
        var _idx_item = player.items.indexOf(_item);

        if (_idx_item > -1) {
          if (_item.cantidad <= cantidad) {
            this.playerService.player.items.splice(_idx_item, 1);
          } else {
            this.playerService.player.items[_idx_item].cantidad -= cantidad;
          }
          this.playerService.savePlayer();
          this.statsService.anadirEstadistica('items_gastados', cantidad, 'number');
          this.statsService.anadirEstadistica(id_item + '_items_gastados', cantidad, 'number');
          return true;
        }
      }
      return false;
    });
  }

  contarItems(player: any) {
    var _c = 0;
    if (player && player.items && player.items.length > 0) {
      for (var i = 0; i < player.items.length; i++) {
        _c = _c + player.items[i].cantidad;
      }
    }
    return _c;
  }

  recuperarItemRandom(items: any) {
    if (items && items.length > 0) {
      var _rareza_minima = Math.random() * 100;
      var _items_filtrados = items.filter(function(x) {
        return x.rareza >= _rareza_minima;
      });
      if (_items_filtrados && _items_filtrados.length > 0) {
        return _items_filtrados[Math.floor(Math.random() * _items_filtrados.length)];
      } else {
        return this.recuperarItemRandom(items);
      }
    } else {
      return false;
    }
  }

  playerItemsSitio() {
    var _max_items = this.configService.config.sitios.cantidad_recoger_items;
    var _items_disponibles = this.configService.config.sitios.items_disponibles;
    var _items = [];

    for (var i = 0; i < _max_items; i++) {
      var _item = this.recuperarItemRandom(_items_disponibles);
      if (_item) {
        _items.push(_item);
      } else {
        _item = this.recuperarItemRandom(_items_disponibles);
        if (_item) {
          _items.push(_item);
        }
      }
    }
    return new Promise((response, fail) => {
      return response(_items);
    });
  }

  playerUsarItem(item: any) {
    return this.playerService.getPlayer().then(player => {
      if (player.items && player.items.length > 0 && item.tipo == 'modificador') {
        var _idx = player.items.indexOf(item);

        if (_idx > -1) {
          return this.playerBorrarItem(item.id, 1).then(res => {
            if (res) {
              return this.iniciarModificador(item).then(resultado => {
                return resultado;
              });
            }
          });
        }
      }

      return false;
    });
  }

  iniciarModificador(item: any) {
    let mod = {
      id: this.generateId(),
      item: item,
      fecha: this.getDateTime(),
      tiempo_restante: 999
    };
    return this.playerService.anadirModificador(mod);
  }

  generateId() {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 8)).toUpperCase();
  }

  getDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = (now.getMonth() + 1).toString();
    var day = now.getDate().toString();
    var hour = now.getHours().toString();
    var minute = now.getMinutes().toString();
    var second = now.getSeconds().toString();
    if (month.toString().length == 1) {
      month = '0' + month;
    }
    if (day.toString().length == 1) {
      day = '0' + day;
    }
    if (hour.toString().length == 1) {
      hour = '0' + hour;
    }
    if (minute.toString().length == 1) {
      minute = '0' + minute;
    }
    if (second.toString().length == 1) {
      second = '0' + second;
    }
    var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
    return dateTime;
  }

}
