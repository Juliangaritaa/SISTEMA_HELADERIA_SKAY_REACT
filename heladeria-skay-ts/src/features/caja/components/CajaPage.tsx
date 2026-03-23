import React from "react";
import {
    Card, CardBody, CardHeader, Chip, Divider, Button, Spinner,
} from "@nextui-org/react";
import { Landmark, TrendingUp, DollarSign, Lock, Unlock, ArrowDownCircle } from "lucide-react";
import { useCaja } from "../hooks/useCaja";
import { AbrirCajaModal }   from "./AbrirCajaModal";
import { EgresoCajaModal }  from "./EgresoCajaModal";
import { CerrarCajaModal }  from "./CerrarCajaModal";
import { MovimientosTable } from "./MovimientosTable";

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-CO", {
        style: "currency", currency: "COP", minimumFractionDigits: 0,
    }).format(value);

export default function CajaPage() {
    const {
        caja, movimientos, isLoading,
        abrirCaja, registrarEgreso, cerrarCaja,
    } = useCaja();

    const [modalAbrir,  setModalAbrir]  = React.useState(false);
    const [modalEgreso, setModalEgreso] = React.useState(false);
    const [modalCerrar, setModalCerrar] = React.useState(false);

    const cajaAbierta = caja?.estado === "abierta";

    const totalEgresos = movimientos
    .filter((m) => m.tipo === 5)
    .reduce((acc, m) => acc + m.monto, 0);

    const esperado = (caja?.montoInicial ?? 0) + (caja?.totalVentas ?? 0) - totalEgresos;

    return (
        <div className="p-4 flex flex-col gap-4">

            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-sky-500">Caja</h2>
                {!isLoading && (
                    <Chip
                        size="sm"
                        variant="dot"
                        color={cajaAbierta ? "success" : "danger"}
                    >
                        {cajaAbierta ? "Abierta" : "Cerrada"}
                    </Chip>
                )}
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Spinner color="primary" />
                </div>
            ) : (
                <>
                    {/* ── INFO DE CAJA ── */}
                    <Card className="border border-sky-100">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-sky-100 rounded-lg">
                                    <Landmark size={20} className="text-sky-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-sky-500">
                                        {cajaAbierta ? `Caja #${caja?.cajaId}` : "Sin caja activa"}
                                    </p>
                                    <p className="text-tiny text-default-400">
                                        {cajaAbierta ? "Caja del día en curso" : "No hay caja abierta hoy"}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>

                        <Divider />

                        <CardBody className="gap-4">
                            {cajaAbierta ? (
                                <>
                                    {/* stats */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="flex flex-col gap-1 p-3 bg-sky-50 rounded-xl border border-sky-100">
                                            <div className="flex items-center gap-1">
                                                <DollarSign size={14} className="text-sky-400" />
                                                <p className="text-tiny text-default-400">Monto inicial</p>
                                            </div>
                                            <p className="font-bold text-sky-600">
                                                {formatCurrency(caja?.montoInicial ?? 0)}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-1 p-3 bg-green-50 rounded-xl border border-green-100">
                                            <div className="flex items-center gap-1">
                                                <TrendingUp size={14} className="text-green-500" />
                                                <p className="text-tiny text-default-400">Total ventas</p>
                                            </div>
                                            <p className="font-bold text-green-600">
                                                {formatCurrency(caja?.totalVentas ?? 0)}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-1 p-3 bg-purple-50 rounded-xl border border-purple-100">
                                            <div className="flex items-center gap-1">
                                                <DollarSign size={14} className="text-purple-500" />
                                                <p className="text-tiny text-default-400">Esperado</p>
                                            </div>
                                            <p className="font-bold text-purple-600">
                                                {formatCurrency(esperado)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* acciones */}
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="flat"
                                            color="warning"
                                            className="flex-1"
                                            startContent={<ArrowDownCircle size={16} />}
                                            onPress={() => setModalEgreso(true)}
                                        >
                                            Registrar Egreso
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="flat"
                                            color="danger"
                                            className="flex-1"
                                            startContent={<Lock size={16} />}
                                            onPress={() => setModalCerrar(true)}
                                        >
                                            Cerrar Caja
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-3 py-4">
                                    <div className="p-4 bg-sky-50 rounded-full">
                                        <Unlock size={32} className="text-sky-400" />
                                    </div>
                                    <p className="text-default-400 text-small text-center">
                                        No hay una caja abierta. Abre la caja para comenzar a registrar ventas.
                                    </p>
                                    <Button
                                        className="bg-sky-400 text-white"
                                        startContent={<Unlock size={16} />}
                                        onPress={() => setModalAbrir(true)}
                                    >
                                        Abrir Caja
                                    </Button>
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    {/* ── MOVIMIENTOS ── */}
                    <Card className="border border-sky-100">
                        <CardHeader>
                            <p className="font-bold text-sky-500">Movimientos del día</p>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <MovimientosTable
                                movimientos={movimientos}
                                isLoading={isLoading}
                            />
                        </CardBody>
                    </Card>
                </>
            )}

            {/* ── MODALES ── */}
            <AbrirCajaModal
                isOpen={modalAbrir}
                onClose={() => setModalAbrir(false)}
                onAbrir={abrirCaja}
            />
            <EgresoCajaModal
                isOpen={modalEgreso}
                onClose={() => setModalEgreso(false)}
                onRegistrar={registrarEgreso}
            />
            <CerrarCajaModal
                isOpen={modalCerrar}
                onClose={() => setModalCerrar(false)}
                onCerrar={cerrarCaja}
                caja={caja}
                totalEgresos={totalEgresos}
            />
        </div>
    );
}