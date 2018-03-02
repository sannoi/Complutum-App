import { AvatarModel } from './avatar.model';

export class PlayerModel {
  public nombre: string;
  public icono: string = 'assets/imgs/player_default.png';
  public xp: number;
  public nivel: number;
  public mascotas: Array<AvatarModel>;
  public mascota_seleccionada_idx: number;
}
