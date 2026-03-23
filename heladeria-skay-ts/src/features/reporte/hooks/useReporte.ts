import { useState, useCallback } from "react";
import {
    ReporteVenta,
    RroductoMasVendido,
    ProductoBajoStock,
    ProductoVencer,
    HistorialCaja,
} from "../types/reporte.types";

import { reporteService } from "../services/reporte.service";
import { toast } from "sonner";

const hoy = new Date().toISOString().split("T")[0];
const haceTreintaDias = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString().split("T")[0];

export function useReporte() {
    const [ fechaInicio, setFechaInicio ] = useState(haceTreintaDias);
    const [ fechaFin, setFechaFin ] = useState(hoy);
    const [ ventas, setVentas ] = useState<ReporteVenta[]>([]);
    const [ masVendidos, setMasVendidos ] = useState<ProductoMasVendido[]>([]);
    const [ bajoStock, setBajoStock ] = useState<ProductoBajoStock[]>([]);
    const [ porVencer, setPorVencer ] = useState<ProductoVener[]>([]);
    const [ historialCajas, setHistorialCajas ] = useState<HistorialCaja[]>([]);
    const [ isLoading, setIsLoading ] = useState(false);

    const fetchVentas = useCallback(async () => {
        
        try {
            const data = await reporteService.getVentas(fechaInicio, fechaFin);
            if(data.exito) setVentas(data.data);
        } catch {
            toast.error("Error al cargar reporte de ventas.");
        }    
    }, [fechaInicio, fechaFin]);

    const fetchHistorialCajas = useCallback(async() => {
        try {
            const data = await reporteService.getHistorialCajas(fechaInicio, fechaFin);
            if(data.exito) setHistorialCajas(data.data);
        } catch {
            toast.error("Error al cargar el historial de cajas.");
        }
    }, [fechaInicio, fechaFin]);

    const fetchTodo = useCallback(async () => {
        setIsLoading(true);
        try {
            const [prod, stock, vencer] = await Promise.all([
                reporteService.getProductosMasVendidos(),
                reporteService.getProductosBajoStock(),
                reporteService.getProductosVencer(),
            ]);
            if (prod.exito)   setMasVendidos(prod.data);
            if (stock.exito)  setBajoStock(stock.body);   // ← body según tu response
            if (vencer.exito) setPorVencer(vencer.body);  // ← body según tu response
            await fetchVentas();
            await fetchHistorialCajas();
        } catch {
            toast.error("Error al cargar los reportes.");
        } finally {
            setIsLoading(false);
        }
    }, [fetchVentas, fetchHistorialCajas]);

    return {
        fechaInicio, 
        setFechaInicio,
        fechaFin,
        setFechaFin,
        ventas, 
        masVendidos, 
        bajoStock, 
        porVencer, 
        historialCajas,
        isLoading, 
        fetchTodo, 
        fetchVentas, 
        fetchHistorialCajas,
    };
};