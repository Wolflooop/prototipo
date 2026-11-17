import React, { useState } from "react";
import { Title, Stats, Panel, BarChart } from "./Elementos.jsx";
export default function DetalleIP({ ip = "192.168.1.45", onBack, onAlerts }) {
  const [estado, setEstado] = useState("Sospechosa");
  return (
    <>
      <Title detail={`IP ${ip}`} badge={estado} onBack={onBack} />
      <Stats
        items={[
          { label: "Intentos fallidos (24 h)", value: "12", tone: "red" },
          { label: "Usuarios intentados", value: "3" },
          { label: "Primer intento", value: "13:05" },
          { label: "Último intento", value: "14:06" },
        ]}
      />
      <div className="cy-cols cy-wide">
        <Panel title="Intentos por hora">
          <BarChart values={[0, 1, 0, 2, 0, 2, 3, 4]} color="#e74a4a" unit="intentos" />
        </Panel>
        <Panel title="Usuarios intentados">
          {[
            ["admin", 7],
            ["operador1", 3],
            ["root", 2],
          ].map(([name, v], i) => (
            <div className="cy-progress" key={name}>
              <div>
                {name}
                <span>{v} intentos</span>
              </div>
              <div className="cy-track">
                <div className="anim-barra-fill" style={{ width: `${(v / 7) * 100}%`, background: "#e74a4a", animationDelay: `${0.2 + i * 0.12}s` }} />
              </div>
            </div>
          ))}
          <p className="cy-muted cy-bottom-note">Origen: red interna (simulada)</p>
        </Panel>
      </div>
      <Panel title="Acciones">
        <p>Esta IP acumula 12 intentos fallidos en 24 h.</p>
        <div className="cy-actions">
          <button className="cy-primary" onClick={() => setEstado("Bloqueada")}>Bloquear IP</button>
          <button onClick={() => setEstado("Segura")}>Marcar como segura</button>
          <button onClick={onAlerts}>Ver alertas relacionadas</button>
        </div>
        <p className="cy-muted">Estado de demostración: {estado}. No se bloquea ninguna red real.</p>
      </Panel>
    </>
  );
}