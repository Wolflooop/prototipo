import { useEffect, useState } from "react";
import { Thermometer, TrendingUp, ArrowUp, ArrowDown, ShieldAlert } from "lucide-react";
import { Graph, Tiles, Panel, Status, PageHeader, StatusBar } from "./Monitoreo.jsx";
import { exportarExcel } from "../../utils/exportarExcel.js";

const values = [60, 61, 62, 63, 62, 61, 64, 65, 64, 66, 69, 73, 78, 76, 72];

export default function SensorTemperatura({ onBack, onThresholds, threshold, onNavigate }) {
  const [period, setPeriod] = useState("1 h");
  const [showAlert, setShowAlert] = useState(false);

  // Escape cierra el modal
  useEffect(() => {
    if (!showAlert) return;
    const cerrar = (e) => { if (e.key === "Escape") setShowAlert(false); };
    window.addEventListener("keydown", cerrar);
    return () => window.removeEventListener("keydown", cerrar);
  }, [showAlert]);

  const handleExportExcel = () => {
    const umbralMax = threshold?.enabled ? Number(threshold.max) : 75;

    const filas = values.map((v, i) => ({
      Hora: `10:${String(i * 4).padStart(2, "0")}`,
      "Temperatura (°C)": v,
      Estado: v >= umbralMax ? "Alta (Fuera de umbral)" : "Normal",
    }));

    exportarExcel({
      datos: filas,
      nombreArchivo: "cyber-hydrovolt-temperatura-simulada",
      nombreHoja: "Sensor Temperatura",
      modulo: "monitoreo",
      esCritico: (fila) => fila["Temperatura (°C)"] >= umbralMax,
    });
  };

  return (
    <section>
      <PageHeader
        title={<><button type="button" className="mon-crumb" onClick={onBack}>Monitoreo</button> › Sensor de temperatura</>}
        SubIcon={Thermometer}
        subtitle="Turbina 1 · Sensor S5"
        right={<Status tone="alta">Alta</Status>}
      />
      <Tiles
        items={[
          { label: "Valor actual", value: "78 °C", color: "#c83239", Icon: Thermometer },
          { label: "Promedio (1 h)", value: "66.4 °C", Icon: TrendingUp },
          { label: "Máximo", value: "78 °C", Icon: ArrowUp },
          { label: "Mínimo", value: "60 °C", Icon: ArrowDown },
        ]}
      />
      <Panel
        title="Temperatura · Turbina 1"
        Icon={TrendingUp}
        extra={
          <div className="mon-times">
            {["1 h", "6 h", "24 h", "7 días"].map((p) => (
              <button type="button" key={p} aria-pressed={period === p} className={period === p ? "selected" : ""} onClick={() => setPeriod(p)}>
                {p}
              </button>
            ))}
          </div>
        }
      >
        <div key={period}>
          <Graph
            data={values} min={50} max={90} unit="°C" nombre="Temperatura"
            threshold={threshold?.enabled ? Number(threshold.max) : null}
            anomalyIndex={12}
            label={`Serie de temperatura de demostración, selección ${period}`}
          />
        </div>
        {period !== "1 h" && (
          <p className="mon-muted" style={{ fontSize: 14, margin: "8px 0 0" }}>
            Vista de demostración: aún no contamos con series históricas diferentes para {period}.
          </p>
        )}
      </Panel>
      <Panel title="Umbral y eventos" Icon={ShieldAlert}>
        <div className="mon-info-grid">
          <div className="mon-info">
            <span>Umbral actual</span>
            <p>{threshold?.enabled ? `${threshold.max} °C` : "Desactivado"}</p>
          </div>
          <div className="mon-info">
            <span>Eventos fuera de umbral hoy</span>
            <p>3</p>
          </div>
          <div className="mon-info">
            <span>Última anomalía</span>
            <p>14:06 · Alerta ALT-042</p>
          </div>
        </div>
        <div className="mon-action-row">
          <button type="button" onClick={onThresholds}>Editar umbral</button>
          <button type="button" onClick={() => setShowAlert(true)}>Ver alerta ALT-042</button>
          <button type="button" onClick={handleExportExcel}>Exportar datos (Excel)</button>
        </div>
        {showAlert && (
          <div role="dialog" aria-modal="true" aria-label="Alerta ALT-042" className="ch-modal-overlay anim-overlay" onClick={() => setShowAlert(false)}>
            <div className="ch-modal anim-modal" style={{ minHeight: 0, maxWidth: 520, padding: 25 }} onClick={(e) => e.stopPropagation()}>
              <div className="mon-head" style={{ marginBottom: 12 }}>
                <h2 style={{ margin: 0, fontWeight: 800, color: "#112b50" }}>Alerta ALT-042</h2>
                <button type="button" onClick={() => setShowAlert(false)} className="mon-secondary">Cerrar ×</button>
              </div>
              <p><strong>Temperatura alta · Turbina 1</strong></p>
              <p>Valor simulado: 78 °C. Umbral configurado: {threshold?.max} °C.</p>
              <p className="mon-muted">Requiere revisión. No es confirmación de un ciberataque.</p>
              <div className="mon-action-row">
                <button type="button" onClick={() => { setShowAlert(false); onNavigate?.("Centro de alertas"); }}>
                  Ir al Centro de alertas
                </button>
              </div>
            </div>
          </div>
        )}
      </Panel>
      <StatusBar sensores="5/6" />
    </section>
  );
}