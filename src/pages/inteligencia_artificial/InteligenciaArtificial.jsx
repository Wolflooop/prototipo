
import React,{useState} from 'react';
import { MODELOS,REGISTROS,Titulo,Caja,Tabla,Etiqueta,Boton,Metricas } from './ElementosIA.jsx';
import SimularLectura from './SimularLectura.jsx';
import { useSimulacion } from '../../context/SimulacionContext.jsx';
import DetalleModelo from './DetalleModelo.jsx';
import MatrizConfusion from './MatrizConfusion.jsx';
import EntrenarModelo from './EntrenarModelo.jsx';
import DetalleClasificacion from './DetalleClasificacion.jsx';
import DatosEntrenamiento from './DatosEntrenamiento.jsx';

export default function InteligenciaArtificial({onNavigate}){
 const {lecturas,abrirAlerta}=useSimulacion();
 const cuenta=(c)=>String(lecturas.filter(r=>r.clase===c).length);
 const [vista,setVista]=useState('resumen');
 const [modelo,setModelo]=useState('Red neuronal');
 const [activo,setActivo]=useState('Red neuronal');
 const [registro,setRegistro]=useState(REGISTROS[0]);
 const [mensaje,setMensaje]=useState('');

 const regresar=()=>{
  setVista('resumen');
  setMensaje('');
 };

 const abrir=(v,n)=>{
  if(n)setModelo(n);
  setVista(v);
  setMensaje('');
 };

 return <div className="ia-root anim-scope">

 <style>{`

 .ia-root,.ia-root *{box-sizing:border-box}
 .ia-root{
  width:100%;
  color:#102f55;
  font-family:"Segoe UI",Arial,Helvetica,sans-serif;
  font-size:14px;
 }

 .ia-root button,.ia-root input,.ia-root select{
  font:inherit;
 }

 .ia-root button{cursor:pointer}

 .ia-root h1,.ia-root h2{font-weight:400}

 .ia-root h1{
  font-size:27px;
  font-weight:750;
  color:#102f55;
  letter-spacing:-.5px;
  margin:0;
 }

 .ia-root h2{
  color:#12365f;
  font-size:16px;
  font-weight:700;
  margin:0 0 16px;
 }

 .ia-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:15px;
  margin:0 0 8px;
  flex-wrap:wrap;
 }

 .ia-bread{
  border:0;
  padding:0;
  background:none;
  color:#393936;
 }

 .ia-bread:hover{
  color:#1865ac;
  text-decoration:underline;
 }

 .ia-muted{
  color:#7186a1;
  font-size:12px;
 }

 .ia-note{
  margin:4px 0 22px;
  color:#7186a1;
 }

 /* TARJETAS DE METRICAS */

 .ia-metrics{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:13px;
  margin-bottom:16px;
 }

 .ia-metric{
  position:relative;
  overflow:hidden;
  min-width:0;
  background:#fff;
  border:1px solid #d8e7fa;
  border-radius:13px;
  padding:16px 18px;
  min-height:88px;
  display:flex;
  flex-direction:column;
  gap:9px;
  box-shadow:0 4px 14px rgba(37,91,153,.045);
 }

 .ia-metric::after{
  content:"";
  position:absolute;
  width:115px;
  height:75px;
  right:-15px;
  bottom:-48px;
  background:#e5f1ff;
  border-radius:50%;
  pointer-events:none;
 }

 .ia-metric span,
 .ia-metric strong{
  position:relative;
  z-index:1;
 }

 .ia-metric span{
  font-size:12px;
  color:#6d819d;
 }

 .ia-metric strong{
  font-size:26px;
  font-weight:750;
  color:#12365f;
  line-height:1.1;
  overflow-wrap:anywhere;
 }

 /* PANELES */

 .ia-box{
  background:#fff;
  border:1px solid #d8e7fa;
  border-radius:13px;
  padding:19px;
  min-width:0;
  position:relative;
  box-shadow:0 4px 15px rgba(37,91,153,.045);
 }

 .ia-box-no-pad{
  padding:0;
  overflow:hidden;
 }

 .ia-box-no-pad h2{
  margin:19px 20px 15px;
 }

 .ia-two{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:14px;
  margin-bottom:18px;
 }

 .ia-overview{
  grid-template-columns:1.15fr .85fr;
 }

 /* TABLAS */

 .ia-table-scroll{
  overflow:auto;
 }

 .ia-table{
  border-collapse:collapse;
  width:100%;
  font-size:13px;
  color:#193b63;
  text-align:left;
 }

 .ia-table th{
  background:#f2f7ff;
  color:#526e91;
  font-size:12px;
  font-weight:650;
  white-space:nowrap;
  padding:13px 17px;
 }

 .ia-table td{
  padding:13px 17px;
  border-bottom:1px solid #e8eff8;
 }

 .ia-table tr:last-child td{
  border-bottom:none;
 }

 .ia-table tr.clickable{
  cursor:pointer;
 }

 .ia-table tr.clickable:hover{
  background:#f0f6ff;
 }

 .ia-table tr.highlight{
  background:#eaf3ff;
 }

 .ia-model-summary{
  border-radius:13px;
  overflow:hidden;
  margin-bottom:16px;
  padding:0;
 }

 .ia-model-summary .ia-table td,
 .ia-model-summary .ia-table th{
  padding:13px 17px;
 }

 .ia-inline-link{
  border:0;
  background:none;
  color:#1265c3;
  font-weight:650;
  padding:2px 0;
 }

 .ia-inline-link:hover{
  text-decoration:underline;
 }

 /* ETIQUETAS */

 .ia-tag{
  display:inline-block;
  border-radius:7px;
  min-width:65px;
  padding:6px 10px;
  text-align:center;
  font-size:11px;
  font-weight:650;
 }

 .ia-tag.red{
  background:#ffebed;
  color:#d63e48;
 }

 .ia-tag.green{
  background:#e0f6e9;
  color:#16864d;
 }

 .ia-tag.amber{
  background:#fff1d9;
  color:#b67513;
 }

 /* BOTONES */

 .ia-button{
  border:1px solid #d5e3f4;
  border-radius:8px;
  padding:10px 15px;
  background:#fff;
  color:#24527f;
  min-width:0;
  font-size:12px;
  font-weight:600;
  transition:background .2s,border-color .2s;
 }

 .ia-button:hover,
 .ia-tabs button:hover{
  background:#edf5ff;
  border-color:#a9c9ee;
 }

 .ia-button.primary{
  color:#fff;
  background:#1769c2;
  border-color:#1769c2;
 }

 .ia-button.primary:hover{
  background:#1255a0;
 }

 .ia-button:disabled{
  opacity:.6;
  cursor:not-allowed;
 }

 .ia-actions{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  margin-top:18px;
 }

 .ia-actions>*{
  flex:1;
 }

 .ia-bottom-actions{
  display:flex;
  flex-direction:column;
  gap:13px;
  margin-top:auto;
  padding-top:26px;
 }

 .ia-bottom-actions .ia-button{
  width:100%;
 }

 /* GRAFICAS */

 .ia-bars{
  display:flex;
  justify-content:space-around;
  align-items:flex-end;
  gap:14px;
  border-bottom:1px solid #dce8f6;
  padding:12px 15px 0;
  margin-top:20px;
 }

 .ia-bar-col{
  flex:1;
  height:100%;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:flex-end;
  min-width:0;
 }

 .ia-bar{
  width:64%;
  max-width:90px;
  min-height:5px;
 }

 .ia-bar-col small{
  color:#647d9c;
  font-size:12px;
  text-align:center;
  margin:12px 0 0;
  min-height:18px;
 }

 .ia-chart{
  width:100%;
  height:auto;
  display:block;
  margin-top:18px;
  max-height:330px;
 }

 .ia-legend{
  color:#7186a1;
  font-size:12px;
 }

 /* PARAMETROS */

 .ia-param{
  display:flex;
  flex-direction:column;
  border-bottom:1px solid #d8e7fa;
  padding:10px 0;
 }

 .ia-param span{
  color:#7186a1;
  font-size:12px;
 }

 .ia-param strong{
  font-weight:400;
  margin-top:8px;
 }

 /* MATRIZ DE CONFUSION */

 .ia-matrix{
  display:grid;
  grid-template-columns:150px repeat(3,minmax(0,1fr));
  gap:5px;
  align-items:stretch;
  margin:25px 0;
 }

 .ia-matrix-label{
  display:flex;
  align-items:center;
  justify-content:center;
  text-align:center;
  font-size:14px;
  min-height:45px;
 }

 .ia-matrix-cell{
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:8px;
  border:1px solid #d8e7fa;
  min-height:110px;
  font-size:28px;
 }

 .ia-matrix-cell.hit{
  background:#87b6e7;
  color:#183651;
 }

 .ia-matrix-cell.miss{
  background:#ffebed;
 }

 .ia-matrix-stats{
  display:flex;
  gap:48px;
  margin:24px 0;
 }

 .ia-matrix-stats>div{
  color:#7186a1;
  display:flex;
  flex-direction:column;
  gap:10px;
 }

 .ia-matrix-stats strong{
  color:#12365f;
  font-weight:400;
  font-size:36px;
 }

 .ia-matrix-layout{
  grid-template-columns:1.5fr 1fr;
 }

 /* PESTAÑAS */

 .ia-tabs{
  display:flex;
  align-items:center;
  flex-wrap:wrap;
  gap:12px;
  margin:0 0 22px;
 }

 .ia-tabs button{
  background:#fff;
  border:1px solid #d5e3f4;
  border-radius:8px;
  padding:10px 23px;
  min-width:125px;
 }

 .ia-tabs button.selected{
  border-color:#c9e1fc;
  background:#e6f3ff;
  color:#1c65ac;
 }

 /* ENTRENAMIENTO */

 .ia-train-layout{
  grid-template-columns:1.35fr .95fr;
 }

 .ia-train-side{
  display:flex;
  flex-direction:column;
 }

 .ia-form-grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:20px 24px;
  margin-bottom:26px;
 }

 .ia-form-grid label,
 .ia-wide-label{
  display:flex;
  flex-direction:column;
  gap:7px;
  color:#7186a1;
  font-size:13px;
 }

 .ia-form-grid input,
 .ia-form-grid select{
  width:100%;
  padding:12px 14px;
  border:1px solid #d5e3f4;
  border-radius:9px;
  color:#193b63;
  background:#fff;
 }

 .ia-form-grid input:disabled,
 .ia-form-grid select:disabled{
  background:#f2f7ff;
 }

 .ia-wide-label{
  margin-bottom:30px;
 }

 .ia-wide-label input{
  width:100%;
  accent-color:#1769c2;
 }

 .ia-split,
 .ia-between{
  display:flex;
  justify-content:space-between;
  gap:10px;
 }

 .ia-split{
  font-size:12px;
  color:#7186a1;
 }

 .ia-track{
  height:10px;
  background:#e5edf7;
  border-radius:20px;
  overflow:hidden;
  margin:8px 0 18px;
 }

 .ia-track>div{
  height:100%;
  border-radius:20px;
 }

 .ia-result{
  display:flex;
  justify-content:space-between;
  gap:10px;
  padding:17px 0;
  border-bottom:1px solid #d8e7fa;
  color:#7186a1;
 }

 .ia-result strong{
  color:#12365f;
  font-weight:400;
 }

 .ia-train-side .ia-bottom-actions{
  margin-top:auto;
 }

 /* AVISOS */

 .ia-notice{
  padding:12px 15px;
  background:#e0f6e9;
  border-radius:8px;
  color:#16864d;
  font-size:13px;
 }

 .ia-prob{
  margin:15px 0 22px;
  color:#7186a1;
 }

 /* FLUJO */

 .ia-flow{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:4px;
  margin:24px 0;
  flex-wrap:wrap;
 }

 .ia-flow-item{
  background:#f2f7ff;
  border:1px solid #d8e7fa;
  border-radius:10px;
  padding:21px 10px;
  text-align:center;
  flex:1;
  min-width:125px;
 }

 .ia-flow-arrow{
  color:#7186a1;
  font-size:27px;
 }

 .ia-root button:focus-visible{
  outline:3px solid #3989e1;
  outline-offset:2px;
 }

 /* RESPONSIVE */

 @media(max-width:1100px){
  .ia-metrics{
   grid-template-columns:repeat(2,1fr);
  }

  .ia-two,
  .ia-matrix-layout,
  .ia-train-layout,
  .ia-overview{
   grid-template-columns:1fr;
  }
 }

 @media(max-width:700px){
  .ia-metrics{
   gap:10px;
   grid-template-columns:repeat(2,minmax(0,1fr));
  }

  .ia-head{
   align-items:flex-start;
  }

  .ia-model-summary .ia-table{
   min-width:650px;
  }

  .ia-actions>*{
   flex-basis:100%;
  }

  .ia-form-grid{
   grid-template-columns:1fr;
  }

  .ia-box{
   padding:18px 15px;
  }

  .ia-box-no-pad{
   padding:0;
  }

  .ia-matrix{
   grid-template-columns:74px repeat(3,minmax(0,1fr));
  }

  .ia-matrix-cell{
   min-height:65px;
   font-size:19px;
  }

  .ia-matrix-label{
   font-size:11px;
  }

  .ia-table{
   font-size:13px;
  }

  .ia-table td,
  .ia-table th{
   padding:12px;
  }

  .ia-head h1{
   font-size:23px;
  }
 }

 @media(max-width:420px){
  .ia-metrics{
   grid-template-columns:1fr;
  }
 }

 `}</style>

 <div className="anim-vista" key={vista}>

 {vista==='resumen'?<>
  <Titulo extra="SVM · KNN · Red neuronal">
   Inteligencia Artificial
  </Titulo>

  <p className="ia-muted ia-note">
   Valores de ejemplo; reemplazarlos cuando existan resultados reales.
  </p>

  <Metricas items={[
   {label:'Lecturas clasificadas',value:String(lecturas.length)},
   {label:'Normales',value:cuenta('Normal')},
   {label:'Anómalas',value:cuenta('Anómalo'),color:'#93550c'},
   {label:'Ataques',value:cuenta('Ataque'),color:'#b82e2e'}
  ]}/>

  <Caja className="ia-model-summary">
   <Tabla headers={[
    'Algoritmo',
    'Precisión',
    'Recall',
    'F1-score',
    'Tiempo de entrenamiento',
    ''
   ]}>
    {MODELOS.map(m=>
     <tr
      className={m.nombre==='Red neuronal'?'highlight clickable':'clickable'}
      key={m.nombre}
      onClick={()=>abrir('modelo',m.nombre)}
     >
      <td>{m.nombre}</td>
      <td>{m.precision.toFixed(2)}</td>
      <td>{m.recall.toFixed(2)}</td>
      <td>{m.f1.toFixed(2)}</td>
      <td>{m.tiempo}</td>
      <td>
       <button
        type="button"
        className="ia-inline-link"
        onClick={e=>{
         e.stopPropagation();
         abrir('modelo',m.nombre);
        }}
       >
        {m.nombre==='Red neuronal'?'Mejor F1 ›':'Ver ›'}
       </button>
      </td>
     </tr>
    )}
   </Tabla>
  </Caja>

  <div className="ia-two ia-overview">

   <Caja>
    <h2>Comparación de métricas</h2>

    <p className="ia-legend">
     🟦 Precisión　🔵 Recall　🔷 F1
    </p>

    <div style={{
     height:310,
     display:'flex',
     alignItems:'flex-end',
     justifyContent:'space-around',
     borderBottom:'1px solid #dce8f6',
     gap:12,
     padding:'20px 12px 0'
    }}>
     {MODELOS.map((m,mi)=>
      <button
       type="button"
       className="anim-nolift"
       key={m.nombre}
       onClick={()=>abrir('modelo',m.nombre)}
       title={'Ver '+m.nombre}
       style={{
        border:0,
        background:'transparent',
        display:'flex',
        flex:1,
        alignItems:'flex-end',
        flexDirection:'column',
        justifyContent:'flex-end',
        height:'100%',
        minWidth:0,
        cursor:'pointer'
       }}
      >
       <div style={{
        width:'100%',
        height:'90%',
        display:'flex',
        alignItems:'flex-end',
        gap:3,
        justifyContent:'center'
       }}>
        {[m.precision,m.recall,m.f1].map((v,i)=>
         <div
          key={i}
          className="anim-barra-v"
          style={{
           background:['#b6d5f5','#3b8fe0','#154e88'][i],
           width:'28%',
           height:(v*100)+'%',
           animationDelay:`${0.15+mi*0.12+i*0.06}s`
          }}
          title={`${v.toFixed(2)}`}
         />
        )}
       </div>

       <span style={{
        textAlign:'center',
        width:'100%',
        fontSize:14,
        marginTop:10,
        whiteSpace:'nowrap'
       }}>
        {m.nombre}
       </span>
      </button>
     )}
    </div>
   </Caja>

   <Caja className="ia-box-no-pad">
    <h2>Clasificación reciente</h2>

    <Tabla headers={[
     'Hora',
     'Lectura',
     'Clase',
     'Confianza'
    ]}>
     {lecturas.slice(0,6).map((r,i)=>
      <tr
       className={(i===0&&r.simulada?'highlight ':'')+'clickable'}
       key={r.id}
       onClick={()=>{
        setRegistro(r);
        abrir('clasificacion');
       }}
      >
       <td>{r.hora}</td>
       <td>{r.lectura}</td>
       <td><Etiqueta text={r.clase}/></td>
       <td>{r.confianza.toFixed(2)}</td>
      </tr>
     )}
    </Tabla>

    <p className="ia-muted" style={{
     padding:'12px 24px 0',
     margin:0
    }}>
     Mostrando las últimas {Math.min(6,lecturas.length)} de {lecturas.length} lecturas
    </p>

    <div style={{
     padding:20,
     display:'flex',
     flexWrap:'wrap',
     gap:10
    }}>
     <Boton principal onClick={()=>abrir('simular')}>
      Simular lectura
     </Boton>

     <Boton onClick={()=>abrir('matriz','Red neuronal')}>
      Ver matriz de confusión
     </Boton>

     <Boton onClick={()=>abrir('datos')}>
      Datos de entrenamiento
     </Boton>

     <Boton onClick={()=>abrir('entrenar',activo)}>
      Entrenar modelo
     </Boton>
    </div>
   </Caja>

  </div>

  {mensaje&&<p className="ia-notice">{mensaje}</p>}

 </>:vista==='simular'?

  <SimularLectura
   modelo={activo}
   onBack={regresar}
   onDetalle={r=>{
    setRegistro(r);
    abrir('clasificacion');
   }}
   onAlerta={id=>{
    abrirAlerta(id);
    onNavigate?.('Centro de alertas');
   }}
  />

 :vista==='modelo'?

  <DetalleModelo
   nombre={modelo}
   activo={activo}
   onBack={regresar}
   onMatrix={n=>abrir('matriz',n)}
   onTrain={n=>abrir('entrenar',n)}
   onUse={n=>{
    setActivo(n);
    setMensaje(`Modelo ${n} seleccionado para la demostración; no se actualizó un modelo real.`);
    regresar();
    setMensaje(`Modelo ${n} seleccionado solo en esta sesión.`);
   }}
  />

 :vista==='matriz'?

  <MatrizConfusion
   inicial={modelo}
   onBack={regresar}
  />

 :vista==='entrenar'?

  <EntrenarModelo
   modeloInicial={modelo}
   onBack={regresar}
   onDetails={n=>abrir('modelo',n)}
   onCompare={regresar}
   onUse={setActivo}
  />

 :vista==='clasificacion'?

  <DetalleClasificacion
   registro={registro}
   onBack={regresar}
   onNavigate={onNavigate}
  />

 :

  <DatosEntrenamiento onBack={regresar}/>

 }

 </div>
 </div>;
}
