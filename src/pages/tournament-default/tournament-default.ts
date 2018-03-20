import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, Events } from 'ionic-angular';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { StatsServiceProvider } from '../../providers/stats-service/stats-service';
import { BattleServiceProvider } from '../../providers/battle-service/battle-service';
import { MapServiceProvider } from '../../providers/map-service/map-service';
import { PlayerServiceProvider } from '../../providers/player-service/player-service';
import { ItemsServiceProvider } from '../../providers/items-service/items-service';
import { ToastServiceProvider } from '../../providers/toast-service/toast-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { WikidataServiceProvider } from '../../providers/wikidata-service/wikidata-service';
import { AvatarModel } from '../../models/avatar.model';

@IonicPage()
@Component({
  selector: 'page-tournament-default',
  templateUrl: 'tournament-default.html',
})
export class TournamentDefaultPage {
  torneo: any;
  wikidata: any;

  items: any;

  sin_items: boolean = false;

  private torneo_iniciado: boolean = false;
  private enemigos_derrotados: number = 0;
  private jefes_derrotados: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public toastService: ToastServiceProvider,
    public alertService: AlertServiceProvider,
    private statsService: StatsServiceProvider,
    public configService: ConfigServiceProvider,
    public battleService: BattleServiceProvider,
    public mapService: MapServiceProvider,
    public playerService: PlayerServiceProvider,
    public wikiService: WikidataServiceProvider,
    public itemsService: ItemsServiceProvider) {
      var _torneo = this.navParams.get('torneo');
      if (_torneo && _torneo['properties']['wikidata']) {
        wikiService.getWikidataInfo(_torneo.properties.wikidata).then(info => {
          this.wikidata = info;
          this.torneo = this.parsearTorneo(_torneo);
        });
      } else {
        this.torneo = this.parsearTorneo(_torneo);
      }
      itemsService.playerItemsSitio().then(data => {
        this.items = data;
      });
  }

  recogerItems() {
    var distancia = this.mapService.getDistanciaEnKilometros(this.mapService.coordenadas, this.torneo.coordenadas);
    if (distancia > this.configService.config.mapa.radio_interaccion) {
      this.toastService.push('Acércate para interactuar con el sitio');
    } else if (this.sin_items) {
      this.toastService.push('Inténtalo más tarde');
    } else {
      for (var i = 0; i < this.items.length; i++) {
        var _item = this.configService.encontrarItem(this.items[i].item);
        if (_item) {
          var _cantidad = this.items[i].cantidad;
          this.itemsService.playerAnadirItem(_item, _cantidad).then(res => {
            if (res) {
              this.toastService.push('+' + _cantidad + ' ' + _item.nombre);
            } else {
              this.toastService.push("No tienes espacio en el inventario");
            }
          });
        }
      }
      this.sin_items = true;
      if (this.configService.config.sitios.xp_recoger_items > 0) {
        this.playerService.addXp(this.configService.config.sitios.xp_recoger_items).then(_exp => {
          this.toastService.push('+' + _exp + ' XP ' + this.playerService.player.nombre);
        });
      }
      this.statsService.anadirEstadistica('torneos_visitados', 1, 'number');
      this.statsService.anadirEstadistica(this.torneo.id + '_torneos_visitados', 1, 'number');

      var este = this;
      setTimeout(function(){
        este.sin_items = false;
      }, 60 * 1000);

    }
  }

  dismiss() {
    this.playerService.ocupado = false;
    this.viewCtrl.dismiss();
  }

  parsearTorneo(torneo: any) {
    var _idx_torneo = parseInt(torneo.id.toString().split('').pop());
    if (_idx_torneo > this.configService.torneos.length) {
      _idx_torneo = parseInt((_idx_torneo/2).toString());

      if (_idx_torneo > this.configService.torneos.length) {
        _idx_torneo = parseInt((_idx_torneo/2).toString());
      }

      if (_idx_torneo > this.configService.torneos.length) {
        _idx_torneo = Math.floor(Math.random()*this.configService.torneos.length);
      }
    }
    var _ref_torneo = this.configService.torneos[0];
    if (this.configService.torneos[_idx_torneo]) {
      _ref_torneo = this.configService.torneos[_idx_torneo];
    }
    let _latlng = { lat: torneo._geometry.coordinates[1], lng: torneo._geometry.coordinates[0] };
    let _torneo = {
      id: torneo.id,
      nombre: torneo.properties.name,
      descripcion: "",
      coordenadas: _latlng,
      distancia: this.mapService.getDistanciaEnKilometros(_latlng, this.mapService.coordenadas),
      imagen: this.imagenMapa(_latlng),
      nivel: 1,
      puntos: 0,
      puntos_combate: 0,
      enemigos: this.parsearBots(_ref_torneo.enemigos, _ref_torneo.iv_enemigos),
      jefes: this.parsearBots(_ref_torneo.jefes, _ref_torneo.iv_jefes),
      recompensas: this.parsearRecompensas(_ref_torneo.recompensas)
    };
    _torneo.nivel = this.calcularNivelTorneo(_torneo);
    _torneo.puntos = this.calcularPuntosTorneo(_torneo);
    _torneo.puntos_combate = this.calcularPCTorneo(_torneo);
    console.log(_torneo);
    return _torneo;
  }

  imagenMapa(coordenadas: any) {
    return 'https://api.mapbox.com/styles/v1/' + this.configService.config.mapa.mapbox_estilo + '/static/'+ coordenadas.lng +','+ coordenadas.lat +',16,0.00,0.00/300x200@2x?access_token=' + this.configService.config.mapa.mapbox_access_token;
  }

  comenzarTorneo() {
    if (this.torneo_iniciado || !this.torneo){
      return false;
    }

    var _acreditaciones = this.playerService.player.items.find(function(x){
      return x.id === 'acreditacion-torneo';
    });

    if (!_acreditaciones) {
      let buttons = [
        {
          text: "Vale"
        },
        {
          text: "Ir a la tienda",
          handler: () => {
            let modal = this.modalCtrl.create('ShopPage', { player: this.playerService.player }, {
              enableBackdropDismiss: false
            });
            modal.present();
          }
        }
      ];
      this.alertService.push('Sin acreditación', 'No tienes acreditaciones para participar en el torneo. Puedes comprar acreditaciones en la tienda.', null, buttons, false);

    } else {
      let btns = [
        {
          text: "No",
          role: "cancel",
          handler: () => { }
        },
        {
          text: "Sí",
          handler: () => {
            this.itemsService.playerBorrarItem('acreditacion-torneo', 1).then(res => {
              if (res) {
                this.rutinaTorneo();
              } else {
                this.alertService.push('Error', 'Se ha producido un error. Vuelve a intentarlo.', null, ['Vale'], false);
              }
            });
          }
        }
      ];
      this.alertService.push('Participar en Torneo', 'Vas a participar en un torneo de nivel ' + this.torneo.nivel + '. Para ello tienes que usar una acreditación. ¿Quieres continuar?', null, btns, false);
    }
  }

  rutinaTorneo() {
    if (this.torneo.enemigos && this.torneo.enemigos[this.enemigos_derrotados]) {
      this.playerService.ocupado = true;
      this.torneo_iniciado = true;
      var _siguiente = -1;
      if (this.torneo.enemigos[this.enemigos_derrotados + 1]) {
        _siguiente = this.enemigos_derrotados + 1;
      }
      this.comenzarBatalla(this.torneo.enemigos[this.enemigos_derrotados].id_original, this.torneo.enemigos[this.enemigos_derrotados].xp, _siguiente);
    }
    if ((!this.torneo.enemigos || this.torneo.enemigos.length <= 0) && this.torneo.jefes && this.torneo.jefes.length > 0) {
      this.playerService.ocupado = true;
      this.torneo_iniciado = true;
      var _siguiente_jefe = -1;
      if (this.torneo.jefes[this.jefes_derrotados + 1]) {
        _siguiente_jefe = this.jefes_derrotados + 1;
      }
      this.comenzarBatallaJefe(this.torneo.jefes[this.jefes_derrotados].id_original, this.torneo.jefes[this.jefes_derrotados].xp, _siguiente_jefe);
    }
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
              this.torneoPerdido();
            } else {
              this.torneoPerdido();
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
              this.torneoPerdido();
            } else {
              this.torneoPerdido();
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
      _out = _out + this.textoGanancia(this.torneo.recompensas[i]);
    }

    this.statsService.anadirEstadistica('torneos_ganados', 1, 'number');

    let buttons = [
      {
        text: "Muy bien",
        handler: () => {
          this.cobrarGanancias();
          this.playerService.ocupado = false;
          this.events.publish('app:alerts_pendientes', { publicar: true });
          this.viewCtrl.dismiss();
        }
      }
    ];
    this.alertService.push('Has ganado el Torneo', 'Enhorabuena, has ganado el torneo. Estas son tus ganancias:', _out, buttons, false);
  }

  torneoPerdido() {
    this.torneo_iniciado = false;

    this.statsService.anadirEstadistica('torneos_perdidos', 1, 'number');

    this.alertService.push('Has perdido el Torneo', 'Alguno de tus luchadores ha perdido su combate. Vuelve a intentarlo más adelante.', null, ['Vale'], false);

    this.playerService.ocupado = false;
    this.events.publish('app:alerts_pendientes', { publicar: true });

  }

  textoGanancia(ganancia: any) {
    var out = "";
    if (ganancia.tipo == 'xp') {
      out = '<b>XP:</b> ' + this.playerService.modificar(ganancia.cantidad, "xp") + '<br>';
    } else if (ganancia.tipo == 'item' && ganancia['item']) {
      var _item = this.configService.encontrarItem(ganancia['item']);
      if (_item) {
        out = '<b>Objetos:</b> ' + ganancia.cantidad + ' ' + _item.nombre + '<br>';
      }
    } else {
      out = '<b>' + ganancia.tipo + ':</b> ' + ganancia.cantidad + '<br>';
    }
    return out;
  }

  cobrarGanancias() {
    for (var i = 0; i < this.torneo.recompensas.length; i++) {
      this.anadirGanacia(this.torneo.recompensas[i]);
    }
  }

  anadirGanacia(ganancia: any) {
    console.log(ganancia);
    if (ganancia.tipo == 'xp') {
      this.playerService.addXp(ganancia.cantidad).then(xp => {
        this.toastService.push('+' + xp + " XP");
      });
    } else if (ganancia.tipo == 'monedas') {
      this.playerService.anadirMonedas(ganancia.cantidad);
    } else if (ganancia.tipo == 'item' && ganancia['item']) {
      var _item = this.configService.encontrarItem(ganancia['item']);
      if (_item) {
        this.itemsService.playerAnadirItem(_item, ganancia.cantidad).then(res => {
          if (res) {
            this.toastService.push("+" + ganancia.cantidad + " " + _item.nombre);
          } else {
            this.toastService.push("No tienes espacio en el inventario");
          }
        });
      }
    }
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

  calcularPCTorneo(torneo: any) {
    var _result = 0;
    if (torneo && torneo['enemigos'] && torneo['enemigos'].length > 0) {
      for (var i = 0; i < torneo.enemigos.length; i++) {
        _result = _result + torneo.enemigos[i].puntos_poder;
      }
    }
    if (torneo && torneo['jefes'] && torneo['jefes'].length > 0) {
      for (var ii = 0; ii < torneo.jefes.length; ii++) {
        _result = _result + torneo.jefes[ii].puntos_poder;
      }
    }
    return _result;
  }

  parsearBots(bots: any, rango_iv: any) {
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
            mascota_nueva = mascota_nueva.parse_reference(avatarRef,xp,rango_iv);
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
              cantidad: parseInt(_recExp2[i][1])
            }
            _rec.push(_recompensa);
          } else {
            var _itemExp = _recExp2[i][1].split('=');
            if (_itemExp[0] && _itemExp[1]) {
              let _recompensa_item = {
                tipo: _recExp2[i][0],
                item: _itemExp[1],
                cantidad: parseInt(_itemExp[0])
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
    var _max = 35;
    var _current = this.torneo.nivel;
    return (_current / _max) * 100;
  }

  xpNivelText() {
    /*var _max = this.configService.xpAcumuladosNivel(35);
    var _current = this.torneo.puntos;

    return _current.toString() + '/' + _max.toString();*/
    return "P " + this.torneo.puntos_combate.toString();
  }

}
