import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events, Platform } from 'ionic-angular';
import { PlayerModel } from '../../models/player.model';
import { AvatarModel } from '../../models/avatar.model';
import { ItemModel } from '../../models/item.model';
import { ConfigServiceProvider } from '../config-service/config-service';
import { StatsServiceProvider } from '../stats-service/stats-service';
import * as moment from 'moment';

@Injectable()
export class PlayerServiceProvider {

  public player: PlayerModel;

  private modificadores: Array<any>;

  constructor(private storage: Storage, public platform: Platform, public events: Events, private configService: ConfigServiceProvider, private statsService: StatsServiceProvider) {
    this.modificadores = new Array<any>();

    this.platform.ready().then(() => {
      this.iniciarModificadores();
    });
  }

  iniciarModificadores() {
    this.loadPlayer().then(res => {
      if (res && res.modificadores_activos && res.modificadores_activos.length > 0) {
        for (var i = 0; i < res.modificadores_activos.length; i++) {
          this.nuevoModificador(res.modificadores_activos[i], i);
        }
      }
    });
  }

  public addXp(xp:number) {
    if (this.player) {
      var _xp = this.modificar(xp, "xp");
      this.player.xp += _xp;
      let nivel_actual = this.player.nivel;
      let nivel_calculado = this.configService.nivelXp(this.player.xp);
      if (nivel_calculado > nivel_actual) {
        console.log(this.player.nombre + " ha subido del nivel " + nivel_actual + " al nivel " + nivel_calculado);
        this.player.nivel = nivel_calculado;
        return this.savePlayer().then(res => {
          this.events.publish('player:nivel_conseguido', { player: this.player, nivel: nivel_calculado });
          return _xp;
        });
      }
      return new Promise((response,error) => {
        response(_xp);
      });
    }
    return new Promise((response,error) => {
      response(false);
    });
  }

  public avatarAddXp(xp:number, avatar: AvatarModel, idx_avatar: number) {
    var _xp = this.modificar(xp, "xp");
    avatar.xp += _xp;
    let nivel_actual = avatar.nivel;
    let nivel_calculado = this.configService.nivelXp(avatar.xp);
    if (nivel_calculado > nivel_actual) {
      console.log(avatar.nombre + " ha subido del nivel " + nivel_actual + " al nivel " + nivel_calculado);
      avatar.nivel = nivel_calculado;
      avatar.salud_actual = avatar.propiedades_nivel.salud;
      avatar.recalcular_nuevo_nivel();
      this.events.publish('avatar:nivel_conseguido', { avatar: avatar, nivel: nivel_calculado });
    }
    this.player.mascotas[idx_avatar] = avatar;

    return new Promise((response,error) => {
      response(_xp);
    });
  }

  public modificar(valor: any, tipo: string) {
    var _val = valor;
    if (tipo === "xp") {
      if (this.configService.config.juego.modificadores.xp_multiplicador > 0) {
        _val = _val * this.configService.config.juego.modificadores.xp_multiplicador;
      }
      var _mods = this.modificadores.filter(function(x){
        return x.item.tipo == "modificador" && x.item.propiedades['xp'];
      });
      for (var i = 0; i < _mods.length; i++) {
        var _m = _mods[i];
        if (_m.item.propiedades.xp.substr(0,1) == "x") {
          var _multiplier = parseInt(_m.item.propiedades.xp.substr(1));
          _val = _val * _multiplier;
        }
      }
    }
    return _val;
  }

  getPlayer() {
    if (!this.player) {
      return this.loadPlayer();
    } else {
      return new Promise((resolve, reject) => {
        resolve(this.player);
      });
    }
  }

  loadPlayer() {
    return this.storage.get('player').then(res => {
      if (res) {
        let player_nuevo = new PlayerModel(this.configService);
        res = player_nuevo.parse(res);
        this.player = res;
      }
      return res;
    });
  }

  savePlayer() {
    return this.storage.set('player', this.player).then(res => {
      return res;
    });
  }

  setPlayer(player: PlayerModel) {
    this.player = player;
  }

  newPlayer(data: any) {
    let player = new PlayerModel(this.configService);
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
      } else if (this.configService.config.jugador.xp_inicial > 0) {
        player.xp = this.configService.config.jugador.xp_inicial;
      } else {
        player.xp = 0;
      }
      if (data.nivel) {
        player.nivel = data.nivel;
      } else {
        player.nivel = this.configService.nivelXp(player.xp);
      }
      if (data.monedas) {
        player.monedas = data.monedas;
      } else if (this.configService.config.jugador.monedas_iniciales > 0) {
        player.monedas = this.configService.config.jugador.monedas_iniciales;
      } else {
        player.monedas = 0;
      }
      if (data.mascotas) {
        player.mascotas = data.mascotas;
      } else {
        player.mascotas = new Array<AvatarModel>();
        this.mascotasIniciales(player);
      }
      if (data.mascota_seleccionada_idx) {
        player.mascota_seleccionada_idx = data.mascota_seleccionada_idx;
      } else {
        player.mascota_seleccionada_idx = 0;
      }
      if (data.items) {
        player.items = data.items;
      } else {
        player.items = this.itemsIniciales();
      }
      if (data.trampas_activas) {
        player.trampas_activas = data.trampas_activas;
      } else {
        player.trampas_activas = new Array<any>();
      }
      if (data.modificadores_activos) {
        player.modificadores_activos = data.modificadores_activos;
      } else {
        player.modificadores_activos = new Array<any>();
      }
      return this.storage.set('player', player).then(res => {
        return res;
      });
    }
  }

  anadirMonedas(monedas: number) {
    if (this.player) {
      this.player.monedas = this.player.monedas + monedas;
      this.statsService.anadirEstadistica('monedas_conseguidas', monedas, 'number');
      this.events.publish('player:monedas_anadidas', { monedas: monedas });
    }
  }

  borrarMonedas(monedas: number) {
    return new Promise((response,error) => {
      if (monedas > 0 && this.player && this.player.monedas >= monedas) {
        this.player.monedas -= monedas;
        this.savePlayer();
        this.statsService.anadirEstadistica('monedas_gastadas', monedas, 'number');
        this.events.publish('player:monedas_borradas', { monedas: monedas });
        response(true);
      } else {
        response(false);
      }
    });
  }

  anadirMascota(id_avatar: string, xp: any, player?: any, xp_player?: any) {
    let avatarRef = this.configService.encontrarLuchador(id_avatar);
    if (avatarRef) {
      let mascota_nueva = new AvatarModel(this.configService);
      mascota_nueva = mascota_nueva.parse_reference(avatarRef,xp);
      if (player) {
        player.mascotas.push(mascota_nueva);
      } else {
        this.player.mascotas.push(mascota_nueva);
        this.savePlayer();
      }
      mascota_nueva.anadirEstadistica('fecha_captura', moment().format(), 'date');
      this.statsService.anadirEstadistica('mascotas_conseguidas', 1, 'number');
      this.statsService.anadirEstadistica(id_avatar + '_mascotas_conseguidas', 1, 'number');
      this.events.publish("player:nueva_mascota", { mascota: mascota_nueva, xp_player: xp_player });
    }
  }

  borrarMascota(id: any) {
    return new Promise((response,error) => {
      if (id > -1 && this.player.mascotas[id]) {
        var _id_mascota = this.player.mascotas[id].id_original;
        this.events.publish("player:despedir_mascota", { mascota: this.player.mascotas[id] });
        this.player.mascotas.splice(id, 1);
        this.savePlayer();
        this.statsService.anadirEstadistica('mascotas_despedidas', 1, 'number');
        this.statsService.anadirEstadistica(_id_mascota + '_mascotas_despedidas', 1, 'number');
        response(true);
      } else {
        response(false);
      }
    });
  }

  plantarTrampa(trampa: any, coordenadas: any, entorno: any) {
    var este = this;
    var avatares = this.configService.luchadores.filter(function(x) {
      var tipo_obj = este.configService.encontrarTipo(x.tipo);
      var some_terreno = true;
      if (trampa.propiedades.influye.indexOf('terreno') > -1) {
        if (tipo_obj.terreno && tipo_obj.terreno.length > 0) {
          some_terreno = tipo_obj.terreno.some(function(y) {
            return entorno.terreno.indexOf(y) > -1;
          });
        }
      }
      var some_meteo = true;
      if (trampa.propiedades.influye.indexOf('meteo') > -1) {
        if (tipo_obj.meteo && tipo_obj.meteo.length > 0) {
          some_meteo = tipo_obj.meteo.some(function(y) {
            return entorno.meteo_id === y;
          });
        }
      }
      var cumple_rareza = (x.rareza >= trampa.propiedades.rareza_minima && x.rareza <= trampa.propiedades.rareza_maxima) ? true : false;
      return (some_terreno && some_meteo && cumple_rareza);
    });
    if (avatares && avatares.length > 0) {
      var avatar = avatares[Math.floor(Math.random() * avatares.length)];
      let trampa_plantada = {
        obj: trampa,
        fecha: moment().format(),
        coordenadas: coordenadas,
        entorno: entorno,
        avatar: avatar,
        tiempo_restante: 999,
        multiplicador_tiempo: this.configService.config.juego.modificadores.tiempo_trampas_multiplicador
      };
      this.player.trampas_activas.push(trampa_plantada);
      this.statsService.anadirEstadistica('trampas_plantadas', 1, 'number');
      this.statsService.anadirEstadistica(trampa.id + '__trampas_plantadas', 1, 'number');
      this.events.publish("player:trampa_plantada", { trampa: trampa_plantada });

      return new Promise((response, error) => {
        response(trampa_plantada);
      });
    }

    return new Promise((response, error) => {
      response(false);
    });
  }

  anadirModificador(modificador: any) {
    if (modificador && modificador.item && modificador.fecha) {
      return this.nuevoModificador(modificador).then(mod => {
        this.statsService.anadirEstadistica('modificadores_usados', 1, 'number');
        this.statsService.anadirEstadistica(modificador.item.id + '_mod_usado', 1, 'number');
        this.events.publish("player:modificador_anadido", { modificador: modificador });
        return modificador;
      });
    }

    return new Promise((response, error) => {
      response(false);
    });
  }

  nuevoModificador(modificador: any, idx_mod_player?: any) {
    if (modificador && modificador.id && modificador.item && modificador.tiempo_restante) {
      var _fecha_expiracion = moment(modificador.fecha).add(modificador.item.propiedades.tiempo, "seconds");
      var _fecha_actual = moment();

      var _timeout = parseInt(_fecha_expiracion.format('X')) - parseInt(_fecha_actual.format('X'));

      if (_timeout > 0) {
        var este = this;
        var _exp = parseInt(moment(modificador.fecha).add(modificador.item.propiedades.tiempo, "seconds").format('X'));
        var _act = parseInt(moment().format('X'));
        modificador.tiempo_restante=_exp - _act;
        this.modificadores.push(modificador);

        var cuentas_mod = setInterval(function() {
          var _mod = este.modificadores.find(function(x) {
            return x.id === modificador.id;
          });
          var _idx_mod = este.modificadores.indexOf(_mod);
          if (_idx_mod > -1) {
            if (idx_mod_player == undefined) {
              var _mod_player = este.player.modificadores_activos.find(function(x) {
                return x.id === modificador.id;
              });
              idx_mod_player = este.player.modificadores_activos.indexOf(_mod_player);
            }
            este.modificadores[_idx_mod].tiempo_restante -= 1;
            este.player.modificadores_activos = este.modificadores;
            if (este.modificadores[_idx_mod].tiempo_restante <= 0) {
              clearInterval(cuentas_mod);
              //counter ended, do something here
              return;
            }
          }
        }, 1000);

        setTimeout(function() {
          //este.anadirRecompensaTrampa(trampa);
          este.borrarModificador(modificador.id).then(res => {
            este.borrarModificadorPlayer(modificador.id).then(result => {
              console.log("Modificador expirado");
            });
          });
        }, _timeout * 1000);

        return new Promise((response, error)=>{
          response(modificador);
        });

      } else {
        //this.anadirRecompensaTrampa(trampa);
        this.borrarModificadorPlayer(modificador.id, true).then(result => {
          console.log("Modificador expirado");
        });
      }
    }

    return new Promise((response, error)=>{
      response(false);
    });
  }

  borrarModificadorPlayer(id: any, force?: boolean) {
    this.player.modificadores_activos = this.modificadores;
    if (force) {
      return this.savePlayer();
    } else {
      return new Promise((response, error) => {
        response(true);
      });
    }
  }

  borrarModificador(id: any) {
    return new Promise((response, error)=> {
      var _mod = this.modificadores.find(function(x) {
        return x.id === id;
      });
      var _idx = this.modificadores.indexOf(_mod);
      if (_idx > -1) {
        this.modificadores.splice(_idx, 1);
        response(true);
      }
      response(false);
    });
  }

  mascotasIniciales(player: any) {
    if (this.configService.config.jugador.mascotas_iniciales && this.configService.config.jugador.mascotas_iniciales.length > 0) {
      for (var i = 0; i < this.configService.config.jugador.mascotas_iniciales.length; i++) {
        var idx = this.configService.config.jugador.mascotas_iniciales[i];
        if (this.configService.luchadores[idx]) {
          this.anadirMascota(this.configService.luchadores[idx].id, this.configService.config.jugador.xp_mascotas_iniciales, player);
        }
      }
    }
  }

  itemsIniciales() {
    let items_iniciales = new Array<ItemModel> ();
    if (this.configService.config.jugador.items_iniciales && this.configService.config.jugador.items_iniciales.length > 0) {
      for (var i = 0; i < this.configService.config.jugador.items_iniciales.length; i++) {
        var idx = this.configService.config.jugador.items_iniciales[i].item;
        var cantidad = this.configService.config.jugador.items_iniciales[i].cantidad;
        if (this.configService.items[idx]) {
          let item_nuevo = new ItemModel();
          item_nuevo = item_nuevo.parse_reference(this.configService.items[idx],cantidad);
          items_iniciales.push(item_nuevo);
          this.statsService.anadirEstadistica('items_conseguidos', cantidad, 'number');
          this.statsService.anadirEstadistica(item_nuevo.id + '_items_conseguidos', cantidad, 'number');
        }
      }
    }
    return items_iniciales;
  }

}
