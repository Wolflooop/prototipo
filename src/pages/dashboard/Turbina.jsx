const datosTurbinas = {
  1: {
    rpm: "600",
    temperatura: "78 °C",
    presion: "24.1 bar",
    potencia: "74 MW",
    generador: "Generador 1",
    estado: "Alerta",
    clasificacion: "Falla operativa (78 %)",
    valores: [32, 34, 36, 34, 39, 41, 39, 46, 56, 78, 74, 65],
    avisos: [
      ["Temperatura alta", "Alta"],
      ["Variación de presión", "Media"],
      ["RPM fuera de rango", "Baja"],
    ],
  },
  2: {
    rpm: "600",
    temperatura: "61 °C",
    presion: "24.0 bar",
    potencia: "74 MW",
    generador: "Generador 2",
    estado: "Normal",
    clasificacion: "Comportamiento normal (94 %)",
    valores: [38, 39, 40, 39, 41, 42, 40, 41, 42, 40, 41, 40],
    avisos: [],
  },
};

function TemperaturaChart({ valores, numero }) {
  const left = 12,
    right = 742,
    top = 12,
    bottom = 276;
  const p = (value, i) => [
    left + (i / (valores.length - 1)) * (right - left),
    bottom - (value / 100) * (bottom - top),
  ];
  const points = valores.map((v, i) => p(v, i).join(",")).join(" ");
  const anomalia = p(valores[9], 9);
  const umbral = bottom - (60 / 100) * (bottom - top);
  return (
    <svg
      className="ch-detail-svg"
      viewBox="0 0 760 325"
      role="img"
      aria-label={`Gráfica simulada de temperatura de Turbina ${numero}, de 10:00 a 11:00`}
    >
      <line
        x1={left}
        y1={top}
        x2={left}
        y2={bottom}
        stroke="#bcbab3"
        strokeWidth="1.5"
      />
      <line
        x1={left}
        y1={bottom}
        x2={right}
        y2={bottom}
        stroke="#bcbab3"
        strokeWidth="1.5"
      />
      <line
        x1={left}
        x2={right}
        y1={umbral}
        y2={umbral}
        stroke="#96958f"
        strokeDasharray="7 7"
        strokeWidth="1.5"
      />
      <text x={left + 8} y={umbral - 9} fill="#888680" fontSize="17">
        umbral
      </text>
      <polyline
        points={points}
        fill="none"
        stroke="#64635f"
        strokeWidth="2.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {numero === 1 && (
        <>
          <circle
            cx={anomalia[0]}
            cy={anomalia[1]}
            r="11"
            fill="white"
            fillOpacity="0"
            stroke="#ed4444"
            strokeWidth="3"
          />
          <text
            x={anomalia[0] - 18}
            y={anomalia[1] - 20}
            fill="#c73737"
            textAnchor="end"
            fontSize="17"
          >
            anomalía
          </text>
        </>
      )}
      <text x={left} y="316" fill="#92918a" fontSize="17">
        10:00
      </text>
      <text x="380" y="316" textAnchor="middle" fill="#92918a" fontSize="17">
        10:30
      </text>
      <text x={right} y="316" textAnchor="end" fill="#92918a" fontSize="17">
        11:00
      </text>
    </svg>
  );
}

export default function Turbina({
  numero = 1,
  onBack,
  onNavigate,
  onShowAlerts,
}) {
  const info = datosTurbinas[numero] || datosTurbinas[1];
  const met = [
    ["RPM", info.rpm],
    ["Temperatura", info.temperatura],
    ["Presión", info.presion],
    ["Potencia", info.potencia],
  ];
  const jump = (section) => onNavigate?.(section);
  return (
    <section className="ch-subpage">
      <header className="ch-detail-header">
        <h1>
          <button type="button" className="ch-breadcrumb" onClick={onBack}>
            Dashboard
          </button>{" "}
          › Turbina {numero}
        </h1>
        <span className={`ch-badge ${info.estado.toLowerCase()}`}>
          {info.estado}
        </span>
      </header>
      <div className="ch-detail-metrics four">
        {met.map(([label, value]) => (
          <div className="ch-metric" key={label}>
            <div className="ch-metric-label">{label}</div>
            <div
              className="ch-metric-value"
              style={
                label === "Temperatura" && numero === 1
                  ? { color: "#b92d2d" }
                  : undefined
              }
            >
              {value}
            </div>
          </div>
        ))}
      </div>
      <div className="ch-detail-charts generator">
        <article className="ch-panel">
          <h2>Temperatura de Turbina {numero} (°C)</h2>
          <TemperaturaChart valores={info.valores} numero={numero} />
        </article>
        <article
          className="ch-panel"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <h2>Alertas de esta turbina</h2>
          {info.avisos.length ? (
            <div className="ch-alert-list">
              {info.avisos.map(([name, severity]) => (
                <div className="ch-alert" key={name}>
                  <span>{name}</span>
                  <span className={`ch-badge ${severity.toLowerCase()}`}>
                    {severity}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#777671", fontSize: 17 }}>
              No hay alertas para esta turbina.
            </p>
          )}
          <button
            type="button"
            className="ch-link"
            onClick={() => jump("Centro de alertas")}
            style={{
              alignSelf: "flex-start",
              marginTop: "auto",
              padding: "30px 0 4px",
              fontSize: 17,
            }}
          >
            Ver todas en Centro de alertas
          </button>
        </article>
      </div>
      <article className="ch-panel ch-actions" style={{ minHeight: 280 }}>
        <h2>Información y acciones</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 18,
            marginTop: 16,
          }}
          className="ch-turbina-info"
        >
          {[
            ["Generador asociado", info.generador],
            ["Estado operativo", "En operación"],
            ["Última actualización", "Hace 2 s"],
            ["Clasificación IA", info.clasificacion],
          ].map(([name, val]) => (
            <div key={name}>
              <div style={{ color: "#92918a", fontSize: 16, marginBottom: 8 }}>
                {name}
              </div>
              <div style={{ fontSize: 18 }}>{val}</div>
            </div>
          ))}
        </div>
        <div className="ch-action-buttons" style={{ marginTop: 44 }}>
          <button type="button" onClick={() => jump("Monitoreo")}>
            Ver en Monitoreo
          </button>
          <button type="button" onClick={() => onShowAlerts?.()}>
            Ver alertas
          </button>
          <button type="button" onClick={() => jump("Reportes")}>
            Generar reporte
          </button>
        </div>
      </article>
      <style>{`@media(max-width:860px){.ch-turbina-info{grid-template-columns:repeat(2,minmax(0,1fr)) !important;}} @media(max-width:510px){.ch-turbina-info{grid-template-columns:1fr !important;}}`}</style>
    </section>
  );
}
