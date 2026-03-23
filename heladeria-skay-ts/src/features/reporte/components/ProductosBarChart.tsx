import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

import { ProductoMasVendido } from "../types/reporte.types";

const COLORS = ["#38bdf8", "#7dd3fc", "#bae6fd", "#0ea5e9", "#0284c7"];

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-CO", {
        style: "currency", curency:"COP", minimumFractionDigits: 0,
    }).format(value);

interface Props { productos: ProductoMasVendido[]; }

export function ProductosBarChart({ productos }: Props) {
    return(
        <ResponsiveContainer width="10%" height={250}>
            <BarChart
                data={productos}
                margin={{ top:5, right:20, left:10, bottom:40}}
                >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f9ff" />
                <XAxis
                    dataKey="nombreProducto"
                    tick={{ fontSize: 11}}
                    angle={-30}
                    textAnchor="end"
                />
                <YAxis tick={{ fontSize: 11}} />
                <Tooltip
                    formatter={( value: number, name: string) =>
                        name === "totalVendido" ? formatCurrency(value) : value
                    }
                />

                <Bar dataKey="cantidadVendida" name="Cantidad Vendida" raidus={[4,4,0,0]}>
                    {productos.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}