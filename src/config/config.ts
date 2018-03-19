import * as AppNiveles from './niveles';

export let config = {
  juego: {
    nombre: 'Complutum',
    online: false,
    url_base: 'https://web.mideas.es/mideas_devel',
    url_realtime: '/api/mplay/usuario/usuariosCercanos.json',
    url_statics: '/api/mplay/usuario/atracciones.json',
    url_info_entorno: '/api/mplay/usuario/infoEntorno.json',
    modificadores: {
      xp_multiplicador: 1,
      tiempo_trampas_multiplicador: 1
    }
  },
  jugador: {
    avatares: [
      { icono: 'assets/imgs/avatares/marty.png', nombre: 'Marty McFly' },
      { icono: 'assets/imgs/avatares/chuck_norris.jpg', nombre: 'Chuck Norris' },
      { icono: 'assets/imgs/avatares/indy.jpg', nombre: 'Indiana Jones' },
      { icono: 'assets/imgs/avatares/bruce_lee.jpg', nombre: 'Bruce Lee' },
      { icono: 'assets/imgs/avatares/leia.jpg', nombre: 'Leia' },
      { icono: 'assets/imgs/avatares/wonder.jpg', nombre: 'Wonder Woman' },
      { icono: 'assets/imgs/avatares/tormenta.jpg', nombre: 'Tormenta' },
      { icono: 'assets/imgs/avatares/curie.jpg', nombre: 'Marie Curie' }
    ],
    xp_inicial: 25,
    monedas_iniciales: 125,
    xp_mascotas_iniciales: 1750,
    iv_mascotas_iniciales: {
      min: {
        ataque: 10,
        defensa: 10,
        salud: 10
      },
      max: {
        ataque: 15,
        defensa: 15,
        salud: 15
      }
    },
    mascotas_iniciales: ['mew'],
    items_iniciales: [
      { item: 'medicina-sm', cantidad: 20 },
      { item: 'camara-fotos', cantidad: 1 },
      { item: 'trampa-sm', cantidad: 5 },
      { item: 'trampa-md', cantidad: 2 },
      { item: 'baya-suerte', cantidad: 3 },
      { item: 'acreditacion-torneo', cantidad: 3 }
    ],
    niveles_xp: AppNiveles.niveles,
    inventario: {
      max_items: 200
    },
    mascota_nueva: {
      nivel_maximo: 20
    },
    modificadores: {
      max_activos: 1
    }
  },
  avatares: {
    imagen_desconocido: 'assets/imgs/fighters/unknown.png',
    energia_maxima: 100,
    xp_nuevo_enemigo_derrotado: 500,
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
    zoom: {
      inicial: 19,
      minimo: 12,
      maximo: 22
    },
    perspectiva: {
      inclinacion: 60,
      rotacion: 0
    },
    edificios: {
      activo: true,
      zoom_minimo: 16,
      color: '#dddbd7',
      opacidad: 0.4
    },
    config_gps: {
      frequency: 3000,
      timeout: 50000,
      enableHighAccuracy: true
    },
    iconos: {
      sitio: 'assets/imgs/places/sitio.png',
      torneo: 'assets/imgs/places/torneo.png'
    },
    limite_velocidad: 65,
    tiempo_refresco_entorno: 30,
    tiempo_aparicion_enemigos: 15,
    porcentaje_ningun_enemigo: 33,
    tiempo_desaparicion_enemigos: 45,
    radio_vision: 2.5,
    radio_interaccion: 0.05
  },
  sitios: {
    items_disponibles: [
      { item: 'medicina-sm', cantidad: 1, rareza: 80 },
      { item: 'medicina-md', cantidad: 1, rareza: 60 },
      { item: 'medicina-xl', cantidad: 1, rareza: 30 },
      { item: 'medicina-xxl', cantidad: 1, rareza: 10 },
      { item: 'trampa-sm', cantidad: 1, rareza: 40 },
      { item: 'trampa-md', cantidad: 1, rareza: 20 },
      { item: 'trampa-xl', cantidad: 1, rareza: 5 },
      { item: 'trampa-xxl', cantidad: 1, rareza: 1 }
    ],
    cantidad_recoger_items: 3,
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
    nivel: '#488aff',
    danger: '#ff0000'
  }
};
