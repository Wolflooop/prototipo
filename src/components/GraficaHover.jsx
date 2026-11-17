import { useRef, useState } from "react";

/**
 * Envuelve una gráfica SVG y muestra un tooltip con el punto más cercano
 * al mouse, al dedo o a las flechas del teclado.
 *
 * Props:
 *  - ancho / alto: tamaño del viewBox del SVG que se envuelve
 *  - puntos: [{ x, y, titulo, filas: [{ nombre, valor, color }] }]  (x, y en coordenadas del viewBox)
 */
export default function GraficaHover({ ancho, alto, puntos, children }) {
  const ref = useRef(null);
  const [i, setI] = useState(null);

  const cercano = (clientX) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r || !r.width) return;
    const x = ((clientX - r.left) / r.width) * ancho;
    let mejor = 0;
    let dist = Infinity;
    puntos.forEach((p, k) => {
      const d = Math.abs(p.x - x);
      if (d < dist) { dist = d; mejor = k; }
    });
    setI(mejor);
  };

  const teclado = (e) => {
    if (e.key === "ArrowRight") setI((v) => Math.min(puntos.length - 1, (v ?? -1) + 1));
    else if (e.key === "ArrowLeft") setI((v) => Math.max(0, (v ?? puntos.length) - 1));
    else if (e.key === "Escape") setI(null);
    else return;
    e.preventDefault();
  };

  const p = i != null ? puntos[i] : null;
  const izq = p ? `${(p.x / ancho) * 100}%` : 0;
  const arr = p ? `${(p.y / alto) * 100}%` : 0;

  return (
    <div
      ref={ref}
      className="gh-wrap"
      tabIndex={0}
      onMouseMove={(e) => cercano(e.clientX)}
      onMouseLeave={() => setI(null)}
      onTouchStart={(e) => cercano(e.touches[0].clientX)}
      onTouchMove={(e) => cercano(e.touches[0].clientX)}
      onKeyDown={teclado}
      onBlur={() => setI(null)}
    >
      {children}
      {p && (
        <>
          <span className="gh-guia" style={{ left: izq }} />
          <span className="gh-punto" style={{ left: izq, top: arr }} />
          <div className={"gh-tip" + (p.x / ancho > 0.65 ? " izq" : "")} style={{ left: izq, top: arr }}>
            <strong>{p.titulo}</strong>
            {p.filas.map((f) => (
              <span key={f.nombre}>
                <i style={{ background: f.color }} />
                {f.nombre}: <b>{f.valor}</b>
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
