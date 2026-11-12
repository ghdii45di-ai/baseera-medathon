import {useApp} from './context';
import type {Eye} from './store';
import {EyeSelection} from './RetinalVisuals';

export const DEVICE_RENDER='/assets/baseera-glasses-concept-v1.png';
// One shared product concept; anatomical selection uses an explicitly front-facing close-up.
export function Device({active=0,selected,cutaway=true}:{active?:number;selected?:Eye;cutaway?:boolean}){
 const {t}=useApp();
 if(selected)return <div className="device-drawing"><EyeSelection eye={selected}/></div>;
 return <figure className={'product-concept '+(cutaway?'explorable':'')} data-concept="unvalidated-product-geometry"><div className="product-image-wrap"><img className="product-render" src={DEVICE_RENDER} alt={t.productAlt} width="1536" height="1024" decoding="async"/>{cutaway&&<span className={'concept-location location-'+active} aria-hidden="true"><i/></span>}</div>{cutaway&&<figcaption>{t.conceptGeometry}</figcaption>}</figure>;
}
export function Subsystems({active,onChange}:{active:number;onChange:(i:number)=>void}){const {t}=useApp();return <div className="subsystem-explorer"><div className="hotspots" role="group" aria-label={t.detailPanel}>{t.hotspots.map((s,i)=><button key={i} className={active===i?'active':''} aria-pressed={active===i} aria-controls="subsystem-details" onClick={()=>onChange(i)}><span className="hotspot-dot" aria-hidden="true"/>{s}</button>)}</div><div className="subsystem-detail" id="subsystem-details" aria-live="polite"><span className="eyebrow">{t.detailPanel}</span><h3>{t.hotspotHints[active]}</h3><p className="hotspot-copy">{t.hotspotText[active]}</p></div></div>;}
