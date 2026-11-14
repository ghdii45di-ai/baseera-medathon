import {metadataOnly,today,type Case} from './store';
import {transition,type JourneyEvent} from './journey';

export const DEMO_STORAGE_KEY='baseera-public-simulation-v1';
export const SCENARIOS=['unflagged','flagged','unavailable'] as const;
export type Scenario=typeof SCENARIOS[number];
export type DemoState={c:Case;stage:'capture'|'review'|'report';scenario:Scenario|null;reportDate?:string};
export function freshDemo():DemoState{return {c:metadataOnly({id:'SIM-001',date:today(),eyes:['right','left'],notes:'',workflow:{stage:'input',source:'simulation',eye:'right',simulationStep:0,alignment:20,simulationComplete:false}}),stage:'capture',scenario:null};}
export function scenarioId(value:unknown):Scenario|null {
 if(typeof value==='number'&&Number.isInteger(value))return SCENARIOS[value]??null; // v1 saved indices
 return SCENARIOS.includes(value as Scenario)?value as Scenario:null;
}
export function restoreDemo(raw:string|null):DemoState {
 try{
  const value=JSON.parse(raw||'null');
  if(value?.c?.id!=='SIM-001'||!['capture','review','report'].includes(value.stage))return freshDemo();
  const initial=freshDemo();
  const c=metadataOnly({...initial.c,date:/^\d{4}-\d{2}-\d{2}$/.test(value.c.date)?value.c.date:initial.c.date,
   workflow:{...value.c.workflow,source:'simulation',simulationComplete:value.c.workflow?.simulationComplete===true},simulation:false});
  const scenario=scenarioId(value.scenario);
  const stage=!c.workflow!.simulationComplete?'capture':value.stage==='report'&&!scenario?'review':value.stage;
  return {c,scenario,stage,reportDate:stage==='report'?(/^\d{4}-\d{2}-\d{2}$/.test(value.reportDate)?value.reportDate:c.date):undefined};
 }catch{return freshDemo();}
}
export function captureEvent(state:DemoState,event:JourneyEvent):DemoState {
 // The research journey's legacy completion flag must not resurrect a restarted capture.
 const c={...transition({...state.c,simulation:false,simulationEye:undefined},event),simulation:false,simulationEye:undefined};
 if(event.type==='restart-simulation')return {c,stage:'capture',scenario:null};
 return {...state,c,stage:event.type==='simulation-complete'?'review':state.stage};
}
export function openDemoReport(state:DemoState):DemoState {
 return state.scenario&&state.c.workflow?.simulationComplete?{...state,stage:'report',reportDate:today()}:state;
}
