import {isPrediction,type Prediction} from './prediction';
export type Eye = 'right' | 'left';
export type Review = {checks:Checks; source:'upload';assessment?:'pending'|'failed';prediction?:Prediction};
export type Stage='source'|'input'|'review'|'report';
export type Workflow={stage:Stage;source?:'upload'|'simulation';eye:Eye;simulationStep:number;alignment:number;simulationComplete:boolean};
export type Case = {id:string; date:string; eyes:Eye[]; notes:string; simulation?:boolean; simulationEye?:Eye; reviews?:Partial<Record<Eye,Review>>;workflow?:Workflow};
export type Checks = {width:number;height:number;brightness:number;sharpness:number;method:string;checked_at:string};
export type ImageState = {file:File;url:string;checks?:Checks;prediction?:Prediction;error?:string;busy?:boolean;analysis?:'unavailable'|'failed';requestedAt?:string};
export const STORAGE_KEY = 'baseera-cases-v1';
export function isChecks(v:unknown):v is Checks {
 const c=v as Checks|undefined;
 return !!c && [c.width,c.height,c.brightness,c.sharpness].every(n=>typeof n==='number'&&Number.isFinite(n)) && c.width>=128 && c.height>=128 && c.width<=8000 && c.height<=8000 && c.brightness>=0 && c.brightness<=255 && c.sharpness>=0 && typeof c.method==='string' && typeof c.checked_at==='string' && Number.isFinite(Date.parse(c.checked_at));
}
export function metadataOnly(c:Case):Case {
 const reviews:Case['reviews']={};
 for(const eye of ['right','left'] as Eye[]){const r=c.reviews?.[eye];if(r?.source==='upload'&&isChecks(r.checks)){const {width,height,brightness,sharpness,method,checked_at}=r.checks;const p=r.prediction;reviews[eye]={source:'upload',...(r.assessment==='pending'||r.assessment==='failed'?{assessment:r.assessment}:{}),checks:{width,height,brightness,sharpness,method,checked_at},...(isPrediction(p)?{prediction:{kind:p.kind,grade:p.grade,class_name:p.class_name,model_name:p.model_name,model_version:p.model_version,task:p.task,analysis_at:p.analysis_at,inference_ms:p.inference_ms,input_sha256:p.input_sha256,calibrated:false,clinically_validated:false}}:{})};}}
 const raw=c.workflow;
 const hasReviews=Object.keys(reviews).length>0;
 const source=raw?.source==='upload'||raw?.source==='simulation'?raw.source:c.simulation?'simulation':hasReviews?'upload':undefined;
 const stage:Stage=raw&&['source','input','review','report'].includes(raw.stage)?raw.stage:hasReviews?'review':'source';
 const workflow:Workflow={stage:stage==='report'&&!hasReviews?'review':stage==='input'&&!source?'source':stage,source,eye:raw?.eye==='left'&&c.eyes.includes('left')?'left':raw?.eye==='right'&&c.eyes.includes('right')?'right':c.simulationEye&&c.eyes.includes(c.simulationEye)?c.simulationEye:c.eyes[0],simulationStep:Math.max(0,Math.min(4,Number.isInteger(raw?.simulationStep)?raw!.simulationStep:0)),alignment:Number.isFinite(raw?.alignment)?Math.max(0,Math.min(100,raw!.alignment)):20,simulationComplete:!!(raw?.simulationComplete||c.simulation)};
 return {id:c.id,date:c.date,eyes:[...new Set(c.eyes)],notes:c.notes,simulation:!!c.simulation,simulationEye:c.simulationEye==='left'?'left':c.simulationEye==='right'?'right':undefined,reviews,workflow};
}
export function loadCases():Case[] {
  try { const value:unknown = JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
    return Array.isArray(value) ? value.filter((c):c is Case => c && /^[A-Za-z0-9-]{3,32}$/.test(c.id) && typeof c.date==='string' && Array.isArray(c.eyes) && c.eyes.length>0 && c.eyes.every((e:unknown)=> e==='right'||e==='left') && typeof c.notes==='string').map(metadataOnly) : [];
  } catch { return []; }
}
export function today(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Riyadh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
export function nextId(cases:Case[],prefix='DEMO'){let n=1;while(cases.some(c=>c.id.toUpperCase()===`${prefix}-${String(n).padStart(3,'0')}`))n++;return `${prefix}-${String(n).padStart(3,'0')}`;}
export function validId(id:string,cases:Case[]) {return /^[A-Za-z0-9-]{3,32}$/.test(id) && !cases.some(c=>c.id.toLowerCase()===id.toLowerCase());}
export function caseStatus(images:Partial<Record<Eye,ImageState>>) {
  const values=Object.values(images);
  if(values.some(i=>i.analysis==='failed')) return 'failed';
  if(values.some(i=>i.analysis==='unavailable')) return 'unavailable';
  return values.length ? 'images' : 'draft';
}
export function fileError(file:File) {return file.size>10*1024*1024 ? 'too_large' : undefined;}
