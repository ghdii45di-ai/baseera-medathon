# Data provenance — 2026-11-13

Actual real-image execution inputs: five photographs. The images and downloaded archives stay in ignored `data/retinal-smoke/`, never in public assets or the container context. Sources, archive/image SHA-256 values, original members, transformations and source labels are recorded in [input manifest](retinal-inputs.json). Predictions and basic measurements are recorded separately in [results](retinal-results.json).

| Inputs used | Permitted source | Available reference information |
|---|---|---|
| HRF `01_h.jpg`, `02_h.jpg` | [Official HRF page](https://www5.cs.fau.de/research/data/fundus-images/), [healthy archive](https://www5.cs.fau.de/fileadmin/research/datasets/fundus-images/healthy.zip), CC BY 4.0, research use explicitly permitted | Healthy source group; no five-class DR severity labels acquired |
| HRF `01_dr.JPG`, `02_dr.JPG` | [Official HRF page](https://www5.cs.fau.de/research/data/fundus-images/), [DR archive](https://www5.cs.fau.de/fileadmin/research/datasets/fundus-images/diabetic_retinopathy.zip), CC BY 4.0 | Diabetic-retinopathy source group; no five-class DR severity labels acquired |
| `normal-left.jpg` | [Mikael Häggström original](https://commons.wikimedia.org/wiki/File:Fundus_photograph_of_normal_left_eye.jpg), CC0 1.0; downloaded from [scikit-image v0.19.3 mirror](https://raw.githubusercontent.com/scikit-image/scikit-image/v0.19.3/skimage/data/retina.jpg) after Wikimedia download returned 429 | Photographer describes a normal left fundus; not an independently adjudicated five-class label |

HRF attribution: Budai, Attila; Bock, Rüdiger; Maier, Andreas; Hornegger, Joachim; Michelson, Georg. *Robust Vessel Segmentation in Fundus Images*. International Journal of Biomedical Imaging (2013), DOI 10.1155/2013/154860. Provider: FAU Pattern Recognition Lab and collaborating ophthalmology/Brno institutions. [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Original JPEG pixels decoded and re-encoded as RGB PNG at original dimensions for upload; model preprocessing separately resizes to 224x224. The two official archives each contain 15 images; all 30 compressed images were downloaded, but only the first two sorted members of each archive were decoded into fixtures/tested. No masks or expert vessel labels were acquired.

Public-domain photo attribution: Mikael Häggström (2014), *Medical gallery of Mikael Häggström 2014*, WikiJournal of Medicine 1(2), DOI 10.15347/wjm/2014.008. [scikit-image documents the CC0 origin](https://scikit-image.org/docs/stable/api/skimage.data.html#skimage.data.retina). The downloaded file SHA-1 is checked against the Commons original when acquired; input manifest records SHA-256. No image transformation before upload.

Selection was deterministic convenience sampling, not a random test set. Patient independence, near-duplicates and overlap with APTOS/model training have not been established. Disease-group labels must not be converted into invented 0-4 severity grades. No sensitivity, specificity or five-class accuracy is claimed. No IDRiD, APTOS or Messidor release was acquired during this work.

Reproduce acquisition and API execution with `.venv-model/Scripts/python -m backend.retinal_smoke --acquire` while the model-enabled server is ready. It verifies pinned archive/file hashes and writes new timestamped results. It requires explicit `--acquire` for downloads. Files remain ignored. Existing synthetic execution reports remain clearly labeled historical software smoke tests.

The generated glasses render and editable SVG retina/anatomy remain explanatory artwork, not inference fixtures. See [visual provenance](visual-provenance.md). User uploads require permission and de-identification; do not upload personal health information.
