import { useState, useEffect } from "react";
import { Categoria, CategoriaResponse } from "../types/categoria.types.ts";

export function useCategoria() {
    const [ categoria, setCategoria ] = useState<Categoria[]>([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ error, setError ] = useState<string | null>(null);

    const fetchCategoria = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/categoria");
            const data: CategoriaResponse = await res.json();

            if (data.exito) {
                setCategoria(data.data);
            }
        } catch (err) {
            setError("Error al cargar los productos.");
            console.error(err)
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchCategoria(); }, []);

    return { categoria, isLoading, error, fetchCategoria }
};

