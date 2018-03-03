export let config = {
  juego: {
    nombre: 'Complutum',
    url_base: 'https://web.mideas.es/mideas_devel',
    url_realtime: '/api/sitios/sitio/realtime.json',
    url_info_entorno: '/api/mplay/usuario/infoEntorno.json'
  },
  jugador: {
    xp_mascotas_iniciales: 260,
    mascotas_iniciales: [2,5,8,9,10,11],
    items_iniciales: [
      { item: 0, cantidad: 5 },
      { item: 1, cantidad: 10 }
    ],
    niveles_xp: [
      { id: 1, xp_necesaria: 250 },
      { id: 2, xp_necesaria: 500 },
      { id: 3, xp_necesaria: 1000 },
      { id: 4, xp_necesaria: 2000 },
      { id: 5, xp_necesaria: 4000 }
    ],
    inventario: {
      max_items: 200
    }
  },
  avatares: {
    energia_maxima: 100
  },
  mapa: {
    radio_vision: 1.2,
    radio_interaccion: 0.2
  },
  batalla: {
    tiempo_batalla: 90,
    xp_avatar_gana: 100,
    xp_avatar_pierde: 10,
    xp_avatar_tiempo_agotado: 0,
    xp_player_gana: 25,
    xp_player_pierde: 5,
    xp_player_tiempo_agotado: 0
  },
  colores: {
    salud: '#32db64',
    energia: '#488aff'
  }
};
