import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {useLocation} from 'react-router-dom';
import {CaptureSimulation} from './Simulation';
import {useApp} from './context';
import {demoCopy} from './demo-copy';
import type {Eye} from './store';
import type {JourneyEvent} from './journey';
import {FundusVisual} from './RetinalVisuals';
import {DEMO_STORAGE_KEY,SCENARIOS,captureEvent,freshDemo,openDemoReport,savedDemo} from './public-demo-state';

function readSaved(){try{return savedDemo(localStorage.getItem(DEMO_STORAGE_KEY));}catch{return savedDemo(null);}}
export function PublicDemo(){
 const {lang,t}=useApp();const d=demoCopy[lang];const location=useLocation();const [saved,setSaved]=useState(readSaved);const [state,setState]=useState(()=>saved.state);const [choosing,setChoosing]=useState(()=>saved.exists);const [storageError,setStorageError]=useState(false);const [busy,setBusy]=useState(false);const [focusVersion,setFocusVersion]=useState(0);const heading=useRef<HTMLHeadingElement>(null);const entryKey=useRef(location.key);
 useLayoutEffect(()=>{if(entryKey.current===location.key)return;entryKey.current=location.key;const progress=readSaved();setSaved(progress);setState(progress.state);setChoosing(progress.exists);},[location.key]);
 useEffect(()=>{if(choosing)return;try{localStorage.setItem(DEMO_STORAGE_KEY,JSON.stringify(state));setStorageError(false);}catch{setStorageError(true);}},[state,choosing]);
 useEffect(()=>{const frame=requestAnimationFrame(()=>{heading.current?.focus({preventScroll:true});heading.current?.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});return()=>cancelAnimationFrame(frame);},[choosing,state.stage,state.c.workflow!.simulationStep,focusVersion]);
 const event=(e:JourneyEvent)=>{setState(s=>captureEvent(s,e));if(e.type==='restart-simulation')setFocusVersion(v=>v+1);};
 const startNew=()=>{setState(freshDemo());setChoosing(false);setFocusVersion(v=>v+1);};
 const moveStage=(stage:'capture'|'review'|'report')=>{setState(s=>stage==='report'?openDemoReport(s):{...s,stage});setFocusVersion(v=>v+1);};
 const report=state.scenario?d.reports[state.scenario]:null;
 const illustration=<div className="demo-illustration"><FundusVisual caption={d.illustrationLabel}/><p>{d.illustrationHelp}</p></div>;
 const secondaryActions=<><button className="text-link" onClick={()=>moveStage('capture')}>{d.back}</button><button className="text-link" onClick={startNew}>{d.restart}</button></>;
 return <div className="page public-demo"><p className="eyebrow no-print">{d.title}</p><h1 ref={heading} tabIndex={-1} className="no-print demo-step-heading">{choosing?d.entryTitle:state.stage==='capture'?t.compactSteps[state.c.workflow!.simulationStep]:state.stage==='review'?d.review:d.report}</h1>{(choosing||state.stage!=='report')&&<p className="notice demo-disclosure">{d.notice}</p>}{storageError&&<p role="alert" className="error">{d.storage}</p>}
 {choosing?<section className="panel saved-demo-choice"><h2>{d.entryIntro}</h2><p>{saved.canResume?d.savedChoice:d.invalidSaved}</p><div className="actions"><button className="button" disabled={!saved.canResume} onClick={()=>{setState(saved.state);setChoosing(false);}}>{d.resume}</button><button className="button secondary" onClick={startNew}>{d.restart}</button></div></section>:<>
 <ol className="workflow-progress no-print">{[d.capture,d.review,d.report].map((label,i)=><li key={label} aria-current={['capture','review','report'][i]===state.stage?'step':undefined}><button disabled={busy||(i>0&&!state.c.workflow!.simulationComplete)||(i===2&&!state.scenario)} onClick={()=>moveStage(i===0?'capture':i===1?'review':'report')}>{i+1} · {label}</button></li>)}</ol>
 {state.stage==='capture'&&<CaptureSimulation c={state.c} onEvent={event} onBusy={setBusy} onComplete={()=>event({type:'simulation-complete'})} onPrevious={()=>event({type:'simulation',step:state.c.workflow!.simulationStep-1})} onStartNew={startNew} startNewLabel={d.restart}/>}
 {state.stage==='review'&&<section className="panel demo-review"><div className="demo-review-layout">{illustration}<div><h2>{d.done}</h2><label className="demo-eye">{d.eye}<select value={state.c.workflow!.eye} onChange={e=>event({type:'eye',eye:e.target.value as Eye})}>{state.c.eyes.map(eye=><option key={eye} value={eye}>{t[eye]}</option>)}</select></label><fieldset><legend>{d.scenario}</legend>{SCENARIOS.map(id=><label className="checkbox scenario-option" key={id}><input type="radio" name="scenario" checked={state.scenario===id} onChange={()=>setState(s=>({...s,scenario:id}))}/><span><strong>{d.reports[id].title}</strong><small>{d.reports[id].preview}</small></span></label>)}</fieldset><div className="actions"><button className="button" disabled={!state.scenario} onClick={()=>setState(openDemoReport)}>{d.next}</button>{secondaryActions}</div></div></div></section>}
 {state.stage==='report'&&report&&<section className="panel simulation-report" data-scenario={state.scenario}>
  <div className="report-outcome-heading"><span className="badge simulation-label">{d.predefined}</span><p className="eyebrow">{d.report}</p><h2 className="demo-outcome">{report.title}</h2><p className="scenario-explanation">{report.explanation}</p></div>
  <dl className="demo-report-meta"><div><dt>{d.case}</dt><dd><bdi>{state.c.id}</bdi></dd></div><div><dt>{d.eye}</dt><dd>{t[state.c.workflow!.eye]}</dd></div><div><dt>{d.date}</dt><dd><bdi>{state.reportDate}</bdi></dd></div><div><dt>{d.scenario}</dt><dd>{report.title}</dd></div></dl>
  <section className="demo-next-step"><h3>{d.nextStep}</h3><p>{report.nextStep}</p>{state.scenario==='unavailable'&&<button className="button secondary no-print" onClick={()=>event({type:'restart-simulation'})}>{d.retry}</button>}</section>
  <section className="demo-limitations"><p className="report-disclosure">{d.reportDisclosure}</p></section>
  <div className="actions no-print"><button className="button" onClick={()=>window.print()}>{d.print}</button><button className="button secondary" onClick={()=>moveStage('review')}>{d.changeScenario}</button>{secondaryActions}</div>
 </section>}
 </>}<p className="retention-note no-print">{d.saved}</p></div>;
}
