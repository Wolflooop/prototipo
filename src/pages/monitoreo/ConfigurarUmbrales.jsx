import { useState } from "react";
import { Panel } from "./Monitoreo.jsx";
export default function ConfigurarUmbrales({
  onBack,
  current,
  defaults,
  onSave,
}) {
  const [rows, setRows] = useState(() => current.map((r) => ({ ...r })));
  const [error, setError] = useState("");
  const edit = (id, field, value) =>
    setRows((old) =>
      old.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  const save = () => {
    for (const row of rows) {
      if (
        row.min === "" ||
        row.max === "" ||
        !Number.isFinite(Number(row.min)) ||
        !Number.isFinite(Number(row.max)) ||
        Number(row.min) >= Number(row.max)
      ) {
        setError(
          `Revisa los valores de ${row.name}: el mínimo debe ser menor que el máximo.`,
        );
        return;
      }
    }
    setError("");
    onSave(
      rows.map((r) => ({
        ...r,
        min: Number(r.min),
        max: Number(r.max),
        modified: "Ahora (simulación)",
      })),
    );
  };
  return (
    <section>
      <header className="mon-head">
        <h1>
          <button type="button" className="mon-crumb" onClick={onBack}>
            Monitoreo
          </button>{" "}
          › Configurar umbrales
        </h1>
      </header>
      <Panel title="Umbrales por sensor">
        <div className="mon-table-scroll">
          <table className="mon-form-table">
            <thead>
              <tr>
                {[
                  "Sensor",
                  "Unidad",
                  "Mínimo",
                  "Máximo",
                  "Alerta activa",
                  "Última modificación",
                ].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td className="mon-muted">{r.unit}</td>
                  <td>
                    <input
                      aria-label={`Mínimo de ${r.name}`}
                      type="number"
                      value={r.min}
                      onChange={(e) => edit(r.id, "min", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      aria-label={`Máximo de ${r.name}`}
                      type="number"
                      value={r.max}
                      onChange={(e) => edit(r.id, "max", e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      role="switch"
                      aria-label={`Activar alertas de ${r.name}`}
                      aria-checked={r.enabled}
                      className={`mon-switch ${r.enabled ? "on" : ""}`}
                      onClick={() => edit(r.id, "enabled", !r.enabled)}
                    >
                      <i />
                    </button>
                  </td>
                  <td className="mon-muted">{r.modified}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mon-muted" style={{ marginTop: 26 }}>
          Los cambios se aplican a Turbina 1 y Turbina 2 durante la sesión de
          demostración.
        </p>
        {error && (
          <p className="mon-message error" role="alert">
            {error}
          </p>
        )}
        <div className="mon-action-row" style={{ marginTop: 45 }}>
          <button
            type="button"
            onClick={() => {
              setRows(defaults.map((r) => ({ ...r })));
              setError("");
            }}
          >
            Restablecer valores
          </button>
          <button type="button" className="primary" onClick={save}>
            Guardar cambios
          </button>
        </div>
      </Panel>
    </section>
  );
}
