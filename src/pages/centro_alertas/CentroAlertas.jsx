import { useState, useEffect } from "react";
import { useSimulacion } from "../../context/SimulacionContext.jsx";
import {
  Cabecera,
  Metrica,
  Etiqueta,
  Modal,
  Barra,
  btn,
  blueBtn,
  field,
  panel,
  C,
} from "./UI.jsx";
import DetalleAlerta from "./DetalleAlerta.jsx";
import ReglasNotificaciones from "./ReglasNotificaciones.jsx";
import AlertasCerradas from "./AlertasCerradas.jsx";

const nuevaInicial = {
  evento: "",
  tipo: "Operativa",
  riesgo: "Media",
  componente: "Turbina 1",
  descripcion: "",
};

const inicial = {
  motivo: "Lectura fuera de rango por calibración",
  comentario: "",
  revisar: true,
  destino: "Ciberseguridad",
  prioridad: "Alta",
  adjuntar: true,
  notificar: true,
};

export default function CentroAlertas({ onNavigate }) {
  const {
    alertas,
    actualizarAlerta,
    agregarAlerta,
    alertaAbrir,
    limpiarAlertaAbrir,
  } = useSimulacion();

  const [nueva, setNueva] = useState(nuevaInicial);
  const [errorNueva, setErrorNueva] = useState("");
  const [vista, setVista] = useState(alertaAbrir ? "detalle" : "principal");
  const [seleccion, setSeleccion] = useState(alertaAbrir || "ALT-042");
  const [modal, setModal] = useState("");
  const [form, setForm] = useState(inicial);

  const [texto, setTexto] = useState("");
  const [riesgo, setRiesgo] = useState("");
  const [tipo, setTipo] = useState("");
  const [estado, setEstado] = useState("");
  const [pagina, setPagina] = useState(0);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (alertaAbrir) limpiarAlertaAbrir();
  }, []);

  const pFalla = (a) =>
    a.ia ? a.ia.probabilidades[1][1] : a.tipo === "Operativa" ? 78 : 24;

  const pCiber = (a) =>
    a.ia ? a.ia.probabilidades[2][1] : a.tipo === "Ciber" ? 76 : 22;

  const actual = alertas.find((a) => a.id === seleccion) || alertas[0];

  const actualizar = (obj) => {
    if (!actual) return;
    actualizarAlerta(seleccion, obj);
    setMensaje(`Alerta ${seleccion} actualizada en el prototipo`);
  };

  const cerrar = () => setModal("");

  const abiertas = alertas.filter((a) => a.estado !== "Cerrada");

  const guardarNueva = () => {
    if (!nueva.evento.trim()) {
      setErrorNueva("Escribe el nombre del evento.");
      return;
    }

    const a = agregarAlerta({
      evento: nueva.evento.trim(),
      tipo: nueva.tipo,
      riesgo: nueva.riesgo,
      componente: nueva.componente,
      descripcion:
        nueva.descripcion.trim() ||
        `${nueva.evento.trim()} en ${nueva.componente}`,
    });

    setTexto("");
    setRiesgo("");
    setTipo("");
    setEstado("");
    setPagina(0);
    setSeleccion(a.id);
    setMensaje(`Alerta ${a.id} creada en el prototipo`);
    cerrar();
  };

  const iniciarModal = (m) => {
    setForm(inicial);
    setModal(m);
  };

  const guardarModal = () => {
    if (modal === "falso") {
      actualizar({
        estado: "Cerrada",
        resolucion: "Falso positivo",
        nota: form.comentario,
      });
    }

    if (modal === "escalar") {
      actualizar({
        estado: "Revisión",
        escalada: form.destino,
        riesgo: form.prioridad,
        nota: form.comentario,
      });
    }

    cerrar();
  };

  const filtradas = alertas.filter(
    (a) =>
      `${a.id} ${a.evento}`.toLowerCase().includes(texto.toLowerCase()) &&
      (!riesgo || a.riesgo === riesgo) &&
      (!tipo || a.tipo === tipo) &&
      (!estado || a.estado === estado)
  );

  const vistaPrincipal = () => {
    setVista("principal");
    setMensaje("");
  };

  const abrirDetalle = (id) => {
    setSeleccion(id);
    setVista("detalle");
  };

  return (
    <div className="anim-scope" style={{ fontSize: 17 }}>
      <div className="anim-vista" key={vista}>
        {vista === "reglas" ? (
          <ReglasNotificaciones onBack={vistaPrincipal} />
        ) : vista === "cerradas" ? (
          <AlertasCerradas
            alertas={alertas.filter((a) => a.estado === "Cerrada")}
            onBack={vistaPrincipal}
            onOpen={abrirDetalle}
          />
        ) : vista === "detalle" ? (
          actual ? (
            <DetalleAlerta
              alerta={actual}
              onBack={vistaPrincipal}
              onActualizar={actualizar}
              onModal={iniciarModal}
              onNavigate={onNavigate}
            />
          ) : (
            <p>No hay alertas disponibles.</p>
          )
        ) : (
          <>
            <Cabecera
              titulo="Centro de alertas"
              subtitulo="Priorizadas por riesgo"
            />

            {/* MÉTRICAS */}
            <div
              className="ca-metricas"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,minmax(0,1fr))",
                gap: 20,
                marginBottom: 25,
              }}
            >
              <Metrica
                label="Alertas abiertas"
                value={String(abiertas.length)}
              />
              <Metrica
                label="Riesgo alto"
                value={String(
                  abiertas.filter((a) => a.riesgo === "Alta").length
                )}
                color="#bd3434"
              />
              <Metrica
                label="Ciberseguridad"
                value={String(
                  abiertas.filter((a) => a.tipo === "Ciber").length
                )}
              />
              <Metrica
                label="Cerradas"
                value={String(alertas.length - abiertas.length)}
              />
            </div>

            {/* FILTROS Y BOTONES */}
            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                marginBottom: 25,
              }}
            >
              <input
                aria-label="Buscar por ID o evento"
                placeholder="Buscar por ID o evento"
                value={texto}
                onChange={(e) => {
                  setTexto(e.target.value);
                  setPagina(0);
                }}
                style={{ ...field, width: 290 }}
              />

              <select
                aria-label="Filtrar riesgo"
                value={riesgo}
                onChange={(e) => {
                  setRiesgo(e.target.value);
                  setPagina(0);
                }}
                style={field}
              >
                <option value="">Riesgo</option>
                {["Alta", "Media", "Baja"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>

              <select
                aria-label="Filtrar tipo"
                value={tipo}
                onChange={(e) => {
                  setTipo(e.target.value);
                  setPagina(0);
                }}
                style={field}
              >
                <option value="">Tipo</option>
                <option>Operativa</option>
                <option>Ciber</option>
              </select>

              <select
                aria-label="Filtrar estado"
                value={estado}
                onChange={(e) => {
                  setEstado(e.target.value);
                  setPagina(0);
                }}
                style={field}
              >
                <option value="">Estado</option>
                <option>Nueva</option>
                <option>Revisión</option>
                <option>Cerrada</option>
              </select>

              <button style={btn} onClick={() => setVista("cerradas")}>
                Alertas cerradas
              </button>

              <button style={btn} onClick={() => setVista("reglas")}>
                Reglas y notificaciones
              </button>

              <button
                style={{ ...blueBtn, marginLeft: "auto" }}
                onClick={() => {
                  setNueva(nuevaInicial);
                  setErrorNueva("");
                  setModal("nueva");
                }}
              >
                + Nueva alerta
              </button>
            </div>

            {/* TABLA Y PANEL DE DETALLE */}
            <div
              className="ca-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0,1.65fr) minmax(320px,.92fr)",
                gap: 24,
                alignItems: "stretch",
              }}
            >
              {/* TABLA DE ALERTAS */}
              <section
                style={{
                  ...panel,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 680,
                }}
              >
                <div style={{ overflowX: "auto", flex: 1 }}>
                  <table
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                      fontSize: 17,
                    }}
                  >
                    <thead style={{ background: C.gray, color: C.muted }}>
                      <tr>
                        {["ID", "Evento", "Tipo", "Riesgo", "Estado"].map(
                          (t) => (
                            <th
                              key={t}
                              style={{
                                padding: "17px 15px",
                                textAlign: "left",
                                fontWeight: 400,
                              }}
                            >
                              {t}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {filtradas
                        .slice(pagina * 8, pagina * 8 + 8)
                        .map((a) => (
                          <tr
                            key={a.id}
                            onClick={() => setSeleccion(a.id)}
                            onDoubleClick={() => abrirDetalle(a.id)}
                            style={{
                              cursor: "pointer",
                              background:
                                a.id === seleccion ? "#e6f2ff" : "white",
                              transition: "background-color .25s",
                              borderBottom: `1px solid ${C.border}`,
                            }}
                          >
                            {[a.id, a.evento, a.tipo].map((v, i) => (
                              <td key={i} style={{ padding: "16px 15px" }}>
                                {v}
                              </td>
                            ))}

                            <td style={{ padding: "16px 15px" }}>
                              <Etiqueta valor={a.riesgo} />
                            </td>

                            <td style={{ padding: "16px 15px" }}>
                              {a.estado}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>

                  {filtradas.length === 0 && (
                    <p style={{ padding: 22 }}>No se encontraron alertas.</p>
                  )}
                </div>

                {/* PAGINACIÓN */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 20,
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ color: C.muted }}>
                    Mostrando {filtradas.length ? pagina * 8 + 1 : 0}–
                    {Math.min((pagina + 1) * 8, filtradas.length)} de{" "}
                    {filtradas.length} alertas de demostración
                  </span>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      style={btn}
                      disabled={!pagina}
                      onClick={() => setPagina((v) => Math.max(0, v - 1))}
                    >
                      Anterior
                    </button>

                    <button
                      style={btn}
                      disabled={(pagina + 1) * 8 >= filtradas.length}
                      onClick={() => setPagina((v) => v + 1)}
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </section>

              {/* PANEL LATERAL */}
              {actual && (
                <aside style={panel}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <h2
                      style={{
                        fontWeight: 400,
                        fontSize: 23,
                        margin: "0 0 13px",
                      }}
                    >
                      <button
                        onClick={() => abrirDetalle(actual.id)}
                        className="anim-link"
                        style={{
                          border: 0,
                          background: "none",
                          cursor: "pointer",
                          font: "inherit",
                          color: "inherit",
                        }}
                      >
                        {actual.id} ↗
                      </button>
                    </h2>

                    <Etiqueta valor={actual.riesgo} />
                  </div>

                  <p style={{ color: C.muted, margin: "12px 0 30px" }}>
                    {actual.descripcion || actual.evento}
                  </p>

                  <h3 style={{ fontWeight: 400, fontSize: 18 }}>
                    Clasificación de IA
                  </h3>

                  <Barra label="Falla operativa" value={pFalla(actual)} />

                  <Barra
                    label="Posible ciberataque"
                    value={pCiber(actual)}
                    color="#e54848"
                  />

                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 400,
                      marginTop: 35,
                    }}
                  >
                    Eventos relacionados
                  </h3>

                  {(
                    actual.eventos || [
                      ["14:06", "Lectura fuera de rango"],
                      ["14:02", "Sin accesos sospechosos"],
                    ]
                  ).map((e) => (
                    <p key={e[1]} style={{ color: C.muted }}>
                      {e[0]} · {e[1]}
                    </p>
                  ))}

                  {/* ACCIONES */}
                  <div
                    style={{
                      display: "grid",
                      gap: 10,
                      marginTop: 25,
                    }}
                  >
                    <button
                      style={btn}
                      onClick={() => actualizar({ estado: "Revisión" })}
                    >
                      Reconocer alerta
                    </button>

                    <button
                      style={btn}
                      onClick={() => iniciarModal("escalar")}
                    >
                      Escalar a Ciberseguridad
                    </button>

                    <button
                      style={btn}
                      onClick={() => iniciarModal("falso")}
                    >
                      Marcar como falso positivo
                    </button>

                    <button
                      style={btn}
                      onClick={() => abrirDetalle(actual.id)}
                    >
                      Ver detalle completo
                    </button>
                  </div>

                  {/* NOTAS */}
                  <label style={{ display: "block", marginTop: 24 }}>
                    Notas del analista
                    <textarea
                      value={actual.nota || ""}
                      onChange={(e) => actualizar({ nota: e.target.value })}
                      style={{
                        ...field,
                        display: "block",
                        height: 120,
                        width: "100%",
                        marginTop: 10,
                        resize: "vertical",
                        borderStyle: "dashed",
                      }}
                    />
                  </label>

                  {mensaje && (
                    <p role="status" style={{ color: C.blue }}>
                      {mensaje}
                    </p>
                  )}
                </aside>
              )}
            </div>
          </>
        )}
      </div>

      {/* MODAL: FALSO POSITIVO */}
      {modal === "falso" && (
        <Modal
          title="Marcar como falso positivo"
          onClose={cerrar}
          footer={
            <>
              <button style={{ ...btn, flex: 1 }} onClick={cerrar}>
                Cancelar
              </button>
              <button style={{ ...blueBtn, flex: 1 }} onClick={guardarModal}>
                Confirmar
              </button>
            </>
          }
        >
          <p style={{ color: C.muted }}>
            {actual?.id} · {actual?.evento}
          </p>

          <label>
            Motivo
            <select
              style={{
                ...field,
                width: "100%",
                display: "block",
                margin: "10px 0 30px",
              }}
              value={form.motivo}
              onChange={(e) => setForm({ ...form, motivo: e.target.value })}
            >
              <option>Lectura fuera de rango por calibración</option>
              <option>Error del sensor</option>
              <option>Dato de simulación</option>
              <option>Otro</option>
            </select>
          </label>

          <label>
            Comentario
            <textarea
              style={{
                ...field,
                width: "100%",
                height: 110,
                display: "block",
                marginTop: 8,
              }}
              value={form.comentario}
              onChange={(e) => setForm({ ...form, comentario: e.target.value })}
            />
          </label>

          <p>
            <label>
              <input
                type="checkbox"
                checked={form.revisar}
                onChange={(e) =>
                  setForm({ ...form, revisar: e.target.checked })
                }
              />{" "}
              Usar esta alerta para revisar el modelo de IA
            </label>
          </p>

          <p style={{ color: C.muted, fontSize: 15 }}>
            La alerta pasará a «Falso positivo» en esta demostración.
          </p>
        </Modal>
      )}

      {/* MODAL: ESCALAR ALERTA */}
      {modal === "escalar" && (
        <Modal
          title={`Escalar alerta ${actual?.id || ""}`}
          onClose={cerrar}
          footer={
            <>
              <button style={{ ...btn, flex: 1 }} onClick={cerrar}>
                Cancelar
              </button>
              <button style={{ ...blueBtn, flex: 1 }} onClick={guardarModal}>
                Escalar
              </button>
            </>
          }
        >
          <label>
            Escalar a
            <select
              style={{
                ...field,
                width: "100%",
                margin: "8px 0 27px",
              }}
              value={form.destino}
              onChange={(e) => setForm({ ...form, destino: e.target.value })}
            >
              <option>Ciberseguridad</option>
              <option>Operaciones</option>
              <option>Analista</option>
            </select>
          </label>

          <div>
            Prioridad
            <div
              style={{
                display: "flex",
                gap: 9,
                marginTop: 10,
                marginBottom: 27,
              }}
            >
              {["Alta", "Media", "Baja"].map((x) => (
                <button
                  key={x}
                  style={{
                    ...btn,
                    background: form.prioridad === x ? "#e5f2ff" : "white",
                  }}
                  onClick={() => setForm({ ...form, prioridad: x })}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>

          <label>
            Comentario
            <textarea
              style={{
                ...field,
                width: "100%",
                height: 100,
                display: "block",
                marginTop: 8,
              }}
              value={form.comentario}
              onChange={(e) => setForm({ ...form, comentario: e.target.value })}
            />
          </label>

          <p>
            <label>
              <input
                type="checkbox"
                checked={form.adjuntar}
                onChange={(e) =>
                  setForm({ ...form, adjuntar: e.target.checked })
                }
              />{" "}
              Adjuntar telemetría y eventos relacionados
            </label>
          </p>

          <p>
            <label>
              <input
                type="checkbox"
                checked={form.notificar}
                onChange={(e) =>
                  setForm({ ...form, notificar: e.target.checked })
                }
              />{" "}
              Notificar por correo (solo simulación)
            </label>
          </p>
        </Modal>
      )}

      {/* MODAL: NUEVA ALERTA */}
      {modal === "nueva" && (
        <Modal
          title="Nueva alerta (simulada)"
          onClose={cerrar}
          footer={
            <>
              <button style={{ ...btn, flex: 1 }} onClick={cerrar}>
                Cancelar
              </button>
              <button style={{ ...blueBtn, flex: 1 }} onClick={guardarNueva}>
                Crear alerta
              </button>
            </>
          }
        >
          <label>
            Evento
            <input
              style={{
                ...field,
                width: "100%",
                display: "block",
                margin: "8px 0 22px",
              }}
              placeholder="Ej. Temperatura Turbina 2 alta"
              value={nueva.evento}
              onChange={(e) => {
                setNueva({ ...nueva, evento: e.target.value });
                setErrorNueva("");
              }}
            />
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 18,
              marginBottom: 22,
            }}
          >
            <label>
              Tipo
              <select
                style={{
                  ...field,
                  width: "100%",
                  display: "block",
                  marginTop: 8,
                }}
                value={nueva.tipo}
                onChange={(e) => setNueva({ ...nueva, tipo: e.target.value })}
              >
                <option>Operativa</option>
                <option>Ciber</option>
              </select>
            </label>

            <label>
              Componente
              <select
                style={{
                  ...field,
                  width: "100%",
                  display: "block",
                  marginTop: 8,
                }}
                value={nueva.componente}
                onChange={(e) =>
                  setNueva({ ...nueva, componente: e.target.value })
                }
              >
                {[
                  "Embalse",
                  "Conducción",
                  "Turbina 1",
                  "Turbina 2",
                  "Generador 1",
                  "Generador 2",
                  "Red industrial",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
          </div>

          <div>
            Riesgo
            <div
              style={{
                display: "flex",
                gap: 9,
                marginTop: 10,
                marginBottom: 22,
              }}
            >
              {["Alta", "Media", "Baja"].map((x) => (
                <button
                  key={x}
                  style={{
                    ...btn,
                    background: nueva.riesgo === x ? "#e5f2ff" : "white",
                  }}
                  onClick={() => setNueva({ ...nueva, riesgo: x })}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>

          <label>
            Descripción (opcional)
            <textarea
              style={{
                ...field,
                width: "100%",
                height: 90,
                display: "block",
                marginTop: 8,
              }}
              value={nueva.descripcion}
              onChange={(e) =>
                setNueva({ ...nueva, descripcion: e.target.value })
              }
            />
          </label>

          {errorNueva && (
            <p role="alert" style={{ color: "#b72a2a" }}>
              {errorNueva}
            </p>
          )}

          <p style={{ color: C.muted, fontSize: 15 }}>
            La alerta se crea como «Nueva» solo en esta demostración.
          </p>
        </Modal>
      )}

      {/* DISEÑO RESPONSIVO */}
      <style>
        {`
          @media(max-width:1050px) {
            .ca-grid {
              grid-template-columns: 1fr !important;
            }
            .ca-metricas {
              grid-template-columns: repeat(2,minmax(0,1fr)) !important;
            }
          }
          @media(max-width:550px) {
            .ca-metricas {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}