// Crea una alerta a partir de una lectura clasificada como Anómalo o Ataque.
const dosDigitos = (n) => String(n).padStart(2, "0");
export const fechaActual = () => {
  const d = new Date();
  return `${dosDigitos(d.getDate())}/${dosDigitos(d.getMonth() + 1)} ${dosDigitos(d.getHours())}:${dosDigitos(d.getMinutes())}`;
};

export function alertaDesdeLectura(reg, id) {
  if (reg.clase === "Normal") return null;
  const d = reg.detalle;
  const fuera = d.variables.filter((v) => v.estado === "Fuera");
  const ciber = reg.clase === "Ataque";
  const fmt = (v) => `${v.nombre} ${v.valor}${v.unidad ? " " + v.unidad : ""}`;

  const eventos = fuera.map((v) => [reg.hora, `${fmt(v)} fuera de rango`, `Sensor de ${v.nombre.toLowerCase()}`]);
  if (d.accesos >= 3) eventos.push([reg.hora, `${d.accesos} accesos fallidos en 5 min`, "Red industrial"]);

  let evento, descripcion, riesgo;
  if (ciber) {
    evento = `Accesos fallidos x${d.accesos}`;
    descripcion = `${d.accesos} intentos de acceso fallidos en 5 min (lectura simulada)`;
    riesgo = d.accesos >= 10 || reg.confianza >= 0.85 ? "Alta" : "Media";
  } else {
    evento = fuera.length === 1 ? `${fuera[0].nombre} fuera de rango` : `${fuera.length} variables fuera de rango`;
    descripcion = fuera.map((v) => `${fmt(v)} (normal ${v.min} – ${v.max}${v.unidad ? " " + v.unidad : ""})`).join("; ");
    const maxDesv = Math.max(...fuera.map((v) => v.desv));
    riesgo = fuera.length >= 2 || maxDesv >= 0.3 ? "Alta" : maxDesv >= 0.1 ? "Media" : "Baja";
  }
  return {
    id, evento, descripcion, riesgo,
    tipo: ciber ? "Ciber" : "Operativa",
    estado: "Nueva",
    fecha: fechaActual(),
    hora: reg.hora,
    confianza: reg.confianza,
    modelo: reg.modelo,
    ia: { claseNombre: d.claseNombre, probabilidades: d.probabilidades },
    eventos,
    lecturaId: reg.id,
    simulada: true,
  };
}
