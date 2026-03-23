import React from "react";
import {
    Card, CardBody, CardHeader, Divider,
    Input, Button, Spinner, Chip, Table,
    TableHeader, TableColumn, TableBody,
    TableRow, TableCell,
} from "@nextui-org/react";
import {
    TrendingUp, Package, AlertTriangle,
    Clock, Landmark, RefreshCw, FileDown, 
    FileSpreadsheet
} from "lucide-react";

import { useReporte } from "../hooks/useReporte";
import { 
    exportarVentasPDF, exportarVentasExcel, 
    exportarCajasPDF, exportarCajasExcel 
} from "../utils/exportUtils";

import { VentasLineChart }    from "./VentasLineChart";
import { ProductosBarChart }  from "./ProductosBarChart";
import { MetodoPagoChart }    from "./MetodoPagoChart";

// Formateadores locales (Colombia)
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

    React.useEffect(() => { 
        fetchTodo(); 
    }, [fetchTodo]);

    // Cálculo de KPIs en tiempo real
    const totalVentas    = ventas.reduce((a, v) => a + v.total, 0);
    const cantidadVentas = ventas.length;
    const ticketPromedio = cantidadVentas > 0 ? totalVentas / cantidadVentas : 0;

    return (
        <div className="p-4 flex flex-col gap-4 max-w-[1400px] mx-auto">

            {/* ── HEADER + FILTROS ── */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-sky-500">Panel de Reportes</h2>
                    <Button
                        size="sm"
                        className="bg-sky-400 text-white shadow-sm"
                        startContent={<RefreshCw size={14} />}
                        isLoading={isLoading}
                        onPress={fetchTodo}
                    >
                        Actualizar Datos
                    </Button>
                </div>

                <Card className="border border-sky-100 shadow-sm">
                    <CardBody className="flex flex-col md:flex-row gap-4 items-end p-4">
                        <Input
                            type="date" size="sm" label="Fecha de Inicio"
                            labelPlacement="outside" variant="bordered"
                            value={fechaInicio}
                            classNames={{
                                inputWrapper: "border-sky-200 hover:border-sky-400 focus-within:!border-sky-400",
                                label: "text-sky-500 font-medium",
                            }}
                            onChange={(e) => setFechaInicio(e.target.value)}
                        />
                        <Input
                            type="date" size="sm" label="Fecha de Fin"
                            labelPlacement="outside" variant="bordered"
                            value={fechaFin}
                            classNames={{
                                inputWrapper: "border-sky-200 hover:border-sky-400 focus-within:!border-sky-400",
                                label: "text-sky-500 font-medium",
                            }}
                            onChange={(e) => setFechaFin(e.target.value)}
                        />
                        <div className="flex gap-2 w-full md:w-auto">
                            <Button
                                className="bg-sky-500 text-white flex-1 md:flex-none"
                                onPress={fetchTodo}
                            >
                                Filtrar
                            </Button>
                            
                            {/* Botones de Exportación Global (Ventas) */}
                            {ventas.length > 0 && (
                                <>
                                    <Button 
                                        isIconOnly color="danger" variant="flat" 
                                        onPress={() => exportarVentasPDF(ventas, fechaInicio, fechaFin)}
                                    >
                                        <FileDown size={20} />
                                    </Button>
                                    <Button 
                                        isIconOnly color="success" variant="flat"
                                        onPress={() => exportarVentasExcel(ventas, fechaInicio, fechaFin)}
                                    >
                                        <FileSpreadsheet size={20} />
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardBody>
                </Card>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Spinner size="lg" color="primary" />
                    <p className="text-sky-500 animate-pulse">Cargando información estratégica...</p>
                </div>
            ) : (
                <>
                    {/* ── SECCIÓN DE KPIs ── */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { label: "Ventas Totales", value: formatCurrency(totalVentas), icon: <TrendingUp size={24} />, color: "text-sky-500", bg: "bg-sky-50", border: "border-sky-100" },
                            { label: "Volumen de Ventas", value: `${cantidadVentas} ops`, icon: <Package size={24} />, color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-100" },
                            { label: "Ticket Promedio", value: formatCurrency(ticketPromedio), icon: <TrendingUp size={24} />, color: "text-green-500", bg: "bg-green-50", border: "border-green-100" },
                        ].map((kpi) => (
                            <Card key={kpi.label} className={`border ${kpi.border} shadow-sm`}>
                                <CardBody className={`${kpi.bg} p-4 flex-row items-center gap-4`}>
                                    <div className={`p-3 rounded-full bg-white shadow-sm ${kpi.color}`}>
                                        {kpi.icon}
                                    </div>
                                    <div>
                                        <p className="text-tiny uppercase font-bold text-default-400">{kpi.label}</p>
                                        <p className="text-2xl font-bold">{kpi.value}</p>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    {/* ── GRÁFICAS PRINCIPALES ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card className="border border-sky-100 shadow-sm">
                            <CardHeader className="font-bold text-sky-500">Tendencia de Ventas</CardHeader>
                            <Divider />
                            <CardBody className="h-[300px]">
                                {ventas.length > 0 ? <VentasLineChart ventas={ventas} /> : <NoData />}
                            </CardBody>
                        </Card>

                        <Card className="border border-sky-100 shadow-sm">
                            <CardHeader className="font-bold text-sky-500">Métodos de Pago Preferidos</CardHeader>
                            <Divider />
                            <CardBody className="h-[300px]">
                                {ventas.length > 0 ? <MetodoPagoChart ventas={ventas} /> : <NoData />}
                            </CardBody>
                        </Card>
                    </div>

                    {/* ── PRODUCTOS MÁS VENDIDOS ── */}
                    <Card className="border border-sky-100 shadow-sm">
                        <CardHeader className="font-bold text-sky-500 italic">Top Productos (Ranking)</CardHeader>
                        <Divider />
                        <CardBody className="h-[350px]">
                            {masVendidos.length > 0 ? <ProductosBarChart productos={masVendidos} /> : <NoData />}
                        </CardBody>
                    </Card>

                    {/* ── TABLAS DE ALERTA Y OPERACIÓN ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Inventario Crítico */}
                        <Card className="border border-orange-100 shadow-sm">
                            <CardHeader className="flex justify-between items-center">
                                <span className="font-bold text-orange-500 flex items-center gap-2">
                                    <AlertTriangle size={18} /> Bajo Stock
                                </span>
                                <Chip size="sm" color="warning" variant="flat">{bajoStock.length}</Chip>
                            </CardHeader>
                            <Divider />
                            <Table removeWrapper aria-label="Bajo stock table" className="p-2">
                                <TableHeader>
                                    <TableColumn>PRODUCTO</TableColumn>
                                    <TableColumn align="center">STOCK</TableColumn>
                                    <TableColumn align="center">ESTADO</TableColumn>
                                </TableHeader>
                                <TableBody emptyContent="Todo el stock está en niveles óptimos">
                                    {bajoStock.map((p) => (
                                        <TableRow key={p.idProducto}>
                                            <TableCell className="text-tiny">{p.nombreProducto}</TableCell>
                                            <TableCell className="font-bold text-danger">{p.cantidadActual}</TableCell>
                                            <TableCell><Chip size="sm" color="danger" variant="dot">Crítico</Chip></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>

                        {/* Historial de Cajas */}
                        <Card className="border border-sky-100 shadow-sm">
                            <CardHeader className="flex justify-between items-center">
                                <span className="font-bold text-sky-500 flex items-center gap-2">
                                    <Landmark size={18} /> Historial de Cajas
                                </span>
                                <div className="flex gap-1">
                                    <Button isIconOnly size="sm" color="danger" variant="light" onPress={() => exportarCajasPDF(historialCajas, fechaInicio, fechaFin)}>
                                        <FileDown size={16} />
                                    </Button>
                                    <Button isIconOnly size="sm" color="success" variant="light" onPress={() => exportarCajasExcel(historialCajas, fechaInicio, fechaFin)}>
                                        <FileSpreadsheet size={16} />
                                    </Button>
                                </div>
                            </CardHeader>
                            <Divider />
                            <Table removeWrapper isStriped aria-label="Cajas table" className="p-2">
                                <TableHeader>
                                    <TableColumn>FECHA</TableColumn>
                                    <TableColumn>RESPONSABLE</TableColumn>
                                    <TableColumn align="right">DIFERENCIA</TableColumn>
                                </TableHeader>
                                <TableBody emptyContent="No hay registros de caja">
                                    {historialCajas.slice(0, 5).map((c) => (
                                        <TableRow key={c.idCaja}>
                                            <TableCell className="text-tiny">{formatFecha(c.fecha)}</TableCell>
                                            <TableCell className="text-tiny">{c.cerradaPor || c.abiertaPor}</TableCell>
                                            <TableCell align="right">
                                                <span className={c.diferencia < 0 ? "text-danger" : "text-success"}>
                                                    {formatCurrency(c.diferencia)}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}

// Sub-componente para estados vacíos
const NoData = () => (
    <div className="flex flex-col items-center justify-center h-full text-default-300 gap-2">
        <Package size={40} strokeWidth={1} />
        <p className="text-small">No hay datos suficientes para mostrar la gráfica</p>
    </div>
);