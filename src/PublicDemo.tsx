import {useEffect,useState} from 'react';
import {CaptureSimulation} from './Simulation';
import {useApp} from './context';
import {demoCopy} from './demo-copy';
import type {Eye} from './store';
import type {JourneyEvent} from './journey';
import {FundusVisual} from './RetinalVisuals';
import {DEMO_STORAGE_KEY,SCENARIOS,captureEvent,freshDemo,openDemoReport,restoreDemo} from './public-demo-state';

function restore(){try{return restoreDemo(localStorage.getItem(DEMO_STORAGE_KEY));}catch{return freshDemo();}}
export function PublicDemo(){
 const {lang,t}=useApp();const d=demoCopy[lang];const [state,setState]=useState(restore);const [storageError,setStorageError]=useState(false);const [busy,setBusy]=useState(false);
 useEffect(()=>{try{localStorage.setItem(DEMO_STORAGE_KEY,JSON.stringify(state));setStorageError(false);}catch{setStorageError(true);}},[state]);
 const event=(e:JourneyEvent)=>setState(s=>captureEvent(s,e));
 const report=state.scenario?d.reports[state.scenario]:null;
 const illustration=<div className="demo-illustration"><FundusVisual caption={d.illustrationLabel}/><p>{d.illustrationHelp}</p></div>;
 return <div className="page public-demo"><p className="eyebrow no-print">{d.title}</p><h1 className="no-print">{state.stage==='capture'?d.capture:state.stage==='review'?d.review:d.report}</h1>{state.stage!=='report'&&<p className="notice demo-disclosure">{d.notice}</p>}{storageError&&<p role="alert" className="error">{d.storage}</p>}
 <ol className="workflow-progress no-print">{[d.capture,d.review,d.report].map((label,i)=><li key={label} aria-current={['capture','review','report'][i]===state.stage?'step':undefined}><button disabled={busy||(i>0&&!state.c.workflow!.simulationComplete)||(i===2&&!state.scenario)} onClick={()=>setState(s=>i===2?openDemoReport(s):{...s,stage:i===0?'capture':'review'})}>{i+1} · {label}</button></li>)}</ol>
 {state.stage==='capture'&&<><p>{d.intro}</p><CaptureSimulation c={state.c} onEvent={event} onBusy={setBusy} onComplete={()=>event({type:'simulation-complete'})}/><div className="actions">{state.c.workflow!.simulationStep>0&&<button className="button secondary" disabled={busy} onClick={()=>event({type:'simulation',step:state.c.workflow!.simulationStep-1})}>{t.previous}</button>}</div></>}
 {state.stage==='review'&&<section className="panel demo-review"><div className="demo-review-layout">{illustration}<div><h2>{d.done}</h2><label className="demo-eye">{d.eye}<select value={state.c.workflow!.eye} onChange={e=>event({type:'eye',eye:e.target.value as Eye})}>{state.c.eyes.map(eye=><option key={eye} value={eye}>{t[eye]}</option>)}</select></label><fieldset><legend>{d.scenario}</legend>{SCENARIOS.map(id=><label className="checkbox scenario-option" key={id}><input type="radio" name="scenario" checked={state.scenario===id} onChange={()=>setState(s=>({...s,scenario:id}))}/><span><strong>{d.reports[id].title}</strong><small>{d.reports[id].preview}</small></span></label>)}</fieldset><p className="demo-provenance">{d.provenance}</p><button className="button" disabled={!state.scenario} onClick={()=>setState(openDemoReport)}>{d.next}</button></div></div></section>}
 {state.stage==='report'&&report&&<section className="panel simulation-report" data-scenario={state.scenario}>
  <div className="report-outcome-heading"><span className="badge simulation-label">{d.predefined}</span><p className="eyebrow">{d.report}</p><h2 className="demo-outcome">{report.title}</h2><p className="scenario-explanation">{report.explanation}</p></div>
  <dl className="demo-report-meta"><div><dt>{d.case}</dt><dd><bdi>{state.c.id}</bdi></dd></div><div><dt>{d.eye}</dt><dd>{t[state.c.workflow!.eye]}</dd></div><div><dt>{d.date}</dt><dd><bdi>{state.reportDate}</bdi></dd></div><div><dt>{d.scenario}</dt><dd>{report.title}</dd></div></dl>
  <section className="demo-next-step"><h3>{d.nextStep}</h3><p>{report.nextStep}</p>{state.scenario==='unavailable'&&<button className="button secondary no-print" onClick={()=>event({type:'restart-simulation'})}>{d.retry}</button>}</section>
  <section className="demo-limitations"><h3>{d.boundaries}</h3><p>{d.provenance}</p><p>{d.limits}</p></section>
  <div className="actions no-print"><button className="button" onClick={()=>window.print()}>{d.print}</button><button className="button secondary" onClick={()=>setState(s=>({...s,stage:'review'}))}>{d.changeScenario}</button></div>
 </section>}
 <div className="actions no-print">{state.stage!=='capture'&&<button className="text-link" onClick={()=>setState(s=>({...s,stage:'capture'}))}>{d.back}</button>}<button className="text-link" disabled={busy} onClick={()=>setState(freshDemo())}>{d.restart}</button></div><p className="retention-note no-print">{d.saved}</p></div>;
}
