import React from "react";
import {
    Table, TableHeader, TableColumn, TableBody,
    TableRow, TableCell, Input, Button, Dropdown,
    DropdownTrigger, DropdownMenu, DropdownItem,
    Pagination, Chip, Spinner,
} from "@nextui-org/react";
import { Search, ChevronDown, Plus, MoreVertical } from "lucide-react";
import { useUsuario } from "../hooks/useUsuario";
import { Usuario } from '../types/usuario.types';
import { NuevoUsuarioModal } from "./NuevoUsuarioModal";
import { EditarUsuarioModal } from './EditarUsuarioModal';

const columns = [
    { name: "NOMBRE USUARIO", uid: "nombreUsuario", sortable: true  },
    { name: "USUARIO", uid: "usuario", sortable: true  },
    { name: "ROL",  uid: "rol", sortable: true  },
    { name: "ACTIVO", uid: "activo", sortable: true  },
    { name: "EMAIL", uid: "email", sortable: true  },
    { name: "ACCIONES",      uid: "acciones", sortable: false },
];

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(value);

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("es-CO");

const getStockColor = (stock: number): "danger" | "warning" | "success" => {
    if (stock <= 5)  return "danger";
    if (stock <= 15) return "warning";
    return "success";
};

export function UsuarioTable() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const {usuarios, isLoading, refetch, editarUsuario, eliminarUsuario} = useUsuario();
    const [filterValue, setFilterValue] = React.useState("");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(1);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "nombreUsuario",
        direction: "ascending" as "ascending" | "descending",
    });
    const [deletingId, setDeletingId] = React.useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = React.useState<Usuario | null>(null);

    const handleEditar = (usuario: Usuario) => {
        setUsuarioSeleccionado(usuario);
        setIsEditModalOpen(true);
    };

    const handleEliminar = async (idUsuario: number) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (!confirmar) return;

    setDeletingId(idUsuario);
    await eliminarUsuario(idUsuario);
    setDeletingId(null);
    }

    const filteredItems = React.useMemo(() => {
    const safeUsuarios = Array.isArray(usuarios) ? usuarios : [];

    let result = [...safeUsuarios];

    if (filterValue) {
        result = result.filter((u) =>
            u.nombreUsuario.toLowerCase().includes(filterValue.toLowerCase())
        );
    }

    return result;
}, [usuarios, filterValue]);

    const pages = Math.max(1, Math.ceil(filteredItems.length / rowsPerPage));

    const paginatedItems = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredItems.slice(start, start + rowsPerPage);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...paginatedItems].sort((a, b) => {
            const first  = a[sortDescriptor.column as keyof Usuario];
            const second = b[sortDescriptor.column as keyof Usuario];
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, paginatedItems]);

    const renderCell = React.useCallback((usuario: Usuario, columnKey: string) => {
        switch (columnKey) {
            case "nombreUsuario":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small">{usuario.nombreUsuario}</p>
                    </div>
                );
            case "usuario":
                return (
                    <div className="flex flex-col">
                        <p className="text-small">{usuario.usuario}</p>
                    </div>
                );
            case "rol":
                return (
                    <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        color={usuario.rol === 1 ? "primary":"secondary"} 
                        size="sm"
                        variant="flat"
                    >
                        {usuario.rol === 1 ? "Administrador":"Cajero"} 
                    </Chip>
                );
            case "activo":
                return (
                    <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        color={usuario.activo ? "success":"danger"}
                        size="sm"
                        variant="dot"
                    >
                        {usuario.activo ? "Activo":"Inactivo"} 
                    </Chip>
                );
                case "email":
                return (
                    <div className="flex flex-col">
                        <p className="text-small">{usuario.email}</p>
                    </div>
                );
            case "acciones":
                return (
                    <Dropdown className="bg-background border-1 border-default-200">
                        <DropdownTrigger>
                            <Button isIconOnly radius="full" size="sm" variant="light">
                                <MoreVertical size={16} className="text-default-400" />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem 
                                key="editar"
                                onPress={() => handleEditar(usuario)}>
                                Editar
                            </DropdownItem>
                            <DropdownItem 
                                key="eliminar" 
                                className="text-danger" 
                                color="danger"
                                onPress={() => handleEliminar(usuario.idUsuario)}
                                >
                                Eliminar
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return <span>{String(usuario[columnKey as keyof Usuario])}</span>;
        }
    }, [refetch]);

    const topContent = React.useMemo(() => (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-3 items-end">
                <Input
                    isClearable
                    classNames={{ base: "w-full sm:max-w-[44%]", inputWrapper: "border-1" }}
                    placeholder="Buscar usuario..."
                    size="sm"
                    startContent={<Search size={16} className="text-default-300" />}
                    value={filterValue}
                    variant="bordered"
                    onClear={() => { setFilterValue(""); setPage(1); }}
                    onValueChange={(v) => { setFilterValue(v); setPage(1); }}
                />
                <div className="flex gap-3">

                    <Button
                        className="bg-sky-400 text-white"
                        endContent={<Plus size={16} />}
                        size="sm"
                        onPress={() => setIsModalOpen(true)}
                    >
                        Nuevo
                    </Button>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <span className="text-default-400 text-small">
                    Total: {filteredItems.length} usuario
                </span>
                <label className="flex items-center text-default-400 text-small">
                    Filas por página:
                    <select
                        className="bg-transparent outline-none text-default-400 text-small"
                        onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </label>
            </div>
        </div>
    ), [filterValue, filteredItems.length]);

    const bottomContent = React.useMemo(() => (
        <div className="py-2 px-2 flex justify-between items-center">
            <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                classNames={{ cursor: "bg-sky-400 text-white" }}
                page={page}
                total={pages}
                onChange={setPage}
            />
            <div className="hidden sm:flex gap-2">
                <Button
                    isDisabled={page === 1}
                    size="sm"
                    variant="flat"
                    onPress={() => setPage((p) => Math.max(1, p - 1))}
                >
                    Anterior
                </Button>
                <Button
                    isDisabled={page === pages}
                    size="sm"
                    variant="flat"
                    onPress={() => setPage((p) => Math.min(pages, p + 1))}
                >
                    Siguiente
                </Button>
            </div>
        </div>
    ), [page, pages]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold text-sky-500 mb-4">Usuarios</h2>
            <Table
                isHeaderSticky
                aria-label="Tabla de usuarios"
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "max-h-[480px]",
                    th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
                    td: [
                        "first:group-data-[first=true]/tr:before:rounded-none",
                        "last:group-data-[first=true]/tr:before:rounded-none",
                        "group-data-[middle=true]/tr:before:rounded-none",
                        "first:group-data-[last=true]/tr:before:rounded-none",
                        "last:group-data-[last=true]/tr:before:rounded-none",
                    ],
                }}
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSortChange={(d) => setSortDescriptor({
                    column: String(d.column),
                    direction: d.direction,
                })}
            >
                <TableHeader columns={columns}>
                    {(col) => (
                        <TableColumn
                            key={col.uid}
                            align={col.uid === "acciones" ? "center" : "start"}
                            allowsSorting={col.sortable}
                        >
                            {col.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    items={sortedItems}
                    isLoading={isLoading}
                    loadingContent={<Spinner color="primary" />}
                    emptyContent="No se encontraron usuarios"
                >
                    {(usuario) => (
                        <TableRow key={usuario.idUsuario}>
                            {(columnKey) => (
                                <TableCell>{renderCell(usuario, columnKey as string)}</TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            
            { 
                <NuevoUsuarioModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={refetch}
                /> 
            }

            {usuarioSeleccionado && (
                <EditarUsuarioModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setUsuarioSeleccionado(null);
                    }}
                    onSuccess={refetch}
                    usuarios={usuarioSeleccionado}
                    onEditar={editarUsuario}
                />
            )} 
        </div>
    );
}