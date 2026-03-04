export interface MenuItem {
    nombre: string;
    icono: string;
    url: string;
}

export interface MenuResponse {
    exito: boolean;
    menu: MenuItem[];
}