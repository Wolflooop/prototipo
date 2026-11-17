import React from 'react';
import ContadorAnimado from '../../components/ContadorAnimado.jsx';

export const MODELOS = [
  { nombre:'SVM', precision:.88, recall:.85, f1:.86, tiempo:'18 s' },
  { nombre:'KNN', precision:.84, recall:.82, f1:.83, tiempo:'4 s' },
  { nombre:'Red neuronal', precision:.91, recall:.90, f1:.90, tiempo:'2 min' }
];
export const REGISTROS = [
  { hora:'14:06', lectura:'Temp. 78 °C', clase:'Anómalo', confianza:.93 },
  { hora:'14:05', lectura:'Accesos x5', clase:'Ataque', confianza:.89 },
  { hora:'14:04', lectura:'Presión 24', clase:'Normal', confianza:.97 },
  { hora:'14:03', lectura:'RPM 600', clase:'Normal', confianza:.98 },
  { hora:'14:02', lectura:'Caudal 85', clase:'Normal', confianza:.96 },
  { hora:'14:01', lectura:'Señal s4', clase:'Anómalo', confianza:.81 }
];
export const cn = (...names) => names.filter(Boolean).join(' ');
export function Titulo({ children, onBack, extra }) {
  return <div className="ia-head"><h1>{onBack ? <><button type="button" className="ia-bread" onClick={onBack}>Inteligencia Artificial</button><span> › {children}</span></> : children}</h1>{extra && <span className="ia-muted">{extra}</span>}</div>;
}
export function Caja({ children, className='', style }) { return <section className={cn('ia-box',className)} style={style}>{children}</section>; }
export function Metricas({ items }) { return <div className="ia-metrics">{items.map(x=><div className="ia-metric" key={x.label}><span>{x.label}</span><strong style={{color:x.color}}><ContadorAnimado valor={x.value}/></strong></div>)}</div>; }
export function Etiqueta({ text }) { let tone = ['Ataque','Anómalo','Fuera','Alto'].includes(text) ? 'red' : ['Normal','Completado'].includes(text) ? 'green' : 'amber'; return <span className={'ia-tag '+tone}>{text}</span>; }
export function Boton({ children, onClick, principal=false, disabled=false }) { return <button type="button" disabled={disabled} className={'ia-button '+(principal?'primary':'')} onClick={onClick}>{children}</button>; }
export function Tabla({ headers, children }) { return <div className="ia-table-scroll"><table className="ia-table"><thead><tr>{headers.map((h,i)=><th key={i}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>; }
export function Barras({ values, labels, colors, max=1, height=280 }) {
  return <div className="ia-bars" style={{height}}>{labels.map((label,i)=><div className="ia-bar-col" key={label}><div className="ia-bar anim-barra-v" style={{height:`${Math.max(1,(values[i]/max)*80)}%`,background:colors?.[i]||'#388de1',animationDelay:`${0.15+i*0.1}s`}} title={`${label}: ${values[i]}`}/><small>{label}</small></div>)}</div>;
}
export function Lineas({ sets, colors=['#3989e1','#ea4747'], dashed=[], anomaly=null, threshold=null }) {
  const x0=18,x1=622,y0=14,y1=252, W=640,H=282;
  const coords = (values) => values.map((v,i)=>`${x0+i*(x1-x0)/(values.length-1)},${y1-(v*(y1-y0))}`).join(' ');
  const ax = anomaly===null?null:x0+anomaly*(x1-x0)/(sets[0].length-1);
  const ay = anomaly===null?null:y1-sets[0][anomaly]*(y1-y0);
  return <svg className="ia-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Gráfica de datos simulados"><line x1={x0} y1={y0} x2={x0} y2={y1} stroke="#bfbeb7"/><line x1={x0} y1={y1} x2={x1} y2={y1} stroke="#bfbeb7"/>{threshold!==null&&<><line x1={x0} y1={y1-threshold*(y1-y0)} x2={x1} y2={y1-threshold*(y1-y0)} stroke="#a4a39d" strokeDasharray="5 5"/><text x="24" y={y1-threshold*(y1-y0)-6} fill="#888" fontSize="13">umbral</text></>}{sets.map((v,i)=><polyline key={i} className={dashed[i]?'anim-fade':'anim-linea'} pathLength={dashed[i]?undefined:1} points={coords(v)} fill="none" stroke={colors[i]} strokeWidth="2.6" strokeDasharray={dashed[i]?'6 5':undefined}/>)}{anomaly!==null&&<><circle className="anim-punto" cx={ax} cy={ay} r="10" fill="none" stroke="#e64b4b" strokeWidth="3"/><text className="anim-fade" x={ax-6} y={ay-20} fill="#c33" fontSize="15" textAnchor="middle">anomalía</text></>}<text x={x0} y="279" fill="#8e8e88" fontSize="14">10:00</text><text x="320" y="279" fill="#8e8e88" fontSize="14" textAnchor="middle">10:30</text><text x={x1} y="279" fill="#8e8e88" fontSize="14" textAnchor="end">11:00</text></svg>;
}
export function descargar(texto,nombre,tipo='text/csv;charset=utf-8') { const url=URL.createObjectURL(new Blob([texto],{type:tipo}));const a=document.createElement('a');a.href=url;a.download=nombre;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000); }
