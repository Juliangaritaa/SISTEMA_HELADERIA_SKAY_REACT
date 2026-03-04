import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AuthState, UserData } from '../types/auth.types'

interface AuthActions {
    setAuth: (user: UserData, token?: string) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    logout: () => void
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
}

interface User {
    id: number;
    nombreUsuario: string;
    idRol: string;
}

export const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        (set) => ({
        ...initialState,
        
        setAuth: (user: UserData, token?: string) => 
            set({
                user,
                token: token ?? null,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            }),

            setLoading: (isLoading: boolean) => set ({ isLoading }),

            setError: (error: string | null) => set ({ error, isLoading: false }),

            logout: () => {
                set(initialState)
            },
        }),
        {
            name: 'heladeria-auth',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        },
    ),
)