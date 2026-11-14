import {useEffect,useRef,useState} from 'react';

import {ArrowLeft,ArrowRight,Check,FileText,RotateCcw,ScanLine,Upload} from 'lucide-react';
import {useApp,useNavigationRisk} from './context';
import {Device,Subsystems,DEVICE_RENDER} from './Device';
import {EyeRelationship,ImagingCloseup,PreparationVisual} from './RetinalVisuals';
import type {Case,Eye} from './store';
import type {JourneyEvent} from './journey';
import {PUBLIC_DEMO} from './mode';

export function Simulation(){const {t}=useApp();const [hot,setHot]=useState(0);return <div className="page device-education"><p className="eyebrow">{t.noCaseCreated}</p><h1>{t.educationTitle}</h1><p className="lead">{t.educationIntro}</p><div className="device-panel"><Device active={hot}/><Subsystems active={hot} onChange={setHot}/></div><EyeRelationship/></div>;}
export function CaptureSimulation({c,onEvent,onComplete,onBusy}:{c:Case;onEvent:(event:JourneyEvent)=>void;onComplete:()=>void;onBusy:(busy:boolean)=>void}){
 const {t,images}=useApp();const flow=c.workflow!;const step=flow.simulationStep+1;const eye=flow.eye;const align=flow.alignment;const [capturing,setCapturing]=useState(false);const timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 useEffect(()=>{onBusy(capturing);return()=>onBusy(false);},[capturing,onBusy]);
 useNavigationRisk('simulation-capture',capturing);
 const aligned=align>=45&&align<=55;
 const setEye=(eye:Eye)=>onEvent({type:'eye',eye});const setAlign=(alignment:number)=>onEvent({type:'simulation',alignment});
 const restart=()=>{if((Object.keys(c.reviews||{}).length||Object.keys(images[c.id]||{}).length)&&!window.confirm(t.restartPreserves))return;clearTimeout(timer.current);setCapturing(false);onEvent({type:'restart-simulation'});};
 const next=()=>{if(step===4){setCapturing(true);const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;timer.current=setTimeout(()=>{setCapturing(false);onEvent({type:'simulation',step:4});},reduced?100:1000);}else onEvent({type:'simulation',step:flow.simulationStep+1});};
 return <section className="case-simulation"><div className="simulation-toolbar"><span className="badge">{t.demo}</span><button className="text-link" disabled={capturing} onClick={restart}><RotateCcw size={16}/>{t.restart}</button></div>
 <div className="sim-layout"><div className={'sim-visual sim-stage-'+step+(capturing?' capturing':'')} data-stage={step+1}><span className="badge">{t.demo}</span>

 {step===1&&<div className="preparation-visual"><PreparationVisual src={DEVICE_RENDER}/></div>}
 {step===2&&<div className="selection-visual"><Device selected={eye} cutaway={false}/><p><strong>{t.selectionLabel}: {t[eye]}</strong></p></div>}
 {step===3&&<div className="alignment-scene contextual-alignment"><ImagingCloseup position={align}/><div className="alignment-zone-readout"><span>{t.targetZone} <bdi>45–55</bdi></span><strong>{t.position}: <bdi>{align}</bdi></strong></div><p className={aligned?'alignment-feedback aligned':'alignment-feedback'}>{aligned?<Check size={20}/>:<ScanLine size={20}/>} {aligned?t.aligned:t.alignHelp}</p></div>}
 {step===4&&<div className="capture-scene contextual-capture"><ImagingCloseup capture active={capturing}/><p aria-live="polite">{capturing?t.simCapturing:t.compactSteps[3]}</p></div>}
 {step===5&&<div className="handoff-scene"><div className="handoff-icon">{PUBLIC_DEMO?<ScanLine size={40}/>:<Upload size={40}/>}<ArrowRight size={23}/><FileText size={40}/></div><h2>{t.handoffTitle}</h2><p>{t.handoffText}</p><div className="handoff-case"><bdi>{c.id}</bdi><span>{t[eye]}</span></div><span className="badge">{t.captured}</span></div>}
 </div><div className="panel sim-controls"><p className="eyebrow">{t.step} {step} {t.of} 5</p><div className="step-dots">{t.compactSteps.map((s,i)=><span key={i} className={i<step?'active':''} title={s}/>)}</div><h2>{t.compactSteps[step-1]}</h2><p aria-live="polite">{t.simDescriptions[step]}</p>
 {step===2&&<div className="eye-select">{c.eyes.map(e=><button key={e} aria-pressed={e===eye} className={eye===e?'active':''} onClick={()=>setEye(e)}>{t[e]}</button>)}</div>}
 {step===3&&<label>{t.alignment}<input type="range" dir="ltr" min="0" max="100" step="1" value={align} aria-describedby="align-instruction" onChange={e=>setAlign(+e.target.value)}/><small id="align-instruction" aria-live="polite">{aligned?t.aligned:t.alignHelp}</small></label>}
 <div className="actions sim-navigation">{step===5?<button className="button" onClick={onComplete}>{t.reviewNext}<ArrowRight size={17}/></button>:<button className="button" disabled={capturing||(step===3&&!aligned)} onClick={next}>{step===4?t.capture:t.next}<ArrowRight size={17}/></button>}</div></div></div></section>;
}
