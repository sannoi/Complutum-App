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
      xp: 200,
      influye: [ "meteo", "terreno" ],
      iv_rango: {
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
      }
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
      xp: 500,
      influye: [ "meteo", "terreno" ],
      iv_rango: {
        min: {
          ataque: 11,
          defensa: 11,
          salud: 11
        },
        max: {
          ataque: 15,
          defensa: 15,
          salud: 15
        }
      }
    }
  },
  {
    id: "trampa-xl",
    nombre: "Trampa Premium",
    descripcion: "Captura mascotas de nivel alto en 60 minutos",
    icono: "assets/imgs/items/Item_1201.png",
    tipo: "trampa",
    propiedades: {
      tiempo: 60 * 60,
      rareza_minima: 10,
      rareza_maxima: 40,
      xp: 1000,
      influye: [ "meteo", "terreno" ],
      iv_rango: {
        min: {
          ataque: 12,
          defensa: 12,
          salud: 12
        },
        max: {
          ataque: 15,
          defensa: 15,
          salud: 15
        }
      }
    }
  },
  {
    id: "trampa-xxl",
    nombre: "Trampa Technie",
    descripcion: "Atrae a una mascota única tras 24 horas",
    icono: "assets/imgs/items/Item_1403.png",
    tipo: "trampa",
    propiedades: {
      tiempo: 24 * 60 * 60,
      rareza_minima: 1,
      rareza_maxima: 10,
      xp: 2500,
      influye: [ "meteo", "terreno" ],
      iv_rango: {
        min: {
          ataque: 13,
          defensa: 13,
          salud: 13
        },
        max: {
          ataque: 15,
          defensa: 15,
          salud: 15
        }
      }
    }
  },
  {
    id: "baya-suerte",
    nombre: "Baya de la Suerte",
    descripcion: "Consigue el doble de XP durante 30 minutos",
    icono: "assets/imgs/items/Item_0704.png",
    tipo: "modificador",
    propiedades: {
      tiempo: 30 * 60,
      xp: "x2"
    }
  }
];
