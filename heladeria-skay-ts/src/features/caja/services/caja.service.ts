import { CajaResponse, MovimientoResponse } from '../types/caja.types';

export const cajaService = {

    obtener: async (): Promise<CajaResponse> => {
        try{
            const res = await fetch("/api/caja");
            return res.json();
        } catch (err) {
            console.log(err.message)
        }
    },

    abrir: async (payload: {
        UsuarioAperturaId: number;
        MontoInicial:      number;
    }): Promise<{ exito: boolean; mensaje: string }> => {
        const res = await fetch("/api/caja/abrir", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(payload),
        });
        return res.json();
    },

    egreso: async (payload: {
        UsuarioId: number;
        Monto: number;
        Concepto: string;
    }) : Promise <{ 
        exito: boolean,
        mensaje: string
    }> => {
        const res = await fetch("/api/caja/egreso", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(payload),
        });
        return res.json();
    },

    cerrar: async (payload: {
            CajaId: number;
            UsuarioCierreId: number;
            EfectivoContado: number;
        }) : Promise <{ 
            exito: boolean,
            mensaje: string
        }> => {
            const res = await fetch("/api/caja", {
                method: "DELETE",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(payload),
            });
            return res.json();
        },

    obtenerMovimientos: async(): Promise<MovimientoResponse> => {
        try{
            const res = await fetch("/api/movimiento");
        return res.json();
        } catch(err) {
            console.log(err.message)
        }
    },
};