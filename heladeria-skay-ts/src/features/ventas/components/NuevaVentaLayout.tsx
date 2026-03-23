import React from "react";
import { Input, Chip, Spinner } from "@nextui-org/react";
import { Search } from "lucide-react";
import { useVenta } from "../hooks/useVenta";
import { Producto } from "../producto/types/producto.type";
import { NuevaVentaCarrito } from "./NuevaVentaCarrito";
import { NuevaVentaModal } from "./NuevaVentaModal";

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-CO", {
        style: "currency", currency: "COP", minimumFractionDigits: 0,
    }).format(value);

export function NuevaVentaLayout() {
    const {
    carrito, metodoPago, setMetodoPago,
    agregarAlCarrito, quitarDelCarrito, cambiarCantidad,
    limpiarCarrito, totalCarrito, procesarVenta,
    error, ventaExitosa, productos,
    isLoading, 
} = useVenta();

    const [busqueda, setBusqueda] = React.useState("");
    const [showExitoModal, setShowExitoModal] = React.useState(false);

    React.useEffect(() => {
        if (ventaExitosa) setShowExitoModal(true);
    }, [ventaExitosa]);

    const handleCloseModal = () => {
        setShowExitoModal(false);
        limpiarCarrito();
    };

    const productosFiltrados = productos.filter((p) =>
        p.nombreProducto.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="p-4 flex gap-4 h-[calc(100vh-80px)]">

            {/* ── CATÁLOGO ── */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">

                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-sky-500">Nueva Venta</h2>
                    <Chip size="sm" className="bg-sky-100 text-sky-600">
                        {productos.length} productos disponibles
                    </Chip>
                </div>

                <Input
                    isClearable
                    placeholder="Buscar producto..."
                    size="sm"
                    variant="bordered"
                    classNames={{ inputWrapper: "border-sky-200 hover:border-sky-400" }}
                    startContent={<Search size={16} className="text-sky-400" />}
                    value={busqueda}
                    onClear={() => setBusqueda("")}
                    onValueChange={setBusqueda}
                />

                {isLoading ? (
                    <div className="flex justify-center items-center flex-1">
                        <Spinner color="primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto pr-1">
                        {productosFiltrados.map((producto: Producto) => {
                            const enCarrito = carrito.find(
                                (c) => c.idProducto === producto.idProducto
                            );
                            return (
                                <div
                                    key={producto.idProducto}
                                    onClick={() => producto.stockProducto > 0 && agregarAlCarrito({
                                        idProducto:     producto.idProducto,
                                        nombreProducto: producto.nombreProducto,
                                        precioUnitario: producto.precioProducto,
                                        cantidad:       1,
                                    })}
                                    className={`border rounded-xl p-3 flex flex-col gap-2 transition-all
                                        ${producto.stockProducto === 0
                                            ? "opacity-50 cursor-not-allowed border-default-200"
                                            : "cursor-pointer hover:shadow-md"
                                        }
                                        ${enCarrito
                                            ? "border-sky-400 bg-sky-50"
                                            : "border-sky-100 hover:border-sky-400 bg-white"
                                        }`}
                                >
                                    <p className="text-small line-clamp-2">
                                        {producto.nombreProducto}
                                    </p>
                                    <p className="text-sky-500 font-semibold text-small">
                                        {formatCurrency(producto.precioProducto)}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <Chip
                                            size="sm" variant="dot"
                                            className="border-none text-default-500"
                                            color={
                                                producto.stockProducto === 0 ? "danger" :
                                                producto.stockProducto <= 5  ? "danger" :
                                                producto.stockProducto <= 15 ? "warning" : "success"
                                            }
                                        >
                                            {producto.stockProducto === 0
                                                ? "Sin stock"
                                                : `Stock: ${producto.stockProducto}`}
                                        </Chip>
                                        {enCarrito && (
                                            <Chip size="sm" className="bg-sky-400 text-white">
                                                x{enCarrito.cantidad}
                                            </Chip>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {productosFiltrados.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-12 text-default-300 gap-2">
                                <Search size={40} />
                                <p className="text-small">No se encontraron productos</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── CARRITO ── */}
            <NuevaVentaCarrito
                carrito={carrito}
                metodoPago={metodoPago}
                totalCarrito={totalCarrito}
                isLoading={isLoading}
                error={error}
                onMetodoPago={setMetodoPago}
                onCambiarCantidad={cambiarCantidad}
                onQuitar={quitarDelCarrito}
                onLimpiar={limpiarCarrito}
                onCobrar={procesarVenta}
            />

            {/* ── MODAL ÉXITO ── */}
            <NuevaVentaModal
                isOpen={showExitoModal}
                ventaExitosa={ventaExitosa}
                onClose={handleCloseModal}
            />

        </div>
    );
}