import { ConfigServiceProvider } from '../providers/config-service/config-service';
import { AvatarModel } from './avatar.model';
import { ItemModel } from './item.model';

export class PlayerModel {
  public nombre: string;
  public icono: string = 'assets/imgs/player_default.png';
  public equipo: any;
  public xp: number;
  public nivel: number;
  public monedas: number;
  public mascotas: Array<AvatarModel>;
  public mascota_seleccionada_idx: number;
  public items: Array<ItemModel>;
  public trampas_activas: Array<any>;
  public modificadores_activos: Array<any>;

  //private configService: ConfigServiceProvider;

  constructor(private configService: ConfigServiceProvider) {
  }

  public parse(player: any) {
    let player_nuevo = new PlayerModel(this.configService);
    player_nuevo.nombre = player.nombre;
    player_nuevo.icono = player.icono;
    player_nuevo.equipo = player.equipo;
    player_nuevo.xp = player.xp;
    player_nuevo.monedas = player.monedas;
    player_nuevo.nivel = this.configService.nivelXp(player.xp);
    player_nuevo.mascota_seleccionada_idx = player.mascota_seleccionada_idx;
    let mascotas = new Array<AvatarModel>();
    for (var i = 0; i < player.mascotas.length; i++) {
      let mascota_nueva = new AvatarModel(this.configService);
      mascota_nueva = mascota_nueva.parse(player.mascotas[i]);
      mascotas.push(mascota_nueva);
    }
    player_nuevo.mascotas = mascotas;
    let items = new Array<ItemModel>();
    for (var z = 0; z < player.items.length; z++) {
      let item_nuevo = new ItemModel();
      item_nuevo = item_nuevo.parse(player.items[z]);
      items.push(item_nuevo);
    }
    player_nuevo.trampas_activas = player.trampas_activas;
    player_nuevo.modificadores_activos = player.modificadores_activos;
    player_nuevo.items = items;
    return player_nuevo;
  }
}
