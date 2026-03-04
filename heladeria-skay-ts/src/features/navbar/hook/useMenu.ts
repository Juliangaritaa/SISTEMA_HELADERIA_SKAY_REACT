import { useState, useEffect } from 'react';
import { MenuItem, MenuResponse } from '../types/menu.types';
import { useAuthStore } from '../../auth/store/authStore';

export function useMenu(){
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const rol = useAuthStore((state) => state.user?.rol);

    useEffect(() => {
        if(!rol) return;

        const fetchMenu = async () => {
            try {
                const res = await fetch(`/api/menu?rol=${rol}`);
                const data: MenuResponse = await res.json();
                if (data.exito) setMenu(data.menu);
            } catch (error) {
                console.log("Error al cargar el menú.", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenu();
    }, [rol]);
    return { menu, isLoading }
}