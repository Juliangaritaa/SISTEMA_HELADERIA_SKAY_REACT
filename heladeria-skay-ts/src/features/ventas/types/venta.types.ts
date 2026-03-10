export interface DetalleVenta {
    idProducto: number;
    nombreProducto: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

export interface ItemCarrito {
    idProducto: string;
    nombreProducto: string;
    precioUnitario: number;
    cantidad: number;
}

export interface CrearVentaPayload {
    usuarioId: number;
    metodoPago: string;
    detalles: {
        idProducto: number;
        cantidad: number;
    }[];
}

export interface VentaResponse {
    exito: boolean;
    mensaje: string;
    datos?: {
        ventaId:    number;
        cajaId:     number;
        totalVenta: number;
        mensaje:    string;
        exito:      boolean;
    };
}