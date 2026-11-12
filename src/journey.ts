import {metadataOnly,nextId,today,type Case,type Eye,type Stage} from './store';
export const ACTIVE_CASE='baseera-active-case';
let memoryActive='';
export const stages:Stage[]=['source','input','review','report'];
export type JourneyEvent=
 | {type:'source';source:'upload'|'simulation'}
 | {type:'stage';stage:Stage}
 | {type:'eye';eye:Eye}
 | {type:'simulation';step?:number;alignment?:number}
 | {type:'simulation-complete'}
 | {type:'restart-simulation'};
export function canReport(c:Case){return c.eyes.some(e=>!!c.reviews?.[e]);}
export function transition(original:Case,event:JourneyEvent):Case {
 const c=metadataOnly(original);const flow={...c.workflow!};
 switch(event.type){
 case 'source': flow.source=event.source;flow.stage='input';break;
 case 'stage': flow.stage=event.stage==='report'&&!canReport(c)?'review':event.stage==='input'&&!flow.source?'source':event.stage;break;
 case 'eye': if(c.eyes.includes(event.eye))flow.eye=event.eye;break;
 case 'simulation': if(event.step!==undefined)flow.simulationStep=Math.max(0,Math.min(4,event.step));if(event.alignment!==undefined)flow.alignment=Math.max(0,Math.min(100,event.alignment));break;
 case 'restart-simulation': flow.simulationStep=0;flow.alignment=20;flow.simulationComplete=false;break;
 case 'simulation-complete':flow.stage='review';flow.simulationComplete=true;c.simulation=true;c.simulationEye=flow.eye;break;
 }
 return {...c,workflow:flow};
}
export function newExperience(cases:Case[]):Case{return metadataOnly({id:nextId(cases),date:today(),eyes:['right','left'],notes:''});}
export function rememberCase(id:string){memoryActive=id;try{localStorage.setItem(ACTIVE_CASE,id);}catch{/* Context still retains the case if storage is unavailable. */}}
export function activeCase(cases:Case[]){try{return cases.find(c=>c.id===(localStorage.getItem(ACTIVE_CASE)||memoryActive));}catch{return cases.find(c=>c.id===memoryActive);}}
