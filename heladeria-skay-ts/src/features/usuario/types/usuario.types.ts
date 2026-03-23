export interface Usuario {
    idUsuario: number;
    nombreUsuario: string;
    usuario: string;
    password: string;
    rol: number;
    activo: boolean;
    email: string;
}

export interface UsuarioResponse {
    exito: boolean;
    data: Usuario[];
}