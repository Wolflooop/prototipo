function Linea({ values }) {
  const points = values
    .map(
      (y, index) =>
        `${10 + index * (580 / (values.length - 1))},${240 - y * 2}`,
    )
    .join(" ");
  return (
    <svg
      className="ch-detail-svg"
      viewBox="0 0 610 300"
      role="img"
      aria-label="Gráfica ilustrativa de mediciones entre las 10:00 y las 11:00"
    >
      <line x1="10" y1="10" x2="10" y2="252" stroke="#adaea7" />
      <line x1="10" y1="252" x2="590" y2="252" stroke="#adaea7" />
      <polyline
        points={points}
        fill="none"
        stroke="#64645f"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <text x="10" y="287" fill="#92918a" fontSize="17">
        10:00
      </text>
      <text x="300" y="287" textAnchor="middle" fill="#92918a" fontSize="17">
        10:30
      </text>
      <text x="590" y="287" textAnchor="end" fill="#92918a" fontSize="17">
        11:00
      </text>
    </svg>
  );
}

export default function EmbalseConduccion({ onBack }) {
  const tramos = [
    { nombre: "Embalse", estado: "Normal" },
    { nombre: "Conducción", estado: "Normal" },
    { nombre: "Turbinas 1 y 2", estado: "1 en alerta" },
    { nombre: "Generadores 1 y 2", estado: "Normal" },
  ];
  return (
    <section className="ch-subpage">
      <header className="ch-detail-header">
        <h1>
          <button className="ch-breadcrumb" onClick={onBack}>
            Dashboard
          </button>{" "}
          › Embalse y conducción
        </h1>
        <span className="ch-badge normal">Normal</span>
      </header>
      <div className="ch-detail-metrics three">
        <div className="ch-metric">
          <div className="ch-metric-label">Nivel del embalse</div>
          <div className="ch-metric-value">412.3 m</div>
        </div>
        <div className="ch-metric">
          <div className="ch-metric-label">Caudal</div>
          <div className="ch-metric-value">85 m³/s</div>
        </div>
        <div className="ch-metric">
          <div className="ch-metric-label">Presión en conducción</div>
          <div className="ch-metric-value">24.1 bar</div>
        </div>
      </div>
      <div className="ch-detail-charts half">
        <article className="ch-panel">
          <h2>Nivel del embalse (m)</h2>
          <Linea values={[46, 55, 55, 64, 64, 64, 74, 64, 64, 64, 64, 64]} />
        </article>
        <article className="ch-panel">
          <h2>Caudal y presión</h2>
          <Linea values={[48, 57, 71, 66, 71, 76, 71, 71, 66, 71, 71, 71]} />
        </article>
      </div>
      <article className="ch-panel ch-water-flow">
        <h2>Recorrido del agua</h2>
        <div className="ch-water-steps">
          {tramos.map((tramo, index) => (
            <div className="ch-water-step-wrap" key={tramo.nombre}>
              {index > 0 && (
                <span className="ch-water-arrow" aria-hidden="true">
                  →
                </span>
              )}
              <div className="ch-water-step">
                <span>{tramo.nombre}</span>
                <small
                  className={tramo.estado === "Normal" ? "normal" : "alerta"}
                >
                  {tramo.estado}
                </small>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
