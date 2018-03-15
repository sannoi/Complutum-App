import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ViewController } from 'ionic-angular';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { StatsServiceProvider } from '../../providers/stats-service/stats-service';
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
  jefes: Array<AvatarModel>;

  private torneo_iniciado: boolean = false;
  private enemigos_derrotados: number = 0;
  private jefes_derrotados: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastService: ToastServiceProvider,
    private statsService: StatsServiceProvider,
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
    return _torneo;
  }

  comenzarTorneo() {
    if (this.torneo_iniciado || !this.torneo){
      return false;
    }

    if (this.torneo.enemigos && this.torneo.enemigos[this.enemigos_derrotados]) {
      this.torneo_iniciado = true;
      var _siguiente = -1;
      if (this.torneo.enemigos[this.enemigos_derrotados + 1]) {
        _siguiente = this.enemigos_derrotados + 1;
      }
      this.comenzarBatalla(this.torneo.enemigos[this.enemigos_derrotados].id_original, this.torneo.enemigos[this.enemigos_derrotados].xp, _siguiente);
    }

    console.log('Comenzar torneo', this.torneo);
  }

  comenzarBatalla(luchadorId: any, luchadorXp: number, siguienteEnemigoIdx?: number) {
    let enemigoRef = this.configService.encontrarLuchador(luchadorId);
    if (enemigoRef) {
      let enemigo = new AvatarModel(this.configService);
      enemigo = enemigo.parse_reference(enemigoRef, luchadorXp);
      let modal = this.modalCtrl.create('BattleDefaultPage', { enemigo: enemigo }, {
        enableBackdropDismiss: false
      });
      modal.present();
      return new Promise((response, error) => {
        return modal.onDidDismiss(data => {
          if (data && data['resultado'] && data['luchador']) {
            var _luchador = this.playerService.player.mascotas.find(function(x){
              return x.id === data['luchador'].id;
            });
            var _idx_luchador = this.playerService.player.mascotas.indexOf(_luchador);
            if (data['resultado'] == 'ganador') {
              if (_idx_luchador > -1) {
                this.playerService.player.mascotas[_idx_luchador].anadirEstadistica('batallas_ganadas', 1, 'number');
                this.playerService.savePlayer();
              }
              this.statsService.anadirEstadistica('batallas_ganadas', 1, 'number');
              this.statsService.anadirEstadistica(data['enemigo']['id_original'] + '_derrotados', 1, 'number');
              this.enemigos_derrotados++;
              if (siguienteEnemigoIdx > -1 && this.torneo.enemigos[siguienteEnemigoIdx]) {
                var _siguiente = -1;
                if (this.torneo.enemigos[siguienteEnemigoIdx + 1]) {
                  _siguiente = siguienteEnemigoIdx + 1;
                }
                this.comenzarBatalla(this.torneo.enemigos[siguienteEnemigoIdx].id_original, this.torneo.enemigos[siguienteEnemigoIdx].xp, _siguiente);
              } else if (this.torneo.enemigos.length == this.enemigos_derrotados) {
                if (this.torneo.jefes && this.torneo.jefes.length > 0) {
                  var _siguiente_jefe = -1;
                  if (this.torneo.jefes[this.jefes_derrotados + 1]) {
                    _siguiente_jefe = this.jefes_derrotados + 1;
                  }
                  this.comenzarBatallaJefe(this.torneo.jefes[this.jefes_derrotados].id_original, this.torneo.jefes[this.jefes_derrotados].xp, _siguiente_jefe);
                } else {
                  this.torneoGanado();
                }
              }
            } else if (data['resultado'] == 'perdedor') {
              if (_idx_luchador > -1) {
                this.playerService.player.mascotas[_idx_luchador].anadirEstadistica('batallas_perdidas', 1, 'number');
                this.playerService.savePlayer();
              }
              this.statsService.anadirEstadistica('batallas_perdidas', 1, 'number');
            }
          }
          response(data);
        });
      });
    }

    return new Promise((response, error) => {
      response(false);
    });
  }

  comenzarBatallaJefe(luchadorId: any, luchadorXp: number, siguienteJefeIdx?: number) {
    let enemigoRef = this.configService.encontrarLuchador(luchadorId);
    if (enemigoRef) {
      let enemigo = new AvatarModel(this.configService);
      enemigo = enemigo.parse_reference(enemigoRef, luchadorXp);
      let modal = this.modalCtrl.create('BattleDefaultPage', { enemigo: enemigo }, {
        enableBackdropDismiss: false
      });
      modal.present();
      return new Promise((response, error) => {
        return modal.onDidDismiss(data => {
          if (data && data['resultado'] && data['luchador']) {
            var _luchador = this.playerService.player.mascotas.find(function(x){
              return x.id === data['luchador'].id;
            });
            var _idx_luchador = this.playerService.player.mascotas.indexOf(_luchador);
            if (data['resultado'] == 'ganador') {
              if (_idx_luchador > -1) {
                this.playerService.player.mascotas[_idx_luchador].anadirEstadistica('batallas_ganadas', 1, 'number');
                this.playerService.player.mascotas[_idx_luchador].anadirEstadistica('batallas_ganadas_jefes_torneos', 1, 'number');
                this.playerService.savePlayer();
              }
              this.statsService.anadirEstadistica('batallas_ganadas', 1, 'number');
              this.statsService.anadirEstadistica('batallas_ganadas_jefes_torneos', 1, 'number');
              this.statsService.anadirEstadistica(data['enemigo']['id_original'] + '_derrotados', 1, 'number');
              this.jefes_derrotados++;
              if (siguienteJefeIdx > -1 && this.torneo.jefes[siguienteJefeIdx]) {
                var _siguiente = -1;
                if (this.torneo.jefes[siguienteJefeIdx + 1]) {
                  _siguiente = siguienteJefeIdx + 1;
                }
                this.comenzarBatallaJefe(this.torneo.jefes[siguienteJefeIdx].id_original, this.torneo.jefes[siguienteJefeIdx].xp, _siguiente);
              } else if (this.torneo.jefes.length == this.jefes_derrotados) {
                this.torneoGanado();
              }
            } else if (data['resultado'] == 'perdedor') {
              if (_idx_luchador > -1) {
                this.playerService.player.mascotas[_idx_luchador].anadirEstadistica('batallas_perdidas', 1, 'number');
                this.playerService.savePlayer();
              }
              this.statsService.anadirEstadistica('batallas_perdidas', 1, 'number');
            }
          }
          response(data);
        });
      });
    }

    return new Promise((response, error) => {
      response(false);
    });
  }

  torneoGanado() {
    this.torneo_iniciado = false;

    var _out = "";

    for (var i = 0; i < this.torneo.recompensas.length; i++) {
      _out = _out + this.anadirGanacia(this.torneo.recompensas[i]) + "<br>";
    }

    let alert = this.alertCtrl.create({
      title: "Has ganado el torneo",
      subtitle: "Enhorabuena, has ganado el torneo. Estas son tus ganancias:",
      message: _out,
      buttons: ["Muy bien"]
    });
    alert.present();

    console.log('Torneo ganado', this.torneo.recompensas);
  }

  anadirGanacia(ganancia: any) {
    return ganancia.tipo + " / " + ganancia.cantidad;
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
