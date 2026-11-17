import { useState } from "react";
import { reportesIniciales, lecturas } from "./DatosReportes.js";
import { Cabecera, Etiqueta, btn, blueBtn, field, panel, C } from "../centro_alertas/UI.jsx";
import { exportarExcel } from "../../utils/exportarExcel.js";

const mapModulo = {
  Operación: "monitoreo",
  Telemetría: "monitoreo",
  Ciberseguridad: "ciberseguridad",
  "Inteligencia Artificial": "ia",
  Alertas: "alertas",
};

export default function HistorialReportes({ onBack, onNuevo, onPreview, reportes = reportesIniciales }) {
  const [texto, setTexto] = useState(""),
    [tipo, setTipo] = useState(""),
    [formato, setFormato] = useState(""),
    [pagina, setPagina] = useState(0);

  const arr = reportes.filter(
    (x) =>
      x.nombre.toLowerCase().includes(texto.toLowerCase()) &&
      (!tipo || x.tipo === tipo) &&
      (!formato || x.formato === formato)
  );

  const descargarReporteExcel = (r) => {
    const filas = lecturas.map((x) => ({
      "Fecha y hora": x.fecha,
      Sensor: x.sensor,
      Valor: x.valor,
      Unidad: x.unidad,
      Estado: x.estado,
    }));

    exportarExcel({
      datos: filas,
      nombreArchivo: `reporte_${r.nombre.toLowerCase().replace(/\s+/g, "_")}`,
      nombreHoja: r.tipo || "Reporte",
      modulo: mapModulo[r.tipo] || "default",
      esCritico: (fila) => fila.Estado !== "Normal",
    });
  };

  return (
    <>
      <Cabecera titulo="Reportes › Historial" onBack={onBack} />
      <div style={{ display: "flex", gap: 15, flexWrap: "wrap", marginBottom: 25 }}>
        <input
          placeholder="Buscar reporte"
          aria-label="Buscar reporte"
          style={{ ...field, width: 330 }}
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            setPagina(0);
          }}
        />
        <select
          aria-label="Tipo"
          value={tipo}
          onChange={(e) => {
            setTipo(e.target.value);
            setPagina(0);
          }}
          style={field}
        >
          <option value="">Tipo</option>
          {["Operación", "Ciberseguridad", "Telemetría", "Inteligencia Artificial", "Alertas"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          aria-label="Formato"
          value={formato}
          onChange={(e) => {
            setFormato(e.target.value);
            setPagina(0);
          }}
          style={field}
        >
          <option value="">Formato</option>
          <option>PDF</option>
          <option>CSV</option>
          <option>Excel</option>
        </select>
        <button style={{ ...blueBtn, marginLeft: "auto" }} onClick={onNuevo}>
          + Nuevo reporte
        </button>
      </div>
      <section style={{ ...panel, padding: 0, minHeight: 675, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.gray }}>
                {["Nombre", "Tipo", "Periodo", "Formato", "Generado", ""].map((t, i) => (
                  <th key={i} style={{ padding: 19, fontWeight: 400, textAlign: "left", color: C.muted }}>
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {arr.slice(pagina * 7, pagina * 7 + 7).map((r, i) => (
                <tr key={`${r.nombre}-${i}`} style={{ borderBottom: `1px solid ${C.border}` }}>
                  {[r.nombre, r.tipo, r.periodo].map((v, k) => (
                    <td key={k} style={{ padding: 19 }}>
                      {v}
                    </td>
                  ))}
                  <td>
                    <Etiqueta valor={r.formato} />
                  </td>
                  <td>{r.generado}</td>
                  <td>
                    <button
                      style={{ ...btn, border: 0 }}
                      onClick={() => (r.formato === "CSV" || r.formato === "Excel" ? descargarReporteExcel(r) : onPreview(r))}
                    >
                      {r.formato === "CSV" || r.formato === "Excel" ? "Descargar Excel" : "Ver ↗"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 15, flexWrap: "wrap", padding: 20 }}>
          <span style={{ color: C.muted }}>
            Mostrando {arr.length ? pagina * 7 + 1 : 0}–{Math.min((pagina + 1) * 7, arr.length)} de {arr.length} reportes de demostración
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            <button disabled={!pagina} style={btn} onClick={() => setPagina((p) => p - 1)}>
              Anterior
            </button>
            <button disabled={(pagina + 1) * 7 >= arr.length} style={btn} onClick={() => setPagina((p) => p + 1)}>
              Siguiente
            </button>
          </div>
        </div>
      </section>
    </>
  );
}