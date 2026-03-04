import { useState, useEffect, useCallback } from 'react';
import { Producto, ProductoResponse } from '../types/producto.type';

export function useProducto() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError]         = useState<string | null>(null);

    const fetchProductos = useCallback(async () => {
        try {
            setIsLoading(true);
            const res  = await fetch("/api/productos");
            const data: ProductoResponse = await res.json();
            if (data.exito) setProductos(data.data);
        } catch (err) {
            setError("Error al cargar productos.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProductos();
    }, [fetchProductos]);

    return { productos, isLoading, error, refetch: fetchProductos };
}