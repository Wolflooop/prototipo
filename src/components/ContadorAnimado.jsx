import { useEffect, useState } from "react";

// Convierte "73.8", "8,640", "70 %", "120 ms", "78 °C", "5/6" en número + sufijo.
// Cualquier otro texto ("Red neuronal", "MQTT", "14:06") se muestra tal cual.
const PATRON = /^(\d[\d,]*)(?:\.(\d+))?(\s?(?:%|min|ms|MW|°C|bar|rpm)|\/\d+)?$/;

function interpretar(valor) {
  if (typeof valor !== "string") return null;
  const m = valor.match(PATRON);
  if (!m) return null;
  return {
    numero: parseFloat(m[1].replace(/,/g, "") + (m[2] ? "." + m[2] : "")),
    decimales: m[2] ? m[2].length : 0,
    miles: m[1].includes(","),
    sufijo: m[3] || "",
  };
}

function formatear({ decimales, miles, sufijo }, n) {
  const texto = n.toLocaleString("en-US", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
    useGrouping: miles,
  });
  return texto + sufijo;
}

// Cuenta de 0 al valor final en ~0.9 s. Respeta "reducir movimiento".
export default function ContadorAnimado({ valor, duracion = 900 }) {
  const info = interpretar(valor);
  const [actual, setActual] = useState(() => (info ? 0 : null));

  useEffect(() => {
    if (!info) return;
    const reducir = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reducir) { setActual(info.numero); return; }
    let raf;
    const inicio = performance.now();
    const paso = (ahora) => {
      const t = Math.min(1, (ahora - inicio) / duracion);
      const suave = 1 - Math.pow(1 - t, 3); // ease-out
      setActual(info.numero * suave);
      if (t < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor, duracion]);

  if (!info) return valor;
  return formatear(info, actual ?? info.numero);
}