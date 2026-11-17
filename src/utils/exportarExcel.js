import XLSX from "xlsx-js-style";

// Paleta de colores por módulo (puedes ajustar los códigos hex a los de tu CSS)
const TEMAS = {
  monitoreo: {
    primario: "0284C7",   // Azul monitoreo
    secundario: "F0F9FF", // Fondo fila par suave
    borde: "BAE6FD",
  },
  ciberseguridad: {
    primario: "059669",   // Verde esmeralda
    secundario: "ECFDF5",
    borde: "A7F3D0",
  },
  ia: {
    primario: "7C3AED",   // Morado IA
    secundario: "F5F3FF",
    borde: "DDD6FE",
  },
  alertas: {
    primario: "B82E2E",   // Rojo alerta (el mismo de tu tile #b82e2e)
    secundario: "FEF2F2",
    borde: "FECACA",
  },
  default: {
    primario: "1E293B",   // Gris oscuro elegante
    secundario: "F8FAFC",
    borde: "CBD5E1",
  },
};

/**
 * Exporta un arreglo de objetos a un archivo .xlsx con estilos y colores del módulo.
 *
 * @param {Object} opciones
 * @param {Array<Object>} opciones.datos - Arreglo de filas, ej: [{ Hora: "10:00", "Temperatura (°C)": 60 }]
 * @param {string} opciones.nombreArchivo - Nombre sin extensión
 * @param {string} opciones.nombreHoja - Nombre de la pestaña en Excel (máx 31 caracteres)
 * @param {string} opciones.modulo - "monitoreo" | "ciberseguridad" | "ia" | "alertas"
 * @param {Function} [opciones.esCritico] - Función opcional (fila) => boolean para resaltar en rojo
 */
export function exportarExcel({
  datos,
  nombreArchivo = "reporte-cyber-hydrovolt",
  nombreHoja = "Datos",
  modulo = "default",
  esCritico = null,
}) {
  if (!datos || datos.length === 0) return;

  const tema = TEMAS[modulo.toLowerCase()] || TEMAS.default;
  const columnas = Object.keys(datos[0]);

  // 1. Crear hoja desde los datos
  const ws = XLSX.utils.json_to_sheet(datos);

  // 2. Estilo de encabezados (Fila 1)
  columnas.forEach((_, colIdx) => {
    const celdaRef = XLSX.utils.encode_cell({ r: 0, c: colIdx });
    if (!ws[celdaRef]) return;

    ws[celdaRef].s = {
      fill: { fgColor: { rgb: tema.primario } },
      font: { name: "Segoe UI", sz: 11, bold: true, color: { rgb: "FFFFFF" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: tema.primario } },
        bottom: { style: "medium", color: { rgb: tema.primario } },
        left: { style: "thin", color: { rgb: tema.primario } },
        right: { style: "thin", color: { rgb: tema.primario } },
      },
    };
  });

  // 3. Estilo de filas de datos
  datos.forEach((fila, rowIdx) => {
    const r = rowIdx + 1;
    const alerta = esCritico ? esCritico(fila) : false;
    const fondoFila = alerta
      ? "FEE2E2" // Rojo claro si supera el umbral
      : rowIdx % 2 === 1
      ? tema.secundario
      : "FFFFFF";

    columnas.forEach((col, colIdx) => {
      const celdaRef = XLSX.utils.encode_cell({ r, c: colIdx });
      if (!ws[celdaRef]) return;

      ws[celdaRef].s = {
        fill: { fgColor: { rgb: fondoFila } },
        font: {
          name: "Segoe UI",
          sz: 10,
          bold: alerta,
          color: { rgb: alerta ? "991B1B" : "1E293B" },
        },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: tema.borde } },
          bottom: { style: "thin", color: { rgb: tema.borde } },
          left: { style: "thin", color: { rgb: tema.borde } },
          right: { style: "thin", color: { rgb: tema.borde } },
        },
      };
    });
  });

  // 4. Ajustar ancho automático de columnas y altura de encabezados
  ws["!cols"] = columnas.map((col) => {
    const maxLargo = Math.max(
      col.length,
      ...datos.map((fila) => String(fila[col] ?? "").length)
    );
    return { wch: maxLargo + 6 };
  });
  ws["!rows"] = [{ hpt: 26 }];

  // 5. Generar y descargar archivo .xlsx
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, nombreHoja.slice(0, 31));
  XLSX.writeFile(wb, `${nombreArchivo}.xlsx`);
}