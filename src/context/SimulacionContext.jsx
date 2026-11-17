import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { MODELOS, REGISTROS } from "../pages/inteligencia_artificial/ElementosIA.jsx";
import { alertasIniciales } from "../pages/centro_alertas/AlertasDatos.js";
import { clasificarLectura } from "../utils/clasificador.js";
import { alertaDesdeLectura, fechaActual } from "../utils/alertas.js";

// Estado compartido de la simulación (lecturas de IA + alertas).
// Vive en memoria: al recargar la página se pierde.
const SimulacionContext = createContext(null);

const lecturasBase = () => REGISTROS.map((r, i) => ({ ...r, id: `base-${i}`, modelo: "Red neuronal" }));
const horaActual = () => new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false });
const numeroId = (id) => parseInt(String(id).replace(/\D/g, ""), 10) || 0;
const ultimoNumero = () => Math.max(...alertasIniciales.map((a) => numeroId(a.id)));
const nuevoId = (n) => `ALT-${String(n).padStart(3, "0")}`;

export function SimulacionProvider({ children }) {
  const [lecturas, setLecturas] = useState(lecturasBase);
  const [alertas, setAlertas] = useState(alertasIniciales);
  const [alertaAbrir, setAlertaAbrir] = useState(null); // alerta que Centro de alertas debe abrir
  const contador = useRef(ultimoNumero());

  const agregarAlerta = useCallback((datos) => {
    contador.current += 1;
    const alerta = { estado: "Nueva", fecha: fechaActual(), hora: horaActual(), simulada: true, ...datos, id: nuevoId(contador.current) };
    setAlertas((prev) => [alerta, ...prev]);
    return alerta;
  }, []);

  const actualizarAlerta = useCallback((id, cambios) => {
    setAlertas((prev) => prev.map((a) => (a.id === id ? { ...a, ...cambios } : a)));
  }, []);

  // Clasifica la lectura; si es Anómalo o Ataque, genera una alerta.
  const agregarLectura = useCallback((valores, modelo = "Red neuronal") => {
    const f1 = MODELOS.find((m) => m.nombre === modelo)?.f1 ?? 0.9;
    const r = clasificarLectura(valores, f1);
    let registro = {
      id: `sim-${Date.now()}`,
      hora: horaActual(),
      lectura: r.lectura,
      clase: r.clase,
      confianza: r.confianza,
      modelo,
      simulada: true,
      valores,
      detalle: r.detalle,
    };
    if (registro.clase !== "Normal") {
      contador.current += 1;
      const alerta = alertaDesdeLectura(registro, nuevoId(contador.current));
      setAlertas((prev) => [alerta, ...prev]);
      registro = { ...registro, alertaId: alerta.id, alertaRiesgo: alerta.riesgo };
    }
    setLecturas((prev) => [registro, ...prev].slice(0, 50));
    return registro;
  }, []);

  const reiniciarLecturas = useCallback(() => {
    setLecturas(lecturasBase());
    setAlertas(alertasIniciales);
    contador.current = ultimoNumero();
  }, []);

  const abrirAlerta = useCallback((id) => setAlertaAbrir(id), []);
  const limpiarAlertaAbrir = useCallback(() => setAlertaAbrir(null), []);

  const valor = useMemo(
    () => ({ lecturas, alertas, alertaAbrir, agregarLectura, agregarAlerta, actualizarAlerta, reiniciarLecturas, abrirAlerta, limpiarAlertaAbrir }),
    [lecturas, alertas, alertaAbrir, agregarLectura, agregarAlerta, actualizarAlerta, reiniciarLecturas, abrirAlerta, limpiarAlertaAbrir],
  );
  return <SimulacionContext.Provider value={valor}>{children}</SimulacionContext.Provider>;
}

export function useSimulacion() {
  const ctx = useContext(SimulacionContext);
  if (!ctx) throw new Error("useSimulacion debe usarse dentro de <SimulacionProvider>");
  return ctx;
}
