// Clasificador SIMULADO: no es un modelo real. Aplica reglas sencillas sobre
// rangos normales para que el prototipo responda a los datos que se ingresan.

// Rangos normales (los mismos que muestra el detalle de clasificación).
export const VARIABLES = [
  { clave: "nivel", nombre: "Nivel", corto: "Nivel", unidad: "m", min: 405, max: 418, limMin: 380, limMax: 440 },
  { clave: "caudal", nombre: "Caudal", corto: "Caudal", unidad: "m³/s", min: 80, max: 90, limMin: 0, limMax: 150 },
  { clave: "presion", nombre: "Presión", corto: "Presión", unidad: "bar", min: 22, max: 26, limMin: 0, limMax: 40 },
  { clave: "rpm", nombre: "RPM", corto: "RPM", unidad: "", min: 590, max: 610, limMin: 0, limMax: 900 },
  { clave: "temperatura", nombre: "Temperatura", corto: "Temp.", unidad: "°C", min: 55, max: 72, limMin: 0, limMax: 150 },
  { clave: "potencia", nombre: "Potencia", corto: "Potencia", unidad: "MW", min: 70, max: 78, limMin: 0, limMax: 120 },
];
export const ACCESOS = { clave: "accesos", nombre: "Accesos fallidos (5 min)", limMin: 0, limMax: 50 };

const BASE = { nivel: "412", caudal: "85", presion: "24", rpm: "600", temperatura: "65", potencia: "72", accesos: "0" };
export const EJEMPLOS = {
  normal: { ...BASE },
  anomalo: { ...BASE, temperatura: "78", potencia: "74" },
  ataque: { ...BASE, accesos: "6" },
};

const COLORES = { Normal: "#3989e1", "Falla operativa": "#f4a322", Ciberataque: "#e74747" };
const ETIQUETAS = { Normal: "Normal", "Falla operativa": "Anómalo", Ciberataque: "Ataque" };

// Valida el formulario (texto) y devuelve números listos para clasificar.
export function validar(form) {
  const valores = {};
  for (const v of [...VARIABLES, ACCESOS]) {
    const texto = String(form[v.clave] ?? "").trim();
    if (texto === "") return { ok: false, campo: v.clave, error: `Escribe un valor para ${v.nombre}.` };
    const n = Number(texto);
    if (!Number.isFinite(n)) return { ok: false, campo: v.clave, error: `${v.nombre} debe ser un número.` };
    if (n < v.limMin || n > v.limMax) {
      return { ok: false, campo: v.clave, error: `${v.nombre} debe estar entre ${v.limMin} y ${v.limMax}${v.unidad ? " " + v.unidad : ""}.` };
    }
    if (v.clave === "accesos" && !Number.isInteger(n)) return { ok: false, campo: v.clave, error: "Los accesos fallidos deben ser un número entero." };
    valores[v.clave] = n;
  }
  return { ok: true, valores };
}

const formato = (v, n) => `${v.corto} ${n}${v.unidad === "°C" ? " °C" : ""}`;

// f1 del modelo activo: ajusta un poco la confianza según el algoritmo elegido.
export function clasificarLectura(valores, f1 = 0.9) {
  const variables = VARIABLES.map((v) => {
    const valor = valores[v.clave];
    const fuera = valor < v.min || valor > v.max;
    const desv = !fuera ? 0 : (valor < v.min ? v.min - valor : valor - v.max) / (v.max - v.min);
    return { clave: v.clave, nombre: v.nombre, corto: v.corto, unidad: v.unidad, valor, min: v.min, max: v.max, estado: fuera ? "Fuera" : "Normal", desv };
  });
  const nFuera = variables.filter((v) => v.estado === "Fuera").length;
  const desvTotal = variables.reduce((a, v) => a + v.desv, 0);
  const accesos = valores.accesos;

  const sev = Math.min(1, desvTotal * 2 + nFuera * 0.15);
  const ciber = accesos >= 5 ? Math.min(0.97, 0.75 + (accesos - 5) * 0.04) : accesos >= 3 ? 0.2 : 0.02;
  const falla = nFuera ? Math.max(0.25, sev) * (1 - ciber * 0.5) : 0.02;
  const normal = nFuera === 0 && accesos < 3 ? 0.96 : Math.max(0.02, 1 - Math.max(sev, ciber) - 0.1);

  const suma = normal + falla + ciber;
  const nombres = ["Normal", "Falla operativa", "Ciberataque"];
  const crudas = [normal / suma, falla / suma, ciber / suma];
  const pct = crudas.map((p) => Math.round(p * 100));
  const iMax = crudas.indexOf(Math.max(...crudas));
  pct[iMax] += 100 - pct.reduce((a, b) => a + b, 0); // que sumen 100
  const clase = nombres[iMax];
  const confianza = Math.round(Math.min(0.99, Math.max(0.5, crudas[iMax] * (f1 / 0.9))) * 100) / 100;

  let lectura;
  if (clase === "Ciberataque") lectura = `Accesos x${accesos}`;
  else if (clase === "Falla operativa") {
    const peor = variables.reduce((a, b) => (b.desv > a.desv ? b : a));
    lectura = formato(peor, peor.valor);
  } else lectura = formato(variables.find((v) => v.clave === "temperatura"), valores.temperatura);

  return {
    clase: ETIQUETAS[clase],
    confianza,
    lectura,
    detalle: {
      claseNombre: clase,
      probabilidades: nombres.map((n, i) => [n, pct[i], COLORES[n]]),
      variables,
      accesos,
    },
  };
}
