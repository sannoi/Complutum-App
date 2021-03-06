import { ConfigServiceProvider } from '../providers/config-service/config-service';

export class AvatarModel {
  public id: string;
  public id_original: string;
  public nombre: string;
  public icono: string = 'assets/imgs/avatar_default.png';
  public tipo: any;
  public rareza: any;
  public xp: number;
  public nivel: number;
  public salud: number;
  public salud_actual: number;
  public energia: number = 0;
  public puntos_poder: number;
  public propiedades: { ataque: number, defensa: number  };
  public propiedades_nivel: { ataque: number, defensa: number, salud: number };
  public propiedades_unicas: { ataque: number, defensa: number, salud: number };
  public ataque: { nombre: string, icono: string, tipo: any, puntos_dano: number, segundos_enfriamiento: number, incremento_energia: number };
  public especial: { nombre: string, icono: string, tipo: any, puntos_dano: number, segundos_enfriamiento: number, gasto_energia: number };
  public estadisticas: Array<any>;
  public fecha?: string;
  public id_marker?: any;

  //private configService: ConfigServiceProvider;

  constructor(private configService: ConfigServiceProvider) {
  }

  public parse(avatar: any) {
    let mascota_nueva = new AvatarModel(this.configService);
    mascota_nueva.id = avatar.id;
    mascota_nueva.id_original = avatar.id_original;
    mascota_nueva.nombre = avatar.nombre;
    mascota_nueva.icono = avatar.icono;
    mascota_nueva.tipo = avatar.tipo;
    mascota_nueva.rareza = avatar.rareza;
    mascota_nueva.xp = avatar.xp;
    mascota_nueva.salud = avatar.salud;
    mascota_nueva.propiedades = { ataque: avatar.propiedades.ataque, defensa: avatar.propiedades.defensa };
    mascota_nueva.propiedades_unicas = { ataque: avatar.propiedades_unicas.ataque, defensa: avatar.propiedades_unicas.defensa, salud: avatar.propiedades_unicas.salud };
    mascota_nueva.ataque = this.configService.encontrarAtaque(avatar.ataque.id,'debil');
    mascota_nueva.especial = this.configService.encontrarAtaque(avatar.especial.id,'fuerte');
    mascota_nueva.nivel = this.configService.nivelXp(avatar.xp);
    mascota_nueva.salud_actual = avatar.salud_actual;
    mascota_nueva.energia = avatar.energia;
    mascota_nueva.estadisticas = avatar.estadisticas;
    if (avatar.fecha) {
      mascota_nueva.fecha = avatar.fecha;
    } else {
      mascota_nueva.fecha = this.getDateTime();
    }
    mascota_nueva.propiedades_nivel = mascota_nueva.calc_propiedades_nivel();
    mascota_nueva.puntos_poder = mascota_nueva.calc_puntos_poder();
    return mascota_nueva;
  }

  public parse_reference(avatar: any, xp: number, rango_iv?: any) {
    let mascota_nueva = new AvatarModel(this.configService);
    mascota_nueva.id = this.generateId();
    mascota_nueva.id_original = avatar.id;
    mascota_nueva.nombre = avatar.nombre;
    mascota_nueva.icono = avatar.icono;
    mascota_nueva.tipo = this.configService.encontrarTipo(avatar.tipo);
    mascota_nueva.rareza = avatar.rareza;
    mascota_nueva.xp = xp;
    mascota_nueva.salud = avatar.salud;
    mascota_nueva.propiedades = { ataque: avatar.propiedades.ataque, defensa: avatar.propiedades.defensa };
    mascota_nueva.propiedades_unicas = this.generarPropiedadesUnicas(rango_iv);
    var _ataque_id = avatar.ataques[Math.floor(Math.random()*avatar.ataques.length)];
    mascota_nueva.ataque = this.configService.encontrarAtaque(_ataque_id,'debil');
    var _especial_id = avatar.especiales[Math.floor(Math.random()*avatar.especiales.length)];
    mascota_nueva.especial = this.configService.encontrarAtaque(_especial_id,'fuerte');
    mascota_nueva.nivel = this.configService.nivelXp(xp);
    mascota_nueva.energia = 0;
    mascota_nueva.estadisticas = new Array<any> ();
    mascota_nueva.fecha = this.getDateTime();
    mascota_nueva.propiedades_nivel = mascota_nueva.calc_propiedades_nivel();
    mascota_nueva.puntos_poder = mascota_nueva.calc_puntos_poder();
    mascota_nueva.salud_actual = mascota_nueva.propiedades_nivel.salud;
    return mascota_nueva;
  }

  generarPropiedadesUnicas(rango_iv?: any) {
    if (rango_iv && rango_iv['min'] && rango_iv['max']) {
      var _ataque = this.getRandomInt(rango_iv.min.ataque, rango_iv.max.ataque);
      var _defensa = this.getRandomInt(rango_iv.min.defensa, rango_iv.max.defensa);
      var _salud = this.getRandomInt(rango_iv.min.salud, rango_iv.max.salud);
      return { ataque: _ataque, defensa: _defensa, salud: _salud };
    } else {
      return { ataque: Math.floor(Math.random()*16), defensa: Math.floor(Math.random()*16), salud: Math.floor(Math.random()*16) };
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public recalcular_nuevo_nivel() {
    this.propiedades_nivel = this.calc_propiedades_nivel();
    this.puntos_poder = this.calc_puntos_poder();
  }

  public calc_propiedades_nivel() {
    let modifier = parseFloat((this.nivel / 30).toString());
    return { salud: parseInt(((this.salud + this.propiedades_unicas.salud) * modifier).toString()) + 10, ataque: parseInt(((this.propiedades.ataque + this.propiedades_unicas.ataque) * modifier).toString()), defensa: parseInt(((this.propiedades.defensa + this.propiedades_unicas.defensa) * modifier).toString()) };
  }

  public calc_puntos_poder() {
    var multiplier = 0.095 * Math.sqrt(parseInt(this.nivel.toString()) * 2);
    var bAtaque = 2 * parseInt((this.propiedades.ataque + this.propiedades_unicas.ataque).toString()) * multiplier;
    var bDefensa = 2 * parseInt((this.propiedades.defensa + this.propiedades_unicas.defensa).toString()) * multiplier;
    var bSalud = 2 * parseInt((this.salud + this.propiedades_unicas.salud).toString()) * multiplier;
    return Math.max(10, Math.floor( (Math.pow(bSalud, 0.5) * bAtaque * Math.pow(bDefensa, 0.5)) / 40));
  }

  public anadirEstadistica(clave: string, valor: any, tipo?: string) {
    if (!tipo) {
      tipo = 'number';
    }
    var _stat = this.estadisticas.find(function(x){
      return x.clave === clave;
    });
    if (_stat) {
      // La estadistica existe
      var _idx = this.estadisticas.indexOf(_stat);
      if (_idx > -1) {
        if (tipo == 'number') {
          this.estadisticas[_idx].valor = this.estadisticas[_idx].valor + valor;
        } else {
          this.estadisticas[_idx].valor = valor;
        }
      }
    } else {
      // La estadistica no existe
      let _new_stat = {
        clave: clave,
        valor: valor,
        tipo: tipo
      };
      this.estadisticas.push(_new_stat);
    }
  }

  public recuperarEstadistica(clave: string) {
    var _stat = this.estadisticas.find(function(x){
      return x.clave === clave;
    });
    return _stat;
  }

  generateId() {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 8)).toUpperCase();
  }

  getDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = (now.getMonth() + 1).toString();
    var day = now.getDate().toString();
    var hour = now.getHours().toString();
    var minute = now.getMinutes().toString();
    var second = now.getSeconds().toString();
    if (month.toString().length == 1) {
      month = '0' + month;
    }
    if (day.toString().length == 1) {
      day = '0' + day;
    }
    if (hour.toString().length == 1) {
      hour = '0' + hour;
    }
    if (minute.toString().length == 1) {
      minute = '0' + minute;
    }
    if (second.toString().length == 1) {
      second = '0' + second;
    }
    var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
    return dateTime;
  }
}
