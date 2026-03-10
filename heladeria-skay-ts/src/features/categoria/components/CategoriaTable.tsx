import React from "react";
import {
    Table, TableHeader, TableColumn, TableBody,
    TableRow, TableCell, Input, Button, Dropdown,
    DropdownTrigger, DropdownMenu, DropdownItem,
    Pagination, Chip, Spinner,
} from "@nextui-org/react";
import { Search, ChevronDown, Plus, MoreVertical } from "lucide-react";
import { useCategoria } from "../hooks/useCategoria";
import { Categoria } from '../types/categoria.type';
import { NuevaCategoriaModal } from "./NuevaCategoriaModal";
// import { EditarProductoModal } from './EditarProductoModal';

const columns = [
    { name: "NOMBRE CATEGORÍA", uid: "nombreCategoria", sortable: true  },
    { name: "DESCRIPCIÓN CATEGORÍA", uid: "descripcionCategoria", sortable: true  },
    { name: "ESTADO", uid: "estado", sortable: true  },
    { name: "ACCIONES", uid: "acciones", sortable: false },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  1: "success",
  0: "danger",
};

export function CategoriaTable() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const {categoria, isLoading, refetch, editarCategoria, eliminarCategoria} = useCategoria();
    const [filterValue, setFilterValue] = React.useState("");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(1);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "nombreCategoria",
        direction: "ascending" as "ascending" | "descending",
    });
    const [deletingId, setDeletingId] = React.useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = React.useState<Categoria | null>(null);

    const handleEditar = (categoria: Categoria) => {
        setCategoriaSeleccionada(categoria);
        setIsEditModalOpen(true);
    };

    const handleEliminar = async (idCategoria: number) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta categoria?");
    if (!confirmar) return;

    setDeletingId(idCategoria);
    await eliminarCategoria(idCategoria);
    setDeletingId(null);
    }

    const filteredItems = React.useMemo(() => {
        let result = [...categoria];
        if (filterValue) {
            result = result.filter((c) =>
                c.nombreCategoria.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
        return result;
    }, [categoria, filterValue]);

    const pages = Math.max(1, Math.ceil(filteredItems.length / rowsPerPage));

    const paginatedItems = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredItems.slice(start, start + rowsPerPage);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...paginatedItems].sort((a, b) => {
            const first  = a[sortDescriptor.column as keyof Categoria];
            const second = b[sortDescriptor.column as keyof Categoria];
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, paginatedItems]);

    const renderCell = React.useCallback((categoria: Categoria, columnKey: string) => {
        
        switch (columnKey) {
            case "nombreCategoria":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small">{categoria.nombreCategoria}</p>
                    </div>
                );
            case "descripcionCategoria":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small">{categoria.descripcionCategoria}</p>
                    </div>
                );
            case "estado":
                const esActivo = Number(categoria.estado) === 1;
                
                return (
                    <Chip 
                        className="capitalize" 
                        color={statusColorMap[esActivo ? 1 : 0]} 
                        size="sm" 
                        variant="flat"
                    >
                        {esActivo ? "Activo" : "Inactivo"}
                    </Chip>
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
                            <DropdownItem key="ver">Ver detalle</DropdownItem>
                            <DropdownItem 
                                key="editar"
                                onPress={() => handleEditar(categoria)}>
                                Editar
                            </DropdownItem>
                            <DropdownItem 
                                key="eliminar" 
                                className="text-danger" 
                                color="danger"
                                onPress={() => handleEliminar(categoria.idCategoria)}
                                >
                                Eliminar
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return <span>{String(categoria[columnKey as keyof Categoria])}</span>;
        }
    }, [deletingId, handleEditar, eliminarCategoria, refetch]);

    const topContent = React.useMemo(() => (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-3 items-end">
                <Input
                    isClearable
                    classNames={{ base: "w-full sm:max-w-[44%]", inputWrapper: "border-1" }}
                    placeholder="Buscar categoria..."
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
                    Total: {filteredItems.length} categoria
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
            <h2 className="text-xl font-bold text-sky-500 mb-4">Categorias</h2>
            <Table
                isHeaderSticky
                aria-label="Tabla de categorias"
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
                    emptyContent="No se encontraron categorias."
                >
                    {(categoria) => (
                        <TableRow key={categoria.idCategoria}>
                            {(columnKey) => (
                                <TableCell>{renderCell(categoria, columnKey as string)}</TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            { <NuevaCategoriaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={refetch}
            />}

            {/* {categoriaSeleccionada && (
                <EditarCategoriaModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setcategoriaSeleccionada(null);
                    }}
                    onSuccess={refetch}
                    categoria={categoriaSeleccionada}
                    onEditar={editarCategoria}
                />
            )} */}
        </div>
    );
}