import { CrearVentaPayload, VentaResponse } from '../typs/venta.types';

export const ventaService = {

    getAll: async (): Promise<ProductoResponse> => {
        const res = await fetch("/api/ventas");
        return res.json();
    },

    crear: async (payload: CrearVentaPayload): Promise<VentaResponse> => {
        const res = await fetch('/api/ventas' , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
        });
        return res.json();
    },
};