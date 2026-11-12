import {defineConfig,type Plugin} from 'vite';
import react from '@vitejs/plugin-react';
function disablePublicApi():Plugin {
 const guard=(req:{url?:string},res:{writeHead:(code:number,headers:Record<string,string>)=>void;end:(body:string)=>void},next:()=>void)=>{
  if(req.url?.split('?')[0]==='/api'||req.url?.startsWith('/api/')){res.writeHead(403,{'Content-Type':'application/json'});res.end(JSON.stringify({detail:{code:'public_demo_inference_disabled'}}));}else next();
 };
 return {name:'disable-public-research-api',configureServer(server){server.middlewares.use(guard);},configurePreviewServer(server){server.middlewares.use(guard);}};
}
export default defineConfig(({mode})=>{
 const research=mode==='research';
 const proxy=research?{'/api':'http://127.0.0.1:8010'}:undefined;
 return {plugins:[react(),...(!research?[disablePublicApi()]:[])],server:{proxy},preview:{proxy}};
});
