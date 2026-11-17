import React, { useState } from "react";
import { Title, Stats, Panel, Pill } from "./Elementos.jsx";
const seed = [
  {
    id: 1,
    time: "14:06:02",
    topic: "hydro/turbina1/rpm",
    problem: "Valor alterado",
    sensor: "S4",
    level: "Alta",
    value: "840 rpm",
    expected: "580 – 620 rpm",
  },
  {
    id: 2,
    time: "13:58:40",
    topic: "hydro/turbina1/rpm",
    problem: "Sin respuesta",
    sensor: "S4",
    level: "Media",
    value: "Sin dato",
    expected: "580 – 620 rpm",
  },
  {
    id: 3,
    time: "12:20:11",
    topic: "hydro/conduccion/presion",
    problem: "Firma no válida",
    sensor: "S3",
    level: "Alta",
    value: "24.1 bar",
    expected: "20 – 28 bar",
  },
  {
    id: 4,
    time: "11:05:33",
    topic: "hydro/embalse/nivel",
    problem: "Retraso alto",
    sensor: "S1",
    level: "Baja",
    value: "412.3 m",
    expected: "405 – 416 m",
  },
];
export default function IntegridadMensajes({ onBack, onMonitor, onAlert }) {
  const [items, setItems] = useState(seed),
    [selected, setSelected] = useState(1),
    [notice, setNotice] = useState("");
  const current = items.find((x) => x.id === selected);
  return (
    <>
      <Title
        detail="Integridad de mensajes"
        aside="MQTT simulado"
        onBack={onBack}
      />
      <Stats
        items={[
          { label: "Mensajes (24 h)", value: "8,640" },
          { label: "Alterados", value: "2", tone: "red" },
          { label: "Sin respuesta", value: "1", tone: "amber" },
          { label: "Verificados", value: "99.9 %", tone: "green" },
        ]}
      />
      <Panel title="Mensajes con incidencias">
        <div className="cy-scroll">
          <table className="cy-table">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Tópico</th>
                <th>Problema</th>
                <th>Sensor</th>
                <th>Nivel</th>
              </tr>
            </thead>
            <tbody>
              {items.map((x) => (
                <tr
                  key={x.id}
                  className={
                    "cy-row-click " + (x.id === selected ? "cy-selected" : "")
                  }
                  onClick={() => {
                    setSelected(x.id);
                    setNotice("");
                  }}
                >
                  <td>{x.time}</td>
                  <td>{x.topic}</td>
                  <td>{x.problem}</td>
                  <td>{x.sensor}</td>
                  <td>
                    <Pill
                      tone={
                        x.level === "Alta"
                          ? "red"
                          : x.level === "Media"
                            ? "amber"
                            : "neutral"
                      }
                    >
                      {x.level}
                    </Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <Panel title="Detalle del mensaje seleccionado">
        <div className="cy-info-grid">
          {[
            ["Tópico", current?.topic || "—"],
            ["Valor recibido", current?.value || "—"],
            ["Rango esperado", current?.expected || "—"],
            ["Hora", current ? `26/10 ${current.time}` : "—"],
          ].map(([k, v]) => (
            <div key={k}>
              <span className="cy-muted">{k}</span>
              <strong>{v}</strong>
            </div>
          ))}
        </div>
        <div className="cy-actions">
          <button
            className="cy-primary"
            disabled={!current}
            onClick={() => {
              setNotice(
                "Alerta de demostración creada para el mensaje seleccionado.",
              );
              onAlert?.(current);
            }}
          >
            Crear alerta
          </button>
          <button onClick={onMonitor}>Ver sensor en Monitoreo</button>
          <button
            disabled={!current}
            onClick={() => {
              setItems((x) => x.filter((y) => y.id !== selected));
              setSelected(items.find((x) => x.id !== selected)?.id ?? null);
              setNotice("Incidencia ignorada en esta demostración.");
            }}
          >
            Ignorar
          </button>
        </div>
        {notice && (
          <p role="status" className="cy-muted">
            {notice}
          </p>
        )}
      </Panel>
    </>
  );
}
