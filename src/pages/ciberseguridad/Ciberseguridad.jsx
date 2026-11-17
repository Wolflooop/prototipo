import React, { useState } from "react";
import { Title, Stats, Panel, Pill, BarChart, exampleLogs, logTone, activar } from "./Elementos.jsx";
import TraficoRed from "./TraficoRed.jsx";
import RegistroAccesos from "./RegistroAccesos.jsx";
import DetalleIP from "./DetalleIP.jsx";
import UsuariosRoles from "./UsuariosRoles.jsx";
import IntegridadMensajes from "./IntegridadMensajes.jsx";

const incidents = [
  ["Múltiples logins fallidos", "Alta"],
  ["Pérdida de señal sensor 4", "Media"],
  ["Mensaje MQTT alterado", "Alta"],
  ["Tráfico fuera de horario", "Baja"],
];
export default function Ciberseguridad({ onNavigate }) {
  const [view, setView] = useState("principal");
  const [ip, setIp] = useState("192.168.1.45");
  const [notice, setNotice] = useState("");
  const home = () => { setView("principal"); setNotice(""); };
  const openIp = (value) => { setIp(value); setView("ip"); };
  return (
    <div className="cy-module anim-scope">
      <style>{ESTILOS}</style>
      <div className="anim-vista" key={view}>
        {view === "trafico" ? (
          <TraficoRed onBack={home} onIp={openIp} />
        ) : view === "accesos" ? (
          <RegistroAccesos onBack={home} onIp={openIp} />
        ) : view === "ip" ? (
          <DetalleIP
            ip={ip}
            onBack={home}
            onAlerts={() => {
              setNotice("Consulta de alertas relacionadas: demostración.");
              home();
              onNavigate?.("Centro de alertas");
            }}
          />
        ) : view === "usuarios" ? (
          <UsuariosRoles onBack={home} />
        ) : view === "integridad" ? (
          <IntegridadMensajes
            onBack={home}
            onMonitor={() => onNavigate?.("Monitoreo")}
            onAlert={() => setNotice("Alerta de demostración generada.")}
          />
        ) : (
          <>
            <Title aside="Red industrial simulada" />
            <Stats
              items={[
                { label: "Accesos fallidos (24 h)", value: "18", tone: "amber" },
                { label: "IPs sospechosas", value: "3", tone: "red" },
                { label: "Sensores sin comunicación", value: "1", tone: "amber" },
                { label: "Mensajes alterados", value: "2", tone: "red" },
              ]}
            />
            <div className="cy-cols cy-wide">
              <Panel
                className="cy-flush"
                title={<button className="cy-text-btn" onClick={() => setView("accesos")}>Registro de accesos ›</button>}
              >
                <div className="cy-scroll">
                  <table className="cy-table">
                    <thead>
                      <tr><th>Hora</th><th>Usuario</th><th>IP</th><th>Resultado</th></tr>
                    </thead>
                    <tbody>
                      {exampleLogs.map((x) => (
                        <tr className="cy-row-click" key={x.id} tabIndex={0} onClick={() => openIp(x.ip)} onKeyDown={activar(() => openIp(x.ip))}>
                          <td>{x.time}</td>
                          <td>{x.user}</td>
                          <td>{x.ip}</td>
                          <td><Pill tone={logTone(x.result)}>{x.result}</Pill></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
              <div>
                <Panel title={<button className="cy-text-btn" onClick={() => setView("trafico")}>Tráfico de red industrial (paq./min) ›</button>}>
                  <BarChart umbral={60} />
                </Panel>
                <Panel title="Actividad sospechosa">
                  {incidents.map(([label, level]) => (
                    <div className="cy-activity" key={label}>
                      <button
                        onClick={() =>
                          label.includes("logins") ? setView("accesos")
                            : label.includes("MQTT") ? setView("integridad")
                            : label.includes("señal") ? onNavigate?.("Monitoreo")
                            : setView("trafico")
                        }
                      >
                        {label}
                      </button>
                      <Pill tone={level === "Alta" ? "red" : level === "Media" ? "amber" : "neutral"}>{level}</Pill>
                    </div>
                  ))}
                </Panel>
              </div>
            </div>
            <div className="cy-actions">
              <button onClick={() => setView("accesos")}>Ver registro completo</button>
              <button onClick={() => setView("usuarios")}>Usuarios y roles</button>
              <button onClick={() => setView("integridad")}>Integridad de mensajes</button>
            </div>
          </>
        )}
        {notice && <p role="status" className="cy-muted">{notice}</p>}
      </div>
    </div>
  );
}

const ESTILOS = `
.cy-module{font-family:Arial,Helvetica,sans-serif;color:#393936;width:100%;font-size:17px}
.cy-module *{box-sizing:border-box}
.cy-header{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:30px;flex-wrap:wrap}
.cy-header h1{font-size:27px;font-weight:400;margin:0}
.cy-muted{color:#94938d}
.cy-header .cy-muted{font-size:16px}
.cy-back{font:inherit;color:inherit;background:none;border:none;padding:0;cursor:pointer}
.cy-back:hover{color:#1865ac;text-decoration:underline}
.cy-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px;margin-bottom:30px}
.cy-stat{background:#f6f6f5;padding:19px 21px;min-height:110px;border-radius:11px;display:flex;flex-direction:column;gap:12px}
.cy-stat span{font-size:17px;color:#74736e}
.cy-stat strong{font-size:34px;line-height:1.1;font-weight:400}
.cy-cols{display:grid;gap:24px;margin-bottom:26px}
.cy-wide{grid-template-columns:minmax(0,1.55fr) minmax(310px,1fr)}
.cy-two{grid-template-columns:repeat(2,minmax(0,1fr))}
.cy-panel{border:1px solid #d4d1c8;border-radius:11px;background:#fff;padding:22px 25px 25px;margin-bottom:25px;min-width:0;position:relative}
.cy-cols .cy-panel{margin-bottom:0}
.cy-cols>div>.cy-panel:not(:last-child){margin-bottom:24px}
.cy-panel-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:15px}
.cy-panel h2{font-size:19px;font-weight:400;margin:0}
.cy-flush{padding:0;overflow:hidden}
.cy-flush .cy-panel-head{padding:20px 24px 14px;margin:0}
.cy-flush .cy-table th,.cy-flush .cy-table td{padding:16px 24px}
.cy-scroll{overflow-x:auto}
.cy-table{border-collapse:collapse;width:100%;text-align:left;white-space:nowrap}
.cy-table th{font-weight:400;color:#6d6c66;background:#f5f5f3;font-size:16px}
.cy-table td,.cy-table th{padding:16px 18px;border-bottom:1px solid #d5d3cb}
.cy-table td{font-size:17px}
.cy-row-click{cursor:pointer}
.cy-row-click:hover,.cy-row-click:focus-visible{background:#edf5ff;outline:none}
.cy-selected{background:#e7f3ff}
.cy-pill{display:inline-block;min-width:78px;text-align:center;border-radius:8px;padding:7px 12px;font-size:16px;white-space:nowrap}
.cy-red{background:#fdeaea;color:#b82e2e}
.cy-green{background:#eaf4df;color:#467924}
.cy-amber{background:#fff0da;color:#93550c}
.cy-neutral{background:#f0efe9;color:#6c6b66}
.cy-blue{background:#e7f3ff;color:#1c65ac}
.cy-text-btn{background:none;border:0;color:#1769b9;cursor:pointer;font:inherit;padding:0}
.cy-text-btn:hover{text-decoration:underline}
.cy-sort{background:none;border:0;padding:0;font:inherit;color:inherit;cursor:pointer}
.cy-sort:hover{color:#1769b9}
.cy-sort span{font-size:11px;color:#a5a49e}
.cy-chart{width:100%;height:auto;display:block}
.cy-bars{height:305px;display:flex;justify-content:space-around;align-items:stretch;padding:12px 16px 0;border-bottom:1px solid #bbb9b0;margin-top:14px}
.cy-bar-cell{flex:1;display:flex;align-items:center;justify-content:flex-end;flex-direction:column;gap:8px;min-width:0}
.cy-bar{width:min(60%,48px);min-height:0;border-radius:5px 5px 0 0}
.cy-bar-cell small{font-size:14px;color:#73716c;height:20px}
.cy-activity{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid #d5d3cb;gap:10px}
.cy-activity:last-child{border-bottom:0}
.cy-activity button{border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer;padding:0}
.cy-activity button:hover{color:#1865ac;text-decoration:underline}
.cy-progress{margin:18px 0 26px}
.cy-progress>div:first-child{display:flex;justify-content:space-between;gap:10px;margin-bottom:8px}
.cy-track{height:10px;border-radius:20px;background:#d6d4cc;overflow:hidden}
.cy-track>div{height:100%;border-radius:20px}
.cy-bottom-note{margin-top:55px}
.cy-filters{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:24px}
.cy-filters input,.cy-filters select,.cy-dialog input,.cy-dialog select{font:inherit;border:1px solid #b8b6ac;border-radius:9px;padding:12px 16px;background:#fff;color:#383835;min-width:0}
.cy-filters input{width:315px;max-width:100%}
.cy-filters select{width:170px}
.cy-filters button,.cy-actions button,.cy-pagination button{font:inherit;cursor:pointer;border:1px solid #aaa89f;background:#fff;color:#383835;border-radius:9px;padding:12px 20px}
.cy-filters button:hover:not(:disabled),.cy-actions button:hover:not(:disabled),.cy-pagination button:hover:not(:disabled){background:#eaf3fc}
.cy-filters .cy-export{margin-left:auto}
.cy-filters .cy-primary,.cy-actions .cy-primary{background:#1e62a6;border-color:#1e62a6;color:#fff}
.cy-filters .cy-primary:hover:not(:disabled),.cy-actions .cy-primary:hover:not(:disabled){background:#16518c}
.cy-actions{display:flex;flex-wrap:wrap;gap:20px;margin-top:30px}
.cy-actions button{min-width:180px;flex:0 1 287px}
.cy-actions button:disabled,.cy-pagination button:disabled{opacity:.5;cursor:not-allowed}
.cy-access-panel{padding:0;min-height:400px;overflow:hidden}
.cy-access-panel .cy-pagination{padding:20px 25px}
.cy-pagination{display:flex;align-items:center;justify-content:space-between;gap:18px;color:#74716a;margin-top:auto}
.cy-pagination>div{display:flex;gap:12px}
.cy-info-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:22px;margin:28px 0 40px}
.cy-info-grid>div{display:flex;flex-direction:column;gap:9px;min-width:0;overflow-wrap:anywhere}
.cy-info-grid strong{font-weight:400}
.cy-permissions td:not(:first-child),.cy-permissions th:not(:first-child){text-align:center}
.cy-overlay{position:fixed;z-index:1000;inset:0;background:#0006;display:flex;justify-content:center;align-items:center;padding:20px}
.cy-dialog{background:#fff;border-radius:12px;padding:30px;display:flex;flex-direction:column;gap:18px;width:min(480px,100%)}
.cy-dialog h2{font-size:23px;margin:0}
.cy-dialog label{display:flex;flex-direction:column;gap:8px}
.cy-module button:focus-visible,.cy-module input:focus-visible,.cy-module select:focus-visible,.cy-module tr:focus-visible{outline:3px solid #3989e1;outline-offset:2px}
@media(max-width:1150px){.cy-wide,.cy-two{grid-template-columns:1fr}.cy-stats{grid-template-columns:repeat(2,1fr)}.cy-info-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:640px){.cy-header{align-items:flex-start;flex-direction:column;margin-bottom:20px}.cy-header h1{font-size:23px}.cy-stats{gap:10px}.cy-stat{padding:15px}.cy-stat strong{font-size:28px}.cy-panel{padding:17px}.cy-flush{padding:0}.cy-filters input,.cy-filters select,.cy-filters button{width:100%;margin-left:0!important}.cy-info-grid{grid-template-columns:1fr}.cy-actions button{flex-basis:100%}.cy-pagination{flex-wrap:wrap}}
`;