export class AvatarModel {
  public nombre: string;
  public nivel: number;
  public salud: number;
  public propiedades: { ataque: number, defensa: number  };
  public ataque: { nombre: string, puntos_dano: number, segundos_enfriamiento: number };
}
