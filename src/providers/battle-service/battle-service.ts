import { Injectable } from '@angular/core';
import { AvatarModel } from '../../models/avatar.model'

@Injectable()
export class BattleServiceProvider {

  constructor() {
  }

  public calcularDano(atacante: AvatarModel, defensor: AvatarModel) {
    var bonus = 1;
		var efectivity = 1;
		var perc_ataque = this.randomIntFromInterval(0.5,1);

    console.log(perc_ataque + " " + bonus + " " + efectivity + " " + atacante.nivel + " " + atacante.propiedades.ataque + " " + atacante.ataque.puntos_dano + " " + defensor.propiedades.defensa);

    var puntosDanoCalculado = Math.floor( 0.5 * atacante.ataque.puntos_dano * (/*(0.01 * atacante.nivel) * */atacante.propiedades.ataque / /*(0.01 * defensor.nivel) * */defensor.propiedades.defensa) * bonus *  efectivity * perc_ataque) + 1;

		//var puntosDanoCalculado = 0.01 * bonus * efectivity * perc_ataque * ( ( ((0.2 * atacante.nivel + 1) * atacante.propiedades.ataque * atacante.ataque.puntos_dano) / ( 25 * defensor.propiedades.defensa ) ) + 2 );

    return parseInt(puntosDanoCalculado);
  }

  randomIntFromInterval(min,max)
  {
      return Math.random() * (max - min) + min;
  }

}
