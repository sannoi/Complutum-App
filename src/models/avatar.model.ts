export class AvatarModel {
  public nombre: string;
  public icono: string = 'assets/imgs/avatar_default.png';
  public nivel: number;
  public salud: number;
  public propiedades: { ataque: number, defensa: number  };
  public ataque: { nombre: string, puntos_dano: number, segundos_enfriamiento: number };
  public especial: { nombre: string, puntos_dano: number, segundos_enfriamiento: number };

  public parse(avatar: any) {
    let mascota_nueva = new AvatarModel();
    mascota_nueva.nombre = avatar.nombre;
    mascota_nueva.icono = avatar.icono;
    mascota_nueva.salud = avatar.salud;
    mascota_nueva.propiedades = { ataque: avatar.propiedades.ataque, defensa: avatar.propiedades.defensa };
    mascota_nueva.ataque = { nombre: avatar.ataque.nombre, puntos_dano: avatar.ataque.puntos_dano, segundos_enfriamiento: avatar.ataque.segundos_enfriamiento };
    mascota_nueva.especial = { nombre: avatar.especial.nombre, puntos_dano: avatar.especial.puntos_dano, segundos_enfriamiento: avatar.especial.segundos_enfriamiento };
    mascota_nueva.nivel = avatar.nivel;
    return mascota_nueva;
  }

  public parse_reference(avatar: any, nivel: number) {
    let mascota_nueva = new AvatarModel();
    mascota_nueva.nombre = avatar.nombre;
    mascota_nueva.icono = avatar.icono;
    mascota_nueva.salud = avatar.salud;
    mascota_nueva.propiedades = { ataque: avatar.propiedades.ataque, defensa: avatar.propiedades.defensa };
    mascota_nueva.ataque = avatar.ataques[Math.floor(Math.random()*avatar.ataques.length)];
    mascota_nueva.especial = avatar.especiales[Math.floor(Math.random()*avatar.especiales.length)];
    mascota_nueva.nivel = nivel;
    return mascota_nueva;
  }

  public propiedades_nivel() {
    let modifier = this.nivel / 30;
    return { salud: parseInt(parseInt(this.salud) * modifier) + 10, ataque: parseInt(parseInt(this.propiedades.ataque) * modifier), defensa: parseInt(parseInt(this.propiedades.defensa) * modifier) };
  }

  public puntos_poder() {
    var multiplier = 0.095 * Math.sqrt(parseInt(this.nivel) * 2);
    var bAtaque = 2 * parseInt(this.propiedades.ataque) * multiplier;
    var bDefensa = 2 * parseInt(this.propiedades.defensa) * multiplier;
    var bSalud = 2 * parseInt(this.salud) * multiplier;
    return Math.max(10, Math.floor( (Math.pow(bSalud, 0.5) * bAtaque * Math.pow(bDefensa, 0.5)) / 40));
  }
}
