import { useState, useEffect, useCallback} from 'react';
import { Caja, MovimientoCaja } from '../types/caja.types';
import { cajaService } from '../services/caja.service';
import { useAuthStore } from '../../auth/store/authStore';
import { toast } from 'sonner';

export function useCaja() {
    const user = useAuthStore((s) => s.user);
    const [ caja, setCaja ] = useState<Caja | null>(null);
    const [ movimientos, setMovimientos ] = useState<MovimientoCaja[]>([]);
    const [ isLoading, setIsLoading ] = useState(true);

    const fetchCaja = useCallback(async () => {
    try {
        setIsLoading(true);
        const data = await cajaService.obtener();
        console.log("CAJA RESPONSE:", data); // ← agrega esto
        if (data.exito && data.data.length > 0) {
            setCaja(data.data[0]);
        } else {
            setCaja(null);
        }
    } catch (error) {
        console.error("ERROR CAJA:", error); // ← agrega esto
        toast.error("Error al cargar la caja.");
    } finally {
        setIsLoading(false);
    }
}, []);

    const fetchMovimientos = useCallback (async () => {
        try {
            const data = await cajaService.obtenerMovimientos();
            if (data.exito) setMovimientos(data.data);
        } catch {
            toast.error("Error al cargar los  movimienos");
        }
    }, []);

    const abrirCaja = useCallback(async (montoInicial: number): Promise<boolean> => {
        if (!user) return false;
        try {
            const result = await cajaService.abrir({
                UsuarioAperturaId: user.id,
                MontoInicial: montoInicial,
            });
            if (result.exito) {
                toast.success(result.mensaje);
                await fetchCaja();
                await fetchMovimientos();
                return true;
            }
            toast.error(result.mensaje);
            return false;
        } catch (error) {
            toast.error("Error al abrir la caja.");
            return false;
        }
    },  [user, fetchCaja, fetchMovimientos]);

    const registrarEgreso = useCallback(async(
        monto: number, concepto: string
    ): Promise<boolean> => {
        if (!user) return false;

        try {
            const result = await cajaService.egreso({
                UsuarioId: user.id,
                Monto: monto,
                Concepto: concepto,
            });
            if (result.exito) {
                toast.success(result.mensaje);
                await fetchMovimientos();
                return true;
            }
            toast.error(result.mensaje);
            return false;
        } catch {
            toast.error("Error al registrar el egreso.");
            return false;
        }
    }, [user, fetchMovimientos]);

    const cerrarCaja = useCallback(async (efectivoContado: number): Promise<boolean> => {
        if (!user || !caja) return false;
        try {
            const result = await cajaService.cerrar({
                CajaId: caja.cajaId,
                UsuarioCierreId: user.id,
                EfectivoContado: efectivoContado,
            });
            if (result.exito) {
                toast.success(result.mensaje);
                await fetchCaja();
                await fetchMovimientos();
                return true;
            }
            toast.error(result.mensaje);
            return false;
        } catch {
            toast.error("Error al cerrar la caja.");
            return false;
        }
    }, [user, caja, fetchCaja, fetchMovimientos]);

    useEffect(() => {
        fetchCaja();
        fetchMovimientos();
    }, [fetchCaja, fetchMovimientos]);

    return {
        caja, movimientos, isLoading, abrirCaja, registrarEgreso, cerrarCaja, refetch: fetchCaja,
    };
}