import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { PlayerModel } from '../../models/player.model';
import { AvatarModel } from '../../models/avatar.model';
import { ConfigServiceProvider } from '../config-service/config-service';

@Injectable()
export class PlayerServiceProvider {

  public player: PlayerModel;

  constructor(private storage: Storage, public events: Events, private configService: ConfigServiceProvider) {
  }

  public addXp(xp:number) {
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

  public avatarAddXp(xp:number, avatar: AvatarModel) {
    avatar.xp += xp;
    let nivel_actual = avatar.nivel;
    let nivel_calculado = this.configService.nivelXp(avatar.xp);
    if (nivel_calculado > nivel_actual) {
      console.log(avatar.nombre + " ha subido del nivel " + nivel_actual + " al nivel " + nivel_calculado);
      avatar.nivel = nivel_calculado;
      this.events.publish('avatar:nivel_conseguido', { avatar: avatar, nivel: nivel_calculado });
    }

    return avatar;
  }

  loadPlayer() {
    return this.storage.get('player').then(res => {
      if (res) {
        let player_nuevo = new PlayerModel();
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
    let player = new PlayerModel();
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
      } else {
        player.xp = 0;
      }
      if (data.nivel) {
        player.nivel = data.nivel;
      } else {
        player.nivel = 1;
      }
      if (data.mascotas) {
        player.mascotas = data.mascotas;
      } else {
        player.mascotas = this.mascotasIniciales();
      }
      if (data.mascota_seleccionada_idx) {
        player.mascota_seleccionada_idx = data.mascota_seleccionada_idx;
      } else {
        player.mascota_seleccionada_idx = 0;
      }
      return this.storage.set('player', player).then(res => {
        return res;
      });
    }
  }

  mascotasIniciales() {
    let mascotas_iniciales = new Array<AvatarModel> ();
    if (this.configService.config.jugador.mascotas_iniciales && this.configService.config.jugador.mascotas_iniciales.length > 0) {
      for (var i = 0; i < this.configService.config.jugador.mascotas_iniciales.length; i++) {
        var idx = this.configService.config.jugador.mascotas_iniciales[i];
        if (this.configService.luchadores[idx]) {
          let mascota_nueva = new AvatarModel();
          mascota_nueva = mascota_nueva.parse_reference(this.configService.luchadores[idx],this.configService.config.jugador.xp_mascotas_iniciales);
          mascotas_iniciales.push(mascota_nueva);
        }
      }
    }
    return mascotas_iniciales;
  }

}
