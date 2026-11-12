# Evaluation — 2026-11-13

This is an execution case series, **not a medical accuracy evaluation**. Existing weights were reused. Five permitted real fundus photographs passed server checks and completed genuine CPU inference twice each with matching classes.

| Image | Source reference | Predicted grade/class on both runs |
|---|---|---|
| HRF 01_h | Healthy group | 0 / No DR |
| HRF 02_h | Healthy group | 0 / No DR |
| HRF 01_dr | Diabetic-retinopathy group | 0 / No DR |
| HRF 02_dr | Diabetic-retinopathy group | 0 / No DR |
| Häggström normal left | Photographer describes normal fundus | 0 / No DR |

**Both disease-group photographs were assigned class 0.** This observed disagreement prevents using class 0 for reassurance. Do not turn the tiny selected case series into a performance estimate. Source groups are available, but expert 0-4 grades, independently verified labels, training overlap and patient independence are unresolved. These results neither establish medical accuracy nor establish that all possible inputs return class 0. Preprocessing matches the author's example; no tuning against these examples was performed.

[Machine-readable results](retinal-results.json) include each source, available reference information, image/archive hashes, measurements, both predictions, model version and timings. [Input provenance](data-provenance.md) documents terms and attribution. Synthetic reports (`smoke-results.json`, `api-smoke-results.json`) establish software execution only, not retinal or medical behavior.

The bilingual browser journey uses the real public-domain photograph: source selection, permission, upload/preview, real basic checks, genuine model inference, report, print PDF, refresh persistence and reattachment invalidation. Separate fault injection covers HTTP 500/429/503, malformed successful responses and transport failure. It verifies no prediction on failure, preserved image/checks and persisted failed report state. API tests cover corrupt/unsupported/oversized/dimension-invalid input, body limits, missing/unknown model, loading/busy, malformed model output and execution exceptions. Stubbed failures are software tests, not model-validation evidence.

Dimensions, mean brightness and 256px grayscale Laplacian variance are descriptive signals only. There is no validated retinal quality threshold, gradability classifier, retina detector or out-of-domain detector. Permission/content confirmation does not validate those properties. Independent labeled, patient-separated evaluation across camera/population/quality conditions remains necessary before any clinical claim.
