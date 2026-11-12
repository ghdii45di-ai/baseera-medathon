import {describe,it,expect} from 'vitest';
import {isPrediction,MODEL_CLASSES,MODEL_NAME,MODEL_VERSION} from './prediction';
import {metadataOnly} from './store';
const result={kind:'research_model_prediction' as const,grade:2,class_name:'Moderate',model_name:MODEL_NAME,model_version:MODEL_VERSION,task:'five_class_diabetic_retinopathy_grading',analysis_at:'2026-11-12T12:00:00Z',inference_ms:400,input_sha256:'a'.repeat(64),calibrated:false as const,clinically_validated:false as const};
describe('research output contract',()=>{
 it('accepts only the pinned model and documented five-class order',()=>{for(let grade=0;grade<5;grade++)expect(isPrediction({...result,grade,class_name:MODEL_CLASSES[grade]})).toBe(true);expect(isPrediction({...result,class_name:'Healthy'})).toBe(false);expect(isPrediction({...result,model_version:'main'})).toBe(false);expect(isPrediction({...result,calibrated:true})).toBe(false);});
 it('saves safe prediction metadata without arbitrary payloads',()=>{const c=metadataOnly({id:'DEMO-001',date:'2026-11-12',eyes:['right'],notes:'',reviews:{right:{source:'upload',checks:{width:256,height:256,brightness:90,sharpness:0,method:'test',checked_at:result.analysis_at},prediction:{...result,image:'data:private'} as never}}});expect(c.reviews?.right?.prediction?.grade).toBe(2);expect(JSON.stringify(c)).not.toContain('data:private');});
});
