import React from "react";
import { Title, Stats, Panel, LineChart, Pill, activar } from "./Elementos.jsx";
export default function TraficoRed({ onBack, onIp }) {
  return (
    <>
      <Title detail="Tráfico de red" onBack={onBack} />
      <Stats
        items={[
          { label: "Paquetes por minuto", value: "46" },
          { label: "Pico (últimas 24 h)", value: "95", tone: "red" },
          { label: "Protocolo principal", value: "MQTT" },
          { label: "Conexiones activas", value: "12" },
        ]}
      />
      <Panel title="Tráfico de red industrial (paq./min)">
        <LineChart values={[34, 37, 35, 40, 95, 43, 38, 40, 37, 41, 40, 39]} threshold={80} anomalyIndex={4} />
      </Panel>
      <div className="cy-cols cy-two">
        <Panel title="Por protocolo">
          {[
            ["MQTT", 70, "#358bdf"],
            ["HTTPS", 25, "#8ab9eb"],
            ["Otros", 5, "#bcbab3"],
          ].map(([name, v, color], i) => (
            <div className="cy-progress" key={name}>
              <div>
                {name}
                <span>{v} %</span>
              </div>
              <div className="cy-track">
                <div className="anim-barra-fill" style={{ width: `${v}%`, background: color, animationDelay: `${0.2 + i * 0.12}s` }} />
              </div>
            </div>
          ))}
        </Panel>
        <Panel title="Principales orígenes" className="cy-flush">
          <div className="cy-scroll">
            <table className="cy-table">
              <thead>
                <tr><th>IP</th><th>Paquetes</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {[
                  ["10.0.0.12", "1,240", "Normal"],
                  ["10.0.0.20", "980", "Normal"],
                  ["192.168.1.45", "620", "Sospechosa"],
                  ["203.0.113.8", "310", "Bloqueada"],
                ].map(([ip, count, status]) => (
                  <tr key={ip} tabIndex={0} onClick={() => onIp(ip)} onKeyDown={activar(() => onIp(ip))} className="cy-row-click">
                    <td>{ip}</td>
                    <td>{count}</td>
                    <td><Pill tone={status === "Normal" ? "green" : "red"}>{status}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </>
  );
}