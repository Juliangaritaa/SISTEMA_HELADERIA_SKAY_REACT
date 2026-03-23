import { useState, useEffect, useCallback } from 'react';
import { Producto } from '../types/producto.type';
import { productoService } from '../services/producto.service';
import { toast } from "sonner";

export function useProducto() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProductos = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await productoService.getAll();
            if (data.exito) setProductos(data.data);
        } catch (err) {
            setError("Error al cargar productos.");
            toast.error("Error al cargar los productos.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const eliminarProducto = useCallback(async (idProducto: number): Promise<boolean> => {
        try {
            const result = await productoService.delete(idProducto);
            if (result.exito) {
                await fetchProductos();
                toast.success(`Producto eliminado Correctamente.`);
                return true;
            }
            return false;
        } catch (err) {
            console.error("Error al eliminar producto:", err);
            toast.error("Error al eliminar un producto.");
            return false;
        }
    }, [fetchProductos]);

    const editarProducto = useCallback(async (formData: FormData): Promise<boolead> => {
        try {
            const result = await productoService.update(formData);
            if (result.exito) {
                await fetchProductos();
                toast.success(`Producto editado Correctamente.`);
                return true;
            }
            return false;
        } catch (err) {
            console.log("Error al editar un producto.");
            toast.error("Error al editar un producto.");
            return false;
        }
    }, [fetchProductos])

    useEffect(() => { fetchProductos(); }, [fetchProductos]);

    return { productos, isLoading, error, refetch: fetchProductos, eliminarProducto, editarProducto  };
}