export interface Caja {
    idCaja: number;
    usuarioAperturaId: number;
    usuarioCierreId?: number; 
    fecha: string;            
    fechaApertura: Date;
    fechaCierre?: Date;      
    montoInicial: number;
    montoFinal?: number;      
    estado: 'abierta' | 'cerrada';
}

export interface MovimientoCaja {
    idMovimiento: number;
    cajaId: number;
    tipo: number;             
    concepto: string;
    monto: number;
    usuarioId: number;
    fecha: Date;
}

export interface CajaEstado {
    cajaId: number;
    estado: 'abierta' | 'cerrada';
    montoInicial: number;
    totalVentas: number;
    cajaExiste: boolean;
}

export interface CajaResponse {
    exito: boolean;
    data: CajaEstado[];
}
export interface MovimientiResponse {
    exito: boolean;
    data: MovimientoCaja[];
}