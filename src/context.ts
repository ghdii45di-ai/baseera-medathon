import {createContext,useContext,useEffect} from 'react';
import {copy,type Lang} from './i18n';
import type {Case,Eye,ImageState,Review} from './store';
import type {JourneyEvent} from './journey';
export type Health={state:'checking'|'connected'|'offline';modelReady:boolean;modelState?:string};
export const Context=createContext<{
 lang:Lang;t:typeof copy.en;cases:Case[];save:(cases:Case[])=>void;
 images:Record<string,Partial<Record<Eye,ImageState>>>;
 setImage:(id:string,eye:Eye,image?:ImageState)=>void;
 setReview:(id:string,eye:Eye,review?:Review)=>void;
 dispatch:(id:string,event:JourneyEvent)=>void;
 health:Health;refreshHealth:()=>Promise<void>;
 setRisk:(key:string,value:boolean)=>void;
}>(null!);
export const useApp=()=>useContext(Context);
export const API=(import.meta as unknown as {env:Record<string,string>}).env.VITE_API_BASE||'/api';
export function useNavigationRisk(key:string,active:boolean){const {setRisk}=useApp();useEffect(()=>{setRisk(key,active);return()=>setRisk(key,false);},[key,active,setRisk]);}
