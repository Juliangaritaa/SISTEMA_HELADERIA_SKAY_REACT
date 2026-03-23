import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

import { ReporteVenta } from "../types/reporte.types";

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-CO", {
        style: "currency", currency:"COP", minimumFractionDigits: 0,
    }).format(value);

interface Props { ventas: ReporteVenta[]; }

export function VentasLineChart({ ventas }: Props) {
    const data = Object.values(
        ventas.reduce((acc, v) => {
            const fecha = new Date(v.fecha).toLocaleDateString("es-CO");
            if(!acc[fecha]) acc[fecha] = { fecha, total:0, cantidad:0};
            acc[fecha].total += v.total;
            acc[fecha].cantidad += 1;
            return acc;
        }, {} as Record<string, {fecha: string; total: number; cantidad: number}>)
    );

    return (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f9ff" />
                <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Line
                    type="monotone" dataKey="total" name="Total ventas"
                    stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}