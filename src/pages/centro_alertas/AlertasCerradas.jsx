
import { useState } from "react";
import {
  Cabecera, Etiqueta, btn, field, panel, C
} from "./UI.jsx";
import { exportarExcel } from "../../utils/exportarExcel.js";

export default function AlertasCerradas({
  alertas,
  onBack,
  onOpen
}) {
  const [buscar, setBuscar] = useState("");
  const [res, setRes] = useState("");
  const [tipo, setTipo] = useState("");
  const [pagina, setPagina] = useState(0);

  const items = alertas.filter(a =>
    (a.id + " " + a.evento)
      .toLowerCase()
      .includes(buscar.toLowerCase()) &&
    (!res || a.resolucion === res) &&
    (!tipo || a.tipo === tipo)
  );

  const handleExport = () => {
    const filas = items.map(a => ({
      ID: a.id,
      Evento: a.evento,
      Tipo: a.tipo,
      Riesgo: a.riesgo,
      Resolución: a.resolucion || "Resuelta",
      Fecha: a.fecha,
      "Tiempo de atención": a.atencion || "15 min"
    }));

    if (!filas.length) {
      window.alert("No hay alertas para exportar.");
      return;
    }

    exportarExcel({
      datos: filas,
      nombreArchivo: "alertas_cerradas",
      nombreHoja: "Alertas Cerradas",
      modulo: "alertas",
      esCritico: fila =>
        fila.Riesgo === "Alta" ||
        fila.Riesgo === "Crítica"
    });
  };

  return (
    <>
      <Cabecera
        titulo="Centro de alertas › Alertas cerradas"
        onBack={onBack}
      />

      <div style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        marginBottom: 22
      }}>
        <input
          placeholder="Buscar por ID o evento"
          aria-label="Buscar"
          style={{ ...field, width: 290 }}
          value={buscar}
          onChange={e => {
            setBuscar(e.target.value);
            setPagina(0);
          }}
        />

        <select
          value={res}
          onChange={e => {
            setRes(e.target.value);
            setPagina(0);
          }}
          style={field}
          aria-label="Resolución"
        >
          <option value="">Todas las resoluciones</option>
          <option>Resuelta</option>
          <option>Falso positivo</option>
        </select>

        <select
          value={tipo}
          onChange={e => {
            setTipo(e.target.value);
            setPagina(0);
          }}
          style={field}
          aria-label="Tipo"
        >
          <option value="">Todos los tipos</option>
          <option>Operativa</option>
          <option>Ciber</option>
        </select>

        <button
          style={{ ...btn, marginLeft: "auto" }}
          onClick={handleExport}
        >
          Exportar lista (Excel)
        </button>
      </div>

      <section style={{
        ...panel,
        padding: 0,
        minHeight: 620,
        display: "flex",
        flexDirection: "column"
      }}>
        <div style={{ overflowX: "auto", flex: 1 }}>
          <table style={{
            borderCollapse: "collapse",
            width: "100%",
            fontSize: 14
          }}>
            <thead>
              <tr style={{ background: C.gray }}>
                {[
                  "ID",
                  "Evento",
                  "Tipo",
                  "Riesgo",
                  "Resolución",
                  "Cerrada",
                  "Tiempo de atención"
                ].map(k => (
                  <th
                    key={k}
                    style={{
                      padding: 16,
                      fontWeight: 600,
                      color: C.muted,
                      textAlign: "left",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {k}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {items
                .slice(pagina * 7, pagina * 7 + 7)
                .map(a => (
                  <tr
                    key={a.id}
                    onClick={() => onOpen(a.id)}
                    style={{
                      borderBottom: `1px solid ${C.border}`,
                      cursor: "pointer"
                    }}
                  >
                    <td style={{ padding: 16 }}>{a.id}</td>
                    <td style={{ padding: 16 }}>{a.evento}</td>
                    <td style={{ padding: 16 }}>{a.tipo}</td>
                    <td style={{ padding: 16 }}>
                      <Etiqueta valor={a.riesgo} />
                    </td>
                    <td style={{ padding: 16 }}>
                      <Etiqueta value={a.resolucion || "Resuelta"} valor={a.resolucion || "Resuelta"} />
                    </td>
                    <td style={{ padding: 16 }}>{a.fecha || "—"}</td>
                    <td style={{ padding: 16 }}>
                      {a.atencion || "15 min"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {!items.length && (
            <p style={{ padding: 20 }}>
              No hay alertas con esos filtros.
            </p>
          )}
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 18,
          flexWrap: "wrap",
          gap: 12
        }}>
          <span style={{ color: C.muted, fontSize: 13 }}>
            Mostrando {items.length ? pagina * 7 + 1 : 0}–
            {Math.min((pagina + 1) * 7, items.length)}
            {" "}de {items.length} alertas cerradas
          </span>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              style={btn}
              onClick={() => setPagina(v => Math.max(0, v - 1))}
              disabled={!pagina}
            >
              Anterior
            </button>

            <button
              style={btn}
              onClick={() => setPagina(v => v + 1)}
              disabled={(pagina + 1) * 7 >= items.length}
            >
              Siguiente
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
