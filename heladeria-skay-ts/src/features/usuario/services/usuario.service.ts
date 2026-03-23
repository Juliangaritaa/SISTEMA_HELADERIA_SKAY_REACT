import { UsuarioResponse } from '../types/usuario.types';

export const usuarioService = {
    getAll: async():Promise<UsuarioResponse> => {
        const res = await fetch("api/usuario");
        return res.json();
    },

    create: async (data: Usuario): Promise<{ exito: boolean, mensaje: string}> => {
        const res = await fetch("/api/usuario", {
            method: "POST",
            headers:{ 
                "Content-Type":"application/json",
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    update: async (data: Usuario): Promise<{ exito: boolean, mensaje: string}> => {
        const res = await fetch("/api/usuario", {
            method: "PUT",
            headers:{ 
                "Content-Type":"application/json",
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    delete: async (idUsuario: number): Promise<{ exito: boolean, mensaje: string}> => {
        const res = await fetch(`/api/usuario/${idUsuario}` , {
            method: "DELETE",
        });
        return res.json();
    },
};