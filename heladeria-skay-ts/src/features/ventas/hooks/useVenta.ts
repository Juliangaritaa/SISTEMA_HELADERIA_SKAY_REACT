import { useState, useEffect,useCallback } from 'react';
import { ItemCarrito, CrearVentaPayload } from '../types/venta.types';
import { ventaService } from '../services/venta.service';
import { useAuthStore } from '../../auth/store/authStore';
import {toast} from "sonner";

export function useVenta() {
    const user = useAuthStore((s) => s.user);
    const [productos,  setProductos]  = useState<Producto[]>([]);
    const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
    const [metodoPago, setMetodoPago] = useState("");
    const [isLoading,setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ventaExitosa, setVentaExitosa] = useState<null | { 
        ventaId: number; 
        total: number;
        mensaje: string;
    }>(null);

    const fetchProductos = useCallback(async () => {
    try {
        setIsLoading(true);
        const data = await ventaService.getAll();
        console.log("PRODUCTOS RESPONSE:", data); // ← agrega esto
        if (data.exito) setProductos(data.data);
    } catch (err) {
        console.error("ERROR PRODUCTOS:", err); // ← agrega esto
        setError("Error al cargar productos.");
        toast.error("Error al cargar los productos.");
    } finally {
        setIsLoading(false);
    }
    }, []);

    const agregarAlCarrito = useCallback((item: ItemCarrito) => {
        setCarrito((prev) => {
            const existe = prev.find((p) => p.idProducto === item.idProducto);
            if (existe) {
                return prev.map((p) =>
                p.idProducto === item.idProducto
                    ? { ...p, cantidad: p.cantidad + 1}
                    :p
                );
            }
            return [ ...prev, { ...item, cantidad: 1 }];
        })
    }, []);

    const cambiarCantidad = useCallback((idProducto: number, cantidad: number) => {
        if (cantidad <= 0) {
            setCarrito((prev) => prev.filter((p) => p.idProducto !== idProducto));
            return;
        }
        setCarrito((prev) =>
            prev.map((p) => p.idProducto === idProducto ? { ...p, cantidad } : p)
        );
    }, []);
    
    const quitarDelCarrito = useCallback((idProducto: number) => {
        setCarrito((prev) => prev.filter((p) => p.idProducto !== idProducto));
    }, []);

    const limpiarCarrito = useCallback(() => {
        setCarrito([]);
        setMetodoPago("");
        setVentaExitosa(null);
        setError(null);
    }, []);

    const totalCarrito = carrito.reduce(
        (acc, item) => acc + item.precioUnitario * item.cantidad, 0
    );

    const procesarVenta = useCallback(async () => {
        if (!user) return;

        if (carrito.length === 0) {
            setError("Agrega al menos un producto al carrito.")
            toast.error("Agrega al menos un producto al carrito.")
            return;
        }
        if (!metodoPago.trim()) {
            toast.error("Selecciona un metodo de pago.");
            setError("Selecciona un metodo de pago.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const payload: CrearVentaPayload = {
                usuarioId: user.id,
                metodoPago,
                detalles: carrito.map((p) => ({
                    productoId: p.idProducto,
                    cantidad: p.cantidad,
                })),
            };

            console.log("PAYLOAD:", JSON.stringify(payload, null, 2));

            const result = await ventaService.crear(payload);

            if (result.exito && result.datos) {
                setVentaExitosa({
                    ventaId: result.datos.ventaId,
                    total: result.datos.totalVenta,
                    mensaje: result.mensaje,
                });
                setCarrito([]);
                setMetodoPago("");
            } else {
                toast.error(result.mensaje);
            }
        } catch (err) {
            setError("Error de conexión al procesar la venta.");
        } finally {
            setIsLoading(false);
        }
    }, [carrito, metodoPago, user]);
    
    useEffect(() => { fetchProductos(); }, [fetchProductos]);

    return {
        carrito,
        productos,
        metodoPago, setMetodoPago,
        agregarAlCarrito,
        quitarDelCarrito,
        cambiarCantidad,
        limpiarCarrito,
        totalCarrito,
        procesarVenta,
        isLoading,
        error,
        ventaExitosa,
        fetchProductos
    };
}