import { CategoriaResponse } from "../types/categoria.types";

export const categoriaService = {

    getAll: async(): Promise<CategoriaResponse> => {
        const res = await fetch("/api/categoria");
        return res.json();
    },

    create: async (formData: FormData): Promise<{ exito: boolean; mensaje: string }> => {
    const data = Object.fromEntries(formData.entries());

    const res = await fetch("/api/categoria", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        });
        return res.json();
    },

    update: async (data: Categoria): Promise<{ exito: boolean; mensaje: string}> => {
        console.log("llamando put /api/categoria");
        const res = await fetch("/api/categoria", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    delete: async (idCategoria: number): Promise<{ exito: boolean; mensaje: string }> => {
        const res = await fetch(`/api/categoria/${idCategoria}`, { 
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        });
        return res.json();
    },
}