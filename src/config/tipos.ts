export let tipos = [
  {
    id: 'planta',
    nombre: 'Planta',
    color: '#00ff00',
    color_texto: '#ffffff',
    icono: 'leaf',
    eficaz: ['agua','roca'],
    no_eficaz: ['veneno','fuego','planta'],
    meteo: [],
    terreno: ['landuse.grass','landuse.farmland','landuse.orchard','landuse.plant_nursery','landuse.village_green','landuse.vineyard','leisure.park','leisure.garden']
  },
  {
    id: 'fuego',
    nombre: 'Fuego',
    color: '#ff0000',
    color_texto: '#ffffff',
    icono: 'flame',
    eficaz: ['planta'],
    no_eficaz: ['agua','roca','fuego'],
    meteo: [800,711,751,761,762,904],
    terreno: []
  },
  {
    id: 'agua',
    nombre: 'Agua',
    color: '#0000ff',
    color_texto: '#ffffff',
    icono: 'water',
    eficaz: ['fuego','roca'],
    no_eficaz: ['agua','planta'],
    meteo: [300,301,302,310,311,312,313,314,321,500,501,502,503,504,511,520,521,522,531,701,741],
    terreno: []
  },
  {
    id: 'electrico',
    nombre: 'Eléctrico',
    color: '#ffff00',
    color_texto: '#000000',
    icono: 'flash',
    eficaz: ['agua','normal'],
    no_eficaz: ['veneno','planta','electrico'],
    meteo: [200,201,202,210,211,212,221,230,231,232,300,301,302,310,311,312,313,314,321,500,501,502,503,504,511,520,521,522,531,701,741],
    terreno: []
  },
  {
    id: 'veneno',
    nombre: 'Veneno',
    color: '#00ffff',
    color_texto: '#ffffff',
    icono: 'flask',
    eficaz: ['planta'],
    no_eficaz: ['roca','veneno'],
    meteo: [801,802,803,804,903],
    terreno: ['landuse.residential']
  },
  {
    id: 'normal',
    nombre: 'Normal',
    color: '#ffff00',
    color_texto: '#000000',
    icono: 'contact',
    eficaz: ['veneno'],
    no_eficaz: ['roca'],
    meteo: [],
    terreno: []
  },
  {
    id: 'roca',
    nombre: 'Roca',
    color: '#b8a038',
    color_texto: '#ffffff',
    icono: 'hammer',
    eficaz: ['fuego'],
    no_eficaz: ['normal'],
    meteo: [],
    terreno: ['leisure.nature_reserve']
  }
];
