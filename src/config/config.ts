export let config = {
  juego: {
    nombre: 'Complutum',
    url_base: 'https://web.mideas.es/mideas_devel',
    url_realtime: '/api/mplay/usuario/usuariosCercanos.json',
    url_info_entorno: '/api/mplay/usuario/infoEntorno.json'
  },
  jugador: {
    xp_inicial: 0,
    xp_mascotas_iniciales: 1500,
    mascotas_iniciales: [9],
    items_iniciales: [
      { item: 0, cantidad: 15 },
      { item: 1, cantidad: 10 },
      { item: 2, cantidad: 1 }
    ],
    niveles_xp: [
      { id: 1, xp_necesaria: 1000 },
      { id: 2, xp_necesaria: 2000 },
      { id: 3, xp_necesaria: 3000 },
      { id: 4, xp_necesaria: 4000 },
      { id: 5, xp_necesaria: 5000 },
      { id: 6, xp_necesaria: 6000 },
      { id: 7, xp_necesaria: 7000 },
      { id: 8, xp_necesaria: 8000 },
      { id: 9, xp_necesaria: 9000 },
      { id: 10, xp_necesaria: 10000 },
      { id: 11, xp_necesaria: 10000 },
      { id: 12, xp_necesaria: 10000 },
      { id: 13, xp_necesaria: 10000 },
      { id: 14, xp_necesaria: 15000 },
      { id: 15, xp_necesaria: 20000 },
      { id: 16, xp_necesaria: 20000 },
      { id: 17, xp_necesaria: 20000 },
      { id: 18, xp_necesaria: 25000 },
      { id: 19, xp_necesaria: 25000 },
      { id: 20, xp_necesaria: 50000 },
      { id: 21, xp_necesaria: 75000 },
      { id: 22, xp_necesaria: 100000 },
      { id: 23, xp_necesaria: 125000 },
      { id: 24, xp_necesaria: 150000 },
      { id: 25, xp_necesaria: 190000 },
      { id: 26, xp_necesaria: 200000 },
      { id: 27, xp_necesaria: 250000 },
      { id: 28, xp_necesaria: 300000 },
      { id: 29, xp_necesaria: 350000 },
      { id: 30, xp_necesaria: 500000 }
    ],
    inventario: {
      max_items: 200
    }
  },
  avatares: {
    energia_maxima: 100
  },
  mapa: {
    localizacion_defecto: { lat: 40.5, lng: -3.2 },
    tiempo_aparicion_enemigos: 15,
    tiempo_desaparicion_enemigos: 45,
    radio_vision: 0.8,
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
