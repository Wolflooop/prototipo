const values = [48, 58, 53, 68, 63, 73, 68, 78, 72, 67, 63, 68];
function PotenciaChart() {
  const points = values
    .map((v, i) => `${10 + i * 54},${245 - v * 2.1}`)
    .join(" ");
  return (
    <svg
      className="ch-detail-svg"
      viewBox="0 0 610 300"
      role="img"
      aria-label="Potencia generada entre las 10:00 y las 11:00"
    >
      <line x1="10" y1="10" x2="10" y2="252" stroke="#adaea7" />
      <line x1="10" y1="252" x2="595" y2="252" stroke="#adaea7" />
      <polyline
        points={points}
        fill="none"
        stroke="#64645f"
        strokeWidth="2.5"
      />
      <text x="10" y="289" fontSize="17" fill="#92918a">
        10:00
      </text>
      <text x="305" y="289" fontSize="17" textAnchor="middle" fill="#92918a">
        10:30
      </text>
      <text x="595" y="289" fontSize="17" textAnchor="end" fill="#92918a">
        11:00
      </text>
    </svg>
  );
}

export default function Generador({ numero = 1, onBack }) {
  const rows = [
    ["14:06", "Potencia", numero === 1 ? "74.2" : "73.8", "MW"],
    ["14:05", "Temperatura", numero === 1 ? "61.0" : "60.2", "°C"],
    ["14:04", "Potencia", numero === 1 ? "73.8" : "74.1", "MW"],
    ["14:03", "Temperatura", numero === 1 ? "60.8" : "60.1", "°C"],
  ];
  return (
    <section className="ch-subpage">
      <header className="ch-detail-header">
        <h1>
          <button className="ch-breadcrumb" onClick={onBack}>
            Dashboard
          </button>{" "}
          › Generador {numero}
        </h1>
        <span className="ch-badge normal">Normal</span>
      </header>
      <div className="ch-detail-metrics four">
        <div className="ch-metric">
          <div className="ch-metric-label">Potencia</div>
          <div className="ch-metric-value">74 MW</div>
        </div>
        <div className="ch-metric">
          <div className="ch-metric-label">Temperatura</div>
          <div className="ch-metric-value">61 °C</div>
        </div>
        <div className="ch-metric">
          <div className="ch-metric-label">Turbina asociada</div>
          <div className="ch-metric-value">Turbina {numero}</div>
        </div>
        <div className="ch-metric">
          <div className="ch-metric-label">Estado</div>
          <div className="ch-metric-value" style={{ color: "#39761e" }}>
            Normal
          </div>
        </div>
      </div>
      <div className="ch-detail-charts generator">
        <article className="ch-panel">
          <h2>Potencia generada (MW)</h2>
          <PotenciaChart />
        </article>
        <article className="ch-panel">
          <h2>Comparativo de generadores</h2>
          <div className="ch-generator-bars">
            <div className="ch-generator-bar">
              <span style={{ height: "78%" }} />
              <small>Gen. 1</small>
            </div>
            <div className="ch-generator-bar">
              <span style={{ height: "78%" }} />
              <small>Gen. 2</small>
            </div>
          </div>
        </article>
      </div>
      <div className="ch-table-wrap">
        <table className="ch-detail-table">
          <thead>
            <tr>
              <th>Hora</th>
              <th>Parámetro</th>
              <th>Valor</th>
              <th>Unidad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row[0]}-${row[1]}`}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
                <td>
                  <span className="ch-badge normal">Normal</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
