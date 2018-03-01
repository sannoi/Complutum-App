export class AvatarModel {
  public nombre: string;
  public icono: string = 'assets/imgs/avatar_default.png';
  public nivel: number;
  public salud: number;
  public propiedades: { ataque: number, defensa: number  };
  public ataque: { nombre: string, puntos_dano: number, segundos_enfriamiento: number };
  public especial: { nombre: string, puntos_dano: number, segundos_enfriamiento: number };

  public propiedades_nivel() {
    let modifier = this.nivel / 100;
    return { salud: parseInt(this.salud * modifier) + 10, ataque: parseInt(this.propiedades.ataque * modifier), defensa: parseInt(this.propiedades.defensa * modifier) };
  }
}
