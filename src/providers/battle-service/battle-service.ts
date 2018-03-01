import { Injectable } from '@angular/core';
import { AvatarModel } from '../../models/avatar.model'

@Injectable()
export class BattleServiceProvider {

  constructor() {
  }

  public calcularDano(atacante: AvatarModel, defensor: AvatarModel, esEspecial: boolean) {
    var bonus = 1;
		var efectivity = 1;
		var perc_ataque = this.randomIntFromInterval(0.5,1);
    var atacante_fuerza = atacante.propiedades.ataque;
    var atacante_ataque = atacante.ataque.puntos_dano;
    var defensor_defensa = defensor.propiedades.defensa;
    if (esEspecial) {
      atacante_ataque = atacante.especial.puntos_dano;
    }

    console.log(perc_ataque + " " + bonus + " " + efectivity + " " + atacante.nivel + " " + atacante_fuerza + " " + atacante_ataque + " " + defensor_defensa);

    var puntosDanoCalculado = Math.floor( 0.5 * atacante_ataque * ((0.01 * atacante.nivel * atacante_fuerza) / (0.01 * defensor.nivel * defensor_defensa)) * bonus *  efectivity * perc_ataque) + 1;

    return parseInt(puntosDanoCalculado.toString());
  }

  randomIntFromInterval(min,max)
  {
      return Math.random() * (max - min) + min;
  }

}
