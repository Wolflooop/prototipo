import React, { useMemo, useState } from "react";
import { Title, Pill, exampleLogs, logTone } from "./Elementos.jsx";
import { exportarExcel } from "../../utils/exportarExcel.js";

export default function RegistroAccesos({ onBack, onIp }) {
  const [q, setQ] = useState(""),
    [res, setRes] = useState("todos"),
    [usr, setUsr] = useState("todos"),
    [page, setPage] = useState(0),
    [date, setDate] = useState("todos"),
    [orden, setOrden] = useState({ k: null, d: 1 });

  const rows = useMemo(() => {
    const filtradas = exampleLogs.filter(
      (x) =>
        (x.user + " " + x.ip).toLowerCase().includes(q.toLowerCase()) &&
        (res === "todos" || x.result === res) &&
        (usr === "todos" || x.user === usr) &&
        (date === "todos" || x.date.startsWith(date))
    );
    if (!orden.k) return filtradas;
    return [...filtradas].sort((a, b) => String(a[orden.k]).localeCompare(String(b[orden.k]), "es", { numeric: true }) * orden.d);
  }, [q, res, usr, date, orden]);

  const handleExport = () => {
    const filas = rows.map((x) => ({
      "Fecha y hora": x.date,
      Usuario: x.user,
      IP: x.ip,
      Origen: x.origin,
      Resultado: x.result,
    }));

    exportarExcel({
      datos: filas,
      nombreArchivo: "registro_accesos_simulado",
      nombreHoja: "Registro Accesos",
      modulo: "ciberseguridad",
      esCritico: (fila) => fila.Resultado === "Bloqueado" || fila.Resultado === "Fallido",
    });
  };

  const pages = Math.max(1, Math.ceil(rows.length / 7));
  const visible = rows.slice(page * 7, page * 7 + 7);
  const hayFiltros = q || res !== "todos" || usr !== "todos" || date !== "todos";

  const ordenar = (k) => {
    setOrden((o) => (o.k === k ? { k, d: -o.d } : { k, d: 1 }));
    setPage(0);
  };

  const th = (k, etiqueta) => (
    <th aria-sort={orden.k === k ? (orden.d === 1 ? "ascending" : "descending") : "none"}>
      <button type="button" className="cy-sort" onClick={() => ordenar(k)}>
        {etiqueta}
        <span aria-hidden="true">{orden.k === k ? (orden.d === 1 ? " ▲" : " ▼") : " ↕"}</span>
      </button>
    </th>
  );

  return (
    <>
      <Title detail="Registro de accesos" onBack={onBack} aside="" />
      <div className="cy-filters">
        <input
          aria-label="Buscar usuario o IP"
          placeholder="Buscar usuario o IP"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(0);
          }}
        />
        <select
          aria-label="Filtrar por resultado"
          value={res}
          onChange={(e) => {
            setRes(e.target.value);
            setPage(0);
          }}
        >
          <option value="todos">Resultado</option>
          {["Fallido", "Exitoso", "Bloqueado"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          aria-label="Filtrar por usuario"
          value={usr}
          onChange={(e) => {
            setUsr(e.target.value);
            setPage(0);
          }}
        >
          <option value="todos">Usuario</option>
          {[...new Set(exampleLogs.map((x) => x.user))].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          aria-label="Filtrar por fecha"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setPage(0);
          }}
        >
          <option value="todos">Fecha</option>
          <option value="26/10">26/10</option>
        </select>
        {hayFiltros && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              setRes("todos");
              setUsr("todos");
              setDate("todos");
              setPage(0);
            }}
          >
            Limpiar filtros
          </button>
        )}
        <button className="cy-export" onClick={handleExport}>
          Exportar registro (Excel)
        </button>
      </div>
      <section className="cy-panel cy-access-panel">
        <div className="cy-scroll">
          <table className="cy-table">
            <thead>
              <tr>
                {th("date", "Fecha y hora")}
                {th("user", "Usuario")}
                {th("ip", "IP")}
                {th("origin", "Origen")}
                {th("result", "Resultado")}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((x) => (
                <tr key={x.id}>
                  <td>{x.date}</td>
                  <td>{x.user}</td>
                  <td>{x.ip}</td>
                  <td>{x.origin}</td>
                  <td>
                    <Pill tone={logTone(x.result)}>{x.result}</Pill>
                  </td>
                  <td>
                    <button className="cy-text-btn" onClick={() => onIp(x.ip)}>
                      Ver ›
                    </button>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan="6">Sin resultados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="cy-pagination">
          <span>
            Mostrando {rows.length ? page * 7 + 1 : 0}–{Math.min((page + 1) * 7, rows.length)} de {rows.length} accesos simulados
          </span>
          <div>
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              Anterior
            </button>
            <button disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)}>
              Siguiente
            </button>
          </div>
        </div>
      </section>
    </>
  );
}