import {ArrowUpRight} from 'lucide-react';
import {useApp} from './context';
import {publicSiteCopy} from './public-site-copy';

export function PublicProgress(){
 const {lang,t}=useApp();const p=publicSiteCopy[lang];
 const references=[
  [t.anatomyReference,'https://www.nei.nih.gov/eye-health-information/healthy-vision/how-eyes-work'],
  ['IDRiD','https://idrid.grand-challenge.org/Data/'],
  ['APTOS 2019','https://www.kaggle.com/competitions/aptos2019-blindness-detection/data'],
  ['Messidor','https://www.adcis.net/en/third-party/messidor/'],
 ];
 return <div className="page research-page public-progress"><p className="eyebrow">{p.progressLabel}</p><h1>{p.progressTitle}</h1><p className="lead">{p.progressIntro}</p>
  <div className="status-grid">{p.progressHeadings.map((heading,i)=><article key={heading}><h2>{heading}</h2><p>{[p.now,p.limitations,p.next][i]}</p></article>)}</div>
  <section><h2>{p.pathwayTitle}</h2><p>{p.pathway}</p></section>
  <section><h2>{p.datasetTitle}</h2><p>{p.datasets}</p></section>
  <section><h2>{p.sourcesTitle}</h2><div className="references">{references.map(([label,url])=><a key={url} href={url} target="_blank" rel="noreferrer"><bdi>{label}</bdi><ArrowUpRight size={16}/></a>)}</div></section>
  <section><h2>{p.creditsTitle}</h2><p>{p.credits}</p></section>
 </div>;
}
