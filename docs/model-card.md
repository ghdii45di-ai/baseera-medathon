> The experimental provider below is retained for explicit LOCAL research only. The public default is an interactive simulation with inference disabled and predefined outcomes labelled separately.

# Model card — 2026-11-13

The integrated research provider is `aldahmashi-efficientnetb0`: Nasser Aldahmashi's [DR-EfficientNetB0](https://huggingface.co/Aldahmashi/DR-EfficientNetB0/tree/fb8d14c59bd56aa17fe0dfdea04a83ecd2f2eeac). Exact artifact, SHA-256, size and ordered classes are pinned in `backend/model_manifest.json`. Existing weights and `.venv-model` were reused and checksum-verified; no retraining or checkpoint replacement occurred.

The upstream model card declares MIT metadata, Keras 3.13.2, APTOS 2019 training, RGB 224x224 input and classes 0 No DR, 1 Mild, 2 Moderate, 3 Severe, 4 Proliferative. Exact train/validation membership and patient overlap are not available. Upstream benchmark numbers are not Baseera results. A standalone license notice is absent; see [permission evidence](model-license.md).

Decoding applies EXIF orientation and RGB conversion. Preprocessing uses PIL BICUBIC resize to 224x224, float32 raw 0..255. Rescaling/normalization are embedded in the checkpoint; external division by 255 would double-normalize. This matches the author's PIL example. The loader verifies the pinned hash/size and serialized-class allowlist, then uses Keras safe mode, no custom objects or remote code, `compile=False`, CPU and one model-owning worker. It validates input/output architecture and a synthetic execution before readiness. Outputs must be finite five-class softmax vectors. Probabilities are deliberately omitted; no calibrated confidence, treatment, referral or reassurance is generated.

**Observed limitation:** five permitted real retinal photographs were run twice each. All returned class 0, including both HRF DR-group images. This is an execution case series with known disease misses, not evidence of diagnostic accuracy. No expert five-class grade labels were acquired. See [results](retinal-results.json) and [evaluation](evaluation.md). The bilingual app and printable reports disclose these misses.

`/api/health` separates server liveness from model state; `/api/ready` is 503 until ready. Missing weights, checksum/load failure, unknown configuration, malformed output, concurrency/rate exhaustion and execution exceptions never substitute predictions. API failures use explicit 4xx/5xx codes. Starting a reassessment clears the prior result; pending/failed assessment status persists and prints without a reassuring class. Technical image checks remain separate.

No retinal detector, out-of-domain detector or validated gradability assessment exists. Descriptive dimensions/brightness/sharpness do not establish fundus content or clinical quality. The permission/fundus checkbox is an operator declaration, not a detector. Images of other content can still produce arbitrary model classes.

The glasses, optical path and illumination remain conceptual. IR-assisted alignment, IR capture and color fundus acquisition are different modalities; this color-image classifier is not validated for the proposed device or IR input.

RETFound was previously investigated as a foundation/benchmark option but not adopted; its base encoder is not a ready DR classifier and its repository declares CC BY-NC 4.0. The alternative custom B3 graph was inspected, not loaded. Neither provides Baseera validation. Public deployment still requires the [remaining checks](public-deployment.md).
