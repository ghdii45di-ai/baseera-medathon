// Package only the verified static simulation; never upload the workspace.
import {mkdir,readFile,readdir,copyFile,writeFile,unlink} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
const output=path.resolve(root,'.vercel/output');
if(!output.startsWith(path.resolve(root,'.vercel')+path.sep))throw new Error('Unexpected output path');
const walk=async(dir)=>{const entries=await readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(async e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]))).flat();};
const files=await walk(path.join(root,'dist'));
const allowed=/^(index\.html|api-disabled\.json|_redirects|assets\/(index-[\w-]+\.(js|css)|baseera-glasses-concept-v1\.png))$/;
for(const file of files){const relative=path.relative(path.join(root,'dist'),file).split(path.sep).join('/');if(!allowed.test(relative))throw new Error(`Unexpected public file: ${relative}`);}
const html=await readFile(path.join(root,'dist/index.html'),'utf8');
if(!html.includes('Interactive simulation'))throw new Error('Not the expected public simulation build');
await mkdir(path.join(output,'static/assets'),{recursive:true});
for(const file of files){const relative=path.relative(path.join(root,'dist'),file);if(relative==='_redirects')continue;await copyFile(file,path.join(output,'static',relative));}
const config={version:3,routes:[
 {src:'/api(?:/.*)?',dest:'/api-disabled.json',status:403,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}},
 {handle:'filesystem'},
 {src:'/(?:app(?:/.*)?|research/?|device-demo/?)',dest:'/index.html'},
]};
await writeFile(path.join(output,'config.json'),JSON.stringify(config,null,2)+'\n');
const packaged=await walk(output);
if(packaged.some(p=>p!==path.join(output,'config.json')&&!allowed.test(path.relative(path.join(output,'static'),p).split(path.sep).join('/'))))throw new Error('Unexpected output artifact');
const wanted=new Set([path.join(output,'config.json'),...files.filter(p=>path.basename(p)!=='_redirects').map(p=>path.join(output,'static',path.relative(path.join(root,'dist'),p)))]);
for(const file of packaged)if(!wanted.has(file))await unlink(file);
console.log(`Prepared ${wanted.size} static-only deployment files. No functions, weights, photographs or workspace files.`);
