import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { PlayerModel } from '../../models/player.model';
import { AvatarModel } from '../../models/avatar.model';
import { ItemModel } from '../../models/item.model';
import { ConfigServiceProvider } from '../config-service/config-service';

@Injectable()
export class PlayerServiceProvider {

  public player: PlayerModel;

  constructor(private storage: Storage, public events: Events, private configService: ConfigServiceProvider) {
  }

  public addXp(xp:number) {
    if (this.player) {
      this.player.xp += xp;
      let nivel_actual = this.player.nivel;
      let nivel_calculado = this.configService.nivelXp(this.player.xp);
      if (nivel_calculado > nivel_actual) {
        console.log(this.player.nombre + " ha subido del nivel " + nivel_actual + " al nivel " + nivel_calculado);
        this.player.nivel = nivel_calculado;
        this.savePlayer().then(res => {
          this.events.publish('player:nivel_conseguido', { player: this.player, nivel: nivel_calculado });
        });
      }
    }
  }

  public avatarAddXp(xp:number, avatar: AvatarModel, idx_avatar: number) {
    avatar.xp += xp;
    let nivel_actual = avatar.nivel;
    let nivel_calculado = this.configService.nivelXp(avatar.xp);
    if (nivel_calculado > nivel_actual) {
      console.log(avatar.nombre + " ha subido del nivel " + nivel_actual + " al nivel " + nivel_calculado);
      avatar.nivel = nivel_calculado;
      avatar.salud_actual = avatar.propiedades_nivel.salud;
      avatar.recalcular_nuevo_nivel();
      this.events.publish('avatar:nivel_conseguido', { avatar: avatar, nivel: nivel_calculado });
    }
    this.player.mascotas[idx_avatar] = avatar;

    return avatar;
  }

  getPlayer() {
    if (!this.player) {
      return this.loadPlayer();
    } else {
      return new Promise((resolve, reject) => {
        resolve(this.player);
      });
    }
  }

  loadPlayer() {
    return this.storage.get('player').then(res => {
      if (res) {
        let player_nuevo = new PlayerModel(this.configService);
        res = player_nuevo.parse(res);
        this.player = res;
      }
      return res;
    });
  }

  savePlayer() {
    return this.storage.set('player', this.player).then(res => {
      return res;
    });
  }

  setPlayer(player: PlayerModel) {
    this.player = player;
  }

  newPlayer(data: any) {
    let player = new PlayerModel(this.configService);
    if (!data || !data.nombre || data.nombre.trim() == '') {
      return new Promise<boolean>((resolve, reject) => {
        resolve(false);
      });
    } else {
      player.nombre = data.nombre;
      if (data.icono) {
        player.icono = data.icono;
      }
      if (data.xp) {
        player.xp = data.xp;
      } else if (this.configService.config.jugador.xp_inicial > 0) {
        player.xp = this.configService.config.jugador.xp_inicial;
      } else {
        player.xp = 0;
      }
      if (data.nivel) {
        player.nivel = data.nivel;
      } else {
        player.nivel = this.configService.nivelXp(player.xp);
      }
      if (data.monedas) {
        player.monedas = data.monedas;
      } else if (this.configService.config.jugador.monedas_iniciales > 0) {
        player.monedas = this.configService.config.jugador.monedas_iniciales;
      } else {
        player.monedas = 0;
      }
      if (data.mascotas) {
        player.mascotas = data.mascotas;
      } else {
        player.mascotas = new Array<AvatarModel>();
        this.mascotasIniciales(player);
      }
      if (data.mascota_seleccionada_idx) {
        player.mascota_seleccionada_idx = data.mascota_seleccionada_idx;
      } else {
        player.mascota_seleccionada_idx = 0;
      }
      if (data.items) {
        player.items = data.items;
      } else {
        player.items = this.itemsIniciales();
      }
      return this.storage.set('player', player).then(res => {
        return res;
      });
    }
  }

  anadirMonedas(monedas: number) {
    if (this.player) {
      this.player.monedas += monedas;
      this.events.publish('player:monedas_anadidas', { monedas: monedas });
    }
  }

  borrarMonedas(monedas: number) {
    return new Promise((response,error) => {
      if (monedas > 0 && this.player && this.player.monedas >= monedas) {
        this.player.monedas -= monedas;
        this.savePlayer();
        this.events.publish('player:monedas_borradas', { monedas: monedas });
        response(true);
      } else {
        response(false);
      }
    });
  }

  anadirMascota(id_avatar: string, xp: any, player?: any) {
    let avatarRef = this.configService.encontrarLuchador(id_avatar);
    if (avatarRef) {
      let mascota_nueva = new AvatarModel(this.configService);
      mascota_nueva = mascota_nueva.parse_reference(avatarRef,xp);
      if (player) {
        player.mascotas.push(mascota_nueva);
      } else {
        this.player.mascotas.push(mascota_nueva);
        this.savePlayer();
      }
      this.events.publish("player:nueva_mascota", { mascota: mascota_nueva });
    }
  }

  borrarMascota(id: any) {
    return new Promise((response,error) => {
      if (id > -1 && this.player.mascotas[id]) {
        this.player.mascotas.splice(id, 1);
        this.savePlayer();
        response(true);
      } else {
        response(false);
      }
    });
  }

  mascotasIniciales(player: any) {
    if (this.configService.config.jugador.mascotas_iniciales && this.configService.config.jugador.mascotas_iniciales.length > 0) {
      for (var i = 0; i < this.configService.config.jugador.mascotas_iniciales.length; i++) {
        var idx = this.configService.config.jugador.mascotas_iniciales[i];
        if (this.configService.luchadores[idx]) {
          this.anadirMascota(this.configService.luchadores[idx].id, this.configService.config.jugador.xp_mascotas_iniciales, player);
        }
      }
    }
  }

  itemsIniciales() {
    let items_iniciales = new Array<ItemModel> ();
    if (this.configService.config.jugador.items_iniciales && this.configService.config.jugador.items_iniciales.length > 0) {
      for (var i = 0; i < this.configService.config.jugador.items_iniciales.length; i++) {
        var idx = this.configService.config.jugador.items_iniciales[i].item;
        var cantidad = this.configService.config.jugador.items_iniciales[i].cantidad;
        if (this.configService.items[idx]) {
          let item_nuevo = new ItemModel();
          item_nuevo = item_nuevo.parse_reference(this.configService.items[idx],cantidad);
          items_iniciales.push(item_nuevo);
        }
      }
    }
    return items_iniciales;
  }

}
