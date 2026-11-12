import {test,expect} from '@playwright/test';
import {readFileSync,readdirSync} from 'node:fs';
const labels={en:{start:'Try the simulation',review:'Continue to demonstration review',next:'View demonstration result',report:'Simulation report',print:'Print / Save PDF',choose:'Choose a demonstration scenario',back:'Back to simulated capture'},ar:{start:'جرّب المحاكاة',review:'الانتقال إلى المراجعة التوضيحية',next:'عرض النتيجة التوضيحية',report:'تقرير المحاكاة',print:'طباعة / حفظ PDF',choose:'اختر سيناريو توضيحيًا',back:'العودة إلى الالتقاط المُحاكى'}};
for(const lang of ['en','ar'] as const)test(`${lang}: public simulation, all predefined outcomes, report, persistence and zero inference`,async({page})=>{
 const api:string[]=[];const errors:string[]=[];page.on('request',r=>{if(r.url().includes('/api/'))api.push(r.url());});page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 // Seed a historical research record: public mode must neither display nor overwrite it.
 await page.evaluate(()=>localStorage.setItem('baseera-cases-v1',JSON.stringify([{id:'RESEARCH-KEEP',date:'2026-11-13',eyes:['right'],notes:'preserve'}])));
 if(lang==='ar')await page.getByRole('button',{name:'العربية',exact:true}).click();
 await page.getByRole('link',{name:labels[lang].start,exact:true}).first().click();await expect(page.locator('.public-demo')).toBeVisible();await expect(page.locator('input[type=file]')).toHaveCount(0);
 await page.getByRole('button',{name:lang==='en'?'Continue':'متابعة',exact:true}).click();await page.getByRole('button',{name:lang==='en'?'Left eye':'العين اليسرى',exact:true}).click();await page.getByRole('button',{name:lang==='en'?'Continue':'متابعة',exact:true}).click();await page.getByRole('slider').fill('50');await page.getByRole('button',{name:lang==='en'?'Continue':'متابعة',exact:true}).click();await page.getByRole('button',{name:lang==='en'?'Simulate capture':'محاكاة التصوير',exact:true}).click();await page.getByRole('button',{name:labels[lang].review,exact:true}).click();await expect(page.getByRole('button',{name:labels[lang].next,exact:true})).toBeDisabled();
 for(let i=0;i<3;i++){
  await page.getByRole('radio').nth(i).check();await page.getByRole('button',{name:labels[lang].next,exact:true}).click();await expect(page.locator('.simulation-report')).toContainText(lang==='en'?'predefined demonstration scenario':'سيناريو توضيحي محدد مسبقًا');await expect(page.locator('.simulation-report')).toContainText(lang==='en'?'not run':'لم تُجرَ');await expect(page.locator('.simulation-report')).toContainText(lang==='en'?'disabled':'معطّل');await expect(page.locator('.simulation-report')).toContainText(lang==='en'?'Left eye':'العين اليسرى');
  for(const width of [390,1440]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
  if(i===2){await expect(page.locator('.demo-outcome')).toContainText(lang==='en'?'No result or reassurance':'لا يمكن تقديم نتيجة أو طمأنة');await page.screenshot({path:`test-results/simulation-${lang}.png`,fullPage:true});await page.emulateMedia({media:'print'});await expect(page.locator('.simulation-report .notice')).toBeVisible();await expect(page.getByRole('button',{name:labels[lang].print,exact:true})).toBeHidden();await page.pdf({path:`test-results/simulation-${lang}.pdf`,format:'A4'});await page.emulateMedia({media:'screen'});await page.reload();await expect(page.locator('.demo-outcome')).toBeVisible();}
  if(i<2)await page.getByRole('button',{name:labels[lang].choose,exact:true}).click();
 }
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('baseera-cases-v1')!)[0].id)).toBe('RESEARCH-KEEP');expect(api).toEqual([]);expect(errors).toEqual([]);
 await page.goto('/research');await expect(page.locator('.evaluation')).toContainText(lang==='en'?'two HRF DR-group':'صورتا مجموعة الاعتلال السكري');expect(api).toEqual([]);
});
test('public build contains no weights, research photographs or evaluation artifacts',async()=>{
 const walk=(dir:string):string[]=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(`${dir}/${e.name}`):[`${dir}/${e.name}`]);
 const files=walk('dist');expect(files.some(f=>/\.(keras|h5|pth|pt|tif|zip)$|retinal-results|retinal-inputs|normal-left|01_dr|02_dr|01_h|02_h/.test(f))).toBe(false);expect(readFileSync('dist/_redirects','utf8')).toContain('/api/*');
});
test('public host refuses inference rather than proxying to local research',async({request})=>{
 const response=await request.post('/api/analyze',{multipart:{file:{name:'not-a-retina.png',mimeType:'image/png',buffer:Buffer.from('invalid')}}});
 expect(response.status()).toBe(403);const body=await response.json();expect(body).toMatchObject({detail:{code:'public_demo_inference_disabled'}});expect(body).not.toHaveProperty('grade');expect(body).not.toHaveProperty('prediction');
});
