export class ItemModel {
  public id: string;
  public nombre: string;
  public descripcion: string;
  public icono: string = 'assets/imgs/items/Item_0701.png';
  public cantidad: number;
  public tipo: string;
  public propiedades: any;

  constructor() { }

  public parse(item: any) {
    let item_nuevo = new ItemModel();
    item_nuevo.id = item.id;
    item_nuevo.nombre = item.nombre;
    item_nuevo.descripcion = item.descripcion;
    item_nuevo.icono = item.icono;
    item_nuevo.cantidad = item.cantidad;
    item_nuevo.tipo = item.tipo;
    item_nuevo.propiedades = item.propiedades;
    return item_nuevo;
  }

  public parse_reference(item: any, cantidad?: number) {
    if (!cantidad) {
      cantidad = item.cantidad;
    }
    let item_nuevo = new ItemModel();
    item_nuevo.id = item.id;
    item_nuevo.nombre = item.nombre;
    item_nuevo.descripcion = item.descripcion;
    item_nuevo.icono = item.icono;
    item_nuevo.cantidad = cantidad;
    item_nuevo.tipo = item.tipo;
    item_nuevo.propiedades = item.propiedades;
    return item_nuevo;
  }

}
