# Technical research record

The public **Progress & sources** page is a concise visitor overview. The evidence below remains preserved for technical review; it is not used to generate public demo outcomes.

- [Data provenance](data-provenance.md): permitted HRF and Häggström image sources, attribution, transformations, licensing evidence, available group labels, acquisition counts, and unresolved overlap/independence. [Input manifest](retinal-inputs.json) retains exact sources and hashes. Earlier dataset-access/terms history is retained in [the historical research workflow](local-research-workflow-history.md); those dated access observations are not claims about current access.
- [Evaluation](evaluation.md) and [recorded real-image outputs](retinal-results.json): five selected retinal photographs, two runs each; every prediction was class 0, including both HRF DR-group photographs. These observed misses support keeping the experimental model out of the public demo. No medical accuracy or clinical validation is established. The original records have not been rewritten.
- [Model card](model-card.md), [license evidence](model-license.md), and [pinned manifest](../backend/model_manifest.json): upstream repository, revision, weight checksum, class mapping, preprocessing, safe loading and limitations. Model links and version details belong here rather than in the visitor journey.
- [Synthetic execution record](smoke-results.json), [synthetic HTTP execution record](api-smoke-results.json), and dated verification documents record software behavior only. Synthetic inputs and software test counts are not evidence of medical accuracy.
- [Device architecture](device-architecture.md) and the model card retain unresolved IR versus colour-fundus engineering questions. Proposed acquisition modalities must not be assumed compatible with a model trained on colour photographs.
- [Historical deployment notes](research-deployment-history.md) retain prior access, permission and container limitations. [Public deployment record](vercel-publication.md) documents the static simulation separately.
- [Visual provenance](visual-provenance.md) retains original illustration credits and the NEI anatomy reference. No restricted research photograph is included in the public build.

Local research is opt-in and loopback-only as described in README.md. Public inference is disabled; the visitor chooses predefined illustrative examples without uploading or analyzing an image.
