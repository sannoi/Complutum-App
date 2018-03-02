export let config = {
  juego: {
    nombre: 'Complutum'
  },
  jugador: {
    nivel_mascotas_iniciales: 1,
    mascotas_iniciales: [0,1,2,3,4,5],
    niveles_xp: [
      { id: 1, xp_necesaria: 1000 },
      { id: 2, xp_necesaria: 2000 },
      { id: 3, xp_necesaria: 3000 },
      { id: 4, xp_necesaria: 4000 },
      { id: 5, xp_necesaria: 5000 }
    ]
  },
  avatares: {
    energia_maxima: 100
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
