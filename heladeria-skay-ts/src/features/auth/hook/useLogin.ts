import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { authService } from "../services/authService";
import { authData } from "../services/authService";
import { useAuthStore } from "../store/authStore";

const loginSchema = z.object({
    correo: z
        .string()
        .min(1, "El correo es requerido")
        .email("El correo no es válido"),
    password: z
        .string()
        .min(8, "La contraseña debe tener al menos 4 caracteres")
        .max(100, "La contraseña debe tener como máximo 100 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function useLogin() {
    const navigate = useNavigate();
    const {
        setAuth,
        setLoading,
        setError,
        isLoading,
    } = useAuthStore();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { correo: "", password: "" },
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authService.login(data);

            if (response.exito && response.datos) {
                setAuth(response.datos);
                toast.success(`¡Bienvenido!`, {
                    description: "Sesión iniciada correctamente.",
                });
                navigate("/dashboard", { replace: true });
            }
        } catch (error: any) {
            // Si el backend respondió (ej. 401 Unauthorized)
            if (error.response) {
                const serverMsg = error.response.data?.mensaje ||
                    "Credenciales incorrectas";
                setError(serverMsg);
                toast.error("Acceso denegado", { description: serverMsg });
            } // Si no hubo respuesta del servidor (servidor apagado)
            else {
                const networkMsg =
                    "No se pudo conectar con el servidor. Intenta de nuevo.";
                setError(networkMsg);
                toast.error("Error de conexión", { description: networkMsg });
            }
        } finally {
            setLoading(false);
        }
    };

    return { form, onSubmit: form.handleSubmit(onSubmit), isLoading };
}
