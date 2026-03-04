import {
  Navbar, NavbarBrand, NavbarContent, NavbarItem,
  Link, DropdownItem, DropdownTrigger, Dropdown,
  DropdownMenu, Avatar, Spinner,
} from "@nextui-org/react";
import { IceCream } from "lucide-react";
import { useMenu } from "../hook/useMenu";
import { useAuthStore } from "../../auth/store/authStore";
import { useNavigate } from "react-router-dom";

export function AppNavbar() {
    const { menu, isLoading } = useMenu();
    const usuario = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
    <Navbar isBordered className="bg-white shadow-sm">

      {/* MARCA */}
      <NavbarBrand>
        <div className="p-1 bg-sky-400 rounded-full mr-2">
          <IceCream className="text-white" size={20} />
        </div>
        <p className="font-bold text-sky-500 text-lg">Heladería Sky</p>
      </NavbarBrand>

      {/* ITEMS DEL MENÚ DINÁMICO */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {isLoading ? (
          <Spinner size="sm" color="primary" />
        ) : (
          menu.map((item) => (
            <NavbarItem key={item.nombre}>
              <Link
                color="foreground"
                href={item.url}
                className="hover:text-sky-500 transition-colors"
              >
                {item.nombre}
              </Link>
            </NavbarItem>
          ))
        )}
      </NavbarContent>

      {/* AVATAR Y DROPDOWN */}
      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="primary"
              name={usuario?.nombreUsuario}
              size="sm"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Acciones de perfil" variant="flat">
            <DropdownItem key="logout" color="danger" onPress={handleLogout}>
              Cerrar sesión
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

    </Navbar>
  );
}