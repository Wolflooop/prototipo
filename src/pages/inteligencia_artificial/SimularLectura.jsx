import React, { useState } from 'react';
import { Titulo, Caja, Boton, Etiqueta } from './ElementosIA.jsx';
import { VARIABLES, ACCESOS, EJEMPLOS, validar } from '../../utils/clasificador.js';
import { useSimulacion } from '../../context/SimulacionContext.jsx';
import '../../styles/ia-simulador.css';

const CAMPOS = [...VARIABLES, { ...ACCESOS, unidad: '' }];

export default function SimularLectura({ modelo = 'Red neuronal', onBack, onDetalle, onAlerta }) {
  const { agregarLectura, reiniciarLecturas } = useSimulacion();
  const [form, setForm] = useState({ ...EJEMPLOS.normal });
  const [error, setError] = useState('');
  const [campoError, setCampoError] = useState('');
  const [resultado, setResultado] = useState(null);
  const [aviso, setAviso] = useState('');

  const cambiar = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setError(''); setCampoError(''); };
  const cargar = (nombre) => { setForm({ ...EJEMPLOS[nombre] }); setError(''); setCampoError(''); };
  const clasificar = (e) => {
    e.preventDefault();
    const r = validar(form);
    if (!r.ok) { setError(r.error); setCampoError(r.campo); return; }
    setResultado(agregarLectura(r.valores, modelo));
    setAviso('');
  };
  const restablecer = () => { reiniciarLecturas(); setResultado(null); setAviso('Lecturas y alertas restablecidas a los valores de ejemplo.'); };

  return <>
    <Titulo onBack={onBack} extra="Datos simulados">Simular lectura</Titulo>
    <div className="ia-two ia-train-layout">
      <Caja>
        <h2>Datos de la lectura</h2>
        <div className="ia-presets">
          <span>Cargar ejemplo:</span>
          <Boton onClick={() => cargar('normal')}>Normal</Boton>
          <Boton onClick={() => cargar('anomalo')}>Anómalo</Boton>
          <Boton onClick={() => cargar('ataque')}>Ataque</Boton>
        </div>
        <form onSubmit={clasificar} noValidate>
          <div className="ia-form-grid">
            {CAMPOS.map((c) => (
              <label key={c.clave}>
                {c.nombre}{c.unidad ? ` (${c.unidad})` : ''}
                <input type="number" step="any" inputMode="decimal" value={form[c.clave]} className={campoError === c.clave ? 'invalid' : ''} onChange={(e) => cambiar(c.clave, e.target.value)} />
                <span className="ia-hint">{c.min !== undefined ? `Rango normal: ${c.min} – ${c.max}${c.unidad ? ' ' + c.unidad : ''}` : 'Normal: menos de 3'}</span>
              </label>
            ))}
          </div>
          {error && <p className="ia-error" role="alert">{error}</p>}
          <div className="ia-actions">
            <Boton onClick={() => cargar('normal')}>Restablecer valores</Boton>
            <button type="submit" className="ia-submit">Clasificar lectura</button>
          </div>
          <p className="ia-muted">Clasificación simulada con reglas sencillas y el modelo activo ({modelo}); no usa un modelo entrenado real.</p>
        </form>
      </Caja>

      <Caja className="ia-train-side">
        <div className="ia-between"><h2>Resultado</h2>{resultado && <Etiqueta text={resultado.clase} />}</div>
        {!resultado ? <p className="ia-sim-vacio">Ingresa una lectura y presiona «Clasificar lectura».</p> : (
          <div key={resultado.id}>
            <p className="ia-muted">{resultado.hora} · {resultado.modelo}</p>
            <p className="ia-sim-clase">Clase asignada: {resultado.detalle.claseNombre}</p>
            <div className="ia-result"><span>Confianza</span><strong>{resultado.confianza.toFixed(2)}</strong></div>
            {resultado.detalle.probabilidades.map(([n, p, c]) => (
              <div className="ia-prob" key={n}>
                <div className="ia-between"><span>{n}</span><span>{p} %</span></div>
                <div className="ia-track"><div style={{ width: p + '%', background: c }} /></div>
              </div>
            ))}
            {resultado.detalle.variables.map((v) => (
              <div className="ia-result" key={v.clave}><span>{v.nombre}: {v.valor}{v.unidad ? ' ' + v.unidad : ''}</span><Etiqueta text={v.estado} /></div>
            ))}
            <div className="ia-result"><span>Accesos fallidos: {resultado.detalle.accesos}</span><Etiqueta text={resultado.detalle.accesos >= 5 ? 'Alto' : 'Normal'} /></div>
            <p className="ia-notice">Agregada a «Clasificación reciente».</p>
            {resultado.alertaId
              ? <p className="ia-notice" style={{ background: '#fff0da', color: '#93550c' }}>Se generó la alerta {resultado.alertaId} (riesgo {resultado.alertaRiesgo}) en Centro de alertas.</p>
              : <p className="ia-muted">Lectura normal: no se generó alerta.</p>}
          </div>
        )}
        {aviso && <p className="ia-muted">{aviso}</p>}
        <div className="ia-bottom-actions">
          <Boton principal disabled={!resultado} onClick={() => onDetalle(resultado)}>Ver detalle completo</Boton>
          {resultado?.alertaId && <Boton onClick={() => onAlerta(resultado.alertaId)}>Ver alerta {resultado.alertaId}</Boton>}
          <Boton onClick={onBack}>Volver a Inteligencia Artificial</Boton>
          <Boton onClick={restablecer}>Restablecer lecturas y alertas</Boton>
        </div>
      </Caja>
    </div>
  </>;
}
