import { useState, useEffect, useCallback } from "react";
import { Categoria, CategoriaResponse } from "../types/categoria.types.ts";
import { categoriaService } from '../services/categoria.services';
import { toast } from "sonner";

export function useCategoria() {
    const [ categoria, setCategoria ] = useState<Categoria[]>([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ error, setError ] = useState<string | null>(null);

    const fetchCategoria = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await categoriaService.getAll();
            if (data.exito) setCategoria(data.data);
        } catch (err) {
            setError("Error al cargar las categoria.");
            toast.error("Error al cargar las categorias.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const eliminarCategoria = useCallback(async (idCategoria: number): Promise<boolean> => {
        try {
            const result = await categoriaService.delete(idCategoria);
            if (result.exito) {
                await fetchCategoria();
                toast.success(`Categoria eliminada Correctamente.`);
                return true;
            }
            return false;
        } catch (err) {
            console.error("Error al eliminar categoria:", err);
            toast.error("Error al eliminar la categoria.");
            return false;
        }
    }, [fetchCategoria]);

    const editarCategoria = useCallback(async (datosEditados: Categoria): Promise<boolean> => {
        try {
            const result = await categoriaService.update(datosEditados);
            if (result.exito) {
                toast.success("Categoría actualizada correctamente");
                await fetchCategoria(); 
                return true;
            }
            return false;
        } catch (err) {
        toast.error("Error al conectar con el servidor");
        return false;
        }
    }, [fetchCategoria]);

    useEffect(() => { fetchCategoria(); }, [fetchCategoria]);

    return { categoria, isLoading, error, refetch:fetchCategoria, editarCategoria, eliminarCategoria }
};

