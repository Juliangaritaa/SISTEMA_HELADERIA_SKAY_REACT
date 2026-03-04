export interface LoginCredentials {
    correo: string
    password: string
}

export interface UserData {
    id: number
    nombreUsuario: string
    rol: number
}

export interface LoginResponse {
    exito: boolean
    mensaje: string
    datos?: UserData
}

export interface AuthState {
    user: UserData | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
}