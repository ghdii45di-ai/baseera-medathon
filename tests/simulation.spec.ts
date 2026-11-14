import {test,expect,type Page} from '@playwright/test';
import {readFileSync,readdirSync} from 'node:fs';
import {demoCopy} from '../src/demo-copy';
import {SCENARIOS,DEMO_STORAGE_KEY} from '../src/public-demo-state';
const labels={en:{start:'Try the simulation',continue:'Continue',capture:'Simulate capture',handoff:'Continue to scenario selection',previous:'Previous',eyes:{right:'Right eye',left:'Left eye'}},ar:{start:'جرّب المحاكاة',continue:'متابعة',capture:'محاكاة التصوير',handoff:'الانتقال إلى اختيار السيناريو',previous:'السابق',eyes:{right:'العين اليمنى',left:'العين اليسرى'}}};
async function finishCapture(page:Page,lang:'en'|'ar',eye:'right'|'left'){
 const l=labels[lang];await page.getByRole('button',{name:l.continue,exact:true}).click();await page.getByRole('button',{name:l.eyes[eye],exact:true}).click();await page.getByRole('button',{name:l.continue,exact:true}).click();await expect(page.getByText('45–55',{exact:true})).toBeVisible();await expect(page.locator('.public-demo')).not.toContainText('45?55');await page.getByRole('slider').fill('50');await page.getByRole('button',{name:l.continue,exact:true}).click();await page.getByRole('button',{name:l.capture,exact:true}).click();await page.getByRole('button',{name:l.handoff,exact:true}).click();
}
for(const lang of ['en','ar'] as const)for(const eye of ['right','left'] as const)test(`${lang}/${eye}: distinct reports, switching, back, retry, restart, restoration and print`,async({page})=>{
 const d=demoCopy[lang],l=labels[lang];const api:string[]=[],errors:string[]=[];page.on('request',r=>{if(r.url().includes('/api/'))api.push(r.url());});page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await page.evaluate(()=>localStorage.setItem('baseera-cases-v1',JSON.stringify([{id:'RESEARCH-KEEP',date:'2026-11-13',eyes:['right'],notes:'preserve'}])));
 if(lang==='ar')await page.getByRole('button',{name:'العربية',exact:true}).click();await page.getByRole('link',{name:l.start,exact:true}).first().click();await expect(page.locator('input[type=file]')).toHaveCount(0);await finishCapture(page,lang,eye);
 await expect(page.getByRole('button',{name:d.next,exact:true})).toBeDisabled();await expect(page.locator('.demo-illustration figcaption')).toHaveText(d.illustrationLabel);await expect(page.locator('.demo-eye select')).toHaveValue(eye);
 const contents:string[]=[];
 for(const [index,id] of SCENARIOS.entries()){
  await page.getByRole('radio').nth(index).check();await page.getByRole('button',{name:d.next,exact:true}).click();const report=page.locator('.simulation-report');
  await expect(report).toHaveAttribute('data-scenario',id);await expect(report.locator('.demo-outcome')).toHaveText(d.reports[id].title);await expect(report.locator('.scenario-explanation')).toHaveText(d.reports[id].explanation);await expect(report.locator('.demo-next-step p')).toHaveText(d.reports[id].nextStep);
  for(const other of SCENARIOS.filter(s=>s!==id)){await expect(report).not.toContainText(d.reports[other].explanation);await expect(report).not.toContainText(d.reports[other].nextStep);}
  await expect(report.locator('.simulation-label')).toHaveText(d.predefined);await expect(report.locator('.demo-report-meta')).toContainText(l.eyes[eye]);await expect(report.locator('.demo-report-meta')).toContainText('SIM-001');await expect(report.locator('.demo-report-meta')).toContainText(/\d{4}-\d{2}-\d{2}/);await expect(report).not.toContainText(/\d+\s?%|confidence score|درجة ثقة/);contents.push(await report.innerText());
  for(const width of [390,1440]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
  await page.screenshot({path:`test-results/report-${lang}-${eye}-${id}.png`,fullPage:true});await page.emulateMedia({media:'print'});await expect(report.locator('.simulation-label')).toBeVisible();await expect(page.getByRole('button',{name:d.print,exact:true})).toBeHidden();await page.pdf({path:`test-results/report-${lang}-${eye}-${id}.pdf`,format:'A4'});await page.emulateMedia({media:'screen'});
  await page.reload();await expect(report).toHaveAttribute('data-scenario',id);await expect(report.locator('.scenario-explanation')).toHaveText(d.reports[id].explanation);
  if(index<2){await page.getByRole('button',{name:d.changeScenario,exact:true}).click();await expect(page.getByRole('radio').nth(index)).toBeChecked();await expect(page.locator('.demo-eye select')).toHaveValue(eye);}
 }
 expect(new Set(contents).size).toBe(3);
 // Browser Back restores the saved report after leaving the simulation route.
 await page.locator('header .brand').click();await page.goBack();await expect(page.locator('.simulation-report')).toHaveAttribute('data-scenario','unavailable');
 await page.getByRole('button',{name:d.back,exact:true}).click();await page.getByRole('button',{name:l.previous,exact:true}).click();await expect(page.locator('.sim-stage-4')).toBeVisible();await page.locator('.workflow-progress button').nth(2).click();await expect(page.locator('.simulation-report')).toHaveAttribute('data-scenario','unavailable');
 // Retry must preserve the eye but remove the old outcome and completion status, including after refresh.
 await page.getByRole('button',{name:d.retry,exact:true}).click();await page.reload();await expect(page.locator('.sim-stage-1')).toBeVisible();await expect(page.locator('.workflow-progress button').nth(2)).toBeDisabled();await page.getByRole('button',{name:l.continue,exact:true}).click();await expect(page.getByRole('button',{name:l.eyes[eye],exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:d.restart,exact:true}).click();await page.reload();await expect(page.locator('.sim-stage-1')).toBeVisible();await page.getByRole('button',{name:l.continue,exact:true}).click();await expect(page.getByRole('button',{name:l.eyes.right,exact:true})).toHaveAttribute('aria-pressed','true');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('baseera-cases-v1')!)[0].id)).toBe('RESEARCH-KEEP');expect(api).toEqual([]);expect(errors).toEqual([]);
 await page.goto('/');await expect(page.locator('main')).not.toContainText(lang==='en'?'class 0':'الفئة صفر');await page.goto('/research');await expect(page.locator('.evaluation')).toContainText(lang==='en'?'two HRF DR-group':'صورتا مجموعة الاعتلال السكري');expect(api).toEqual([]);
});
for(const lang of ['en','ar'] as const)test(`${lang}: legacy saved reports migrate; eye changes and live language switch keep the selected scenario`,async({page})=>{
 await page.goto('/app');await page.evaluate(({key})=>localStorage.setItem(key,JSON.stringify({c:{id:'SIM-001',date:'2026-11-13',eyes:['right','left'],notes:'',simulation:true,workflow:{stage:'review',source:'simulation',eye:'left',simulationStep:4,alignment:50,simulationComplete:true}},stage:'report',scenario:1})),{key:DEMO_STORAGE_KEY});await page.reload();
 if(lang==='ar')await page.getByRole('button',{name:'العربية',exact:true}).click();const d=demoCopy[lang];await expect(page.locator('.demo-outcome')).toHaveText(d.reports.flagged.title);await page.getByRole('button',{name:d.changeScenario,exact:true}).click();await page.locator('.demo-eye select').selectOption('right');await page.getByRole('button',{name:d.next,exact:true}).click();await expect(page.locator('.demo-report-meta')).toContainText(labels[lang].eyes.right);await expect(page.locator('.simulation-report')).toHaveAttribute('data-scenario','flagged');
 const other=lang==='en'?'ar':'en';await page.getByRole('button',{name:lang==='en'?'العربية':'English',exact:true}).click();await expect(page.locator('.demo-outcome')).toHaveText(demoCopy[other].reports.flagged.title);await page.reload();await expect(page.locator('.simulation-report')).toHaveAttribute('data-scenario','flagged');
 await page.getByRole('button',{name:demoCopy[other].back,exact:true}).click();await page.locator('.simulation-toolbar button').click();await page.reload();await expect(page.locator('.sim-stage-1')).toBeVisible();await expect(page.locator('.workflow-progress button').nth(2)).toBeDisabled();
});
test('public build contains no weights, research photographs or evaluation artifacts',async()=>{
 const walk=(dir:string):string[]=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(`${dir}/${e.name}`):[`${dir}/${e.name}`]);const files=walk('dist');expect(files.some(f=>/\.(keras|h5|pth|pt|tif|zip)$|retinal-results|retinal-inputs|normal-left|01_dr|02_dr|01_h|02_h/.test(f))).toBe(false);expect(readFileSync('dist/_redirects','utf8')).toContain('/api/*');
});
test('public host refuses inference rather than proxying to local research',async({request})=>{
 const response=await request.post('/api/analyze',{multipart:{file:{name:'not-a-retina.png',mimeType:'image/png',buffer:Buffer.from('invalid')}}});expect(response.status()).toBe(403);const body=await response.json();expect(body).toMatchObject({detail:{code:'public_demo_inference_disabled'}});expect(body).not.toHaveProperty('grade');expect(body).not.toHaveProperty('prediction');
});
