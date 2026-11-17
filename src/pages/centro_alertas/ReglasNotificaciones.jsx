
import { useState } from "react";
import {
  Cabecera, Etiqueta, btn, blueBtn, field, panel, C
} from "./UI.jsx";

const originales = [
  {
    nivel: "Alta",
    min: "0.85",
    max: "1.00",
    detalle: "Atención inmediata"
  },
  {
    nivel: "Media",
    min: "0.60",
    max: "0.84",
    detalle: "Revisar en el turno"
  },
  {
    nivel: "Baja",
    min: "0.00",
    max: "0.59",
    detalle: "Solo registro"
  }
];

export default function ReglasNotificaciones({ onBack }) {
  const [reglas, setReglas] = useState(originales);
  const [criticos, setCriticos] = useState(true);

  const [notificaciones, setNotificaciones] = useState({
    pantalla: true,
    correo: true,
    sonido: false
  });

  const [destinatarios, setDestinatarios] = useState({
    operativa: "Operador",
    ciber: "Ciberseguridad"
  });

  const [guardado, setGuardado] = useState(false);

  const cambiar = (index, campo, valor) => {
    setReglas(arr =>
      arr.map((r, i) =>
        i === index ? { ...r, [campo]: valor } : r
      )
    );
    setGuardado(false);
  };

  const guardar = () => {
    if (
      reglas.some(r =>
        +r.min > +r.max ||
        +r.min < 0 ||
        +r.max > 1
      )
    ) {
      window.alert(
        "Revisa los rangos. Deben estar entre 0 y 1."
      );
      return;
    }

    setGuardado(true);
  };

  return (
    <>
      <Cabecera
        titulo="Centro de alertas › Reglas y notificaciones"
        onBack={onBack}
      />

      <div
        className="ca-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.35fr .9fr",
          gap: 20
        }}
      >
        <section style={{ ...panel, minHeight: 650 }}>
          <h2 style={{ fontSize: 19, fontWeight: 600 }}>
            Niveles de riesgo
          </h2>

          {reglas.map((r, i) => (
            <div key={r.nivel} style={{ margin: "32px 0" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 18
              }}>
                <Etiqueta valor={r.nivel} />
                <span style={{ color: C.muted }}>
                  {r.detalle}
                </span>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                marginTop: 18
              }}>
                {["min", "max"].map(k => (
                  <label key={k} style={{ color: C.muted }}>
                    Score IA {k === "min" ? "desde" : "hasta"}

                    <input
                      aria-label={`${r.nivel} ${k}`}
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      style={{
                        ...field,
                        width: "100%",
                        marginTop: 7
                      }}
                      value={r[k]}
                      onChange={e =>
                        cambiar(i, k, e.target.value)
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}

          <label style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "30px 0 65px"
          }}>
            <input
              type="checkbox"
              checked={criticos}
              onChange={e => setCriticos(e.target.checked)}
            />
            Tratar eventos de ciberseguridad críticos como riesgo Alta
          </label>

          <div style={{ display: "flex", gap: 14 }}>
            <button
              style={{ ...btn, flex: 1 }}
              onClick={() => {
                setReglas(originales);
                setCriticos(true);
                setGuardado(false);
              }}
            >
              Restablecer valores
            </button>

            <button
              style={{ ...blueBtn, flex: 1 }}
              onClick={guardar}
            >
              Guardar cambios
            </button>
          </div>

          {guardado && (
            <p role="status" style={{ color: C.blue }}>
              Configuración guardada durante esta sesión.
            </p>
          )}
        </section>

        <section style={panel}>
          <h2 style={{ fontSize: 19, fontWeight: 600 }}>
            Notificaciones
          </h2>

          {[
            ["pantalla", "Mostrar en pantalla"],
            ["correo", "Correo electrónico"],
            ["sonido", "Sonido para alertas Altas"]
          ].map(([k, t]) => (
            <label
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                padding: "23px 0",
                borderBottom: `1px solid ${C.border}`
              }}
            >
              {t}

              <input
                type="checkbox"
                checked={notificaciones[k]}
                onChange={e =>
                  setNotificaciones({
                    ...notificaciones,
                    [k]: e.target.checked
                  })
                }
              />
            </label>
          ))}

          <h3 style={{ fontWeight: 600, marginTop: 30 }}>
            Destinatarios
          </h3>

          {[
            ["operativa", "Alertas operativas"],
            ["ciber", "Alertas de ciberseguridad"]
          ].map(([k, t]) => (
            <label
              key={k}
              style={{
                display: "block",
                color: C.muted,
                marginBottom: 22
              }}
            >
              {t}

              <select
                style={{
                  ...field,
                  width: "100%",
                  display: "block",
                  marginTop: 8
                }}
                value={destinatarios[k]}
                onChange={e =>
                  setDestinatarios({
                    ...destinatarios,
                    [k]: e.target.value
                  })
                }
              >
                <option>Operador</option>
                <option>Analista</option>
                <option>Ciberseguridad</option>
                <option>Administrador</option>
              </select>
            </label>
          ))}

          <p style={{ color: C.muted, fontSize: 13 }}>
            Las notificaciones son configuraciones visuales de prueba.
            No se envían correos reales.
          </p>
        </section>
      </div>

      <style>{`
        @media(max-width:1050px){
          .ca-grid{grid-template-columns:1fr!important}
        }
      `}</style>
    </>
  );
}
