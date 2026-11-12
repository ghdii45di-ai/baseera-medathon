import {useEffect,useState} from 'react';
import {CaptureSimulation} from './Simulation';
import {useApp} from './context';
import {demoCopy} from './demo-copy';
import {metadataOnly,today,type Case} from './store';
import {transition,type JourneyEvent} from './journey';

const KEY='baseera-public-simulation-v1';
type Demo={c:Case;stage:'capture'|'review'|'report';scenario:number|null};
function fresh():Demo{return {c:metadataOnly({id:'SIM-001',date:today(),eyes:['right','left'],notes:'',workflow:{stage:'input',source:'simulation',eye:'right',simulationStep:0,alignment:20,simulationComplete:false}}),stage:'capture',scenario:null};}
function restore():Demo{try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(d?.c?.id==='SIM-001'&&['capture','review','report'].includes(d.stage)){const c=metadataOnly({...d.c,reviews:{},notes:''});const scenario=Number.isInteger(d.scenario)&&d.scenario>=0&&d.scenario<3?d.scenario:null;return {c,scenario,stage:!c.workflow?.simulationComplete?'capture':d.stage==='report'&&scenario===null?'review':d.stage};}}catch{}return fresh();}
export function PublicDemo(){
 const {lang,t}=useApp();const d=demoCopy[lang];const [state,setState]=useState(restore);const [storageError,setStorageError]=useState(false);const [busy,setBusy]=useState(false);
 useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(state));setStorageError(false);}catch{setStorageError(true);}},[state]);
 const event=(e:JourneyEvent)=>setState(s=>({...s,c:transition(s.c,e)}));
 return <div className="page public-demo"><p className="eyebrow">{d.title}</p><h1>{state.stage==='capture'?d.capture:state.stage==='review'?d.review:d.report}</h1><p className="notice demo-disclosure">{d.notice}</p>{storageError&&<p role="alert" className="error">{d.storage}</p>}
 <ol className="workflow-progress no-print">{[d.capture,d.review,d.report].map((label,i)=><li key={label} aria-current={['capture','review','report'][i]===state.stage?'step':undefined}>{i+1} · {label}</li>)}</ol>
 {state.stage==='capture'&&<><p>{d.intro}</p><CaptureSimulation c={state.c} onEvent={event} onBusy={setBusy} onComplete={()=>setState(s=>({...s,c:transition(s.c,{type:'simulation-complete'}),stage:'review',scenario:null}))}/></>}
 {state.stage==='review'&&<section className="panel demo-review"><h2>{d.done}</h2><p>{d.provenance}</p><fieldset><legend>{d.scenario}</legend>{d.scenarios.map((label,i)=><label className="checkbox" key={label}><input type="radio" name="scenario" checked={state.scenario===i} onChange={()=>setState(s=>({...s,scenario:i}))}/>{label}</label>)}</fieldset><p>{d.checks}</p><p>{d.inference}</p><button className="button" disabled={state.scenario===null} onClick={()=>setState(s=>({...s,stage:'report'}))}>{d.next}</button></section>}
 {state.stage==='report'&&state.scenario!==null&&<section className="panel simulation-report"><h2>{d.report} · <bdi>SIM-001</bdi></h2><p className="notice">{d.notice}</p><dl><div><dt>{d.case}</dt><dd><bdi>SIM-001</bdi></dd></div><div><dt>{d.date}</dt><dd><bdi>{state.c.date}</bdi></dd></div><div><dt>{d.eye}</dt><dd>{t[state.c.workflow!.eye]}</dd></div></dl><h3>{d.scenarios[state.scenario]}</h3><p className="demo-outcome">{d.outcomes[state.scenario]}</p><p>{d.provenance}</p><p>{d.done}</p><p>{d.checks}</p><p>{d.quality}</p><p>{d.inference}</p><button className="button no-print" onClick={()=>window.print()}>{d.print}</button><button className="button secondary no-print" onClick={()=>setState(s=>({...s,stage:'review'}))}>{d.review}</button></section>}
 <div className="actions no-print">{state.stage!=='capture'&&<button className="text-link" onClick={()=>setState(s=>({...s,stage:'capture'}))}>{d.back}</button>}<button className="text-link" disabled={busy} onClick={()=>setState(fresh())}>{d.restart}</button></div><p className="retention-note no-print">{d.saved}</p></div>;
}
