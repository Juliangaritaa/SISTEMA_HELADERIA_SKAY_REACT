import {
    Table, TableHeader, TableColumn, TableBody,
    TableRow, TableCell, Chip, Spinner,
} from "@nextui-org/react";
import { MovimientoCaja } from "../types/caja.types";

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-CO", {
        style: "currency", currency: "COP", minimumFractionDigits: 0,
    }).format(value);

    const formatDate = (date: string) =>
        new Date(date).toLocaleString("es-CO");

    const tipoMap: Record<number, {
        label: string, color: "success" | "danger" | "primary" | "warning"
    }> = {
        1: { label: "Apertura", color: "primary" },
        2: { label: "Venta", color: "success" },
        3: { label: "Deposito", color: "danger" },
        5: { label: "Retiro", color: "warning"},
        6: { label: "Cierre", color: "primary" }
    };

    const columns = [
        { name: "TIPO", uid: "tipo" },
        { name: "CONCEPTO", uid: "concepto" },
        { name: "MONTO", uid: "monto" },
        { name: "FECHA", uid: "fecha" },
    ];

    interface Props {
        movimientos: MovimientoCaja[];
        isLoading: boolean;
    }

export function MovimientosTable({ movimientos, isLoading}: Props) {
    return (
        <Table
            aria-label="Movimientos de caja"
            removeWrapper
            isCompact
            classNames={{
                th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
            }}
        >
            <TableHeader columns={columns}>
                {(col) => (
                    <TableColumn key={col.uid}>
                        {col.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                items={movimientos}
                isLoading={isLoading}
                loadingContent={<Spinner color="primary" />}
                emptyContent="No hay movimientos registrados hoy."
            >
                {(mov) => (
                    <TableRow key={mov.idMovimiento}>
                        <TableCell>
                            <Chip
                                size="sm"
                                variant="flat"
                                color={tipoMap[mov.tipo]?.color ?? "default"}
                            >
                                {tipoMap[mov.tipo]?.label ?? `Tipo ${mov.tipo}`}
                            </Chip>
                        </TableCell>
                        <TableCell>
                            <p className="text-small">{mov.concepto}</p>
                        </TableCell>
                        <TableCell>
                            <p className={`text-small font-semibold ${
                                mov.tipo === 5 ? "text-danger" : "text-sky-600"
                            }`}>
                                {mov.tipo === 5 ? "-" : "+"}{formatCurrency(mov.monto)}
                            </p>
                        </TableCell>
                        <TableCell>
                            <p className="text-small text-default-400">{formatDate(mov.fecha)}</p>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}