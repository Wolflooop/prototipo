import { Wifi, Activity, WifiOff, Timer, Radio, MessageSquare } from "lucide-react";
import { Panel, Tiles, Status, PageHeader, StatusBar } from "./Monitoreo.jsx";

const sensors = [
  { id: "S1 · Nivel", location: "Embalse", read: "Hace 2 s", status: "Normal" },
  { id: "S2 · Caudal", location: "Conducción", read: "Hace 2 s", status: "Normal" },
  { id: "S3 · Presión", location: "Conducción", read: "Hace 3 s", status: "Normal" },
  { id: "S4 · RPM", location: "Turbina 1", read: "Hace 38 s", status: "Intermitente" },
  { id: "S5 · Temperatura", location: "Turbina 1", read: "Hace 2 s", status: "Normal" },
  { id: "S6 · Potencia", location: "Generador 1", read: "Hace 2 s", status: "Normal" },
];
const messages = [
  ["14:06:02", "hydro/turbina1/temperatura", "78.0"],
  ["14:06:01", "hydro/turbina1/rpm", "600"],
  ["14:06:00", "hydro/conduccion/presion", "24.1"],
  ["14:05:59", "hydro/embalse/nivel", "412.3"],
];
function SignalBars({ intermittent }) {
  return (
    <div className="mon-bars" aria-label={intermittent ? "Señal intermitente" : "Señal buena"}>
      {[8, 14, 21, 27].map((h, i) => (
        <i key={i} className={"anim-barra-v" + (intermittent && i >= 2 ? " dim" : "")} style={{ height: h, animationDelay: `${0.2 + i * 0.08}s` }} />
      ))}
    </div>
  );
}
export default function EstadoSensores({ onBack, onSensor }) {
  return (
    <section>
      <PageHeader
        title={<><button className="mon-crumb" onClick={onBack} type="button">Monitoreo</button> › Estado de sensores</>}
        SubIcon={Radio}
        subtitle="Red de sensores simulada"
      />
      <Tiles
        items={[
          { label: "En línea", value: "5/6", color: "#167c40", Icon: Wifi },
          { label: "Intermitentes", value: "1", color: "#a56600", Icon: Activity },
          { label: "Sin señal", value: "0", Icon: WifiOff },
          { label: "Latencia MQTT", value: "120 ms", Icon: Timer },
        ]}
      />
      <Panel title="Estado de sensores" Icon={Radio} className="mon-panel-flush">
        <div className="mon-table-scroll">
          <table className="mon-sensors-table">
            <thead>
              <tr>{["Sensor", "Ubicación", "Última lectura", "Señal", "Estado"].map((t) => <th key={t}>{t}</th>)}</tr>
            </thead>
            <tbody>
              {sensors.map((s) => {
                const abre = s.id.includes("Temperatura");
                return (
                  <tr
                    key={s.id}
                    className={abre ? "clickable" : undefined}
                    tabIndex={abre ? 0 : undefined}
                    onClick={abre ? onSensor : undefined}
                    onKeyDown={abre ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSensor(); } } : undefined}
                  >
                    <td>
                      {s.id}
                      {abre && <span style={{ color: "#1269d0", marginLeft: 8, fontSize: 13, fontWeight: 700 }}>Ver detalle ›</span>}
                    </td>
                    <td>{s.location}</td>
                    <td>{s.read}</td>
                    <td><SignalBars intermittent={s.status === "Intermitente"} /></td>
                    <td><Status tone={s.status === "Normal" ? "normal" : "variable"}>{s.status}</Status></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
      <Panel title="Mensajes MQTT recientes" Icon={MessageSquare}>
        <div className="anim-stagger">
          {messages.map(([time, topic, value], i) => (
            <div className="mon-messages" key={time} style={{ "--i": i }}>
              <span className="mon-muted">{time}</span>
              <span>{topic}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </Panel>
      <StatusBar sensores="5/6" />
      <div className="mon-action-row">
        <button onClick={onSensor} type="button">Ver sensor de temperatura</button>
      </div>
    </section>
  );
}