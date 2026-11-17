
import { useState } from "react";
import {
  Cabecera, Barra, Graph, btn, panel, C
} from "./UI.jsx";

export default function DetalleAlerta({
  alerta,
  onBack,
  onActualizar,
  onModal,
  onNavigate
}) {
  const [nota, setNota] = useState(alerta.nota || "");
  const [status, setStatus] = useState(alerta.estado || "Nueva");

  const guardarEstado = v => {
    setStatus(v);
    onActualizar({ estado: v });
  };

  const ia = alerta.ia;
  const pF = ia ? ia.probabilidades[1][1] : 78;
  const pC = ia ? ia.probabilidades[2][1] : 22;

  const h = alerta.hora;
  const tiempos = h ? [h, h, h] : ["14:06", "14:07", "14:10"];

  const ultimo =
    status === "Revisión"
      ? "En revisión por el analista"
      : status === "Cerrada"
      ? "Alerta cerrada"
      : "Pendiente de reconocimiento";

  return (
    <>
      <Cabecera
        titulo={`Centro de alertas › ${alerta.id}`}
        onBack={onBack}
        badge={alerta.riesgo}
      />

      <div
        className="ca-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: 22
        }}
      >
        <div>
          <section style={{ ...panel, marginBottom: 22 }}>
            <h2 style={{ fontSize: 19, fontWeight: 600 }}>
              {ia
                ? "Mediciones alrededor del evento"
                : "Temperatura Turbina 1 alrededor del evento"}
            </h2>
            <Graph />
          </section>

          <section style={{ ...panel, marginBottom: 22 }}>
            <h2 style={{ fontSize: 19, fontWeight: 600 }}>
              Eventos relacionados
            </h2>

            {(alerta.eventos || [
              ["14:06", "Lectura fuera de rango", "Sensor S5"],
              ["14:05", "Variación de presión", "Sensor S3"],
              ["14:02", "Sin accesos sospechosos", "Red industrial"]
            ]).map((x, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                  borderBottom: `1px solid ${C.border}`,
                  padding: "15px 0"
                }}
              >
                <span style={{ color: C.muted }}>{x[0]}</span>
                <span>{x[1]}</span>
                <span style={{ color: C.muted }}>{x[2]}</span>
              </div>
            ))}
          </section>

          <section style={panel}>
            <h2 style={{ fontSize: 19, fontWeight: 600 }}>
              Línea de tiempo
            </h2>

            {[
              [tiempos[0], "Alerta generada por la IA"],
              [tiempos[1], "Notificada al operador"],
              [tiempos[2], ultimo]
            ].map((x, i) => (
              <p key={i}>
                🔵　<span style={{ color: C.muted }}>{x[0]}</span>　{x[1]}
              </p>
            ))}
          </section>
        </div>

        <div>
          <section
            style={{
              ...panel,
              background: C.gray,
              marginBottom: 22
            }}
          >
            <h2 style={{ fontSize: 19, fontWeight: 600 }}>
              Clasificación de IA
            </h2>

            <p style={{ fontSize: 24 }}>
              {ia ? ia.claseNombre : "Falla operativa"}
            </p>

            <Barra label="Falla operativa" value={pF} />
            <Barra
              label="Posible ciberataque"
              value={pC}
              color="#e74b4b"
            />

            <p style={{ color: C.muted, fontSize: 13 }}>
              Modelo: {alerta.modelo || "Red neuronal"} ·
              Confianza {(alerta.confianza ?? 0.93).toFixed(2)}
            </p>
          </section>

          <section style={panel}>
            <div style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 25
            }}>
              {["Nueva", "Revisión", "Cerrada"].map(s => (
                <button
                  key={s}
                  onClick={() => guardarEstado(s)}
                  style={{
                    ...btn,
                    padding: "9px 13px",
                    background: status === s ? "#e5f2ff" : "white"
                  }}
                >
                  {s === "Revisión" ? "En revisión" : s}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <button
                style={btn}
                onClick={() => guardarEstado("Revisión")}
              >
                Reconocer alerta
              </button>

              <button
                style={btn}
                onClick={() => onModal("escalar")}
              >
                Escalar a Ciberseguridad
              </button>

              <button
                style={btn}
                onClick={() => onModal("falso")}
              >
                Marcar como falso positivo
              </button>
            </div>

            <p style={{ color: C.muted, margin: "25px 0" }}>
              Asignada a: {alerta.escalada || "Analista"}
            </p>

            <label>
              Notas del analista
              <textarea
                value={nota}
                onChange={e => {
                  setNota(e.target.value);
                  onActualizar({ nota: e.target.value });
                }}
                style={{
                  display: "block",
                  width: "100%",
                  height: 140,
                  marginTop: 10,
                  border: `1px dashed ${C.border}`,
                  borderRadius: 9,
                  padding: 12,
                  font: "inherit"
                }}
              />
            </label>
          </section>
        </div>
      </div>

      <style>{`
        @media(max-width:1050px){
          .ca-grid{grid-template-columns:1fr!important}
        }
      `}</style>
    </>
  );
}
