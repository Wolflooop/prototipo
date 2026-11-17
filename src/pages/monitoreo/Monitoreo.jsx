import { useEffect, useId, useRef, useState } from "react";
import {
  Activity, Waves, Droplets, Gauge, RotateCw, Thermometer, Zap,
  Radio, SlidersHorizontal, ChevronRight,
} from "lucide-react";
import "./css/Monitoreo.css";
import EstadoSensores from "./EstadoSensores.jsx";
import SensorTemperatura from "./SensorTemperatura.jsx";
import ConfigurarUmbrales from "./ConfigurarUmbrales.jsx";
import ContadorAnimado from "../../components/ContadorAnimado.jsx";
import GraficaHover from "../../components/GraficaHover.jsx";

const INITIAL = [
  { id: "nivel", name: "Nivel", unit: "m", min: 405, max: 416, enabled: true, modified: "Hoy 09:12" },
  { id: "caudal", name: "Caudal", unit: "m³/s", min: 70, max: 95, enabled: true, modified: "Hoy 09:12" },
  { id: "presion", name: "Presión", unit: "bar", min: 20, max: 28, enabled: true, modified: "Ayer" },
  { id: "rpm", name: "RPM", unit: "rpm", min: 580, max: 620, enabled: true, modified: "Ayer" },
  { id: "temperatura", name: "Temperatura", unit: "°C", min: 50, max: 72, enabled: true, modified: "Hoy 10:40" },
  { id: "potencia", name: "Potencia", unit: "MW", min: 60, max: 80, enabled: false, modified: "Hace 3 días" },
];
const temp1 = [60, 61, 62, 63, 62, 61, 64, 65, 64, 66, 69, 73, 78, 76, 72];
const temp2 = [59, 60, 60, 61, 60, 61, 60, 61, 62, 61, 60, 61, 61, 60, 61];
const reservoir = [410.9, 411.4, 411.4, 411.9, 411.9, 411.9, 412.4, 411.9, 411.9, 411.9, 411.9, 411.9];
const generator1 = [68, 70, 69, 72, 71, 73, 72, 74, 73, 72, 71, 72];
const generator2 = [66, 68, 70, 69, 71, 70, 72, 71, 73, 72, 70, 71];
const TABS = ["Turbina 1", "Turbina 2", "Generadores", "Embalse"];
const TONE_COLOR = { normal: "#1a73e0", alta: "#e34445", variable: "#e8a13a" };
const LINE = "#1265d2";

/* ---------- Piezas compartidas (las usan los demás archivos de Monitoreo) ---------- */

export function MiniLine({ data, color = LINE }) {
  const min = Math.min(...data) - 2;
  const range = Math.max(...data) - min + 2;
  const points = data
    .map((value, i) => `${(i / (data.length - 1)) * 190},${45 - ((value - min) / range) * 38}`)
    .join(" ");
  return (
    <svg viewBox="0 0 190 50" width="100%" height="50" preserveAspectRatio="none" role="img" aria-label="Tendencia de demostración">
      <polyline className="anim-linea" pathLength={1} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" points={points} />
    </svg>
  );
}

// Escalas "bonitas" para el eje Y (50, 60, 70… en vez de números raros).
function pasoBonito(rango) {
  const raw = rango / 4;
  const p = 10 ** Math.floor(Math.log10(raw));
  const f = raw / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
}

// Mide el ancho real del contenedor para dibujar el SVG a escala 1:1.
// Así los textos ("umbral", "anomalía", horas) conservan su tamaño en cualquier pantalla.
function useAncho(inicial = 1020) {
  const ref = useRef(null);
  const [ancho, setAncho] = useState(inicial);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => {
      const w = Math.round(el.getBoundingClientRect().width);
      if (w > 0) setAncho((a) => (a === w ? a : w));
    };
    medir();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, ancho];
}

export function Graph({
  data, min = 0, max = 100, threshold, anomalyIndex, color = LINE,
  compare, label, unit = "", nombre = "Valor", nombreCompare = "Comparación",
}) {
  const [boxRef, w] = useAncho();
  const gid = "mon-fill-" + useId().replace(/:/g, "");
  const h = 290, x0 = 46, x1 = w - 18, top = 16, bottom = 250;
  const y = (v) => bottom - ((v - min) / (max - min)) * (bottom - top);
  const x = (i, n) => x0 + (i / (n - 1)) * (x1 - x0);
  const pts = (values) => values.map((v, i) => `${x(i, values.length)},${y(v)}`).join(" ");
  const hora = (i, n) => {
    const m = Math.round((i / (n - 1)) * 60);
    return m >= 60 ? "11:00" : `10:${String(m).padStart(2, "0")}`;
  };
  const fmt = (v) => (unit ? `${v} ${unit}` : String(v));
  const puntos = data.map((v, i) => ({
    x: x(i, data.length),
    y: y(v),
    titulo: hora(i, data.length),
    filas: [
      { nombre, valor: fmt(v), color },
      ...(compare && compare[i] != null ? [{ nombre: nombreCompare, valor: fmt(compare[i]), color: "#aab8cc" }] : []),
    ],
  }));
  const isMark = Number.isInteger(anomalyIndex) && anomalyIndex >= 0 && anomalyIndex < data.length;
  const area = `${x0},${bottom} ${pts(data)} ${x1},${bottom}`;

  const paso = pasoBonito(max - min);
  const ticks = [];
  for (let t = Math.ceil(min / paso) * paso; t <= max + 1e-9; t += paso) ticks.push(Math.round(t * 100) / 100);

  return (
    <div className="mon-graph-box" ref={boxRef}>
      <GraficaHover ancho={w} alto={h} puntos={puntos}>
        <svg className="mon-graph" viewBox={`0 0 ${w} ${h}`} width={w} height={h} role="img" aria-label={label || "Gráfica con datos simulados"}>
          <defs>
            <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={x0} x2={x1} y1={y(t)} y2={y(t)} stroke="#d5e4f7" strokeDasharray="4 4" />
              <text x={x0 - 10} y={y(t) + 4} textAnchor="end" fill="#607695" fontSize="12">{t}</text>
            </g>
          ))}
          <line x1={x0} x2={x1} y1={bottom} y2={bottom} stroke="#b7c9e2" strokeWidth="1.2" />
          {threshold != null && threshold >= min && threshold <= max && (
            <g className="anim-fade">
              <line x1={x0} x2={x1} y1={y(threshold)} y2={y(threshold)} stroke="#e8a13a" strokeDasharray="6 5" strokeWidth="1.5" />
              <text x={x0 + 8} y={y(threshold) - 7} fill="#a56600" fontSize="12" fontWeight="600">umbral</text>
            </g>
          )}
          <polygon className="anim-fade" points={area} fill={`url(#${gid})`} />
          <polyline className="anim-linea" pathLength={1} points={pts(data)} stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" fill="none" />
          {compare && (
            <polyline className="anim-fade" points={pts(compare)} stroke="#aab8cc" strokeWidth="2.5" strokeDasharray="6 5" strokeLinejoin="round" fill="none" />
          )}
          {isMark && (
            <>
              <circle className="anim-punto" cx={x(anomalyIndex, data.length)} cy={y(data[anomalyIndex])} r="9" stroke="#e34445" strokeWidth="2.5" fill="#ffe4e7" fillOpacity="0.7" />
              <text className="anim-fade" x={x(anomalyIndex, data.length)} y={y(data[anomalyIndex]) - 18} fill="#c83239" textAnchor="middle" fontSize="13" fontWeight="700">anomalía</text>
            </>
          )}
          {[["10:00", 0], ["10:15", 0.25], ["10:30", 0.5], ["10:45", 0.75], ["11:00", 1]].map(([t, f]) => (
            <text key={t} x={x0 + f * (x1 - x0)} y={bottom + 24} textAnchor="middle" fill="#607695" fontSize="12">{t}</text>
          ))}
        </svg>
      </GraficaHover>
    </div>
  );
}

export function Status({ children, tone = "normal" }) {
  return (
    <span className={`mon-status mon-${tone}`}>
      <i className="mon-dot" />
      {children}
    </span>
  );
}

export function Panel({ title, children, extra, className = "", Icon }) {
  return (
    <section className={`mon-panel ${className}`}>
      <div className="mon-panel-title">
        <h2>{Icon && <Icon size={22} />}{title}</h2>
        {extra}
      </div>
      {children}
    </section>
  );
}

// items: [{ label, value, color?, Icon? }]
export function Tiles({ items }) {
  return (
    <div className="mon-stats anim-stagger">
      {items.map((item, i) => (
        <div className="mon-stat anim-metrica" key={item.label} style={{ "--i": i }}>
          {item.Icon && <span className="mon-stat-icon"><item.Icon size={24} /></span>}
          <div className="mon-stat-info">
            <span>{item.label}</span>
            <strong style={{ color: item.color || undefined }}>
              <ContadorAnimado valor={item.value} />
            </strong>
          </div>
        </div>
      ))}
    </div>
  );
}

// Encabezado grande como el del Dashboard: título, subtítulo con ícono y chip a la derecha.
export function PageHeader({ title, subtitle = "Central Hidroeléctrica Cyber-HydroVolt", SubIcon = Waves, right }) {
  return (
    <header className="mon-head">
      <div>
        <h1>{title}</h1>
        <p className="mon-sub"><SubIcon size={20} /> {subtitle}</p>
      </div>
      {right}
    </header>
  );
}

export function StatusBar({ sensores = "6/6" }) {
  return (
    <div className="mon-statusbar">
      <div>
        <i className="gh-live" style={{ margin: 0 }} />
        <strong>Telemetría en tiempo real</strong>
        <span className="mon-pipe" />
        <span>Sensores en línea: {sensores}</span>
        <span className="mon-pipe" />
        <span>Última actualización: hace 2 s</span>
      </div>
      <span className="mon-stable"><Activity size={17} /> Sistema estable</span>
    </div>
  );
}

/* ---------- Pantalla principal de Monitoreo ---------- */

export default function Monitoreo({ onNavigate }) {
  const [view, setView] = useState("resumen");
  const [tab, setTab] = useState("Turbina 1");
  const [thresholds, setThresholds] = useState(INITIAL);
  const [notice, setNotice] = useState("");
  const threshold = (id) => thresholds.find((v) => v.id === id);
  const openSensor = () => { setNotice(""); setView("sensor"); };
  const openThresholds = () => { setNotice(""); setView("umbrales"); };
  const returnToMonitor = () => { setNotice(""); setView("resumen"); };
  const currentTurbine = tab === "Turbina 2" ? 2 : 1;
  const temp = currentTurbine === 1 ? temp1 : temp2;
  const display = currentTurbine === 1 ? 78 : 61;
  const pressure = currentTurbine === 1 ? "24.1" : "24.0";
  const metrics = [
    { label: "Nivel (m)", Icon: Droplets, value: "412.3", tone: "normal", data: reservoir },
    { label: "Caudal (m³/s)", Icon: Waves, value: "85", tone: "normal", data: [82, 80, 83, 85, 83, 84, 85, 83] },
    { label: "Presión (bar)", Icon: Gauge, value: pressure, tone: tab === "Embalse" || currentTurbine === 2 ? "normal" : "variable", data: [24, 24, 25, 23.5, 25.5, 24, 24.5, 24] },
    { label: "RPM", Icon: RotateCw, value: "600", tone: "normal", data: [600, 600, 600, 600, 600, 600] },
    { label: "Temperatura (°C)", Icon: Thermometer, value: String(display), tone: currentTurbine === 1 ? "alta" : "normal", data: temp, clickable: true },
    { label: "Potencia (MW)", Icon: Zap, value: currentTurbine === 1 ? "74" : "73", tone: "normal", data: currentTurbine === 1 ? generator1 : generator2 },
  ];
  const tarjeta = (m, i) => {
    const content = (
      <>
        <div className="mon-metric-top">
          <span className={`mon-metric-icon mon-i-${m.tone}`}><m.Icon size={20} /></span>
          <span className="mon-metric-label">{m.label}</span>
          {m.clickable && <ChevronRight className="mon-metric-arrow" size={18} />}
        </div>
        <div className="mon-metric-body">
          <strong><ContadorAnimado valor={m.value} /></strong>
          <MiniLine data={m.data} color={TONE_COLOR[m.tone]} />
        </div>
        <Status tone={m.tone}>{m.tone === "alta" ? "Alta" : m.tone === "variable" ? "Variable" : "Normal"}</Status>
      </>
    );
    const cls = `mon-metric anim-metrica${m.tone === "alta" ? " is-alta" : ""}`;
    return m.clickable ? (
      <button className={`${cls} mon-metric-button anim-nolift`} key={m.label} type="button" title="Ver detalle del sensor" style={{ "--i": i }} onClick={openSensor}>
        {content}
      </button>
    ) : (
      <div className={cls} key={m.label} style={{ "--i": i }}>{content}</div>
    );
  };

  return (
    <section className="mon-root anim-scope">
      <div className="anim-vista" key={view}>
        {view === "sensores" ? (
          <EstadoSensores onBack={returnToMonitor} onSensor={openSensor} />
        ) : view === "sensor" ? (
          <SensorTemperatura onBack={returnToMonitor} onThresholds={openThresholds} threshold={threshold("temperatura")} onNavigate={onNavigate} />
        ) : view === "umbrales" ? (
          <ConfigurarUmbrales
            onBack={returnToMonitor}
            current={thresholds}
            defaults={INITIAL}
            onSave={(values) => {
              setThresholds(values);
              setNotice("Cambios guardados en esta demostración.");
              setView("sensor");
            }}
          />
        ) : (
          <>
            <PageHeader
              title={`Monitoreo hidroeléctrico${tab !== "Turbina 1" ? ` › ${tab}` : ""}`}
              right={<span className="mon-chip"><Radio size={18} /> Telemetría en tiempo real · Datos simulados</span>}
            />
            <div className="mon-tabs">
              <div className="mon-tab-list" role="group" aria-label="Componente">
                {TABS.map((name) => (
                  <button className={`mon-tab ${tab === name ? "active" : ""}`} type="button" key={name} aria-pressed={tab === name} onClick={() => setTab(name)}>
                    {name}
                  </button>
                ))}
              </div>
              <span className="mon-live"><i className="gh-live" />En vivo (simulado)</span>
            </div>
            <div className="mon-toolbar">
              <button type="button" className="mon-secondary" onClick={() => setView("sensores")}>
                <Radio size={17} /> Estado de sensores <ChevronRight size={16} />
              </button>
              <button type="button" className="mon-secondary" onClick={openThresholds}>
                <SlidersHorizontal size={17} /> Configurar umbrales <ChevronRight size={16} />
              </button>
            </div>
            <div key={tab}>
              {tab === "Generadores" ? (
                <>
                  <div className="mon-generator-grid">
                    {[1, 2].map((n) => (
                      <Panel title={`Generador ${n}`} Icon={Zap} key={n} extra={<Status>Normal</Status>}>
                        <div className="mon-generator-metrics">
                          <div><span>Potencia</span><strong><ContadorAnimado valor={String(n === 1 ? 74 : 73)} /> MW</strong></div>
                          <div><span>Temperatura</span><strong><ContadorAnimado valor={String(n === 1 ? 61 : 63)} /> °C</strong></div>
                        </div>
                        <MiniLine data={n === 1 ? generator1 : generator2} />
                      </Panel>
                    ))}
                  </div>
                  <Panel
                    title="Potencia generada (MW)"
                    Icon={Activity}
                    extra={<span className="mon-legend"><span><i />Generador 1</span><span><i className="dash" />Generador 2</span></span>}
                  >
                    <Graph data={generator1} compare={generator2} min={50} max={90} unit="MW" nombre="Generador 1" nombreCompare="Generador 2" label="Potencia simulada comparativa de los generadores" />
                  </Panel>
                </>
              ) : tab === "Embalse" ? (
                <>
                  <div className="mon-cards anim-stagger">
                    {metrics.slice(0, 3).map((m, i) => tarjeta({ ...m, tone: "normal", clickable: false }, i))}
                  </div>
                  <Panel title="Nivel del embalse (m)" Icon={Droplets} extra={<Status>Dentro de rango</Status>}>
                    <Graph data={reservoir} min={408} max={419} unit="m" nombre="Nivel" threshold={threshold("nivel")?.max} label="Nivel simulado del embalse" />
                    <p className="mon-muted" style={{ textAlign: "right", margin: "8px 0 0" }}>Nivel máximo operativo: 416 m</p>
                  </Panel>
                </>
              ) : (
                <>
                  <div className="mon-cards anim-stagger">{metrics.map(tarjeta)}</div>
                  <Panel title={`Tendencia: Temperatura Turbina ${currentTurbine} (°C)`} Icon={Thermometer}>
                    <Graph
                      data={temp} min={50} max={90} unit="°C" nombre="Temperatura"
                      threshold={threshold("temperatura")?.enabled ? threshold("temperatura").max : null}
                      anomalyIndex={currentTurbine === 1 ? 12 : undefined}
                      label={`Temperatura simulada Turbina ${currentTurbine}`}
                    />
                  </Panel>
                </>
              )}
            </div>
            <StatusBar />
          </>
        )}
        {notice && view === "sensor" && <p className="mon-message" role="status">{notice}</p>}
      </div>
    </section>
  );
}