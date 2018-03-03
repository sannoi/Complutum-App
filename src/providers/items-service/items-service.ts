import { Injectable } from '@angular/core';
import { ConfigServiceProvider } from '../config-service/config-service';
import { PlayerServiceProvider } from '../player-service/player-service';
import { ItemModel } from '../../models/item.model';

@Injectable()
export class ItemsServiceProvider {

  constructor(private playerService: PlayerServiceProvider, private configService: ConfigServiceProvider) { }

  playerAnadirItem(item: any, cantidad: number) {
    return this.playerService.getPlayer().then(player => {
      if (player.items && player.items.length > 0) {

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

      return true;
    });
  }

}
