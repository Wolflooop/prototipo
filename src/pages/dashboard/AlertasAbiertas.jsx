import { useEffect } from "react";

const alertas = [
  {
    titulo: "Temperatura Turbina 1 alta",
    origen: "Operativa",
    hora: "14:06",
    nivel: "Alta",
  },
  {
    titulo: "Accesos fallidos x5",
    origen: "Ciber",
    hora: "14:05",
    nivel: "Alta",
  },
  {
    titulo: "Pérdida de señal sensor 4",
    origen: "Ciber",
    hora: "13:58",
    nivel: "Media",
  },
  {
    titulo: "Variación de presión",
    origen: "Operativa",
    hora: "13:40",
    nivel: "Media",
  },
  {
    titulo: "RPM fuera de rango",
    origen: "Operativa",
    hora: "13:22",
    nivel: "Baja",
  },
];

export default function AlertasAbiertas({ onClose, onNavigate }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="ch-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="ch-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ch-alert-dialog-title"
      >
        <header className="ch-modal-header">
          <h2 id="ch-alert-dialog-title">Alertas abiertas (5)</h2>
          <button
            className="ch-modal-close"
            onClick={onClose}
            aria-label="Cerrar ventana"
          >
            ×
          </button>
        </header>
        <div className="ch-modal-list">
          {alertas.map((alerta) => (
            <div className="ch-modal-alert" key={alerta.titulo}>
              <div>
                <div>{alerta.titulo}</div>
                <small>
                  {alerta.origen} · {alerta.hora}
                </small>
              </div>
              <span className={`ch-badge ${alerta.nivel.toLowerCase()}`}>
                {alerta.nivel}
              </span>
              <button
                className="ch-link"
                onClick={() => onNavigate("Centro de alertas")}
              >
                Ver ›
              </button>
            </div>
          ))}
        </div>
        <footer className="ch-modal-footer">
          <button onClick={() => onNavigate("Centro de alertas")}>
            Ir al Centro de alertas
          </button>
        </footer>
      </section>
    </div>
  );
}
