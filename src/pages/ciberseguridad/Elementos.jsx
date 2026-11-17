import React, { useEffect, useId, useRef, useState } from "react";
import {
  ShieldCheck, Activity, Lock, ShieldAlert, WifiOff, MessageSquare,
  Network, Users, Clock3, Radio,
} from "lucide-react";
import ContadorAnimado from "../../components/ContadorAnimado.jsx";
import GraficaHover from "../../components/GraficaHover.jsx";

export const colors = {
  red: "#c83239",
  green: "#167c40",
  amber: "#a56600",
  blue: "#0f5fc0",
  muted: "#6780a2",
};

// Activa una fila/elemento con Enter o Espacio (accesibilidad por teclado)
export const activar = (fn) => (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(); }
};

// Ícono automático según la etiqueta, para no tocar cada pantalla que usa <Stats>.
function iconoPara(label = "") {
  if (/primer|último|ultimo/i.test(label)) return Clock3;
  if (/usuario|rol/i.test(label)) return Users;
  if (/sin comunic/i.test(label)) return WifiOff;
  if (/\bip|sospech/i.test(label)) return ShieldAlert;
  if (/mensaje|alterad|integr/i.test(label)) return MessageSquare;
  if (/acceso|intento|fallid|login/i.test(label)) return Lock;
  if (/conexion|conexión|protocolo/i.test(label)) return Network;
  return Activity;
}

export function Title({ section = "Ciberseguridad", detail, aside, onBack, badge, subtitle = "Central Hidroeléctrica Cyber-HydroVolt" }) {
  return (
    <div className="cy-header">
      <div>
        <h1>
          {detail ? (
            <>
              <button className="cy-back" onClick={onBack}>{section}</button>
              <span> › {detail}</span>
            </>
          ) : (
            section
          )}
        </h1>
        <p className="cy-sub"><ShieldCheck size={20} /> {subtitle}</p>
      </div>
      {badge ? (
        <Pill tone={badge === "Sospechosa" ? "red" : "green"}>{badge}</Pill>
      ) : (
        <span className="cy-chip"><Radio size={18} /> {aside || "Red industrial simulada"}</span>
      )}
    </div>
  );
}
export function Pill({ tone = "neutral", children }) {
  return (
    <span className={"cy-pill cy-" + tone}>
      <i className="cy-dot" />
      {children}
    </span>
  );
}
// items: [{ label, value, tone?, Icon? }]
export function Stats({ items }) {
  return (
    <div className="cy-stats anim-stagger">
      {items.map((x, i) => {
        const Ico = x.Icon || iconoPara(x.label);
        return (
          <div className={"cy-stat anim-metrica" + (x.tone ? " cy-stat-" + x.tone : "")} key={i} style={{ "--i": i }}>
            <span className="cy-stat-icon"><Ico size={22} /></span>
            <div className="cy-stat-info">
              <span>{x.label}</span>
              <strong style={{ color: x.tone ? colors[x.tone] : undefined }}>
                <ContadorAnimado valor={x.value} />
              </strong>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export function Panel({ title, children, extra, className = "", Icon }) {
  return (
    <section className={"cy-panel " + className}>
      <div className="cy-panel-head">
        <h2>{Icon && <Icon size={22} />}{title}</h2>
        {extra}
      </div>
      {children}
    </section>
  );
}
export function StatusBar({ conexiones = "12", chip = "Vigilancia activa" }) {
  return (
    <div className="cy-statusbar">
      <div>
        <i className="gh-live" style={{ margin: 0 }} />
        <strong>Monitoreo de red en tiempo real</strong>
        <span className="cy-pipe" />
        <span>Conexiones activas: {conexiones}</span>
        <span className="cy-pipe" />
        <span>Última actualización: hace 2 s</span>
      </div>
      <span className="cy-stable"><ShieldCheck size={17} /> {chip}</span>
    </div>
  );
}

// umbral: las barras con valor >= umbral se pintan en rojo (opcional)
export function BarChart({
  values = [30, 33, 31, 36, 75, 37, 33, 34],
  color = "#2f80e6",
  labels = ["10", "11", "12", "13", "14", "15", "16", "17"],
  unit = "paq./min",
  umbral,
}) {
  const max = Math.max(...values, 1);
  return (
    <div className="cy-bars" role="group" aria-label="Gráfica de barras de datos simulados">
      {values.map((v, i) => {
        const alto = umbral != null && v >= umbral;
        const base = alto ? "#e34445" : color;
        const texto = `${labels[i] ?? i}:00 · ${v} ${unit}`;
        return (
          <div className="cy-bar-cell gh-barcell" key={i} tabIndex={0} data-tip={texto} aria-label={texto}>
            <div
              className="cy-bar anim-barra-v"
              style={{ height: `${(v / max) * 82}%`, minHeight: 3, background: `linear-gradient(180deg, ${base}, ${base}cc)`, animationDelay: `${0.15 + i * 0.07}s` }}
            />
            <small>{labels[i] ?? i}</small>
          </div>
        );
      })}
    </div>
  );
}

// Mide el ancho real del contenedor: el SVG se dibuja a escala 1:1 y el texto no se agranda.
function useAncho(inicial = 1010) {
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

export function LineChart({ values, threshold, anomalyIndex, low = 0, high = 100, unit = "paq./min" }) {
  const [boxRef, w] = useAncho();
  const gid = "cy-fill-" + useId().replace(/:/g, "");
  const h = 290, x0 = 46, x1 = w - 18, bottom = 250;
  const x = (i) => x0 + i * ((x1 - x0) / (values.length - 1));
  const y = (v) => bottom - ((v - low) / (high - low)) * (bottom - 16);
  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const area = `${x0},${bottom} ${points} ${x1},${bottom}`;
  const hora = (i) => {
    const m = Math.round((i / (values.length - 1)) * 60);
    return m >= 60 ? "11:00" : `10:${String(m).padStart(2, "0")}`;
  };
  const puntos = values.map((v, i) => ({
    x: x(i),
    y: y(v),
    titulo: hora(i),
    filas: [{ nombre: "Tráfico", valor: `${v} ${unit}`, color: "#1265d2" }],
  }));
  const ticks = [0, 1, 2, 3, 4].map((k) => low + ((high - low) * k) / 4);
  return (
    <div className="cy-chart-box" ref={boxRef}>
      <GraficaHover ancho={w} alto={h} puntos={puntos}>
        <svg className="cy-chart" viewBox={`0 0 ${w} ${h}`} width={w} height={h} role="img" aria-label="Gráfica de tráfico simulado">
          <defs>
            <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#1265d2" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#1265d2" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={x0} x2={x1} y1={y(t)} y2={y(t)} stroke="#d5e4f7" strokeDasharray="4 4" />
              <text x={x0 - 10} y={y(t) + 4} textAnchor="end" fill="#607695" fontSize="12">{t}</text>
            </g>
          ))}
          <line x1={x0} x2={x1} y1={bottom} y2={bottom} stroke="#b7c9e2" strokeWidth="1.2" />
          {threshold !== undefined && (
            <g className="anim-fade">
              <line x1={x0} x2={x1} y1={y(threshold)} y2={y(threshold)} stroke="#e8a13a" strokeDasharray="6 5" strokeWidth="1.5" />
              <text x={x0 + 8} y={y(threshold) - 7} fill="#a56600" fontSize="12" fontWeight="600">umbral</text>
            </g>
          )}
          <polygon className="anim-fade" points={area} fill={`url(#${gid})`} />
          <polyline className="anim-linea" pathLength={1} points={points} fill="none" stroke="#1265d2" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
          {Number.isInteger(anomalyIndex) && (
            <>
              <circle className="anim-punto" cx={x(anomalyIndex)} cy={y(values[anomalyIndex])} r="9" fill="#ffe4e7" fillOpacity="0.7" stroke="#e34445" strokeWidth="2.5" />
              <text className="anim-fade" x={x(anomalyIndex)} y={y(values[anomalyIndex]) - 18} textAnchor="middle" fontSize="13" fontWeight="700" fill="#c83239">anomalía</text>
            </>
          )}
          {[["10:00", 0], ["10:15", 0.25], ["10:30", 0.5], ["10:45", 0.75], ["11:00", 1]].map(([t, f]) => (
            <text key={t} x={x0 + f * (x1 - x0)} y={bottom + 24} textAnchor="middle" fontSize="12" fill="#607695">{t}</text>
          ))}
        </svg>
      </GraficaHover>
    </div>
  );
}

export function DownloadCsv(name, headers, rows) {
  const csv = [headers, ...rows]
    .map((row) => row.map((v) => '"' + String(v).replaceAll('"', '""') + '"').join(","))
    .join("\r\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export const exampleLogs = [
  { id: 1, date: "26/10 14:06", time: "14:06", user: "admin", ip: "192.168.1.45", origin: "Interno", result: "Fallido" },
  { id: 2, date: "26/10 14:05", time: "14:05", user: "admin", ip: "192.168.1.45", origin: "Interno", result: "Fallido" },
  { id: 3, date: "26/10 13:58", time: "13:58", user: "operador1", ip: "10.0.0.12", origin: "Interno", result: "Exitoso" },
  { id: 4, date: "26/10 13:40", time: "13:40", user: "desconocido", ip: "203.0.113.8", origin: "Externo", result: "Bloqueado" },
  { id: 5, date: "26/10 13:22", time: "13:22", user: "analista", ip: "10.0.0.20", origin: "Interno", result: "Exitoso" },
  { id: 6, date: "26/10 13:05", time: "13:05", user: "admin", ip: "192.168.1.45", origin: "Interno", result: "Fallido" },
  { id: 7, date: "26/10 12:51", time: "12:51", user: "operador2", ip: "10.0.0.15", origin: "Interno", result: "Exitoso" },
  { id: 8, date: "26/10 12:30", time: "12:30", user: "desconocido", ip: "198.51.100.4", origin: "Externo", result: "Bloqueado" },
];
export const logTone = (r) => (r === "Exitoso" ? "green" : r === "Fallido" ? "amber" : "red");