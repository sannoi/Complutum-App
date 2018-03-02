import { Injectable } from '@angular/core';
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'
import { AvatarModel } from '../../models/avatar.model'

@Injectable()
export class BattleServiceProvider {

  constructor() {
  }

  public calcularDano(atacante: AvatarModel, defensor: AvatarModel, esEspecial: boolean) {
    var bonus = 1;
		var efectivity = 1;
		var perc_ataque = this.randomFloatFromInterval(0.5,1);
    var atacante_fuerza = atacante.propiedades.ataque;
    var atacante_ataque = atacante.ataque.puntos_dano;
    var defensor_defensa = defensor.propiedades.defensa;
    if (esEspecial) {
      atacante_ataque = atacante.especial.puntos_dano;
    }

    var puntosDanoCalculado = Math.floor( 0.5 * atacante_ataque * ((0.4 * atacante.nivel * atacante_fuerza) / (0.4 * defensor.nivel * defensor_defensa)) * bonus *  efectivity * perc_ataque) + 1;

    return parseInt(puntosDanoCalculado.toString());
  }

  randomFloatFromInterval(min,max)
  {
      return Math.random() * (max - min) + min;
  }

}
