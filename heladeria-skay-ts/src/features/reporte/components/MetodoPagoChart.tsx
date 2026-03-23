import {
    PieChart, 
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

import { ReporteVenta } from "../types/reporte.types";

const COLORS = ["#38bdf8", "#0ea5e9", "#7dd3fc", "#0284c7", "#bae6fd"];

interface Props { ventas: ReporteVenta[]; }

export function MetodoPagoChart({ ventas}: Props) {

    const data = Object.values(
        ventas.reduce((acc, v) => {
            if (!acc[v.metodoPago]) acc[v.metodoPago] = { name: v.metodoPago, value: 0 }
            acc[v.metodoPago].value += 1;
            return acc;
        }, {} as Record<string, { name: string, value: number }>)
    );

    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie
                    data={data} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" outerRadius={80}
                    label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                    }
                >
                    {data.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}