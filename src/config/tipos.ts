export let tipos = [
  {
    id: 'planta',
    nombre: 'Planta',
    color: '#00ff00',
    icono: 'assets/imgs/tipos/planta.png',
    eficaz: ['agua'],
    no_eficaz: ['veneno','fuego']
  },
  {
    id: 'fuego',
    nombre: 'Fuego',
    color: '#ff0000',
    icono: 'assets/imgs/tipos/fuego.png',
    eficaz: ['planta'],
    no_eficaz: ['agua']
  },
  {
    id: 'agua',
    nombre: 'Agua',
    color: '#0000ff',
    icono: 'assets/imgs/tipos/agua.png',
    eficaz: ['fuego'],
    no_eficaz: ['electrico','planta']
  },
  {
    id: 'electrico',
    nombre: 'Eléctrico',
    color: '#ffff00',
    icono: 'assets/imgs/tipos/electrico.png',
    eficaz: ['agua','normal'],
    no_eficaz: ['veneno']
  },
  {
    id: 'veneno',
    nombre: 'Veneno',
    color: '#00ffff',
    icono: 'assets/imgs/tipos/veneno.png',
    eficaz: ['planta'],
    no_eficaz: ['agua']
  },
  {
    id: 'normal',
    nombre: 'Normal',
    color: '#ffff00',
    icono: 'assets/imgs/tipos/normal.png',
    eficaz: ['veneno'],
    no_eficaz: ['agua','planta']
  }
];
