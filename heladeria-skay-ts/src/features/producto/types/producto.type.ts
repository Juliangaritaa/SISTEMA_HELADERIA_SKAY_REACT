export interface Producto {
    idProducto: number;
    nombreProducto: string;
    precioCompraProducto: number;
    precioProducto: number;
    stockProducto: number;
    fechaVencimientoProducto: string;
    categoria: string;
    idCategoria: number;
}

export interface ProductoResponse {
    exito: boolean;
    data: Producto[];
}