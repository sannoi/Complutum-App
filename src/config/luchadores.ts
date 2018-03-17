export let luchadores = [
  {
    id: 'bulbasaur',
    nombre: 'Bulbassaur',
    icono: 'assets/imgs/fighters/pokemon_icon_001_00.png',
    tipo: 'planta',
    rareza: 80,
    salud: 90,
    propiedades: {
      ataque: 118,
      defensa: 118
    },
    ataques: ['mirada_cuqui','culo_pompa'],
    especiales: ['pucheritos','ira_animal']
  },
  {
    id: 'ivysaur',
    nombre: 'Ivysaur',
    icono: 'assets/imgs/fighters/pokemon_icon_002_00.png',
    tipo: 'planta',
    rareza: 50,
    salud: 120,
    propiedades: {
      ataque: 151,
      defensa: 151
    },
    ataques: ['mirada_cuqui','culo_pompa'],
    especiales: ['rayo_solar','lluvia_esporas']
  },
  {
    id: 'venusaur',
    nombre: 'Venusaur',
    icono: 'assets/imgs/fighters/pokemon_icon_003_00.png',
    tipo: 'planta',
    rareza: 30,
    salud: 160,
    propiedades: {
      ataque: 198,
      defensa: 198
    },
    ataques: ['mirada_cuqui','culo_pompa'],
    especiales: ['rayo_solar','lluvia_esporas']
  },
  {
    id: 'charmander',
    nombre: 'Charmander',
    icono: 'assets/imgs/fighters/pokemon_icon_004_00.png',
    tipo: 'fuego',
    rareza: 80,
    salud: 78,
    propiedades: {
      ataque: 116,
      defensa: 96
    },
    ataques: ['fogonazo','ascuas'],
    especiales: ['erupcion_volcanica','lluvia_fuego']
  },
  {
    id: 'charmeleon',
    nombre: 'Charmeleon',
    icono: 'assets/imgs/fighters/pokemon_icon_005_00.png',
    tipo: 'fuego',
    rareza: 40,
    salud: 116,
    propiedades: {
      ataque: 158,
      defensa: 129
    },
    ataques: ['fogonazo','ascuas'],
    especiales: ['erupcion_volcanica','lluvia_fuego']
  },
  {
    id: 'charizard',
    nombre: 'Charizard',
    icono: 'assets/imgs/fighters/pokemon_icon_006_00.png',
    tipo: 'fuego',
    rareza: 25,
    salud: 156,
    propiedades: {
      ataque: 223,
      defensa: 176
    },
    ataques: ['fogonazo','ascuas'],
    especiales: ['erupcion_volcanica','lluvia_fuego']
  },
  {
    id: 'squirtle',
    nombre: 'Squirtle',
    icono: 'assets/imgs/fighters/pokemon_icon_007_00.png',
    tipo: 'agua',
    rareza: 80,
    salud: 88,
    propiedades: {
      ataque: 94,
      defensa: 122
    },
    ataques: ['pistola_agua','mordisquito'],
    especiales: ['hidro_bomba','golpe_helado']
  },
  {
    id: 'wartortle',
    nombre: 'Wartortle',
    icono: 'assets/imgs/fighters/pokemon_icon_008_00.png',
    tipo: 'agua',
    rareza: 50,
    salud: 118,
    propiedades: {
      ataque: 126,
      defensa: 155
    },
    ataques: ['pistola_agua','mordisquito'],
    especiales: ['hidro_bomba','golpe_helado']
  },
  {
    id: 'blastoise',
    nombre: 'Blastoise',
    icono: 'assets/imgs/fighters/pokemon_icon_009_00.png',
    tipo: 'agua',
    rareza: 25,
    salud: 158,
    propiedades: {
      ataque: 171,
      defensa: 210
    },
    ataques: ['pistola_agua','mordisquito'],
    especiales: ['hidro_bomba','golpe_helado']
  },
  {
    id: 'raichu',
    nombre: 'Raichu',
    icono: 'assets/imgs/fighters/pokemon_icon_026_00.png',
    tipo: 'electrico',
    rareza: 45,
    salud: 120,
    propiedades: {
      ataque: 193,
      defensa: 165
    },
    ataques: ['chispa','voltiazo'],
    especiales: ['carga_total','puno_trueno'],
    items_despedir: [ { id: "medicina-xxl", cantidad: 1 } ]
  },
  {
    id: 'nidoqueen',
    nombre: 'Nidoqueen',
    icono: 'assets/imgs/fighters/pokemon_icon_031_00.png',
    tipo: 'veneno',
    rareza: 80,
    salud: 180,
    propiedades: {
      ataque: 180,
      defensa: 174
    },
    ataques: ['puya_venenosa','mordisquito'],
    especiales: ['terremoto','onda_choque']
  },
  {
    id: 'nidoking',
    nombre: 'Nidoking',
    icono: 'assets/imgs/fighters/pokemon_icon_034_00.png',
    tipo: 'veneno',
    rareza: 60,
    salud: 162,
    propiedades: {
      ataque: 204,
      defensa: 157
    },
    ataques: ['puya_venenosa','mordisquito'],
    especiales: ['terremoto','onda_choque']
  },
  {
    id: 'blissey',
    nombre: 'Blissey',
    icono: 'assets/imgs/fighters/pokemon_icon_242_00.png',
    tipo: 'normal',
    rareza: 15,
    salud: 510,
    propiedades: {
      ataque: 129,
      defensa: 229
    },
    ataques: ['destructor','cabezazo'],
    especiales: ['hiperrayo','brillo_magico'],
    items_despedir: [ { id: "medicina-xxl", cantidad: 2 } ]
  },
  {
    id: 'mewtwo',
    nombre: 'Mewtwo',
    icono: 'assets/imgs/fighters/pokemon_icon_150_00.png',
    tipo: 'normal',
    rareza: 5,
    salud: 193,
    propiedades: {
      ataque: 300,
      defensa: 182
    },
    ataques: ['destructor','confusion'],
    especiales: ['hiperrayo','onda_certera']
  },
  {
    id: 'arcanine',
    nombre: 'Arcanine',
    icono: 'assets/imgs/fighters/pokemon_icon_059_00.png',
    tipo: 'fuego',
    rareza: 85,
    salud: 180,
    propiedades: {
      ataque: 227,
      defensa: 166
    },
    ataques: ['aliento_fuego','alarido'],
    especiales: ['llamarada','10000_voltios']
  },
  {
    id: 'poliwrath',
    nombre: 'Poliwrath',
    icono: 'assets/imgs/fighters/pokemon_icon_062_00.png',
    tipo: 'agua',
    rareza: 60,
    salud: 180,
    propiedades: {
      ataque: 182,
      defensa: 187
    },
    ataques: ['burbuja','puya_venenosa'],
    especiales: ['hidro_bomba','golpe_helado']
  },
  {
    id: 'alakazam',
    nombre: 'Alakazam',
    icono: 'assets/imgs/fighters/pokemon_icon_065_00.png',
    tipo: 'normal',
    rareza: 50,
    salud: 110,
    propiedades: {
      ataque: 271,
      defensa: 194
    },
    ataques: ['corte','confusion'],
    especiales: ['premonicion','onda_certera']
  },
  {
    id: 'machamp',
    nombre: 'Machamp',
    icono: 'assets/imgs/fighters/pokemon_icon_068_00.png',
    tipo: 'normal',
    rareza: 77,
    salud: 180,
    propiedades: {
      ataque: 234,
      defensa: 162
    },
    ataques: ['corte','destructor'],
    especiales: ['premonicion','onda_certera','hiperrayo']
  },
  {
    id: 'victreebel',
    nombre: 'Victreebel',
    icono: 'assets/imgs/fighters/pokemon_icon_071_00.png',
    tipo: 'planta',
    rareza: 35,
    salud: 160,
    propiedades: {
      ataque: 207,
      defensa: 138
    },
    ataques: ['mirada_cuqui','alarido'],
    especiales: ['rayo_solar','lluvia_esporas','onda_choque'],
    items_despedir: [ { id: "medicina-xxl", cantidad: 2 } ]
  },
  {
    id: 'slaking',
    nombre: 'Slaking',
    icono: 'assets/imgs/fighters/pokemon_icon_289_00.png',
    tipo: 'normal',
    rareza: 8,
    salud: 273,
    propiedades: {
      ataque: 290,
      defensa: 183
    },
    ataques: ['bostezo'],
    especiales: ['premonicion','onda_certera','hiperrayo']
  },
  {
    id: 'golem',
    nombre: 'Golem',
    icono: 'assets/imgs/fighters/pokemon_icon_076_00.png',
    tipo: 'roca',
    rareza: 35,
    salud: 160,
    propiedades: {
      ataque: 211,
      defensa: 229
    },
    ataques: ['lanzarrocas','bofeton'],
    especiales: ['terremoto','roca_afilada']
  },
  {
    id: 'gengar',
    nombre: 'Gengar',
    icono: 'assets/imgs/fighters/pokemon_icon_094_00.png',
    tipo: 'veneno',
    rareza: 47,
    salud: 120,
    propiedades: {
      ataque: 261,
      defensa: 156
    },
    ataques: ['toxico','cabezazo'],
    especiales: ['nube_radiactiva','onda_certera','onda_choque']
  },
  {
    id: 'rhydon',
    nombre: 'Rhydon',
    icono: 'assets/imgs/fighters/pokemon_icon_112_00.png',
    tipo: 'roca',
    rareza: 62,
    salud: 210,
    propiedades: {
      ataque: 222,
      defensa: 206
    },
    ataques: ['lanzarrocas','bofeton'],
    especiales: ['terremoto','roca_afilada']
  },
  {
    id: 'gyarados',
    nombre: 'Gyarados',
    icono: 'assets/imgs/fighters/pokemon_icon_130_00.png',
    tipo: 'agua',
    rareza: 22,
    salud: 190,
    propiedades: {
      ataque: 237,
      defensa: 197
    },
    ataques: ['mordisquito','cascada'],
    especiales: ['hidro_bomba','golpe_helado']
  },
  {
    id: 'mew',
    nombre: 'Mew',
    icono: 'assets/imgs/fighters/pokemon_icon_151_00.png',
    tipo: 'normal',
    rareza: 1,
    salud: 200,
    propiedades: {
      ataque: 210,
      defensa: 210
    },
    ataques: ['destructor'],
    especiales: ['hiperrayo','onda_certera','rayo_solar','terremoto','carga_total','llamarada','hidro_bomba']
  },
  {
    id: 'meganium',
    nombre: 'Meganium',
    icono: 'assets/imgs/fighters/pokemon_icon_154_00.png',
    tipo: 'planta',
    rareza: 16,
    salud: 160,
    propiedades: {
      ataque: 168,
      defensa: 202
    },
    ataques: ['mirada_cuqui','culo_pompa'],
    especiales: ['rayo_solar','lluvia_esporas','terremoto']
  },
  {
    id: 'typhlosion',
    nombre: 'Typhlosion',
    icono: 'assets/imgs/fighters/pokemon_icon_157_00.png',
    tipo: 'fuego',
    rareza: 27,
    salud: 156,
    propiedades: {
      ataque: 223,
      defensa: 176
    },
    ataques: ['aliento_fuego','ascuas'],
    especiales: ['llamarada','rayo_solar']
  },
  {
    id: 'feraligatr',
    nombre: 'Feraligatr',
    icono: 'assets/imgs/fighters/pokemon_icon_160_00.png',
    tipo: 'agua',
    rareza: 38,
    salud: 170,
    propiedades: {
      ataque: 205,
      defensa: 197
    },
    ataques: ['mordisquito','cascada'],
    especiales: ['hidro_bomba','golpe_helado']
  },
  {
    id: 'ampharos',
    nombre: 'Ampharos',
    icono: 'assets/imgs/fighters/pokemon_icon_181_00.png',
    tipo: 'electrico',
    rareza: 72,
    salud: 180,
    propiedades: {
      ataque: 211,
      defensa: 172
    },
    ataques: ['chispa','voltiazo'],
    especiales: ['carga_total','onda_certera','electrocanon']
  },
  {
    id: 'ursaring',
    nombre: 'Ursaring',
    icono: 'assets/imgs/fighters/pokemon_icon_217_00.png',
    tipo: 'normal',
    rareza: 33,
    salud: 180,
    propiedades: {
      ataque: 236,
      defensa: 144
    },
    ataques: ['cabezazo','corte'],
    especiales: ['onda_certera','hiperrayo']
  },
  {
    id: 'piloswine',
    nombre: 'Piloswine',
    icono: 'assets/imgs/fighters/pokemon_icon_221_00.png',
    tipo: 'agua',
    rareza: 21,
    salud: 200,
    propiedades: {
      ataque: 181,
      defensa: 147
    },
    ataques: ['burbuja','cascada'],
    especiales: ['hidro_bomba','golpe_helado']
  },
  {
    id: 'tyranitar',
    nombre: 'Tyranitar',
    icono: 'assets/imgs/fighters/pokemon_icon_248_00.png',
    tipo: 'roca',
    rareza: 9,
    salud: 200,
    propiedades: {
      ataque: 251,
      defensa: 212
    },
    ataques: ['mordisquito','bofeton'],
    especiales: ['llamarada','roca_afilada']
  },
  {
    id: 'gardevoir',
    nombre: 'Gardevoir',
    icono: 'assets/imgs/fighters/pokemon_icon_282_00.png',
    tipo: 'normal',
    rareza: 27,
    salud: 136,
    propiedades: {
      ataque: 237,
      defensa: 220
    },
    ataques: ['confusion','chispa'],
    especiales: ['brillo_magico','hiperrayo']
  },
  {
    id: 'exploud',
    nombre: 'Exploud',
    icono: 'assets/imgs/fighters/pokemon_icon_295_00.png',
    tipo: 'normal',
    rareza: 46,
    salud: 208,
    propiedades: {
      ataque: 179,
      defensa: 142
    },
    ataques: ['mordisquito','cabezazo'],
    especiales: ['llamarada','premonicion']
  },
  {
    id: 'aggron',
    nombre: 'Aggron',
    icono: 'assets/imgs/fighters/pokemon_icon_306_00.png',
    tipo: 'roca',
    rareza: 9,
    salud: 140,
    propiedades: {
      ataque: 198,
      defensa: 314
    },
    ataques: ['mordisquito','cabezazo'],
    especiales: ['electrocanon','roca_afilada']
  },
  {
    id: 'flygon',
    nombre: 'Flygon',
    icono: 'assets/imgs/fighters/pokemon_icon_330_00.png',
    tipo: 'normal',
    rareza: 16,
    salud: 160,
    propiedades: {
      ataque: 205,
      defensa: 168
    },
    ataques: ['mordisquito','destructor'],
    especiales: ['terremoto','roca_afilada']
  },
  {
    id: 'salamence',
    nombre: 'Salamence',
    icono: 'assets/imgs/fighters/pokemon_icon_373_00.png',
    tipo: 'veneno',
    rareza: 37,
    salud: 190,
    propiedades: {
      ataque: 277,
      defensa: 168
    },
    ataques: ['aliento_fuego','alarido'],
    especiales: ['nube_radiactiva','llamarada']
  },
  {
    id: 'metagross',
    nombre: 'Metagross',
    icono: 'assets/imgs/fighters/pokemon_icon_376_00.png',
    tipo: 'roca',
    rareza: 14,
    salud: 160,
    propiedades: {
      ataque: 257,
      defensa: 247
    },
    ataques: ['lanzarrocas','cabezazo'],
    especiales: ['terremoto','roca_afilada']
  }
];
