export let items = [
  {
    id: "medicina-sm",
    nombre: "Medicina Pequeña",
    descripcion: "Restaura 10 puntos de salud de un luchador",
    icono: "assets/imgs/items/Item_0101.png",
    tipo: "salud",
    propiedades: {
      restaurar_salud: 10
    }
  },
  {
    id: "medicina-md",
    nombre: "Medicina Mediana",
    descripcion: "Restaura 25 puntos de salud de un luchador",
    icono: "assets/imgs/items/Item_0102.png",
    tipo: "salud",
    propiedades: {
      restaurar_salud: 25
    }
  },
  {
    id: "medicina-xl",
    nombre: "Medicina Grande",
    descripcion: "Restaura 50 puntos de salud de un luchador",
    icono: "assets/imgs/items/Item_0103.png",
    tipo: "salud",
    propiedades: {
      restaurar_salud: 50
    }
  },
  {
    id: "medicina-xxl",
    nombre: "Medicina Total",
    descripcion: "Restaura todos los puntos de salud de un luchador",
    icono: "assets/imgs/items/Item_0104.png",
    tipo: "salud",
    propiedades: {
      restaurar_salud: 5000
    }
  },
  {
    id: "camara-fotos",
    nombre: "Cámara de Fotos",
    descripcion: "Úsala para tomar fotos de tus luchadores",
    icono: "assets/imgs/items/Item_0801.png",
    tipo: "defecto",
    propiedades: { }
  },
  {
    id: "trampa-sm",
    nombre: "Trampa Rápida",
    descripcion: "Captura mascotas débiles en 10 minutos",
    icono: "assets/imgs/items/Item_0201.png",
    tipo: "trampa",
    propiedades: {
      tiempo: 10 * 60,
      rareza_minima: 70,
      rareza_maxima: 100,
      influye: [ "meteo", "terreno" ]
    }
  },
  {
    id: "trampa-md",
    nombre: "Trampa Paciente",
    descripcion: "Captura mascotas de nivel medio en 25 minutos",
    icono: "assets/imgs/items/Item_0202.png",
    tipo: "trampa",
    propiedades: {
      tiempo: 25 * 60,
      rareza_minima: 40,
      rareza_maxima: 70,
      influye: [ "meteo", "terreno" ]
    }
  },
  {
    id: "trampa-xl",
    nombre: "Trampa Premium",
    descripcion: "Captura mascotas de nivel alto en 60 minutos",
    icono: "assets/imgs/items/Item_0401.png",
    tipo: "trampa",
    propiedades: {
      tiempo: 60 * 60,
      rareza_minima: 10,
      rareza_maxima: 40,
      influye: [ "meteo", "terreno" ]
    }
  },
  {
    id: "trampa-xxl",
    nombre: "Llave Interdimensional",
    descripcion: "Atrae a una mascota única tras 24 horas",
    icono: "assets/imgs/items/Item_1403.png",
    tipo: "trampa",
    propiedades: {
      tiempo: 24 * 60 * 60,
      rareza_minima: 1,
      rareza_maxima: 10,
      influye: [ "meteo", "terreno" ]
    }
  }
];
