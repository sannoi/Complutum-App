export let luchadores = [
  {
    id: 'bulbassaur',
    nombre: 'Bulbassaur',
    icono: '/assets/imgs/avatar_default.jpg',
    salud: 90,
    propiedades: {
      ataque: 118,
      defensa: 118
    },
    ataques: [
      { nombre: 'Mirada Cuqui', puntos_dano: 10, segundos_enfriamiento: 3 },
      { nombre: 'Culo en Pompa', puntos_dano: 5, segundos_enfriamiento: 1.2 }
    ],
    especiales: [
      { nombre: 'Pucheritos', puntos_dano: 80, segundos_enfriamiento: 17 },
      { nombre: 'Ira Animal', puntos_dano: 150, segundos_enfriamiento: 36 }
    ]
  },
  {
    id: 'charmander',
    nombre: 'Charmander',
    icono: '/assets/imgs/avatar_default.jpg',
    salud: 90,
    propiedades: {
      ataque: 118,
      defensa: 118
    },
    ataques: [
      { nombre: 'Fogonazo', puntos_dano: 10, segundos_enfriamiento: 3 },
      { nombre: 'Ascuas', puntos_dano: 6, segundos_enfriamiento: 1.6 }
    ],
    especiales: [
      { nombre: 'Erupción Volcánica', puntos_dano: 80, segundos_enfriamiento: 12 },
      { nombre: 'Lluvia de Fuego', puntos_dano: 150, segundos_enfriamiento: 30 }
    ]
  }
];
