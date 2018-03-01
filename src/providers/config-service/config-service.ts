import { Injectable } from '@angular/core';
import * as AppConfig from '../../config/config';
import * as AppLuchadores from '../../config/luchadores';

@Injectable()
export class ConfigServiceProvider {

  public config: any;
  public luchadores: any;

  constructor() {
    this.config = AppConfig.config;
    this.luchadores = AppLuchadores.luchadores;
  }

}
