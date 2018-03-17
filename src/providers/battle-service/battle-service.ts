import { Injectable } from '@angular/core';
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'
import { AvatarModel } from '../../models/avatar.model'
import { ConfigServiceProvider } from '../config-service/config-service';

@Injectable()
export class BattleServiceProvider {

  constructor(private configService: ConfigServiceProvider) {
  }

  public calcularDano(atacante: AvatarModel, defensor: AvatarModel, esEspecial: boolean) {
    var bonus = 1;
		var efectivity = this.calcularEfectividad(atacante, defensor, esEspecial);
		var perc_ataque = this.randomFloatFromInterval(0.75,1);
    var atacante_fuerza = (atacante.propiedades.ataque + atacante.propiedades_unicas.ataque);
    var atacante_ataque = atacante.ataque.puntos_dano;
    var defensor_defensa = (defensor.propiedades.defensa + defensor.propiedades_unicas.defensa);
    if (esEspecial) {
      atacante_ataque = atacante.especial.puntos_dano;
    }

    var puntosDanoCalculado = Math.floor( 0.5 * atacante_ataque * ((0.4 * atacante.nivel * atacante_fuerza) / (0.4 * defensor.nivel * defensor_defensa)) * bonus *  efectivity * perc_ataque) + 1;

    if (!esEspecial) {
      console.log("Efectividad ataque " + atacante.ataque.nombre + " de " + atacante.nombre + ": " + efectivity + " - Daño: " + puntosDanoCalculado);
    } else {
      console.log("Efectividad ataque " + atacante.especial.nombre + " de " + atacante.nombre + ": " + efectivity + " - Daño: " + puntosDanoCalculado);
    }

    return parseInt(puntosDanoCalculado.toString());
  }

  calcularEfectividad(atacante: AvatarModel, defensor: AvatarModel, esEspecial: boolean) {
    var tipo_atacante = atacante.tipo;
    var tipo_defensor = defensor.tipo;
    var tipo_ataque_atacante = atacante.ataque.tipo;
    if (esEspecial) {
      tipo_ataque_atacante = atacante.especial.tipo;
    }
    var efectividad = 1;
    if (tipo_atacante.eficaz.indexOf(tipo_defensor.id) > -1) {
      efectividad *= 1.56;
    }
    if (tipo_atacante.no_eficaz.indexOf(tipo_defensor.id) > -1) {
      efectividad *= 0.64;
    }
    if (tipo_ataque_atacante && tipo_ataque_atacante.eficaz && tipo_ataque_atacante.eficaz.indexOf(tipo_defensor.id) > -1) {
      efectividad *= 1.56;
    }
    if (tipo_ataque_atacante && tipo_ataque_atacante.no_eficaz && tipo_ataque_atacante.no_eficaz.indexOf(tipo_defensor.id) > -1) {
      efectividad *= 0.64;
    }

    return efectividad;
  }

  tipoEfectividad(atacante: AvatarModel, defensor: AvatarModel, esEspecial: boolean) {
    var eficaces = 0;
    var no_eficaces = 0;
    var tipo_atacante = atacante.tipo;
    var tipo_defensor = defensor.tipo;
    var tipo_ataque_atacante = atacante.ataque.tipo;
    if (esEspecial) {
      tipo_ataque_atacante = atacante.especial.tipo;
    }
    if (tipo_atacante.eficaz.indexOf(tipo_defensor.id) > -1) {
      eficaces++;
    }
    if (tipo_atacante.no_eficaz.indexOf(tipo_defensor.id) > -1) {
      no_eficaces++;
    }
    if (tipo_ataque_atacante && tipo_ataque_atacante.eficaz && tipo_ataque_atacante.eficaz.indexOf(tipo_defensor.id) > -1) {
      eficaces++;
    }
    if (tipo_ataque_atacante && tipo_ataque_atacante.no_eficaz && tipo_ataque_atacante.no_eficaz.indexOf(tipo_defensor.id) > -1) {
      no_eficaces++;
    }

    return eficaces - no_eficaces;
  }

  randomFloatFromInterval(min,max)
  {
      return Math.random() * (max - min) + min;
  }

}
