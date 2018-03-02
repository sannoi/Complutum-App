import { ConfigServiceProvider } from '../providers/config-service/config-service';
import { AvatarModel } from './avatar.model';

export class PlayerModel {
  public nombre: string;
  public icono: string = 'assets/imgs/player_default.png';
  public xp: number;
  public nivel: number;
  public mascotas: Array<AvatarModel>;
  public mascota_seleccionada_idx: number;

  private configService: ConfigServiceProvider;

  constructor() {
      this.configService = new ConfigServiceProvider();
  }

  public parse(player: any) {
    let player_nuevo = new PlayerModel();
    player_nuevo.nombre = player.nombre;
    player_nuevo.icono = player.icono;
    player_nuevo.xp = player.xp;
    player_nuevo.nivel = this.configService.nivelXp(player.xp);
    player_nuevo.mascota_seleccionada_idx = player.mascota_seleccionada_idx;
    let mascotas = new Array<AvatarModel>();
    for (var i = 0; i < player.mascotas.length; i++) {
      let mascota_nueva = new AvatarModel();
      mascota_nueva = mascota_nueva.parse(player.mascotas[i]);
      mascotas.push(mascota_nueva);
    }
    player_nuevo.mascotas = mascotas;
    return player_nuevo;
  }
}
