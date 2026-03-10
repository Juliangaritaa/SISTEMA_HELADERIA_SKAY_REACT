import React from "react";
import {
    Table, TableHeader, TableColumn, TableBody,
    TableRow, TableCell, Input, Button, Dropdown,
    DropdownTrigger, DropdownMenu, DropdownItem,
    Pagination, Chip, Spinner,
} from "@nextui-org/react";
import { Search, ChevronDown, Plus, MoreVertical } from "lucide-react";
import { useProducto } from "../hooks/useProducto";
import { Producto } from '../types/producto.type';
import { NuevoProductoModal } from "./NuevoProductoModal";
import { EditarProductoModal } from './EditarProductoModal';

const columns = [
    { name: "PRODUCTO",      uid: "nombreProducto",           sortable: true  },
    { name: "PRECIO COMPRA", uid: "precioCompraProducto",     sortable: true  },
    { name: "PRECIO VENTA",  uid: "precioProducto",           sortable: true  },
    { name: "STOCK",         uid: "stockProducto",            sortable: true  },
    { name: "VENCIMIENTO",   uid: "fechaVencimientoProducto", sortable: true  },
    { name: "CATEGORÍA",     uid: "categoria",                sortable: false },
    { name: "ACCIONES",      uid: "acciones",                 sortable: false },
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

export function ProductoTable() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const {productos, isLoading, refetch, editarProducto, eliminarProducto} = useProducto();
    const [filterValue, setFilterValue] = React.useState("");
    const [categoriaFilter, setCategoriaFilter] = React.useState<string>("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(1);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "nombreProducto",
        direction: "ascending" as "ascending" | "descending",
    });
    const [deletingId, setDeletingId] = React.useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = React.useState<Producto | null>(null);

    const handleEditar = (producto: Producto) => {
        setProductoSeleccionado(producto);
        setIsEditModalOpen(true);
    };

    const handleEliminar = async (idProducto: number) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este productp?");
    if (!confirmar) return;

    setDeletingId(idProducto);
    await eliminarProducto(idProducto);
    setDeletingId(null);
    }

    const categorias = React.useMemo(() => {
        const unique = [...new Set(productos.map((p) => p.categoria))];
        return unique.map((c) => ({ nombre: c }));
    }, [productos]);

    const filteredItems = React.useMemo(() => {
        let result = [...productos];
        if (filterValue) {
            result = result.filter((p) =>
                p.nombreProducto.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
        if (categoriaFilter !== "all") {
            result = result.filter((p) => p.categoria === categoriaFilter);
        }
        return result;
    }, [productos, filterValue, categoriaFilter]);

    const pages = Math.max(1, Math.ceil(filteredItems.length / rowsPerPage));

    const paginatedItems = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredItems.slice(start, start + rowsPerPage);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...paginatedItems].sort((a, b) => {
            const first  = a[sortDescriptor.column as keyof Producto];
            const second = b[sortDescriptor.column as keyof Producto];
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, paginatedItems]);

    const renderCell = React.useCallback((producto: Producto, columnKey: string) => {
        switch (columnKey) {
            case "nombreProducto":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small">{producto.nombreProducto}</p>
                    </div>
                );
            case "precioCompraProducto":
                return (
                    <div className="flex flex-col">
                        <p className="text-small">{formatCurrency(producto.precioCompraProducto)}</p>
                    </div>
                );
            case "precioProducto":
                return (
                    <div className="flex flex-col">
                        <p className="text-small font-semibold text-green-600">
                            {formatCurrency(producto.precioProducto)}
                        </p>
                    </div>
                );
            case "stockProducto":
                return (
                    <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        color={getStockColor(producto.stockProducto)}
                        size="sm"
                        variant="dot"
                    >
                        {producto.stockProducto} Unidades
                    </Chip>
                );
            case "fechaVencimientoProducto":
                return <span className="text-small">{formatDate(producto.fechaVencimientoProducto)}</span>;
            case "categoria":
                return (
                    <Chip size="sm" variant="flat" className="bg-sky-100 text-sky-600">
                        {producto.categoria}
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
                                onPress={() => handleEditar(producto)}>
                                Editar
                            </DropdownItem>
                            <DropdownItem 
                                key="eliminar" 
                                className="text-danger" 
                                color="danger"
                                onPress={() => handleEliminar(producto.idProducto)}
                                >
                                Eliminar
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return <span>{String(producto[columnKey as keyof Producto])}</span>;
        }
    }, [deletingId, handleEditar, eliminarProducto, refetch]);

    const topContent = React.useMemo(() => (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-3 items-end">
                <Input
                    isClearable
                    classNames={{ base: "w-full sm:max-w-[44%]", inputWrapper: "border-1" }}
                    placeholder="Buscar producto..."
                    size="sm"
                    startContent={<Search size={16} className="text-default-300" />}
                    value={filterValue}
                    variant="bordered"
                    onClear={() => { setFilterValue(""); setPage(1); }}
                    onValueChange={(v) => { setFilterValue(v); setPage(1); }}
                />
                <div className="flex gap-3">
                    <Dropdown>
                        <DropdownTrigger className="hidden sm:flex">
                            <Button
                                endContent={<ChevronDown size={16} className="text-small" />}
                                size="sm"
                                variant="flat"
                            >
                                {categoriaFilter === "all" ? "Categoría" : categoriaFilter}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Filtro categoría"
                            onAction={(key) => { setCategoriaFilter(key as string); setPage(1); }}
                        >
                            {[
                                <DropdownItem key="all">Todas</DropdownItem>,
                                ...categorias.map((c) => (
                                    <DropdownItem key={c.nombre}>{c.nombre}</DropdownItem>
                                ))
                            ]}
                        </DropdownMenu>
                    </Dropdown>

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
                    Total: {filteredItems.length} productos
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
    ), [filterValue, categoriaFilter, categorias, filteredItems.length]);

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
            <h2 className="text-xl font-bold text-sky-500 mb-4">Productos</h2>
            <Table
                isHeaderSticky
                aria-label="Tabla de productos"
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
                    emptyContent="No se encontraron productos"
                >
                    {(producto) => (
                        <TableRow key={producto.idProducto}>
                            {(columnKey) => (
                                <TableCell>{renderCell(producto, columnKey as string)}</TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <NuevoProductoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={refetch}
            />

            {productoSeleccionado && (
                <EditarProductoModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setProductoSeleccionado(null);
                    }}
                    onSuccess={refetch}
                    producto={productoSeleccionado}
                    onEditar={editarProducto}
                />
            )}
        </div>
    );
}