import React from "react"; // ← sin llaves
import {
    Card, CardBody, CardHeader, Chip, Divider, Button, Input,
} from "@nextui-org/react";
import { ShoppingCart, Trash2, Plus, Minus, AlertCircle } from "lucide-react";
import { ItemCarrito } from "../types/venta.types";

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-CO", {
        style: "currency", currency: "COP", minimumFractionDigits: 0,
    }).format(value);

const metodosPago = ["Efectivo", "Transferencia"];

interface Props {
    carrito:           ItemCarrito[];
    metodoPago:        string;
    totalCarrito:      number;
    isLoading:         boolean;
    error:             string | null;
    onMetodoPago:      (metodo: string) => void;
    onCambiarCantidad: (idProducto: number, cantidad: number) => void;
    onQuitar:          (idProducto: number) => void;
    onLimpiar:         () => void;
    onCobrar:          () => void;
}

export function NuevaVentaCarrito({
    carrito, metodoPago, totalCarrito, isLoading, error,
    onMetodoPago, onCambiarCantidad, onQuitar, onLimpiar, onCobrar,
}: Props) {

    const [dineroRecibido, setDineroRecibido] = React.useState("");

    const cambio = React.useMemo(() => {
        const recibido = parseFloat(dineroRecibido);
        if (!recibido || recibido < totalCarrito) return null;
        return recibido - totalCarrito;
    }, [dineroRecibido, totalCarrito]);

    const faltante = React.useMemo(() => {
        const recibido = parseFloat(dineroRecibido);
        if (!dineroRecibido || recibido >= totalCarrito) return null;
        return totalCarrito - recibido;
    }, [dineroRecibido, totalCarrito]);

    return (
        <div className="w-80 flex flex-col gap-3">

            {/* items */}
            <Card className="flex-1 border border-sky-100 overflow-hidden">
                <CardHeader className="pb-2 border-b border-sky-100">
                    <div className="flex items-center gap-2 w-full">
                        <ShoppingCart size={20} className="text-sky-500" />
                        <h3 className="font-bold text-sky-500 flex-1">Carrito</h3>
                        {carrito.length > 0 && (
                            <Chip size="sm" className="bg-sky-400 text-white">
                                {carrito.length}
                            </Chip>
                        )}
                    </div>
                </CardHeader>

                <CardBody className="gap-2 overflow-y-auto p-3">
                    {carrito.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-default-300 gap-3">
                            <ShoppingCart size={48} />
                            <p className="text-small text-center">
                                Haz click en un producto para agregarlo
                            </p>
                        </div>
                    ) : (
                        carrito.map((item) => (
                            <div
                                key={item.idProducto}
                                className="flex flex-col gap-1 p-2 rounded-xl bg-sky-50 border border-sky-100"
                            >
                                <div className="flex justify-between items-start gap-1">
                                    <p className="text-small font-semibold line-clamp-2 flex-1">
                                        {item.nombreProducto}
                                    </p>
                                    <Button
                                        isIconOnly size="sm" variant="light" color="danger"
                                        className="min-w-6 h-6 shrink-0"
                                        onPress={() => onQuitar(item.idProducto)}
                                    >
                                        <Trash2 size={12} />
                                    </Button>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1">
                                        <Button
                                            isIconOnly size="sm" variant="flat"
                                            className="min-w-6 h-6 bg-white border border-sky-200"
                                            onPress={() => onCambiarCantidad(item.idProducto, item.cantidad - 1)}
                                        >
                                            <Minus size={12} />
                                        </Button>
                                        <span className="text-small w-6 text-center font-bold">
                                            {item.cantidad}
                                        </span>
                                        <Button
                                            isIconOnly size="sm" variant="flat"
                                            className="min-w-6 h-6 bg-white border border-sky-200"
                                            onPress={() => onCambiarCantidad(item.idProducto, item.cantidad + 1)}
                                        >
                                            <Plus size={12} />
                                        </Button>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-tiny text-default-400">
                                            {formatCurrency(item.precioUnitario)} c/u
                                        </p>
                                        <p className="text-small font-bold text-sky-600">
                                            {formatCurrency(item.precioUnitario * item.cantidad)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </CardBody>
            </Card>

            {/* método de pago + total + acciones */}
            <Card className="border border-sky-100">
                <CardBody className="gap-3 p-3">

                    <div className="flex flex-col gap-2">
                        <p className="text-small font-bold text-sky-500">Método de pago</p>
                        <div className="flex flex-wrap gap-1">
                            {metodosPago.map((metodo) => (
                                <Button
                                    key={metodo}
                                    size="sm"
                                    variant={metodoPago === metodo ? "solid" : "flat"}
                                    className={
                                        metodoPago === metodo
                                            ? "bg-sky-400 text-white cursor-pointer"
                                            : "cursor-pointer hover:bg-sky-100 border border-sky-200"
                                    }
                                    onPress={() => onMetodoPago(metodo)}
                                >
                                    {metodo}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <Divider />

                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-small text-default-400">
                            <span>Productos</span>
                            <span>{carrito.reduce((a, b) => a + b.cantidad, 0)} items</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-bold">Total</span>
                            <span className="text-xl font-bold text-sky-500">
                                {formatCurrency(totalCarrito)}
                            </span>
                        </div>
                    </div>

                    {/* dinero recibido — solo si método es Efectivo */}
                    {metodoPago === "Efectivo" && (
                        <div className="flex flex-col gap-2">
                            <Input
                                size="sm"
                                type="number"
                                label="Dinero recibido"
                                labelPlacement="outside"
                                placeholder="0"
                                variant="bordered"
                                value={dineroRecibido}
                                classNames={{
                                    inputWrapper: "border-sky-200 hover:border-sky-400 focus-within:!border-sky-400",
                                    label: "text-sky-500 text-small font-bold",
                                }}
                                startContent={<span className="text-default-400 text-small">$</span>}
                                onValueChange={(v) => setDineroRecibido(v)}
                            />

                            {/* cambio */}
                            {cambio !== null && (
                                <div className="flex justify-between items-center bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                                    <span className="text-small font-bold text-green-600">Cambio</span>
                                    <span className="text-small font-bold text-green-600">
                                        {formatCurrency(cambio)}
                                    </span>
                                </div>
                            )}

                            {/* faltante */}
                            {faltante !== null && (
                                <div className="flex justify-between items-center bg-danger-50 border border-danger-200 rounded-lg px-3 py-2">
                                    <span className="text-small font-bold text-danger">Faltante</span>
                                    <span className="text-small font-bold text-danger">
                                        {formatCurrency(faltante)}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 bg-danger-50 border border-danger-200 rounded-lg p-2">
                            <AlertCircle size={16} className="text-danger shrink-0" />
                            <p className="text-danger text-small">{error}</p>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button
                            size="sm" variant="flat" color="danger" className="flex-1"
                            isDisabled={carrito.length === 0 || isLoading}
                            onPress={() => { onLimpiar(); setDineroRecibido(""); }}
                        >
                            Limpiar
                        </Button>
                        <Button
                            size="sm"
                            className="flex-1 bg-sky-400 text-white font-semibold"
                            isLoading={isLoading}
                            isDisabled={
                                carrito.length === 0 ||
                                !metodoPago ||
                                (metodoPago === "Efectivo" && (!dineroRecibido || parseFloat(dineroRecibido) < totalCarrito))
                            }
                            onPress={onCobrar}
                        >
                            Cobrar
                        </Button>
                    </div>

                </CardBody>
            </Card>
        </div>
    );
}