// src/features/reporte/ReportePage.tsx
import React from "react";
import {
    Card, CardBody, CardHeader, Divider,
    Input, Button, Spinner, Chip, Table,
    TableHeader, TableColumn, TableBody,
    TableRow, TableCell,
} from "@nextui-org/react";
import {
    TrendingUp, Package, AlertTriangle,
    Clock, Landmark, RefreshCw,
} from "lucide-react";
import { useReporte } from "../hooks/useReporte";
import { VentasLineChart }    from "./VentasLineChart";
import { ProductosBarChart }  from "./ProductosBarChart";
import { MetodoPagoChart }    from "./MetodoPagoChart";

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-CO", {
        style: "currency", currency: "COP", minimumFractionDigits: 0,
    }).format(value);

const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-CO");

export default function ReportePage() {
    const {
        fechaInicio, setFechaInicio,
        fechaFin, setFechaFin,
        ventas, masVendidos, bajoStock, porVencer, historialCajas,
        isLoading, fetchTodo,
    } = useReporte();

    React.useEffect(() => { fetchTodo(); }, [fetchTodo]);

    // KPIs
    const totalVentas    = ventas.reduce((a, v) => a + v.total, 0);
    const cantidadVentas = ventas.length;
    const ticketPromedio = cantidadVentas > 0 ? totalVentas / cantidadVentas : 0;

    return (
        <div className="p-4 flex flex-col gap-4">

            {/* ── HEADER + FILTROS ── */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-sky-500">Reportes</h2>
                    <Button
                        size="sm"
                        className="bg-sky-400 text-white"
                        startContent={<RefreshCw size={14} />}
                        isLoading={isLoading}
                        onPress={fetchTodo}
                    >
                        Actualizar
                    </Button>
                </div>

                {/* filtro de fechas */}
                <Card className="border border-sky-100">
                    <CardBody className="flex flex-row gap-3 items-end p-3">
                        <Input
                            type="date" size="sm" label="Fecha inicio"
                            labelPlacement="outside" variant="bordered"
                            value={fechaInicio}
                            classNames={{
                                inputWrapper: "border-sky-200 hover:border-sky-400 focus-within:!border-sky-400",
                                label: "text-sky-500",
                            }}
                            onChange={(e) => setFechaInicio(e.target.value)}
                        />
                        <Input
                            type="date" size="sm" label="Fecha fin"
                            labelPlacement="outside" variant="bordered"
                            value={fechaFin}
                            classNames={{
                                inputWrapper: "border-sky-200 hover:border-sky-400 focus-within:!border-sky-400",
                                label: "text-sky-500",
                            }}
                            onChange={(e) => setFechaFin(e.target.value)}
                        />
                        <Button
                            size="sm" className="bg-sky-400 text-white shrink-0"
                            onPress={fetchTodo}
                        >
                            Filtrar
                        </Button>
                    </CardBody>
                </Card>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Spinner color="primary" />
                </div>
            ) : (
                <>
                    {/* ── KPIs ── */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: "Total ventas",    value: formatCurrency(totalVentas), icon: <TrendingUp size={20} className="text-sky-500" />,    bg: "bg-sky-50",    border: "border-sky-100"    },
                            { label: "N° ventas",       value: cantidadVentas,              icon: <Package size={20} className="text-purple-500" />,    bg: "bg-purple-50", border: "border-purple-100" },
                            { label: "Ticket promedio", value: formatCurrency(ticketPromedio), icon: <TrendingUp size={20} className="text-green-500" />, bg: "bg-green-50",  border: "border-green-100"  },
                        ].map((kpi) => (
                            <Card key={kpi.label} className={`border ${kpi.border}`}>
                                <CardBody className={`${kpi.bg} p-3 gap-1`}>
                                    <div className="flex items-center gap-2">
                                        {kpi.icon}
                                        <p className="text-small text-default-500">{kpi.label}</p>
                                    </div>
                                    <p className="text-xl font-bold">{kpi.value}</p>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    {/* ── GRÁFICAS ROW 1 ── */}
                    <div className="grid grid-cols-2 gap-4">

                        {/* ventas por fecha */}
                        <Card className="border border-sky-100">
                            <CardHeader className="pb-1">
                                <div className="flex items-center gap-2">
                                    <TrendingUp size={18} className="text-sky-500" />
                                    <p className="font-bold text-sky-500">Ventas por fecha</p>
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                {ventas.length === 0
                                    ? <p className="text-default-300 text-small text-center py-8">Sin datos</p>
                                    : <VentasLineChart ventas={ventas} />
                                }
                            </CardBody>
                        </Card>

                        {/* método de pago */}
                        <Card className="border border-sky-100">
                            <CardHeader className="pb-1">
                                <div className="flex items-center gap-2">
                                    <TrendingUp size={18} className="text-sky-500" />
                                    <p className="font-bold text-sky-500">Ventas por método de pago</p>
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                {ventas.length === 0
                                    ? <p className="text-default-300 text-small text-center py-8">Sin datos</p>
                                    : <MetodoPagoChart ventas={ventas} />
                                }
                            </CardBody>
                        </Card>
                    </div>

                    {/* ── GRÁFICA ROW 2 ── */}
                    <Card className="border border-sky-100">
                        <CardHeader className="pb-1">
                            <div className="flex items-center gap-2">
                                <Package size={18} className="text-sky-500" />
                                <p className="font-bold text-sky-500">Productos más vendidos</p>
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            {masVendidos.length === 0
                                ? <p className="text-default-300 text-small text-center py-8">Sin datos</p>
                                : <ProductosBarChart productos={masVendidos} />
                            }
                        </CardBody>
                    </Card>

                    {/* ── TABLAS ROW 3 ── */}
                    <div className="grid grid-cols-2 gap-4">

                        {/* bajo stock */}
                        <Card className="border border-sky-100">
                            <CardHeader className="pb-1">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle size={18} className="text-warning" />
                                    <p className="font-bold text-sky-500">Bajo stock</p>
                                    {bajoStock.length > 0 && (
                                        <Chip size="sm" color="warning" variant="flat">
                                            {bajoStock.length}
                                        </Chip>
                                    )}
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody className="p-0">
                                <Table removeWrapper isCompact aria-label="Bajo stock"
                                    classNames={{ th: ["bg-transparent", "text-default-500", "border-b", "border-divider"] }}
                                >
                                    <TableHeader>
                                        <TableColumn>PRODUCTO</TableColumn>
                                        <TableColumn>STOCK</TableColumn>
                                        <TableColumn>ESTADO</TableColumn>
                                    </TableHeader>
                                    <TableBody emptyContent="Sin productos con bajo stock">
                                        {bajoStock.map((p) => (
                                            <TableRow key={p.idProducto}>
                                                <TableCell><p className="text-small">{p.nombreProducto}</p></TableCell>
                                                <TableCell><p className="text-small font-bold">{p.cantidadActual}</p></TableCell>
                                                <TableCell>
                                                    <Chip size="sm" color="danger" variant="flat">
                                                        {p.estado}
                                                    </Chip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardBody>
                        </Card>

                        {/* próximos a vencer */}
                        <Card className="border border-sky-100">
                            <CardHeader className="pb-1">
                                <div className="flex items-center gap-2">
                                    <Clock size={18} className="text-warning" />
                                    <p className="font-bold text-sky-500">Próximos a vencer</p>
                                    {porVencer.length > 0 && (
                                        <Chip size="sm" color="warning" variant="flat">
                                            {porVencer.length}
                                        </Chip>
                                    )}
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody className="p-0">
                                <Table removeWrapper isCompact aria-label="Por vencer"
                                    classNames={{ th: ["bg-transparent", "text-default-500", "border-b", "border-divider"] }}
                                >
                                    <TableHeader>
                                        <TableColumn>PRODUCTO</TableColumn>
                                        <TableColumn>VENCE</TableColumn>
                                    </TableHeader>
                                    <TableBody emptyContent="Sin productos próximos a vencer">
                                        {porVencer.map((p) => {
                                            const dias = Math.ceil(
                                                (new Date(p.DiasRestantes).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                                            );
                                            return (
                                                <TableRow key={p.idProducto}>
                                                    <TableCell><p className="text-small">{p.nombreProducto}</p></TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            size="sm" variant="flat"
                                                            color={dias <= 3 ? "danger" : dias <= 7 ? "warning" : "success"}
                                                        >
                                                            {dias <= 0 ? "Vencido" : `${dias} días`}
                                                        </Chip>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardBody>
                        </Card>
                    </div>

                    {/* ── HISTORIAL CAJAS ── */}
                    <Card className="border border-sky-100">
                        <CardHeader className="pb-1">
                            <div className="flex items-center gap-2">
                                <Landmark size={18} className="text-sky-500" />
                                <p className="font-bold text-sky-500">Historial de cajas</p>
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody className="p-0">
                            <Table removeWrapper isCompact aria-label="Historial cajas"
                                classNames={{ th: ["bg-transparent", "text-default-500", "border-b", "border-divider"] }}
                            >
                                <TableHeader>
                                    <TableColumn>FECHA</TableColumn>
                                    <TableColumn>ABIERTA POR</TableColumn>
                                    <TableColumn>CERRADA POR</TableColumn>
                                    <TableColumn>MONTO INICIAL</TableColumn>
                                    <TableColumn>EFECTIVO CONTADO</TableColumn>
                                    <TableColumn>DIFERENCIA</TableColumn>
                                </TableHeader>
                                <TableBody emptyContent="Sin historial en el período seleccionado">
                                    {historialCajas.map((c) => (
                                        <TableRow key={c.idCaja}>
                                            <TableCell><p className="text-small">{formatFecha(c.fecha)}</p></TableCell>
                                            <TableCell><p className="text-small">{c.abiertaPor} <span className="text-default-400">{c.horaApertura}</span></p></TableCell>
                                            <TableCell><p className="text-small">{c.cerradaPor} <span className="text-default-400">{c.horaCierre}</span></p></TableCell>
                                            <TableCell><p className="text-small">{formatCurrency(c.montoInicial)}</p></TableCell>
                                            <TableCell><p className="text-small">{formatCurrency(c.efectivoContado)}</p></TableCell>
                                            <TableCell>
                                                <Chip
                                                    size="sm" variant="flat"
                                                    color={c.diferencia >= 0 ? "success" : "danger"}
                                                >
                                                    {c.diferencia >= 0 ? "+" : ""}{formatCurrency(c.diferencia)}
                                                </Chip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>
                </>
            )}
        </div>
    );
}