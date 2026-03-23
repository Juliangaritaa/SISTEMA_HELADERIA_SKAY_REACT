export interface ReporteVenta {
    idVenta: number;
    fecha: string;
    nombreUsuario: string;
    total: number; 
    metodoPago: string;
    TotalProductos: number;
    estado: string;
}

export interface ProductoMasVendido {
    idProducto: number;
    nombreProducto: string;
    cantidadVendida: number;
    totalVendido: number;
    ganancia: number;
}

export interface ProductoVencer {
    idProducto: number;
    nombreProducto: string;
    DiasRestantes: string;
}

export interface HistorialCaja {
    idCaja: number;
    fecha: string;
    abiertaPor: string;
    horaApertura: string;
    cerradaPor: string;
    horaCierre: string;
    montoInicial: number;
    efectivoContado: number;
    diferencia: number;
    estado: string;
}