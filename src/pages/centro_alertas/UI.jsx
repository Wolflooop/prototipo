
import React from "react";
import ContadorAnimado from "../../components/ContadorAnimado.jsx";

export const C = {
  border: "#d7e6fb",
  gray: "#f0f6ff",
  ink: "#102f55",
  muted: "#66809f",
  blue: "#0969d9",
  navy: "#15375e",
  green: "#12b76a",
  red: "#ef4444",
  orange: "#f59e0b"
};

export const panel = {
  border: `1px solid ${C.border}`,
  borderRadius: 13,
  background: "#ffffff",
  padding: 22,
  boxShadow: "0 5px 18px rgba(30,91,160,.055)"
};

export const field = {
  background: "#ffffff",
  border: `1px solid ${C.border}`,
  borderRadius: 9,
  padding: "11px 15px",
  font: "inherit",
  fontSize: 14,
  color: C.ink,
  minWidth: 0,
  outlineColor: C.blue
};

export const btn = {
  ...field,
  cursor: "pointer",
  textAlign: "center",
  transition: "all .2s ease"
};

export const blueBtn = {
  ...btn,
  background: C.blue,
  color: "#ffffff",
  borderColor: C.blue,
  fontWeight: 600,
  boxShadow: "0 3px 8px rgba(9,105,217,.16)"
};

export function Cabecera({ titulo, subtitulo, onBack, badge }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 16,
      marginBottom: 25,
      flexWrap: "wrap"
    }}>
      <div>
        <h1 style={{
          fontSize: 27,
          fontWeight: 750,
          color: C.ink,
          margin: 0,
          letterSpacing: "-.6px"
        }}>
          {onBack ? (
            <>
              <button
                className="anim-link"
                onClick={onBack}
                style={{
                  background: "none",
                  border: 0,
                  color: C.blue,
                  font: "inherit",
                  cursor: "pointer",
                  padding: 0
                }}
              >
                {titulo.split(" › ")[0]}
              </button>
              {" › "}
              {titulo.split(" › ").slice(1).join(" › ")}
            </>
          ) : titulo}
        </h1>

        {subtitulo && (
          <p style={{
            color: C.muted,
            fontSize: 13,
            margin: "6px 0 0"
          }}>
            {subtitulo}
          </p>
        )}
      </div>

      {badge && <Etiqueta valor={badge} />}
    </div>
  );
}

export function Etiqueta({ valor }) {
  const cls = String(valor || "").toLowerCase();

  let bg = "#edf2f8";
  let fg = "#64748b";

  if (
    cls.includes("alta") ||
    cls.includes("fuera") ||
    cls.includes("crítica")
  ) {
    bg = "#fee8e9";
    fg = "#d92d36";
  } else if (cls.includes("media")) {
    bg = "#fff1d6";
    fg = "#b76b00";
  } else if (
    cls.includes("resuelta") ||
    cls.includes("normal")
  ) {
    bg = "#dcf7e9";
    fg = "#07864b";
  } else if (cls.includes("nueva")) {
    bg = "#e3efff";
    fg = "#0969d9";
  }

  return (
    <span style={{
      display: "inline-block",
      background: bg,
      color: fg,
      borderRadius: 7,
      padding: "6px 12px",
      minWidth: 66,
      textAlign: "center",
      fontSize: 12,
      fontWeight: 650,
      whiteSpace: "nowrap"
    }}>
      {valor}
    </span>
  );
}

export function Metrica({ label, value, color }) {
  return (
    <div
      className="anim-metrica"
      style={{
        background: "#ffffff",
        border: `1px solid ${C.border}`,
        borderRadius: 13,
        padding: "17px 20px",
        minHeight: 88,
        boxShadow: "0 4px 15px rgba(30,91,160,.05)"
      }}
    >
      <div style={{
        color: C.muted,
        marginBottom: 9,
        fontSize: 13,
        fontWeight: 500
      }}>
        {label}
      </div>

      <div style={{
        fontSize: 29,
        fontWeight: 750,
        color: color || C.ink
      }}>
        <ContadorAnimado valor={value} />
      </div>
    </div>
  );
}

export function Barra({
  label,
  value,
  color = "#2584e8",
  suffix = "%"
}) {
  return (
    <div style={{ margin: "17px 0" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 10,
        color: C.muted,
        fontSize: 13,
        fontWeight: 500
      }}>
        <span>{label}</span>
        <span style={{ color: C.ink, fontWeight: 650 }}>
          {value}{suffix}
        </span>
      </div>

      <div style={{
        height: 8,
        background: "#e6edf6",
        borderRadius: 20,
        marginTop: 8,
        overflow: "hidden"
      }}>
        <div
          className="anim-barra-fill"
          style={{
            height: "100%",
            width: `${Math.min(100, Math.max(0, value))}%`,
            background: color,
            borderRadius: 20,
            transition: "width .6s ease"
          }}
        />
      </div>
    </div>
  );
}

export function Modal({ title, onClose, children, footer }) {
  return (
    <div
      role="presentation"
      className="anim-overlay"
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,35,65,.48)",
        backdropFilter: "blur(3px)",
        zIndex: 200,
        display: "grid",
        placeItems: "center",
        padding: 16
      }}
    >
      <section
        role="dialog"
        className="anim-modal"
        aria-modal="true"
        aria-label={title}
        style={{
          width: "min(680px,100%)",
          maxHeight: "94vh",
          overflow: "auto",
          background: "white",
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          boxShadow: "0 15px 50px rgba(15,50,90,.20)"
        }}
      >
        <header style={{
          padding: "22px 30px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h2 style={{
            fontSize: 21,
            fontWeight: 700,
            color: C.ink,
            margin: 0
          }}>
            {title}
          </h2>

          <button
            aria-label="Cerrar"
            onClick={onClose}
            style={{
              border: 0,
              background: "none",
              color: C.muted,
              cursor: "pointer",
              fontSize: 27
            }}
          >
            ×
          </button>
        </header>

        <div style={{ padding: 30 }}>
          {children}
        </div>

        {footer && (
          <footer style={{
            display: "flex",
            gap: 16,
            padding: "0 30px 30px"
          }}>
            {footer}
          </footer>
        )}
      </section>
    </div>
  );
}

export function Graph({
  points = [39,42,45,43,48,50,49,55,62,77,91,85,77],
  threshold = 75,
  hot = 10
}) {
  let arr = points.map(
    (v,i) => `${12+i*715/(points.length-1)},${260-v*2.25}`
  ).join(" ");

  return (
    <svg
      viewBox="0 0 745 315"
      style={{ width: "100%", display: "block" }}
      role="img"
      aria-label="Gráfica de mediciones simuladas"
    >
      <line x1="12" y1="17" x2="12" y2="260" stroke="#b8c9dc" />
      <line x1="12" y1="260" x2="728" y2="260" stroke="#b8c9dc" />

      <line
        x1="12"
        y1={260-threshold*2.25}
        x2="728"
        y2={260-threshold*2.25}
        stroke="#a8bcd4"
        strokeDasharray="6 6"
      />

      <text
        x="20"
        y={251-threshold*2.25}
        fill="#66809f"
        fontSize="15"
      >
        umbral
      </text>

      <polyline
        className="anim-linea"
        pathLength="1"
        points={arr}
        fill="none"
        stroke="#0969d9"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      <circle
        className="anim-punto"
        cx={12+hot*715/(points.length-1)}
        cy={260-points[hot]*2.25}
        r="10"
        fill="none"
        stroke="#ef4444"
        strokeWidth="3"
      />

      <text
        className="anim-fade"
        x={12+hot*715/(points.length-1)-20}
        y={235-points[hot]*2.25}
        fill="#dc3535"
        fontSize="15"
      >
        anomalía
      </text>

      <text x="12" y="290" fill="#66809f">10:00</text>
      <text x="365" y="290" fill="#66809f">10:30</text>
      <text x="728" y="290" textAnchor="end" fill="#66809f">11:00</text>
    </svg>
  );
}

export function Acciones({ children }) {
  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 14,
      marginTop: 25
    }}>
      {children}
    </div>
  );
}

export function descargar(
  nombre,
  texto,
  tipo = "text/csv;charset=utf-8"
) {
  let blob = new Blob([texto], { type: tipo });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
