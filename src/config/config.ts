import * as AppNiveles from './niveles';

export let config = {
  juego: {
    nombre: 'Complutum',
    online: false,
    url_base: 'https://web.mideas.es/mideas_devel',
    url_realtime: '/api/mplay/usuario/usuariosCercanos.json',
    url_statics: '/api/sitios/sitio/realtime.json',
    url_info_entorno: '/api/mplay/usuario/infoEntorno.json',
    modificadores: {
      xp_multiplicador: 4,
      tiempo_trampas_multiplicador: 0.01
    }
  },
  jugador: {
    xp_inicial: 0,
    monedas_iniciales: 15,
    xp_mascotas_iniciales: 1750,
    mascotas_iniciales: [9],
    items_iniciales: [
      { item: 0, cantidad: 30 },
      { item: 1, cantidad: 20 },
      { item: 2, cantidad: 15 },
      { item: 3, cantidad: 5 },
      { item: 4, cantidad: 1 },
      { item: 5, cantidad: 10 },
      { item: 6, cantidad: 5 },
      { item: 7, cantidad: 2 },
      { item: 8, cantidad: 1 },
      { item: 9, cantidad: 3 }
    ],
    niveles_xp: AppNiveles.niveles,
    inventario: {
      max_items: 200
    },
    mascota_nueva: {
      nivel_maximo: 20
    }
  },
  avatares: {
    energia_maxima: 100,
    xp_nueva_mascota: 250,
    despedir_mascota: {
      xp: 25,
      monedas: 15
    }
  },
  mapa: {
    mapbox_access_token: 'pk.eyJ1Ijoic2Fubm9pIiwiYSI6ImNpeTgwcnBmeTAwMXgycXI3bTA5ZHZ0MjIifQ.4_oblhduvDc6UKdrdioMMQ',
    mapbox_estilo: 'mapbox/streets-v10',
    localizacion_defecto: { lat: 40.5, lng: -3.2 },
    tiempo_refresco_entorno: 30,
    tiempo_aparicion_enemigos: 15,
    tiempo_desaparicion_enemigos: 45,
    radio_vision: 1.2,
    radio_interaccion: 0.05
  },
  sitios: {
    xp_recoger_items: 150
  },
  batalla: {
    tiempo_batalla: 90,
    xp_avatar_gana: 475,
    xp_avatar_pierde: 125,
    xp_avatar_tiempo_agotado: 10,
    xp_player_gana: 125,
    xp_player_pierde: 35,
    xp_player_tiempo_agotado: 5,
    monedas_gana: 5,
    monedas_pierde: 1,
    monedas_tiempo_agotado: 0
  },
  colores: {
    salud: '#32db64',
    energia: '#488aff',
    nivel: '#488aff'
  }
};
