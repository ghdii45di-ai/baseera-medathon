# Proposed device architecture / البنية المقترحة للجهاز

This is the team’s proposed wearable retinal imaging architecture, not a finalized bill of materials, manufactured product, optical specification, or operating procedure. The current deliverable is a responsive web application for phones and computers; no native mobile application or working retinal capture hardware is claimed.

هذه بنية الفريق المقترحة لتصوير الشبكية بجهاز قابل للارتداء، وليست قائمة مكوّنات نهائية أو منتجًا مُصنّعًا أو مواصفات بصرية أو تعليمات تشغيل. المتاح حاليًا تطبيق ويب متجاوب للهواتف والحواسيب؛ لا ندّعي وجود تطبيق هاتف أصلي أو جهاز تصوير شبكية عامل.

| Subsystem / النظام | Proposed components / المكوّنات المقترحة |
|---|---|
| Optics and alignment / البصريات والمحاذاة | Aspheric / ophthalmic imaging lens concept; beam splitter / half mirror subject to optical design; aperture; polarizing filters subject to verification; optical housing; alignment system. / تصوّر لعدسة تصوير لاكروية أو عينية؛ مقسّم حزمة أو مرآة نصف عاكسة وفق التصميم؛ فتحة؛ مرشّحات استقطاب خاضعة للتحقق؛ هيكل بصري ونظام محاذاة. |
| Illumination / الإضاءة | Proposed IR illumination; LED driver and current limiting; intensity control; light baffle. / إضاءة مقترحة تحت الحمراء؛ دائرة قيادة LED مع تحديد التيار؛ التحكم بالشدة؛ حاجب ضوئي. |
| Imaging and processing / التصوير والمعالجة | Proposed NoIR camera or suitable image sensor; optical imaging path; Raspberry Pi or another embedded processor; connectivity. / كاميرا NoIR أو مستشعر مناسب مقترح؛ مسار تصوير بصري؛ Raspberry Pi أو معالج مضمّن آخر؛ الاتصال. |
| Software / البرنامج | Intended retinal image acquisition, quality assessment, AI-assisted screening, research findings and review report. Currently implemented: uploads, descriptive technical checks, and technical reports; device acquisition and AI remain unavailable. / الهدف: التقاط صور الشبكية وتقييم الجودة والفحص المدعوم بالذكاء الاصطناعي والنتائج البحثية وتقرير المراجعة. المنفّذ حاليًا: رفع الصور والفحوص التقنية الوصفية والتقارير التقنية؛ لم يتوفر التصوير الفعلي أو التحليل الآلي. |

## Open imaging decision / قرار التصوير غير المحسوم

IR-assisted alignment followed by color fundus capture and IR imaging are distinct directions. The team must establish the intended acquisition modality, optical feasibility and safety before any human testing. A color-fundus model cannot be assumed reliable on IR imagery. Neither a NoIR camera nor IR illumination alone establishes a valid retinal imaging system. No wavelength, exposure, field of view, battery life, cost or certified safety specification is claimed.

المحاذاة تحت الحمراء مع تصوير قاع عين ملون والتصوير تحت الحمراء اتجاهان مختلفان. يجب حسم نوع التصوير والتحقق من الجدوى البصرية والسلامة قبل أي اختبار على الأشخاص. لا يمكن افتراض موثوقية نموذج مدرّب على صور قاع عين ملونة مع صور تحت الحمراء. كاميرا NoIR أو الإضاءة تحت الحمراء وحدهما لا تثبتان صلاحية نظام تصوير للشبكية. لا ندّعي مواصفات للطول الموجي أو التعرض أو مجال الرؤية أو عمر البطارية أو التكلفة أو السلامة المعتمدة.

## Visual implementation / تنفيذ الرسوم

`src/Device.tsx` displays the shared three-quarter product concept render and clean subsystem selection. `src/RetinalVisuals.tsx` contains original editable fundus, side-section anatomy, eye-selection, alignment and capture SVGs. Physical geometry never mirrors with RTL: the wearer's right remains the viewer's left in the front-facing eye-selection view. The side-section locates the retina at the posterior wall and distinguishes it from the iris and internal lens. Its dedicated imaging optics/sensor/platform relationship is a teaching abstraction, not a ray-traced or verified optical design. Simulated capture never acquires a photograph. See [visual provenance](visual-provenance.md).

يعرض ملف الجهاز التصوّر المشترك للمنتج بزاوية ثلاثية الأرباع وأزرار الأنظمة الفرعية ولوحة التفاصيل. يتضمن ملف الرسوم البصرية رسومًا أصلية قابلة للتعديل لقاع العين والمقطع الجانبي واختيار العين والمحاذاة والتصوير. لا تنعكس الجهات التشريحية في العربية: تظهر يمين مرتدي النظارة على يسار المشاهد في المنظر الأمامي. يوضح المقطع الشبكية في الجدار الخلفي ويميّزها عن القزحية والعدسة الداخلية. العلاقة بين البصريات المخصصة والمستشعر والمنصة تبسيط تعليمي وليس تصميمًا بصريًا متحققًا منه. لا تلتقط المحاكاة صورة فعلية. راجع سجل مصادر الرسوم.
