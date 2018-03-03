import { ConfigServiceProvider } from '../providers/config-service/config-service';

export class AvatarModel {
  public nombre: string;
  public icono: string = 'assets/imgs/avatar_default.png';
  public xp: number;
  public nivel: number;
  public salud: number;
  public salud_actual: number;
  public energia: number = 0;
  public propiedades: { ataque: number, defensa: number  };
  public ataque: { nombre: string, puntos_dano: number, segundos_enfriamiento: number, incremento_energia: number };
  public especial: { nombre: string, puntos_dano: number, segundos_enfriamiento: number, gasto_energia: number };

  private configService: ConfigServiceProvider;

  constructor() {
      this.configService = new ConfigServiceProvider();
  }

  public parse(avatar: any) {
    let mascota_nueva = new AvatarModel();
    mascota_nueva.nombre = avatar.nombre;
    mascota_nueva.icono = avatar.icono;
    mascota_nueva.xp = avatar.xp;
    mascota_nueva.salud = avatar.salud;
    mascota_nueva.propiedades = { ataque: avatar.propiedades.ataque, defensa: avatar.propiedades.defensa };
    mascota_nueva.ataque = { nombre: avatar.ataque.nombre, puntos_dano: avatar.ataque.puntos_dano, segundos_enfriamiento: avatar.ataque.segundos_enfriamiento, incremento_energia: avatar.ataque.incremento_energia };
    mascota_nueva.especial = { nombre: avatar.especial.nombre, puntos_dano: avatar.especial.puntos_dano, segundos_enfriamiento: avatar.especial.segundos_enfriamiento, gasto_energia: avatar.especial.gasto_energia };
    mascota_nueva.nivel = this.configService.nivelXp(avatar.xp);
    mascota_nueva.salud_actual = avatar.salud_actual;
    mascota_nueva.energia = avatar.energia;
    return mascota_nueva;
  }

  public parse_reference(avatar: any, xp: number) {
    let mascota_nueva = new AvatarModel();
    mascota_nueva.nombre = avatar.nombre;
    mascota_nueva.icono = avatar.icono;
    mascota_nueva.xp = xp;
    mascota_nueva.salud = avatar.salud;
    mascota_nueva.propiedades = { ataque: avatar.propiedades.ataque, defensa: avatar.propiedades.defensa };
    mascota_nueva.ataque = avatar.ataques[Math.floor(Math.random()*avatar.ataques.length)];
    mascota_nueva.especial = avatar.especiales[Math.floor(Math.random()*avatar.especiales.length)];
    mascota_nueva.nivel = this.configService.nivelXp(xp);
    mascota_nueva.salud_actual = mascota_nueva.propiedades_nivel().salud;
    mascota_nueva.energia = 0;
    return mascota_nueva;
  }

  public propiedades_nivel() {
    let modifier = parseFloat((this.nivel / 30).toString());
    return { salud: parseInt((this.salud * modifier).toString()) + 10, ataque: parseInt((this.propiedades.ataque * modifier).toString()), defensa: parseInt((this.propiedades.defensa * modifier).toString()) };
  }

  public puntos_poder() {
    var multiplier = 0.095 * Math.sqrt(parseInt(this.nivel.toString()) * 2);
    var bAtaque = 2 * parseInt(this.propiedades.ataque.toString()) * multiplier;
    var bDefensa = 2 * parseInt(this.propiedades.defensa.toString()) * multiplier;
    var bSalud = 2 * parseInt(this.salud.toString()) * multiplier;
    return Math.max(10, Math.floor( (Math.pow(bSalud, 0.5) * bAtaque * Math.pow(bDefensa, 0.5)) / 40));
  }
}
