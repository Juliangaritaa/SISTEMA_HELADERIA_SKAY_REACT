import { useState, useCallback } from 'react';
import { ItemCarrito, CrearVentaPayload } from '../types/venta.types';
import { ventaService } from '../services/venta.service';
import { useAuthStore } from '../../../store/authStore';

export function useVenta() {
    const user = useAuthStore((s) => s.user);
    const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
    const [metodoPago, setMetodoPago] = useState("");
    const [isLoading,setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ventaExitosa, setVentaExitosa] = useState<null | { ventaId: number; mensaje: string}>(null);

    const agregarAlCarrito = useCallback((item: ItemCarrito) => {
        setCarrito((prev) => {
            const existe = prev.find((p) p.idProducto === item.idProducto);
            if (existe) {
                return prev.map((p) =>
                p.idProducto === item.idProducto
                    ? { ...p, cantidad: p.cantidad + 1}
                    :p
                );
            }
            return { ...prev, { ...item, cantidad: 1 }};
        })
    }, []);

    const quitarDelCarrito = useCallback((idProducto: number) => {
        setCarrito((prev) => prev.filter((p) => p.idProducto !== idProducto));
    }, []);

    

}