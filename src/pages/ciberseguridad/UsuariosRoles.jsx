import React, { useState } from "react";
import { Title, Pill } from "./Elementos.jsx";
const initial = [
  {
    user: "admin",
    role: "Administrador",
    state: "Activo",
    last: "26/10 14:06",
  },
  { user: "operador1", role: "Operador", state: "Activo", last: "26/10 13:58" },
  { user: "operador2", role: "Operador", state: "Activo", last: "26/10 12:51" },
  { user: "analista", role: "Analista", state: "Activo", last: "26/10 13:22" },
  {
    user: "visitante",
    role: "Operador",
    state: "Bloqueado",
    last: "24/10 09:10",
  },
];
const rules = [
  ["Ver monitoreo", 1, 1, 1],
  ["Reconocer alertas", 1, 1, 1],
  ["Escalar alertas", 0, 1, 1],
  ["Entrenar modelos", 0, 1, 1],
  ["Exportar reportes", 0, 1, 1],
  ["Gestionar usuarios", 0, 0, 1],
];
export default function UsuariosRoles({ onBack }) {
  const [users, setUsers] = useState(initial),
    [q, setQ] = useState(""),
    [adding, setAdding] = useState(false),
    [name, setName] = useState(""),
    [role, setRole] = useState("Operador");
  function submit(e) {
    e.preventDefault();
    if (!name.trim() || users.some((x) => x.user === name.trim())) return;
    setUsers((u) => [
      ...u,
      { user: name.trim(), role, state: "Activo", last: "Sin accesos" },
    ]);
    setAdding(false);
    setName("");
  }
  return (
    <>
      <Title detail="Usuarios y roles" onBack={onBack} />
      <div className="cy-filters">
        <input
          placeholder="Buscar usuario"
          aria-label="Buscar usuario"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          className="cy-primary cy-export"
          onClick={() => setAdding(true)}
        >
          + Nuevo usuario
        </button>
      </div>
      <div className="cy-cols cy-wide">
        <section className="cy-panel cy-access-panel">
          <div className="cy-scroll">
            <table className="cy-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Último acceso</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((x) => x.user.toLowerCase().includes(q.toLowerCase()))
                  .map((x) => (
                    <tr key={x.user}>
                      <td>{x.user}</td>
                      <td>
                        <Pill
                          tone={
                            x.role === "Administrador"
                              ? "blue"
                              : x.role === "Analista"
                                ? "amber"
                                : "neutral"
                          }
                        >
                          {x.role}
                        </Pill>
                      </td>
                      <td>
                        <Pill tone={x.state === "Activo" ? "green" : "red"}>
                          {x.state}
                        </Pill>
                      </td>
                      <td>{x.last}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="cy-pagination">
            Mostrando{" "}
            {
              users.filter((x) =>
                x.user.toLowerCase().includes(q.toLowerCase()),
              ).length
            }{" "}
            de {users.length} usuarios
          </div>
        </section>
        <section className="cy-panel">
          <div className="cy-panel-head">
            <h2>Permisos por rol</h2>
          </div>
          <div className="cy-scroll">
            <table className="cy-table cy-permissions">
              <thead>
                <tr>
                  <th></th>
                  <th>Operador</th>
                  <th>Analista</th>
                  <th>Admin</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    {row.slice(1).map((v, i) => (
                      <td key={i} style={{ color: v ? "#3d791c" : "#96938d" }}>
                        {v ? "✓" : "–"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="cy-muted cy-bottom-note">
            Acceso con JWT y control de roles (previsto).
            <br />
            Los permisos son de ejemplo.
          </p>
        </section>
      </div>
      {adding && (
        <div className="cy-overlay" onClick={() => setAdding(false)}>
          <form
            className="cy-dialog"
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
          >
            <h2>Nuevo usuario de demostración</h2>
            <label>
              Usuario
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              Rol
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option>Operador</option>
                <option>Analista</option>
                <option>Administrador</option>
              </select>
            </label>
            <p className="cy-muted">
              Se agrega solo a esta sesión del navegador. No se crea una cuenta
              real.
            </p>
            <div className="cy-actions">
              <button type="button" onClick={() => setAdding(false)}>
                Cancelar
              </button>
              <button className="cy-primary" type="submit">
                Agregar
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
