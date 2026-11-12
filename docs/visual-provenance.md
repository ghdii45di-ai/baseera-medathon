# Visual provenance / مصادر الرسوم

## Product render / تصوّر المنتج

- File: `public/assets/baseera-glasses-concept-v1.png` (1536 × 1024 PNG).
- Created for this project on 2026-11-12 using the built-in `image_gen` tool. It is an original generated product concept, not licensed third-party photography, a manufactured device, or a verified optical configuration.
- The original generated artifact was copied into the repository; the original under the Codex generated-images directory was left in place.
- Used in the landing hero and case-free device education/exploration. Labels are HTML, not embedded in the render. The artwork is not evidence of optical feasibility, retinal capture, illumination safety, or hardware performance.

الملف تصوّر أصلي مولّد لهذا المشروع بتاريخ ١٢ نوفمبر ٢٠٢٦ باستخدام أداة توليد الصور المدمجة، وليس صورة فوتوغرافية لجهاز مُصنّع أو إعداد بصري متحقق منه. نُسخت النسخة النهائية إلى المستودع مع الإبقاء على الأصل. يُستخدم في الواجهة والتعريف بالجهاز، وتبقى التسميات بصيغة HTML. لا يثبت جدوى بصرية أو قدرة تصوير أو سلامة إضاءة أو أداء أجهزة.

### Final generation prompt

See `docs/product-render-prompt.txt` for the exact prompt used. Built-in mode was used, not the fallback CLI/API workflow. No reference photographs were provided.

يتضمن ملف وصف التوليد النص النهائي المستخدم كاملًا. استُخدمت الأداة المدمجة دون مسار سطر الأوامر البديل، ولم تُقدّم صور مرجعية.

## Original vector artwork / الرسوم المتجهية الأصلية

`src/RetinalVisuals.tsx` contains:

- A circular fundus illustration with retinal surface, off-center optic-disc representation, and vessels. It is explicitly labeled **Illustrative retinal image**. It is not an iris, real fundus photograph, annotated disease case, or diagnostic output.
- An editable eye side-section and conceptual relationship to dedicated imaging optics, sensor and platform. The iris/pupil is at the anterior side, the internal lens behind it, and the retina at the posterior wall. Labels and leader lines are editable SVG, with bilingual HTML explanation.
- Front-facing eye-selection, eye/imaging-port alignment and simulated capture close-ups. Physical anatomy never mirrors with RTL. Capture animation never creates a retinal photograph; reduced motion disables decorative signal animation.

يتضمن الملف رسمًا دائريًا توضيحيًا لقاع العين مع سطح الشبكية وتمثيل القرص البصري والأوعية، ومقطعًا جانبيًا للعين وعلاقتها التصوّرية بالبصريات والمستشعر والمنصة، ولقطات لاختيار العين والمحاذاة والتصوير المُحاكى. الرسوم أصلية، وتسمياتها وخطوط الشرح قابلة للتعديل. تبقى القزحية والبؤبؤ في المقدمة والعدسة خلفهما والشبكية في الخلف. لا تنعكس الجهات التشريحية مع العربية، ولا تُنتج حركة التصوير صورة فعلية. تُحترم تفضيلات تقليل الحركة.

Anatomical reference checked: [National Eye Institute — How the Eyes Work](https://www.nei.nih.gov/eye-health-information/healthy-vision/how-eyes-work), accessed 2026-11-12. This source supports the basic locations of the cornea, iris/pupil, internal lens and retina. The proposed device path is a project illustration, not endorsed or validated by NEI. No NEI artwork was copied.

رُوجع مرجع المعهد الوطني للعيون لتحديد المواقع التشريحية الأساسية فقط. مسار الجهاز المقترح رسم للمشروع وليس معتمدًا من المعهد، ولم تُنسخ رسوماته.

## Separation from research data / الفصل عن بيانات البحث

All generated/decorative assets live in the public presentation layer. They are never automatically passed to image checks, inference, training, or evaluation. The real image workflow accepts explicit user selection only. No fundus dataset was acquired or bundled, and no disease findings, probabilities, or heatmaps were invented. These assets must remain excluded from future research evaluations.

تبقى الأصول المولّدة والزخرفية في طبقة العرض فقط، ولا تُرسل تلقائيًا إلى فحص الصور أو الاستدلال أو التدريب أو التقييم. يتطلب مسار الصور الفعلي اختيار المستخدم الصريح. لم تُقتنَ مجموعة صور شبكية أو تُرفق عينات، ولم تُختلق نتائج مرضية أو احتمالات أو خرائط تشخيصية. يجب استمرار استبعاد هذه الرسوم من أي تقييم بحثي مستقبلي.
