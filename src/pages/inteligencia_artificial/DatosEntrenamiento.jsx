import React from "react";
import { Titulo, Caja, Metricas, Tabla, Barras, Boton } from "./ElementosIA.jsx";
import { exportarExcel } from "../../utils/exportarExcel.js";

const variables = [
  ["Nivel (m)", 405, 418, 412],
  ["Caudal (m³/s)", 70, 95, 85],
  ["Presión (bar)", 20, 28, 24],
  ["RPM", 580, 620, 600],
  ["Temperatura (°C)", 50, 85, 65],
  ["Potencia (MW)", 60, 80, 72],
];

function dataset() {
  const filas = Array.from({ length: 10000 }, (_, i) => {
    const clase = i < 7000 ? "Normal" : i < 9000 ? "Falla operativa" : "Ciberataque";
    const f = (j) => {
      const k = (i * 37 + j * 113) % 997;
      return k / 996;
    };
    return {
      "Nivel (m)": +(405 + f(1) * 13).toFixed(2),
      "Caudal (m³/s)": +(70 + f(2) * 25).toFixed(2),
      "Presión (bar)": +(20 + f(3) * 8).toFixed(2),
      RPM: Math.round(580 + f(4) * 40),
      "Temperatura (°C)": +(50 + f(5) * 35).toFixed(2),
      "Potencia (MW)": +(60 + f(6) * 20).toFixed(2),
      Clase: clase,
    };
  });

  exportarExcel({
    datos: filas,
    nombreArchivo: "cyber-hydrovolt-dataset-SIMULADO",
    nombreHoja: "Dataset IA",
    modulo: "ia",
    esCritico: (fila) => fila.Clase === "Ciberataque",
  });
}

export default function DatosEntrenamiento({ onBack }) {
  return (
    <>
      <Titulo onBack={onBack} extra="Valores de ejemplo">
        Datos de entrenamiento
      </Titulo>
      <Metricas
        items={[
          { label: "Registros totales", value: "10,000" },
          { label: "Entrenamiento", value: "70 %" },
          { label: "Prueba", value: "30 %" },
          { label: "Variables", value: "6" },
        ]}
      />
      <div className="ia-two">
        <Caja>
          <h2>Distribución de clases</h2>
          <Barras max={7500} height={315} labels={["Normal", "Falla op.", "Ciberataque"]} values={[7000, 2000, 1000]} />
          <p className="ia-muted" style={{ textAlign: "center" }}>
            7,000 · 2,000 · 1,000 registros simulados
          </p>
        </Caja>
        <Caja className="ia-box-no-pad">
          <h2 style={{ padding: "22px 24px 0" }}>Variables del dataset</h2>
          <Tabla headers={["Variable", "Mín.", "Máx.", "Media"]}>
            {variables.map((v) => (
              <tr key={v[0]}>
                {v.map((x, i) => (
                  <td key={i}>{x}</td>
                ))}
              </tr>
            ))}
          </Tabla>
        </Caja>
      </div>
      <Caja>
        <h2>Preparación de los datos</h2>
        <div className="ia-flow">
          {["Datos simulados", "Limpieza", "Normalización", "División 70 / 30", "Entrenamiento"].map((s, i) => (
            <React.Fragment key={s}>
              {i > 0 && <span className="ia-flow-arrow">→</span>}
              <span className="ia-flow-item">{s}</span>
            </React.Fragment>
          ))}
        </div>
        <Boton onClick={dataset}>Descargar dataset (Excel)</Boton>
        <p className="ia-muted">
          El archivo Excel descargado se genera localmente para la demostración; no corresponde a mediciones reales ni a un dataset entrenado.
        </p>
      </Caja>
    </>
  );
}