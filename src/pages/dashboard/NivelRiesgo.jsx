const operativo = [
  { nombre: "Temperatura Turbina 1", porcentaje: 80, color: "#e94c4c" },
  { nombre: "Variación de presión", porcentaje: 50, color: "#f4a11c" },
  { nombre: "RPM", porcentaje: 20, color: "#3d8cdd" },
];
const ciberseguridad = [
  { nombre: "Accesos fallidos", porcentaje: 40, color: "#f4a11c" },
  { nombre: "Pérdida de comunicación", porcentaje: 30, color: "#f4a11c" },
  { nombre: "Mensajes alterados", porcentaje: 15, color: "#3d8cdd" },
];

function Indicadores({ titulo, nivel, items }) {
  return (
    <article className="ch-panel ch-risk-panel">
      <h2>{titulo}</h2>
      <div className={`ch-risk-word ${nivel === "Bajo" ? "low" : "medium"}`}>
        {nivel}
      </div>
      {items.map((item) => (
        <div className="ch-risk-indicator" key={item.nombre}>
          <div>{item.nombre}</div>
          <div className="ch-risk-track">
            <div
              style={{ width: `${item.porcentaje}%`, background: item.color }}
            />
          </div>
        </div>
      ))}
    </article>
  );
}

export default function NivelRiesgo({ onBack, onNavigate }) {
  return (
    <section className="ch-subpage">
      <header className="ch-detail-header">
        <h1>
          <button className="ch-breadcrumb" onClick={onBack}>
            Dashboard
          </button>{" "}
          › Nivel de riesgo
        </h1>
      </header>
      <article className="ch-panel ch-risk-summary">
        <h2>Nivel de riesgo actual</h2>
        <div className="ch-risk-scale">
          <span>Bajo</span>
          <span>Medio</span>
          <span>Alto</span>
        </div>
        <div className="ch-risk-marker">▲</div>
        <p>Medio · 52 / 100</p>
      </article>
      <div className="ch-risk-columns">
        <Indicadores
          titulo="Riesgo operativo"
          nivel="Medio"
          items={operativo}
        />
        <Indicadores
          titulo="Riesgo de ciberseguridad"
          nivel="Bajo"
          items={ciberseguridad}
        />
      </div>
      <article className="ch-panel ch-actions">
        <h2>Acciones recomendadas</h2>
        <p>1. Revisar la temperatura de la Turbina 1 en Monitoreo</p>
        <p>2. Validar los accesos fallidos con Ciberseguridad</p>
        <p>3. Confirmar la clasificación de la IA en el Centro de alertas</p>
        <div className="ch-action-buttons">
          <button onClick={() => onNavigate("Monitoreo")}>
            Ir a Monitoreo
          </button>
          <button onClick={() => onNavigate("Ciberseguridad")}>
            Ir a Ciberseguridad
          </button>
          <button onClick={() => onNavigate("Centro de alertas")}>
            Ir a Centro de alertas
          </button>
        </div>
      </article>
    </section>
  );
}
