import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { ReporteVenta, HistorialCaja } from "../types/reporte.types";

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-CO", {
        style: "currency", currency: "COP", minimumFractionDigits: 0,
    }).format(value);

const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-CO");

// ── HEADER PDF ──────────────────────────────────────────────────
function agregarHeaderPDF(doc: jsPDF, titulo: string, descripcion: string) {
    // fondo header
    doc.setFillColor(56, 189, 248); // sky-400
    doc.rect(0, 0, 210, 28, "F");

    // título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("🍦 Heladería Sky", 14, 12);

    // subtítulo
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(titulo, 14, 20);

    // descripción
    doc.setFillColor(240, 249, 255); // sky-50
    doc.rect(0, 28, 210, 14, "F");
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text(descripcion, 14, 37);

    // fecha generación
    doc.setFontSize(8);
    doc.text(
        `Generado: ${new Date().toLocaleString("es-CO")}`,
        196, 37, { align: "right" }
    );

    return 48; // y inicial para el contenido
}

// ── EXPORT VENTAS PDF ────────────────────────────────────────────
export function exportarVentasPDF(
    ventas: ReporteVenta[],
    fechaInicio: string,
    fechaFin: string
) {
    const doc = new jsPDF();
    const totalVentas    = ventas.reduce((a, v) => a + v.total, 0);
    const cantidadVentas = ventas.length;
    const ticketPromedio = cantidadVentas > 0 ? totalVentas / cantidadVentas : 0;

    const yInicio = agregarHeaderPDF(
        doc,
        "Reporte de Ventas Mensual",
        `Período: ${formatFecha(fechaInicio)} — ${formatFecha(fechaFin)}   |   Total ventas: ${cantidadVentas}   |   Ingresos: ${formatCurrency(totalVentas)}`
    );

    // KPIs
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, yInicio, 55, 18, 3, 3, "F");
    doc.roundedRect(77, yInicio, 55, 18, 3, 3, "F");
    doc.roundedRect(140, yInicio, 55, 18, 3, 3, "F");

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("TOTAL INGRESOS",    16, yInicio + 6);
    doc.text("N° VENTAS",         79, yInicio + 6);
    doc.text("TICKET PROMEDIO",  142, yInicio + 6);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(14, 165, 233); // sky-500
    doc.text(formatCurrency(totalVentas),    16, yInicio + 14);
    doc.text(String(cantidadVentas),          79, yInicio + 14);
    doc.text(formatCurrency(ticketPromedio), 142, yInicio + 14);

    // tabla
    doc.setFont("helvetica", "normal");
    autoTable(doc, {
        startY: yInicio + 24,
        head: [["#", "Fecha", "Vendedor", "Método pago", "Productos", "Total", "Estado"]],
        body: ventas.map((v, i) => [
            i + 1,
            formatFecha(v.fecha),
            v.nombreUsuario,
            v.metodoPago,
            v.TotalProductos,
            formatCurrency(v.total),
            v.estado,
        ]),
        foot: [["", "", "", "", "", formatCurrency(totalVentas), ""]],
        headStyles:  { fillColor: [56, 189, 248], textColor: 255, fontStyle: "bold", fontSize: 8 },
        footStyles:  { fillColor: [240, 249, 255], textColor: [14, 165, 233], fontStyle: "bold" },
        bodyStyles:  { fontSize: 8 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
            0: { cellWidth: 8  },
            5: { halign: "right" },
        },
    });

    doc.save(`reporte_ventas_${fechaInicio}_${fechaFin}.pdf`);
}

// ── EXPORT VENTAS EXCEL ──────────────────────────────────────────
export function exportarVentasExcel(
    ventas: ReporteVenta[],
    fechaInicio: string,
    fechaFin: string
) {
    const totalVentas = ventas.reduce((a, v) => a + v.total, 0);

    const datos = ventas.map((v, i) => ({
        "#":            i + 1,
        "Fecha":        formatFecha(v.fecha),
        "Vendedor":     v.nombreUsuario,
        "Método Pago":  v.metodoPago,
        "Productos":    v.TotalProductos,
        "Total":        v.total,
        "Estado":       v.estado,
    }));

    // fila de totales
    datos.push({
        "#":           "",
        "Fecha":       "",
        "Vendedor":    "",
        "Método Pago": "TOTAL",
        "Productos":   "",
        "Total":       totalVentas,
        "Estado":      "",
    } as any);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datos);

    // ancho de columnas
    ws["!cols"] = [
        { wch: 5  },
        { wch: 14 },
        { wch: 20 },
        { wch: 15 },
        { wch: 12 },
        { wch: 16 },
        { wch: 12 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Ventas");
    XLSX.writeFile(wb, `reporte_ventas_${fechaInicio}_${fechaFin}.xlsx`);
}

// ── EXPORT CAJAS PDF ─────────────────────────────────────────────
export function exportarCajasPDF(
    cajas: HistorialCaja[],
    fechaInicio: string,
    fechaFin: string
) {
    const doc = new jsPDF();

    const totalInicial  = cajas.reduce((a, c) => a + c.montoInicial,    0);
    const totalContado  = cajas.reduce((a, c) => a + c.efectivoContado, 0);
    const totalDiferencia = cajas.reduce((a, c) => a + c.diferencia,    0);

    const yInicio = agregarHeaderPDF(
        doc,
        "Reporte de Cajas",
        `Período: ${formatFecha(fechaInicio)} — ${formatFecha(fechaFin)}   |   Cajas cerradas: ${cajas.length}`
    );

    // KPIs
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, yInicio, 55, 18, 3, 3, "F");
    doc.roundedRect(77, yInicio, 55, 18, 3, 3, "F");
    doc.roundedRect(140, yInicio, 55, 18, 3, 3, "F");

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("TOTAL INICIAL",    16, yInicio + 6);
    doc.text("TOTAL CONTADO",    79, yInicio + 6);
    doc.text("DIFERENCIA",      142, yInicio + 6);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(14, 165, 233);
    doc.text(formatCurrency(totalInicial),    16, yInicio + 14);
    doc.text(formatCurrency(totalContado),    79, yInicio + 14);

    // diferencia en rojo o verde
    doc.setTextColor(totalDiferencia >= 0 ? 34 : 220, totalDiferencia >= 0 ? 197 : 38, totalDiferencia >= 0 ? 94 : 38);
    doc.text(formatCurrency(totalDiferencia), 142, yInicio + 14);

    autoTable(doc, {
        startY: yInicio + 24,
        head: [["Fecha", "Abierta por", "Apertura", "Cerrada por", "Cierre", "Inicial", "Contado", "Diferencia"]],
        body: cajas.map((c) => [
            formatFecha(c.fecha),
            c.abiertaPor,
            c.horaApertura,
            c.cerradaPor,
            c.horaCierre,
            formatCurrency(c.montoInicial),
            formatCurrency(c.efectivoContado),
            formatCurrency(c.diferencia),
        ]),
        foot: [["", "", "", "", "TOTAL",
            formatCurrency(totalInicial),
            formatCurrency(totalContado),
            formatCurrency(totalDiferencia),
        ]],
        headStyles:  { fillColor: [56, 189, 248], textColor: 255, fontStyle: "bold", fontSize: 7 },
        footStyles:  { fillColor: [240, 249, 255], textColor: [14, 165, 233], fontStyle: "bold" },
        bodyStyles:  { fontSize: 7 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
            5: { halign: "right" },
            6: { halign: "right" },
            7: { halign: "right" },
        },
    });

    doc.save(`reporte_cajas_${fechaInicio}_${fechaFin}.pdf`);
}

// ── EXPORT CAJAS EXCEL ───────────────────────────────────────────
export function exportarCajasExcel(
    cajas: HistorialCaja[],
    fechaInicio: string,
    fechaFin: string
) {
    const datos = cajas.map((c, i) => ({
        "#":               i + 1,
        "Fecha":           formatFecha(c.fecha),
        "Abierta por":     c.abiertaPor,
        "Hora apertura":   c.horaApertura,
        "Cerrada por":     c.cerradaPor,
        "Hora cierre":     c.horaCierre,
        "Monto inicial":   c.montoInicial,
        "Efectivo contado": c.efectivoContado,
        "Diferencia":      c.diferencia,
        "Estado":          c.estado,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datos);

    ws["!cols"] = [
        { wch: 5  },
        { wch: 14 },
        { wch: 20 },
        { wch: 14 },
        { wch: 20 },
        { wch: 14 },
        { wch: 16 },
        { wch: 18 },
        { wch: 14 },
        { wch: 10 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Cajas");
    XLSX.writeFile(wb, `reporte_cajas_${fechaInicio}_${fechaFin}.xlsx`);
}