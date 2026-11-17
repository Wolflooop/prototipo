import { useState } from "react";
import {
  Zap,
  House,
  Activity,
  ShieldCheck,
  Cpu,
  Bell,
  ChartColumnIncreasing,
  Clock3,
  UserRound,
  LogOut,
  Waves,
  Fan,
  Gauge,
  GitBranch,
  TrendingUp,
  ChevronRight,
  ChartNoAxesCombined,
  Layers3,
  CircleAlert,
  Info,
  CheckCircle2,
  Radio,
  ArrowUpRight,
  GaugeCircle,
  CalendarDays,
} from "lucide-react";
import "./Dashboard.css";
import NivelRiesgo from "./NivelRiesgo.jsx";
import AlertasAbiertas from "./AlertasAbiertas.jsx";
import EmbalseConduccion from "./EmbalseConduccion.jsx";
import Generador from "./Generador.jsx";
import Turbina from "./Turbina.jsx";
import Monitoreo from "../monitoreo/Monitoreo.jsx";
import Ciberseguridad from "../ciberseguridad/Ciberseguridad.jsx";
import InteligenciaArtificial from "../inteligencia_artificial/InteligenciaArtificial.jsx";
import CentroAlertas from "../centro_alertas/CentroAlertas.jsx";
import Reportes from "../reportes/Reportes.jsx";

const powerSeries = {
  "1 h": [134, 138, 136, 142, 140, 145, 142, 147, 144, 149, 146, 145, 142, 148],
  "6 h": [122, 125, 132, 129, 139, 136, 141, 143, 137, 146, 149, 144, 148, 148],
  "24 h": [
    139, 132, 136, 131, 143, 147, 142, 135, 133, 143, 145, 140, 146, 148,
  ],
  "7 días": [128, 139, 135, 144, 141, 148, 145, 148],
};
const alerts = [
  { title: "Temperatura Turbina 1 alta", level: "Alta", time: "Hace 2 min" },
  { title: "5 accesos fallidos", level: "Media", time: "Hace 8 min" },
  { title: "Pérdida de señal sensor 4", level: "Media", time: "Hace 12 min" },
  { title: "Variación de presión", level: "Baja", time: "Hace 18 min" },
];
const components = [
  { name: "Embalse", status: "Normal", Icon: Waves, destination: "embalse" },
  {
    name: "Conducción",
    status: "Normal",
    Icon: GitBranch,
    destination: "embalse",
  },
  { name: "Turbina 1", status: "Alerta", Icon: Fan, destination: "turbina1" },
  { name: "Turbina 2", status: "Normal", Icon: Fan, destination: "turbina2" },
  {
    name: "Generador 1",
    status: "Normal",
    Icon: Zap,
    destination: "generador1",
  },
  {
    name: "Generador 2",
    status: "Normal",
    Icon: Zap,
    destination: "generador2",
  },
];
const menuItems = [
  { label: "Dashboard", Icon: House },
  { label: "Monitoreo", Icon: Activity },
  { label: "Ciberseguridad", Icon: ShieldCheck },
  { label: "Inteligencia Artificial", Icon: Cpu },
  { label: "Centro de alertas", Icon: Bell },
  { label: "Reportes", Icon: ChartColumnIncreasing },
];

function PowerChart({ period }) {
  const samples = powerSeries[period];
  const left = 66,
    right = 740,
    top = 30,
    bottom = 248;
  const point = (value, i) => ({
    x: left + (i / (samples.length - 1)) * (right - left),
    y: bottom - ((value - 100) / 60) * (bottom - top),
  });
  const pts = samples.map(point);
  const path = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const end = pts[pts.length - 1];
  return (
    <div className="ch-power-chart">
      <svg
        viewBox="0 0 770 306"
        role="img"
        aria-label={`Gráfica ilustrativa de potencia generada de ${period}, valor final ${samples.at(-1)} megavatios`}
      >
        <defs>
          <linearGradient id="ch-power-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#64adf7" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#64adf7" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[100, 110, 120, 130, 140, 150, 160].map((tick) => {
          const y = bottom - ((tick - 100) / 60) * (bottom - top);
          return (
            <g key={tick}>
              <line
                x1={left}
                y1={y}
                x2={right}
                y2={y}
                stroke="#d5e4f7"
                strokeDasharray="4 4"
              />
              <text
                x={left - 15}
                y={y + 5}
                textAnchor="end"
                fill="#607695"
                fontSize="15"
              >
                {tick}
              </text>
            </g>
          );
        })}
        <path
          d={`${path} L ${right} ${bottom} L ${left} ${bottom} Z`}
          fill="url(#ch-power-fill)"
        />
        <path
          d={path}
          fill="none"
          stroke="#1265d2"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={end.x}
          cy={end.y}
          r="6"
          fill="#146bda"
          stroke="white"
          strokeWidth="3"
        />
        <g transform={`translate(${right - 94},${Math.max(2, end.y - 57)})`}>
          <rect width="94" height="36" rx="10" fill="white" stroke="#aacaf3" />
          <text
            x="47"
            y="24"
            textAnchor="middle"
            fontSize="17"
            fontWeight="700"
            fill="#163762"
          >
            {samples.at(-1)} MW
          </text>
        </g>
        {[
          ["10:00", left],
          ["10:15", left + (right - left) * 0.25],
          ["10:30", left + (right - left) * 0.5],
          ["10:45", left + (right - left) * 0.75],
          ["11:00", right],
        ].map(([label, x]) => (
          <text
            key={label}
            x={x}
            y={bottom + 29}
            textAnchor="middle"
            fontSize="15"
            fill="#627796"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default function Dashboard({ onLogout, usuario }) {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [detalle, setDetalle] = useState("principal");
  const [alertasAbiertas, setAlertasAbiertas] = useState(false);
  const [chartPeriod, setChartPeriod] = useState("1 h");
  const irDashboard = () => setDetalle("principal");
  const irMenu = (seccion) => {
    setAlertasAbiertas(false);
    setDetalle("principal");
    setActiveSection(seccion);
  };
  return (
    <div className="ch-app">
      <aside className="ch-sidebar">
        <div className="ch-brand">
          <span className="ch-brand-logo">
            <Zap size={27} fill="currentColor" strokeWidth={1.7} />
          </span>
          <span>Cyber-HydroVolt</span>
        </div>
        <nav className="ch-nav" aria-label="Menú principal">
          {menuItems.map(({ label, Icon }) => (
            <button
              key={label}
              type="button"
              className={`ch-nav-button ${activeSection === label ? "is-active" : ""}`}
              onClick={() => irMenu(label)}
            >
              <Icon size={21} strokeWidth={1.9} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="ch-profile">
          <div className="ch-user-row">
            <span className="ch-avatar">
              <UserRound size={25} />
            </span>
            <div>
              <strong>{usuario?.nombre ?? "Operador"}</strong>
              <small>
                {usuario?.rol
                  ? `Rol: ${usuario.rol}`
                  : "Sesión de demostración"}
              </small>
            </div>
          </div>

          <small className="ch-online">
            <span className="ch-live-dot" />
            Sistema operativo
          </small>

          {onLogout && (
            <button className="ch-logout" type="button" onClick={onLogout}>
              <LogOut size={16} />
              Cerrar sesión
            </button>
          )}
        </div>
      </aside>
      <main className="ch-main">
        {activeSection === "Dashboard" && detalle === "riesgo" ? (
          <NivelRiesgo onBack={irDashboard} onNavigate={irMenu} />
        ) : activeSection === "Dashboard" && detalle === "embalse" ? (
          <EmbalseConduccion onBack={irDashboard} />
        ) : activeSection === "Dashboard" &&
          (detalle === "turbina1" || detalle === "turbina2") ? (
          <Turbina
            numero={detalle === "turbina1" ? 1 : 2}
            onBack={irDashboard}
            onNavigate={irMenu}
            onShowAlerts={() => setAlertasAbiertas(true)}
          />
        ) : activeSection === "Dashboard" &&
          (detalle === "generador1" || detalle === "generador2") ? (
          <Generador
            numero={detalle === "generador1" ? 1 : 2}
            onBack={irDashboard}
          />
        ) : activeSection === "Dashboard" ? (
          <div className="ch-home">
            <header className="ch-home-header">
              <div>
                <h1>Dashboard</h1>
                <p>
                  <Waves size={22} /> Central Hidroeléctrica Cyber-HydroVolt
                </p>
              </div>
              <span className="ch-demo-chip">
                <Clock3 size={18} /> Entorno de simulación
              </span>
            </header>
            <section
              className="ch-kpi-grid"
              aria-label="Indicadores principales"
            >
              <div className="ch-kpi ch-kpi-wave">
                <span className="ch-kpi-icon">
                  <Zap size={27} fill="currentColor" />
                </span>
                <div className="ch-kpi-info">
                  <span>Potencia total</span>
                  <strong>148 MW</strong>
                </div>
                <span className="ch-trend">
                  <ArrowUpRight size={15} /> +2.3%
                </span>
              </div>
              <div className="ch-kpi ch-kpi-wave">
                <span className="ch-kpi-icon">
                  <Fan size={27} />
                </span>
                <div className="ch-kpi-info">
                  <span>Turbinas activas</span>
                  <strong>2/2</strong>
                </div>
              </div>
              <button
                type="button"
                className="ch-kpi ch-kpi-wave ch-kpi-action"
                onClick={() => setAlertasAbiertas(true)}
              >
                <span className="ch-kpi-icon">
                  <Bell size={27} />
                </span>
                <div className="ch-kpi-info">
                  <span>Alertas abiertas</span>
                  <strong>5</strong>
                </div>
                <ChevronRight className="ch-kpi-arrow" size={19} />
              </button>
              <button
                type="button"
                className="ch-kpi ch-kpi-risk ch-kpi-action"
                onClick={() => setDetalle("riesgo")}
              >
                <span className="ch-kpi-icon">
                  <ShieldCheck size={27} />
                </span>
                <div className="ch-kpi-info">
                  <span>Nivel de riesgo</span>
                  <strong>Medio</strong>
                </div>
                <ChevronRight className="ch-kpi-arrow" size={19} />
              </button>
            </section>
            <section className="ch-home-middle" aria-label="Gráfica y alertas">
              <article className="ch-home-panel ch-chart-panel">
                <div className="ch-panel-top">
                  <h2>
                    <TrendingUp size={24} /> Potencia generada (MW)
                  </h2>
                  <div
                    className="ch-period-tabs"
                    aria-label="Periodo de la gráfica"
                  >
                    {Object.keys(powerSeries).map((period) => (
                      <button
                        key={period}
                        type="button"
                        className={chartPeriod === period ? "is-active" : ""}
                        onClick={() => setChartPeriod(period)}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
                <PowerChart period={chartPeriod} />
              </article>
              <article className="ch-home-panel ch-alerts-panel">
                <div className="ch-panel-top">
                  <h2>
                    <Bell size={24} /> Alertas recientes
                  </h2>
                  <button
                    type="button"
                    className="ch-text-link"
                    onClick={() => irMenu("Centro de alertas")}
                  >
                    Ver todas <span aria-hidden="true">→</span>
                  </button>
                </div>
                <div className="ch-recent-list">
                  {alerts.map((alert) => (
                    <button
                      key={alert.title}
                      className="ch-recent-alert"
                      type="button"
                      onClick={() => irMenu("Centro de alertas")}
                    >
                      <span
                        className={`ch-alert-symbol ${alert.level.toLowerCase()}`}
                      >
                        {alert.level === "Baja" ? (
                          <Info size={23} />
                        ) : (
                          <CircleAlert size={23} />
                        )}
                      </span>
                      <span className="ch-recent-copy">
                        <strong>{alert.title}</strong>
                        <small>{alert.time}</small>
                      </span>
                      <span
                        className={`ch-recent-badge ${alert.level.toLowerCase()}`}
                      >
                        {alert.level}
                      </span>
                    </button>
                  ))}
                </div>
              </article>
            </section>
            <section
              className="ch-home-panel ch-components-panel"
              aria-label="Estado de componentes"
            >
              <h2>
                <Layers3 size={24} /> Estado de componentes
              </h2>
              <div className="ch-component-grid">
                {components.map(({ name, status, Icon, destination }) => (
                  <button
                    type="button"
                    key={name}
                    className={`ch-component-tile ${status === "Alerta" ? "has-alert" : ""}`}
                    onClick={() => setDetalle(destination)}
                  >
                    <span className="ch-tile-header">
                      <Icon size={22} />
                      <strong>{name}</strong>
                    </span>
                    <span
                      className={`ch-component-status ${status === "Alerta" ? "alerta" : "normal"}`}
                    >
                      <span className="ch-status-dot" />
                      {status}
                    </span>
                  </button>
                ))}
              </div>
            </section>
            <div className="ch-telemetry-footer">
              <div>
                <span className="ch-live-dot" />
                <strong>Telemetría en tiempo real</strong>
                <span className="ch-pipe" />
                Sensores en línea: 6/6 <span className="ch-pipe" />
                Última actualización: hace 2 s
              </div>
              <span className="ch-stable">
                <Activity size={18} /> Sistema estable
              </span>
            </div>
          </div>
        ) : activeSection === "Monitoreo" ? (
          <Monitoreo onNavigate={irMenu} />
        ) : activeSection === "Ciberseguridad" ? (
          <Ciberseguridad onNavigate={irMenu} />
        ) : activeSection === "Inteligencia Artificial" ? (
          <InteligenciaArtificial onNavigate={irMenu} />
        ) : activeSection === "Centro de alertas" ? (
          <CentroAlertas onNavigate={irMenu} />
        ) : activeSection === "Reportes" ? (
          <Reportes onNavigate={irMenu} />
        ) : (
          <>
            <header className="ch-header">
              <h1>{activeSection}</h1>
              <p>Central Hidroeléctrica Cyber-HydroVolt</p>
            </header>
            <div className="ch-demo-note">
              Esta sección se desarrollará en una próxima pantalla del
              prototipo.
            </div>
          </>
        )}
      </main>
      {alertasAbiertas && (
        <AlertasAbiertas
          onClose={() => setAlertasAbiertas(false)}
          onNavigate={irMenu}
        />
      )}
    </div>
  );
}
