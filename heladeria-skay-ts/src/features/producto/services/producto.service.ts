import { ProductoResponse } from "../types/producto.type";

export const productoService = {

    getAll: async (): Promise<ProductoResponse> => {
        const res = await fetch("/api/productos");
        return res.json();
    },

    create: async (formData: FormData): Promise<{ exito: boolean; mensaje: string }> => {
        const res = await fetch("/api/productos", {
            method: "POST",
            body: formData,
        });
        return res.json();
    },

    update: async (formData: FormData): Promise<{ exito: boolean; mensaje: string }> => {
    console.log("llamando PUT /api/productos");
    const res = await fetch("/api/productos", {
        method: "PUT",
        body: formData,
    });
    console.log("status:", res.status);
    return res.json();
    },

    delete: async (idProducto: number): Promise<{ exito: boolean; mensaje: string }> => {
        const res = await fetch(`/api/productos/${idProducto}`, {
            method: "DELETE",
        });
        return res.json();
    },

};