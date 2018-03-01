import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { PlayerModel } from '../../models/player.model';
import { AvatarModel } from '../../models/avatar.model';
import { ConfigServiceProvider } from '../config-service/config-service';

@Injectable()
export class PlayerServiceProvider {

  public player: PlayerModel;

  constructor(private storage: Storage, private configService: ConfigServiceProvider) {
  }

  loadPlayer() {
    return this.storage.get('player').then(res => {
      if (res) {
        res = this.preparePlayer(res);
        this.player = res;
      }
      return res;
    });
  }

  preparePlayer(player: any) {
    let mascotas = new Array<AvatarModel>();
    for (var i = 0; i < player.mascotas.length; i++) {
      let mascota_nueva = new AvatarModel();
      mascota_nueva = mascota_nueva.parse(player.mascotas[i]);
      mascotas.push(mascota_nueva);
    }
    player.mascotas = mascotas;
    return player;
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
        if (this.configService.luchadores[i]) {
          let mascota_nueva = new AvatarModel();
          mascota_nueva.nombre = this.configService.luchadores[i].nombre;
          mascota_nueva.icono = this.configService.luchadores[i].icono;
          mascota_nueva.salud = this.configService.luchadores[i].salud;
          mascota_nueva.propiedades = { ataque: this.configService.luchadores[i].propiedades.ataque, defensa: this.configService.luchadores[i].propiedades.defensa };
          mascota_nueva.ataque = this.configService.luchadores[i].ataques[Math.floor(Math.random()*this.configService.luchadores[i].ataques.length)];
          mascota_nueva.especial = this.configService.luchadores[i].especiales[Math.floor(Math.random()*this.configService.luchadores[i].especiales.length)];
          mascota_nueva.nivel = 1;
          mascotas_iniciales.push(mascota_nueva);
        }
      }
    }

    return mascotas_iniciales;
  }

}
