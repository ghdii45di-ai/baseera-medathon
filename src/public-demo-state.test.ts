import {describe,it,expect} from 'vitest';
import {captureEvent,freshDemo,openDemoReport,restoreDemo,scenarioId,SCENARIOS} from './public-demo-state';
import {demoCopy} from './demo-copy';

describe('public simulation report selection and restoration',()=>{
 it('migrates saved numeric scenarios to stable IDs without swapping outcomes',()=>{
  for(const [index,id] of SCENARIOS.entries()){
   const c=captureEvent(freshDemo(),{type:'simulation-complete'}).c;
   const restored=restoreDemo(JSON.stringify({c,stage:'report',scenario:index}));
   expect(restored.scenario).toBe(id);expect(restored.stage).toBe('report');
   for(const lang of ['en','ar'] as const){
    expect(demoCopy[lang].reports[restored.scenario!]).toBe(demoCopy[lang].reports[id]);
   }
  }
  expect(scenarioId(-1)).toBeNull();expect(scenarioId('0')).toBeNull();expect(scenarioId('healthy')).toBeNull();
 });
 it('uses distinct titles, explanations and next steps for all scenarios in both languages',()=>{
  for(const lang of ['en','ar'] as const)for(const field of ['title','explanation','nextStep'] as const){
   expect(new Set(SCENARIOS.map(id=>demoCopy[lang].reports[id][field])).size).toBe(3);
  }
 });
 it('cannot open a report without both simulated capture and a selected scenario',()=>{
  const start=freshDemo();expect(openDemoReport({...start,scenario:'flagged'}).stage).toBe('capture');
  const done=captureEvent(start,{type:'simulation-complete'});expect(openDemoReport(done).stage).toBe('review');
  expect(openDemoReport({...done,scenario:'flagged'})).toMatchObject({stage:'report',scenario:'flagged',reportDate:expect.any(String)});
 });
 it('restarts without reviving legacy completion or losing the selected eye',()=>{
  let state=captureEvent(freshDemo(),{type:'eye',eye:'left'});
  state=captureEvent(state,{type:'simulation-complete'});
  state=openDemoReport({...state,scenario:'unavailable'});
  state=captureEvent(state,{type:'restart-simulation'});
  state=captureEvent(state,{type:'simulation',step:1});
  expect(state).toMatchObject({stage:'capture',scenario:null,c:{workflow:{eye:'left',simulationStep:1,simulationComplete:false}}});
  expect(restoreDemo(JSON.stringify(state)).stage).toBe('capture');
  expect(state.reportDate).toBeUndefined();
 });
 it('rejects corrupted saved states and excludes research payloads',()=>{
  expect(restoreDemo('{bad').stage).toBe('capture');
  const c={...freshDemo().c,simulation:true,notes:'private',reviews:{right:{prediction:'private'}},workflow:{...freshDemo().c.workflow,simulationComplete:false}};
  const restored=restoreDemo(JSON.stringify({c,stage:'report',scenario:'unflagged'}));
  expect(restored.stage).toBe('capture');expect(JSON.stringify(restored)).not.toContain('private');
 });
});
