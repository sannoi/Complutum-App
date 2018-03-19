import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { StatsServiceProvider } from '../../providers/stats-service/stats-service';

@IonicPage()
@Component({
  selector: 'page-fighters-db-list',
  templateUrl: 'fighters-db-list.html',
})
export class FightersDbListPage {

  luchadores: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertService: AlertServiceProvider,
    public configService: ConfigServiceProvider,
    public statsService: StatsServiceProvider) {
      this.luchadores = configService.luchadores;
  }

  detallesLuchador(luchador: any) {
    if (luchador && luchador['id']) {
      var _stat = this.statsService.recuperarEstadistica(luchador['id'] + '_derrotados');
      if (_stat) {
        var _tipo = this.configService.encontrarTipo(luchador.tipo);
        var _extra = '<div align="center"><span class="label-bs label-' + _tipo.id + '">' + _tipo.nombre + '</span></div>';
        this.alertService.push(luchador['nombre'], '<div align="center"><img src="' + luchador['icono'] + '"></div>' + _extra + '<h6 align="center">Derrotados: ' + _stat.valor + '</h6>', null, ['Vale'], false);
      }
    }
  }

  descubierto(luchador: any) {
    if (luchador && luchador['id']) {
      var _stat = this.statsService.recuperarEstadistica(luchador['id'] + '_derrotados');
      if (_stat) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  contar() {
    var _c = 0;
    for (var i = 0; i < this.luchadores.length; i++) {
      if (this.descubierto(this.luchadores[i])) {
        _c++;
      }
    }
    return _c;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
