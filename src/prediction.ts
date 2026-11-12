export const MODEL_NAME='Aldahmashi/DR-EfficientNetB0';
export const MODEL_VERSION='fb8d14c59bd56aa17fe0dfdea04a83ecd2f2eeac';
export const MODEL_CLASSES=['No DR','Mild','Moderate','Severe','Proliferative'];
export type Prediction={kind:'research_model_prediction';grade:number;class_name:string;model_name:string;model_version:string;task:string;analysis_at:string;inference_ms:number;input_sha256:string;calibrated:false;clinically_validated:false};
export function isPrediction(value:unknown):value is Prediction {
 const r=value as Prediction|undefined;
 return !!r&&r.kind==='research_model_prediction'&&Number.isInteger(r.grade)&&r.grade>=0&&r.grade<5&&r.class_name===MODEL_CLASSES[r.grade]&&r.model_name===MODEL_NAME&&r.model_version===MODEL_VERSION&&r.task==='five_class_diabetic_retinopathy_grading'&&typeof r.analysis_at==='string'&&Number.isFinite(Date.parse(r.analysis_at))&&typeof r.inference_ms==='number'&&Number.isFinite(r.inference_ms)&&r.inference_ms>=0&&typeof r.input_sha256==='string'&&/^[a-f0-9]{64}$/.test(r.input_sha256)&&r.calibrated===false&&r.clinically_validated===false;
}
