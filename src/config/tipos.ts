export let tipos = [
  {
    id: 'planta',
    nombre: 'Planta',
    color: '#00ff00',
    color_texto: '#ffffff',
    icono: 'leaf',
    eficaz: ['agua'],
    no_eficaz: ['veneno','fuego']
  },
  {
    id: 'fuego',
    nombre: 'Fuego',
    color: '#ff0000',
    color_texto: '#ffffff',
    icono: 'flame',
    eficaz: ['planta'],
    no_eficaz: ['agua']
  },
  {
    id: 'agua',
    nombre: 'Agua',
    color: '#0000ff',
    color_texto: '#ffffff',
    icono: 'water',
    eficaz: ['fuego'],
    no_eficaz: ['electrico','planta']
  },
  {
    id: 'electrico',
    nombre: 'Eléctrico',
    color: '#ffff00',
    color_texto: '#000000',
    icono: 'flash',
    eficaz: ['agua','normal'],
    no_eficaz: ['veneno']
  },
  {
    id: 'veneno',
    nombre: 'Veneno',
    color: '#00ffff',
    color_texto: '#ffffff',
    icono: 'flask',
    eficaz: ['planta'],
    no_eficaz: ['agua']
  },
  {
    id: 'normal',
    nombre: 'Normal',
    color: '#ffff00',
    color_texto: '#000000',
    icono: 'contact',
    eficaz: ['veneno'],
    no_eficaz: ['agua','planta']
  }
];
