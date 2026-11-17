import { useState } from "react";
import { Cabecera, Metrica, Etiqueta, Graph, btn, blueBtn, field, panel, C } from "../centro_alertas/UI.jsx";
import { lecturas, reportesIniciales, configuracionInicial } from "./DatosReportes.js";
import { exportarExcel } from "../../utils/exportarExcel.js";
import EstadisticasAlertas from "./EstadisticasAlertas.jsx";
import HistorialReportes from "./HistorialReportes.jsx";
import GenerarReporte from "./GenerarReporte.jsx";
import VistaPrevia from "./VistaPrevia.jsx";
import ExportarDatos from "./ExportarDatos.jsx";

export default function Reportes({ onNavigate }) {
  const [vista, setVista] = useState("principal"),
    [exportar, setExportar] = useState(false),
    [config, setConfig] = useState(configuracionInicial),
    [reportes, setReportes] = useState(reportesIniciales),
    [periodo, setPeriodo] = useState("Últimos 7 días"),
    [sensor, setSensor] = useState(""),
    [tipo, setTipo] = useState(""),
    [mensaje, setMensaje] = useState("");

  const volver = () => {
    setVista("principal");
    setMensaje("");
  };

  const descargarExcel = (filtro = "", moduloElegido = "monitoreo") => {
    const datosFiltrados = lecturas.filter((x) => (!sensor || x.sensor === sensor) && (!filtro || x.sensor === filtro));
    const filas = datosFiltrados.map((x) => ({
      "Fecha y hora": x.fecha,
      Sensor: x.sensor,
      Valor: x.valor,
      Unidad: x.unidad,
      Estado: x.estado,
    }));

    exportarExcel({
      datos: filas,
      nombreArchivo: "cyber_hydrovolt_telemetria",
      nombreHoja: "Telemetría",
      modulo: moduloElegido,
      esCritico: (fila) => fila.Estado !== "Normal",
    });
  };

  const imprimir = () => {
    window.print();
  };

  const exportarDatos = (e) => {
    setExportar(false);
    if (e.formato === "PDF") {
      setConfig({ ...config, formato: "PDF" });
      setVista("previa");
      setMensaje("Usa «Guardar como PDF (imprimir)» en la vista previa.");
      return;
    }
    descargarExcel();
    setMensaje("Archivo Excel (.xlsx) con formato descargado correctamente.");
  };

  const generar = () => {
    if (!config.secciones.length) {
      setMensaje("Selecciona al menos una sección.");
      return;
    }
    const nuevo = {
      nombre: config.tipo,
      tipo: config.tipo === "Operación de la central" ? "Operación" : config.tipo,
      periodo: config.periodo,
      formato: config.formato,
      generado: "Demostración",
    };
    setReportes([nuevo, ...reportes]);

    if (config.formato === "CSV" || config.formato === "Excel") {
      const mod = config.tipo.includes("Ciber") ? "ciberseguridad" : config.tipo.includes("IA") ? "ia" : "monitoreo";
      descargarExcel("", mod);
      setMensaje("Se generó el reporte en formato Excel (.xlsx).");
      setVista("historial");
    } else {
      setMensaje("Reporte preparado. Usa la función de imprimir para guardarlo como PDF.");
      setVista("previa");
    }
  };

  const contenido = () => {
    switch (vista) {
      case "estadisticas":
        return <EstadisticasAlertas onBack={volver} />;
      case "historial":
        return <HistorialReportes onBack={volver} onNuevo={() => setVista("generar")} onPreview={() => setVista("previa")} reportes={reportes} />;
      case "generar":
        return <GenerarReporte config={config} onChange={setConfig} onBack={volver} onPreview={() => setVista("previa")} onGenerate={generar} />;
      case "previa":
        return <VistaPrevia config={config} onBack={() => setVista("generar")} onCSV={() => descargarExcel()} onPDF={imprimir} />;
      default:
        return (
          <>
            <Cabecera titulo="Reportes" subtitulo="Historial y exportación" />
            <div style={{ display: "flex", gap: 13, flexWrap: "wrap", marginBottom: 25 }}>
              <select aria-label="Periodo" value={periodo} onChange={(e) => setPeriodo(e.target.value)} style={field}>
                {["Últimos 7 días", "Últimas 24 horas", "Últimos 30 días"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
              <select aria-label="Sensor" value={sensor} onChange={(e) => setSensor(e.target.value)} style={field}>
                <option value="">Sensor</option>
                {[...new Set(lecturas.map((x) => x.sensor))].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
              <select aria-label="Tipo de dato" value={tipo} onChange={(e) => setTipo(e.target.value)} style={field}>
                <option value="">Tipo de dato</option>
                <option>Telemetría</option>
                <option>Alertas</option>
              </select>
              <button style={{ ...btn, marginLeft: "auto" }} onClick={() => setExportar(true)}>
                Exportar Excel / PDF
              </button>
              <button style={btn} onClick={() => setVista("historial")}>
                Historial
              </button>
              <button style={btn} onClick={() => setVista("estadisticas")}>
                Estadísticas de alertas
              </button>
              <button style={blueBtn} onClick={() => setVista("generar")}>
                + Nuevo reporte
              </button>
            </div>
            <section style={{ ...panel, marginBottom: 25 }}>
              <h2 style={{ fontSize: 19, fontWeight: 400 }}>Historial de mediciones</h2>
              <Graph points={[45, 55, 50, 63, 59, 68, 64, 73, 69, 64, 60, 63, 55, 70]} hot={8} threshold={100} />
            </section>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 26 }} className="r-metrics">
              <Metrica label="Promedio" value="73.8" />
              <Metrica label="Máximo" value="78.0" />
              <Metrica label="Mínimo" value="68.5" />
              <Metrica label="Desv. estándar" value="2.4" />
            </div>
            <section style={{ ...panel, padding: 0, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: C.gray }}>
                    {["Fecha y hora", "Sensor", "Valor", "Unidad", "Estado"].map((x) => (
                      <th key={x} style={{ fontWeight: 400, textAlign: "left", padding: 18, color: C.muted }}>
                        {x}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lecturas
                    .filter((x) => !sensor || x.sensor === sensor)
                    .slice(0, 4)
                    .map((x) => (
                      <tr key={x.fecha} style={{ borderBottom: `1px solid ${C.border}` }}>
                        {[x.fecha, x.sensor, x.valor, x.unidad].map((v, i) => (
                          <td key={i} style={{ padding: 17 }}>
                            {v}
                          </td>
                        ))}
                        <td>
                          <Etiqueta valor={x.estado} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </section>
          </>
        );
    }
  };

  return (
    <div className="anim-scope" style={{ fontSize: 17 }}>
      <div className="anim-vista" key={vista}>
        {contenido()}
      </div>
      {mensaje && (
        <p role="status" style={{ color: C.blue, marginTop: 17 }}>
          {mensaje}
        </p>
      )}
      {exportar && <ExportarDatos onClose={() => setExportar(false)} onExport={exportarDatos} />}
      <style>{`@media(max-width:1000px){.r-metrics{grid-template-columns:repeat(2,1fr)!important}}`}</style>
    </div>
  );
}