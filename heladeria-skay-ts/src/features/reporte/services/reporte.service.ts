export const reporteService = {

    getVentas: async(fechaInicio: string, fechaFin: string) =>{
        const res = await fetch (
            `/api/reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
        );
        return res.json();
    },

    getProductosMasVendidos: async(limite = 10) => {
        const res = await fetch(
            `/api/reporte/productos?limite=${limite}`
        );
        return res.json();
    },

    getProductosBajoStock: async() => {
        const res = await fetch("/api/reporte/productos/bajoStock");
        return res.json();
    },

    getProductosVencer: async() => {
        const res = await fetch("/api/reporte/productos/vencimiento");
        return res.json();
    },

    getHistorialCajas: async (fechaInicio: string, fechaFin: string) => {
        const res = await fetch(
            `/api/reporte/caja/historial?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
        );
        return res.json();
    }
};