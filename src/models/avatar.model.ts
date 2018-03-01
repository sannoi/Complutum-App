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

  public propiedades_nivel() {
    let modifier = this.nivel / 100;
    return { salud: parseInt(parseInt(this.salud) * modifier) + 10, ataque: parseInt(parseInt(this.propiedades.ataque) * modifier), defensa: parseInt(parseInt(this.propiedades.defensa) * modifier) };
  }
}
