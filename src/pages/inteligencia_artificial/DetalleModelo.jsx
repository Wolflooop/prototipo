import React from 'react';
import { MODELOS,Titulo,Caja,Metricas,Boton,Lineas } from './ElementosIA.jsx';
const meta = {
 'SVM': [['Tipo','Máquina de vectores de soporte (SVC)'],['Kernel','RBF'],['C','1.0'],['Gamma','scale']],
 'KNN': [['Tipo','K vecinos más cercanos'],['Vecinos','5'],['Distancia','Euclidiana'],['Ponderación','Uniforme']],
 'Red neuronal': [['Tipo','Red neuronal (Scikit-learn)'],['Capas ocultas','2 (64 y 32 neuronas)'],['Activación','ReLU'],['Iteraciones','200'],['Tasa de aprendizaje','0.001']]
};
export default function DetalleModelo({nombre='Red neuronal',onBack,onMatrix,onTrain,onUse,activo}){
 const m=MODELOS.find(x=>x.nombre===nombre)||MODELOS[2];
 return <><Titulo onBack={onBack}>{nombre}</Titulo><Metricas items={[{label:'Precisión',value:m.precision.toFixed(2)},{label:'Recall',value:m.recall.toFixed(2)},{label:'F1-score',value:m.f1.toFixed(2)},{label:'Entrenamiento',value:m.tiempo}]}/><div className="ia-two"><Caja><h2>Parámetros del modelo</h2>{meta[m.nombre].map(([k,v])=><div className="ia-param" key={k}><span>{k}</span><strong>{v}</strong></div>)}</Caja><Caja><h2>Curva de aprendizaje</h2><Lineas sets={[[.88,.62,.46,.34,.27,.23,.21,.19],[.87,.60,.44,.31,.24,.19,.17,.16]]} dashed={[false,true]}/><p className="ia-legend"><span style={{color:'#3989e1'}}>■</span> Entrenamiento　 <span style={{color:'#e74747'}}>■</span> Prueba</p></Caja></div><Caja><h2>Acciones</h2><p className="ia-muted">Compara este modelo con los demás antes de elegir el definitivo.</p><div className="ia-actions"><Boton onClick={()=>onMatrix(nombre)}>Ver matriz de confusión</Boton><Boton onClick={()=>onTrain(nombre)}>Entrenar de nuevo</Boton><Boton principal onClick={()=>onUse(nombre)}>{activo===nombre?'Modelo activo ✓':'Usar este modelo'}</Boton></div></Caja></>;
}
