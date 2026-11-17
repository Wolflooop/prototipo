export const lecturas=[
 {fecha:"26/10 14:06",sensor:"Temperatura T1",valor:78.0,unidad:"°C",estado:"Alerta"},
 {fecha:"26/10 14:05",sensor:"Potencia",valor:74.2,unidad:"MW",estado:"Normal"},
 {fecha:"26/10 14:04",sensor:"Presión",valor:24.1,unidad:"bar",estado:"Normal"},
 {fecha:"26/10 14:03",sensor:"Caudal",valor:85.0,unidad:"m³/s",estado:"Normal"},
 {fecha:"26/10 14:02",sensor:"Nivel",valor:412.3,unidad:"m",estado:"Normal"},
 {fecha:"26/10 14:01",sensor:"RPM",valor:600,unidad:"rpm",estado:"Normal"}];
export const reportesIniciales=[
 {nombre:"Operación semanal",tipo:"Operación",periodo:"20 – 26 oct",formato:"PDF",generado:"26/10 14:30"},
 {nombre:"Alertas de seguridad",tipo:"Ciberseguridad",periodo:"20 – 26 oct",formato:"PDF",generado:"26/10 12:10"},
 {nombre:"Telemetría de sensores",tipo:"Telemetría",periodo:"25 oct",formato:"CSV",generado:"25/10 18:00"},
 {nombre:"Rendimiento de modelos IA",tipo:"Inteligencia Artificial",periodo:"13 – 19 oct",formato:"PDF",generado:"20/10 09:15"},
 {nombre:"Operación semanal",tipo:"Operación",periodo:"13 – 19 oct",formato:"PDF",generado:"19/10 20:00"},
 {nombre:"Accesos y tráfico",tipo:"Ciberseguridad",periodo:"12 – 18 oct",formato:"CSV",generado:"18/10 17:45"},
 {nombre:"Estadísticas de alertas",tipo:"Alertas",periodo:"6 – 12 oct",formato:"PDF",generado:"13/10 08:30"}
];
export const configuracionInicial={tipo:"Operación de la central",periodo:"Últimos 7 días",componente:"Toda la central",sensor:"Todos",secciones:["Resumen general","Telemetría por sensor","Alertas y eventos","Accesos y ciberseguridad"],formato:"PDF"};
export const textoCSV = (datos=lecturas)=>"Fecha y hora,Sensor,Valor,Unidad,Estado\n"+datos.map(x=>[x.fecha,x.sensor,x.valor,x.unidad,x.estado].join(",")).join("\n");
