import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ViewController } from 'ionic-angular';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { BattleServiceProvider } from '../../providers/battle-service/battle-service';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';
import { ToastServiceProvider } from '../../providers/toast-service/toast-service';
import { AvatarModel } from '../../models/avatar.model';

@IonicPage()
@Component({
  selector: 'page-tournament-default',
  templateUrl: 'tournament-default.html',
})
export class TournamentDefaultPage {
  torneo: any;
  luchadores: Array<AvatarModel>;
  enemigos: Array<AvatarModel>;
  jefes: Array<AvatarModel>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastService: ToastServiceProvider,
    public configService: ConfigServiceProvider,
    public battleService: BattleServiceProvider,
    public playerService: PlayerServiceProvider) {
      this.torneo = this.parsearTorneo(this.navParams.get('torneo'));
  }

  ionViewDidLoad() { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  parsearTorneo(torneo: any) {
    let _torneo = {
      nombre: torneo.titulo_formateado,
      descripcion: torneo.contenido_formateado,
      coordenadas: { lat: torneo.latitud, lng: torneo.longitud },
      distancia: torneo.distancia,
      imagen: torneo.imagenes.lg,
      nivel: 1,
      puntos: 0,
      enemigos: this.parsearBots(torneo.parametros.propiedades.bots),
      jefes: this.parsearBots(torneo.parametros.propiedades.jefes),
      recompensas: this.parsearRecompensas(torneo.parametros.propiedades.recompensas)
    };
    _torneo.nivel = this.calcularNivelTorneo(_torneo);
    _torneo.puntos = this.calcularPuntosTorneo(_torneo);
    console.log("Parsear Torneo", torneo, _torneo);
    return _torneo;
  }

  calcularNivelTorneo(torneo: any) {
    var _result = 0;
    var _cuenta = 0;
    if (torneo && torneo['enemigos'] && torneo['enemigos'].length > 0) {
      for (var i = 0; i < torneo.enemigos.length; i++) {
        _result = _result + torneo.enemigos[i].nivel;
        _cuenta++;
      }
    }
    if (torneo && torneo['jefes'] && torneo['jefes'].length > 0) {
      for (var ii = 0; ii < torneo.jefes.length; ii++) {
        _result = _result + torneo.jefes[ii].nivel;
        _cuenta++;
      }
    }
    return parseInt((_result / _cuenta).toString());
  }

  calcularPuntosTorneo(torneo: any) {
    var _result = 0;
    var _cuenta = 0;
    if (torneo && torneo['enemigos'] && torneo['enemigos'].length > 0) {
      for (var i = 0; i < torneo.enemigos.length; i++) {
        _result = _result + torneo.enemigos[i].xp;
        _cuenta++;
      }
    }
    if (torneo && torneo['jefes'] && torneo['jefes'].length > 0) {
      for (var ii = 0; ii < torneo.jefes.length; ii++) {
        _result = _result + torneo.jefes[ii].xp;
        _cuenta++;
      }
    }
    console.log(_result, _cuenta);
    return parseInt((_result / _cuenta).toString());
  }

  parsearBots(bots: any) {
    let _bots = new Array<AvatarModel>();
    var _botExp = bots.split(';');

    if (_botExp && _botExp.length > 0) {
      var _botExp2 = _botExp.map(function(x){
        return x.split(':');
      });
      for (var i = 0; i < _botExp2.length; i++) {
        if (_botExp2[i][0] && _botExp2[i][1]) {
          let avatarRef = this.configService.encontrarLuchador(_botExp2[i][0]);
          if (avatarRef) {
            var xp = this.configService.xpAcumuladosNivel(parseInt(_botExp2[i][1]) - 1);
            let mascota_nueva = new AvatarModel(this.configService);
            mascota_nueva = mascota_nueva.parse_reference(avatarRef,xp);
            _bots.push(mascota_nueva);
          }
        }
      }
    }

    return _bots;
  }

  parsearRecompensas(recompensas: any) {
    let _rec = new Array<any>();
    var _recExp = recompensas.split(';');

    if (_recExp && _recExp.length > 0) {
      var _recExp2 = _recExp.map(function(x){
        return x.split(':');
      });
      for (var i = 0; i < _recExp2.length; i++) {
        if (_recExp2[i][0] && _recExp2[i][1]) {
          if (_recExp2[i][0] != 'item') {
            let _recompensa = {
              tipo: _recExp2[i][0],
              cantidad: _recExp2[i][1]
            }
            _rec.push(_recompensa);
          } else {
            var _itemExp = _recExp2[i][1].split('=');
            if (_itemExp[0] && _itemExp[1]) {
              let _recompensa_item = {
                tipo: _recExp2[i][0],
                item: _itemExp[1],
                cantidad: _itemExp[0]
              }
              _rec.push(_recompensa_item);
            }
          }
        }
      }
    }

    return _rec;
  }

  xpTorneo() {
    var _max = this.configService.xpAcumuladosNivel(29);
    var _current = this.torneo.puntos;
    return (_current / _max) * 100;
  }

  xpNivelText() {
    var _max = this.configService.xpAcumuladosNivel(29);
    var _current = this.torneo.puntos;

    return _current.toString() + '/' + _max.toString();
  }

}
