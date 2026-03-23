import { useState, useEffect, useCallback } from 'react';
import { Usuario } from '../types/usuario.types';
import { usuarioService } from '../services/usuario.service';
import { toast } from "sonner";

export function useUsuario() {
    const [ usuarios, setUsuarios ] = useState<Usuario[]>([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ error, setError ] = useState<string | null>(null);

    const fetchUsuarios = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await usuarioService.getAll();
            if (data.exito && Array.isArray(data.data)) {
                setUsuarios(data.data);
            } else {
                setUsuarios([]);
            }
        } catch (err) {
            setError("Error al cargar los usuarios.");
            toast.error("Error al cargar los usuarios.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const crearUsuario = useCallback(async (datos: Usuario): Promise<boolean> => {
        try {
            const result = await usuarioService.create(datos);
            if (result.exito) {
                toast.success("Usuario creado correctamente.");
                await fetchUsuarios();
                return true;
            }
            return false;
        } catch (erro) {
            toast.error("Error al conectar con el servidor");
            return false;
        }
    }, [fetchUsuarios]);

    const editarUsuario = useCallback(async (datosEditados: Usuario): Promise<boolean> => {
        try {
            const result = await usuarioService.update(datosEditados);
            if (result.exito) {
                toast.success("Usuario actualizado correctamente.");
                await fetchUsuarios();
                return true;
            }
            return false;
        } catch (erro) {
            toast.error("Error al conectar con el servidor");
            return false;
        }
    }, [fetchUsuarios]);

    const eliminarUsuario = useCallback(async (idUsuario: number): Promise<boolean> => {
        try {
            const result = await usuarioService.delete(idUsuario);
            if (result.exito) {
                toast.success("Usuario eliminado correctamente.");
                await fetchUsuarios();
                return true;
            } else {
                return false;
            }
        } catch (err) {
            toast.error("Error al conectar con el servidor.");
            return false;
        }
    }, [ fetchUsuarios ]);

    useEffect(() => { fetchUsuarios(); }, [fetchUsuarios]);

    return { usuarios, isLoading, error, refetch: fetchUsuarios, crearUsuario, editarUsuario, eliminarUsuario };
}
