export interface Categoria {
    idCategoria: number;
    nombreCategoria: string;
    descripcionCategoria: string;
}

export interface CategoriaResponse {
    exito: boolean;
    data: Categoria[];
}