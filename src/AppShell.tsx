import {PUBLIC_DEMO} from './mode';
import {useCallback,useEffect,useRef,useState,type ReactNode} from 'react';
import {Link,NavLink,useBlocker,useLocation} from 'react-router-dom';
import {ArrowUpRight,Menu,X} from 'lucide-react';
import {transition,type JourneyEvent} from './journey';
import {MODEL_NAME,MODEL_VERSION} from './prediction';
import {copy,type Lang} from './i18n';
import {API,Context,type Health} from './context';
import {loadCases,metadataOnly,STORAGE_KEY,type Case,type Eye,type ImageState,type Review} from './store';

export function AppShell({children}:{children:ReactNode}){
 const [lang,setLang]=useState<Lang>(()=>{try{return localStorage.getItem('baseera-lang')==='ar'?'ar':'en';}catch{return 'en';}});
 const [cases,setCases]=useState(()=>PUBLIC_DEMO?[]:loadCases());const [storageError,setStorageError]=useState(false);const [images,setImages]=useState<Record<string,Partial<Record<Eye,ImageState>>>>({});const [health,setHealth]=useState<Health>({state:'checking',modelReady:false});
 const [menu,setMenu]=useState(false);const location=useLocation();const t=copy[lang];const risks=useRef<Record<string,boolean>>({});const imagesRef=useRef(images);imagesRef.current=images;
 const setRisk=useCallback((key:string,value:boolean)=>{if(value)risks.current[key]=true;else delete risks.current[key];},[]);
 const blocker=useBlocker(({currentLocation,nextLocation})=>(currentLocation.pathname+currentLocation.search)!==(nextLocation.pathname+nextLocation.search)&&Object.values(risks.current).some(Boolean));
 const leaveDialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(blocker.state==='blocked')leaveDialog.current?.showModal();else leaveDialog.current?.close();},[blocker.state]);
 useEffect(()=>{document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';try{localStorage.setItem('baseera-lang',lang);}catch{}},[lang]);
 useEffect(()=>{setMenu(false);if(location.hash){requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());}else window.scrollTo(0,0);},[location.pathname,location.hash]);
 useEffect(()=>{const warn=(event:BeforeUnloadEvent)=>{if(Object.values(risks.current).some(Boolean)||Object.values(imagesRef.current).some(eyes=>Object.keys(eyes).length)){event.preventDefault();event.returnValue='';}};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[]);
 const persist=useCallback((next:Case[])=>{const clean=next.map(metadataOnly);try{localStorage.setItem(STORAGE_KEY,JSON.stringify(clean));setStorageError(false);}catch{setStorageError(true);}return clean;},[]);
 const save=useCallback((next:Case[])=>setCases(persist(next)),[persist]);
 const dispatch=useCallback((id:string,event:JourneyEvent)=>setCases(prev=>persist(prev.map(c=>c.id===id?transition(c,event):c))),[persist]);
 const setReview=useCallback((id:string,eye:Eye,review?:Review)=>setCases(prev=>persist(prev.map(c=>{if(c.id!==id)return c;const reviews={...c.reviews};if(review)reviews[eye]=review;else delete reviews[eye];return {...c,reviews};}))),[persist]);
 const setImage=useCallback((id:string,eye:Eye,image?:ImageState)=>setImages(prev=>{const old=prev[id]?.[eye];if(old?.url&&old.url!==image?.url)URL.revokeObjectURL(old.url);const next={...prev[id]};if(image)next[eye]=image;else delete next[eye];return {...prev,[id]:next};}),[]);
 const healthRequest=useRef(0);
 const refreshHealth=useCallback(async()=>{if(PUBLIC_DEMO){setHealth({state:'connected',modelReady:false,modelState:'disabled_public_demo'});return;}const token=++healthRequest.current;setHealth({state:'checking',modelReady:false});try{const res=await fetch(API+'/health',{signal:AbortSignal.timeout(8000)});const body=await res.json();if(!res.ok||body.ok!==true||body.retention!=='request_only')throw new Error();if(token===healthRequest.current)setHealth({state:'connected',modelReady:body.model?.ready===true&&body.model?.name===MODEL_NAME&&body.model?.version===MODEL_VERSION,modelState:body.model?.state});}catch{if(token===healthRequest.current)setHealth({state:'offline',modelReady:false});}},[]);
 useEffect(()=>{void refreshHealth();return()=>{healthRequest.current++;};},[refreshHealth]);
 useEffect(()=>{if(health.modelState!=='loading')return;const timer=setInterval(()=>void refreshHealth(),3000);return()=>clearInterval(timer);},[health.modelState,refreshHealth]);
 const app=location.pathname.startsWith('/app');
 return <Context.Provider value={{lang,t,cases,save,images,setImage,setReview,dispatch,health,refreshHealth,setRisk}}><a className="skip" href="#main">{t.skip}</a><header><Link className="brand" to="/" aria-label={t.home}><span className="brand-mark"><i/><i/><i/></span>{t.brand}</Link><nav className={menu?'open':''} aria-label={t.menu}>{app?<><NavLink to="/app">{t.cases}</NavLink><NavLink to="/device-demo">{t.explore}</NavLink><NavLink to="/research">{t.research}</NavLink></>:<><Link to="/#solution">{t.solution}</Link><Link to="/#how">{t.how}</Link><NavLink to="/research">{t.research}</NavLink><Link to="/#status">{t.status}</Link></>}</nav><div className="nav-actions"><button className="lang" onClick={()=>setLang(lang==='en'?'ar':'en')} lang={lang==='en'?'ar':'en'}>{lang==='en'?'العربية':'English'}</button><Link className="button nav-cta" to={app?'/app':'/app/start'}>{app?t.back:t.try}<ArrowUpRight size={18}/></Link><button className="menu-toggle icon-button" aria-label={menu?t.close:t.menu} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></div></header>
 {storageError&&<div role="alert" className="notice">{t.storageError}</div>}<main id="main">{children}</main><footer><Link className="footer-brand" to="/">{t.brand}</Link><p>{t.footer}</p><div><span>MEDATHON 2026</span><Link to="/research">{t.references}<ArrowUpRight size={14}/></Link></div><small>{t.context}</small></footer>
 <dialog ref={leaveDialog} aria-labelledby="leave-title" className="leave-dialog no-print" onCancel={e=>{e.preventDefault();if(blocker.state==='blocked')blocker.reset();}}><h2 id="leave-title">{t.formLeave}</h2><p>{t.leaveDetails}</p><div className="actions"><button autoFocus className="button" onClick={()=>{if(blocker.state==='blocked')blocker.reset();}}>{t.stay}</button><button className="button secondary" onClick={()=>{if(blocker.state==='blocked')blocker.proceed();}}>{t.leave}</button></div></dialog></Context.Provider>;
}
