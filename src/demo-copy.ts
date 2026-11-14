import {publicSiteCopy} from './public-site-copy';
import {visualCopy} from './visual-copy';
export const demoCopy={
 en:{
  title:'Interactive demo',notice:publicSiteCopy.en.disclosure,capture:'Simulated capture',review:'Choose an example',report:'Simulation report',next:'View simulation report',print:'Print / Save PDF',restart:'Start new demo',resume:'Resume previous demo',entryTitle:'Start the interactive demo',entryIntro:'Follow the proposed journey from preparation to an illustrative report.',savedChoice:'Previous demo progress is saved. Resume it, or start a new demo.',invalidSaved:'Saved progress could not be restored. It will only be replaced if you choose to start a new demo.',
  intro:'Follow preparation, choose an eye, try alignment, then select an example and view its report.',
  scenario:'Predefined example',provenance:'Choose a predefined example to explore its report.',saved:'Your demo progress is saved in this browser.',storage:'Browser storage is unavailable. Progress may be lost on refresh.',
  back:'Back to simulated capture',eye:'Selected eye',case:'Demo case ID',date:'Report date',done:'Choose an example for the report.',
  predefined:'PREDEFINED EXAMPLE · SIMULATION',nextStep:'Illustrative next step',boundaries:'About this report',changeScenario:'Change example',retry:'Retry the simulation',
  illustrationLabel:'Illustrative image — not captured by the glasses or analyzed in the demo.',illustrationHelp:'This illustration explains the journey. The example you select determines the report.',
  reportDisclosure:'Illustrative report for a predefined scenario, not a screening result. No image was captured or analyzed. Not medical advice.',
  reports:{
   unflagged:{title:'Example: nothing flagged for review',preview:'Explore routine follow-up in the proposed workflow.',explanation:'A predefined example with no review flag in the illustrated workflow. It is not confirmation of eye health.',nextStep:'This example illustrates routine follow-up in a future validated system; it does not assign a follow-up schedule to any user.'},
   flagged:{title:'Example: flagged for specialist review',preview:'Explore the proposed specialist-review step.',explanation:'A predefined example showing a review flag in the proposed workflow, rather than a finding from an examination.',nextStep:'This example illustrates specialist review in the proposed workflow. No case is sent and no actual referral is issued.'},
   unavailable:{title:'Example: assessment unavailable',preview:'Explore an unavailable result and the retry option.',explanation:'A predefined example in which the workflow cannot offer a result.',nextStep:'This example illustrates an unavailable result. You can retry the simulation or choose another example.'},
  },
 },
 ar:{
  title:'العرض التفاعلي',notice:publicSiteCopy.ar.disclosure,capture:'التقاط مُحاكى',review:'اختر مثالًا',report:'تقرير المحاكاة',next:'عرض تقرير المحاكاة',print:'طباعة / حفظ PDF',restart:'بدء عرض جديد',resume:'استكمال العرض السابق',entryTitle:'ابدأ العرض التفاعلي',entryIntro:'تعرّف على الرحلة المقترحة من التحضير إلى التقرير التوضيحي.',savedChoice:'يوجد تقدم محفوظ لعرض سابق. يمكنك استكماله أو بدء عرض جديد.',invalidSaved:'تعذّر استعادة التقدم المحفوظ. لن يُستبدل إلا إذا اخترت بدء عرض جديد.',
  intro:'تابع التحضير واختر العين وجرّب المحاذاة، ثم اختر مثالًا واعرض تقريره.',
  scenario:'مثال محدد مسبقًا',provenance:'اختر مثالًا محددًا مسبقًا لاستكشاف تقريره.',saved:'يُحفظ تقدم العرض في هذا المتصفح.',storage:'تخزين المتصفح غير متاح. قد يُفقد التقدم عند التحديث.',
  back:'العودة إلى الالتقاط المُحاكى',eye:'العين المختارة',case:'معرّف الحالة التوضيحية',date:'تاريخ التقرير',done:'اختر مثالًا للتقرير.',
  predefined:'مثال محدد مسبقًا · محاكاة',nextStep:'الخطوة التالية التوضيحية',boundaries:'عن هذا التقرير',changeScenario:'تغيير المثال',retry:'إعادة تجربة المحاكاة',
  illustrationLabel:'صورة توضيحية — لم تلتقطها النظارة ولا تُحلَّل في العرض.',illustrationHelp:'يشرح الرسم الرحلة. يحدد المثال الذي تختاره محتوى التقرير.',
  reportDisclosure:'تقرير توضيحي لسيناريو محدد مسبقًا، وليس نتيجة فحص. لم تُلتقط صورة أو تُحلَّل، ولا يقدّم التقرير نصيحة طبية.',
  reports:{
   unflagged:{title:'مثال: لا توجد علامات محددة للمراجعة',preview:'استكشف المتابعة الدورية في سير العمل المقترح.',explanation:'مثال محدد مسبقًا دون علامة للمراجعة في سير العمل التوضيحي. لا يؤكد سلامة العين.',nextStep:'يوضّح هذا المثال مسار المتابعة الدورية في نظام مستقبلي بعد التحقق منه؛ ولا يحدد موعد متابعة لأي مستخدم.'},
   flagged:{title:'مثال: علامة تستدعي مراجعة المختص',preview:'استكشف خطوة مراجعة المختص المقترحة.',explanation:'مثال محدد مسبقًا يوضّح علامة للمراجعة في سير العمل المقترح، وليس نتيجة فحص.',nextStep:'يوضّح هذا المثال الحاجة إلى مراجعة مختص في سير العمل المقترح. لا تُرسل حالة ولا تُصدر إحالة فعلية.'},
   unavailable:{title:'مثال: تعذّر التقييم',preview:'استكشف تعذّر تقديم نتيجة وخيار إعادة التجربة.',explanation:'مثال محدد مسبقًا لا يمكن فيه لسير العمل تقديم نتيجة.',nextStep:'يوضّح هذا المثال تعذّر تقديم نتيجة. يمكنك إعادة تجربة المحاكاة أو اختيار مثال آخر.'},
  },
 }
};
const presentation=(p:typeof publicSiteCopy.en)=>({
 hero:p.hero,intro:p.intro,try:p.try,explore:p.explore,problemText:p.problem,heroNote:p.disclosure,footer:p.footer,
 research:p.progressLabel,references:p.progressLabel,viewResearch:p.progressLabel,researchLabel:p.progressLabel,researchPageTitle:p.progressLabel,researchPageIntro:p.progressIntro,
 status:p.progressTitle,statusTitle:p.progressTitle,statusBuilt:p.now,statusUnder:p.limitations,statusFuture:p.next,
 howTitle:p.howTitle,howText:'',workflow:p.steps,workflowDetails:p.stepText,implemented:p.stepStatus[3],conceptual:p.stepStatus[1],
});
// Local research retains its original copy; these overrides apply only to the public demo.
export const publicCopy={
 en:{...presentation(publicSiteCopy.en),eyebrow:'MEDATHON 2026 · PROPOSED SOLUTION',cases:'Demo',back:'Demo',noCaseCreated:'The glasses concept',
  integrated:'Predefined example',stages:['Proposed glasses','Interactive journey','Predefined examples','Illustrative report'],stageText:['A proposed imaging device to develop and validate.','Explore fit, eye selection and alignment.','Choose one of three examples.','Read or print the selected example’s report.'],
  solutionText:'A proposed imaging device and digital platform, explored here through an interactive demo.',tryNowTitle:'Explore the interactive demo',tryNowText:demoCopy.en.intro,researchTitle:'Explore our progress',researchText:'See what the demo illustrates, what remains to develop, and the sources behind the concept.',
  compactSteps:['Preparation','Eye selection','Simulated alignment','Simulated capture','Choose an example'],transfer:'Continue to example selection',
  simDescriptions:['Explore the proposed journey.','This demo simulates the operator explaining the steps and fitting the glasses.','Choose an eye for the demo.','Move the control to the center target to continue.','Select simulated capture to run the animation.','Choose a predefined example and open its report.'],
  handoffTitle:'Choose a predefined example',handoffText:'Continue to explore the report for your selected example.',reviewNext:'Continue to example selection',captured:'Simulated capture complete',aligned:'Aligned in simulation',
  finalText:'Choose a predefined example and explore its illustrative report.',privacyText:demoCopy.en.saved,local:demoCopy.en.saved,
  formLeave:'Leave the demo?',leaveDetails:'A simulation animation is in progress. You can stay to continue or leave the demo.',
 conceptGeometry:'Unbuilt glasses concept.',
 hotspotText:['Proposed imaging optics and alignment. Their design and feasibility still need development.','Proposed illumination for retinal imaging, subject to safety review and specialist validation.','A proposed inward-facing imaging module. A working capture system still needs development and validation.','A future connection would transfer images to the digital platform for review. No device is connected to this demo.','A proposed power system for a future prototype. Its specifications have not been validated.'],
  retinalIllustration:demoCopy.en.illustrationLabel,retinaNote:'An illustration of the retina at the back of the eye.',platformLabel:'Digital platform',
  relationshipDescriptions:[...visualCopy.en.relationshipDescriptions.slice(0,2),'A future device connection would supply images for review. The current demo illustrates the journey through predefined examples.'],
 },
 ar:{...presentation(publicSiteCopy.ar),eyebrow:'ميداثون ٢٠٢٦ · حل مقترح',cases:'العرض',back:'العرض',noCaseCreated:'مفهوم النظارة',
  integrated:'مثال محدد مسبقًا',stages:['النظارة المقترحة','الرحلة التفاعلية','أمثلة محددة مسبقًا','التقرير التوضيحي'],stageText:['جهاز تصوير مقترح يحتاج إلى تطوير وتحقق.','استكشف وضع النظارة واختيار العين والمحاذاة.','اختر واحدًا من ثلاثة أمثلة.','اقرأ تقرير المثال المختار أو اطبعه.'],
  solutionText:'جهاز تصوير ومنصة رقمية مقترحان، نستكشفهما هنا بعرض تفاعلي.',tryNowTitle:'استكشف العرض التفاعلي',tryNowText:demoCopy.ar.intro,researchTitle:'تعرّف على تقدم المشروع',researchText:'تعرّف على ما يوضحه العرض، وما يحتاج إلى تطوير، والمصادر التي يستند إليها التصوّر.',
  compactSteps:['التحضير','اختيار العين','محاذاة مُحاكاة','التقاط مُحاكى','اختيار المثال'],transfer:'الانتقال إلى اختيار المثال',
  simDescriptions:['استكشف الرحلة المقترحة.','في هذا العرض، نحاكي شرح المشغّل للخطوات ووضع النظارة للمريض.','اختر عينًا للعرض.','حرّك المؤشر إلى الهدف الأوسط للمتابعة.','اختر الالتقاط المُحاكى لتشغيل الحركة.','اختر مثالًا محددًا مسبقًا وافتح تقريره.'],
  handoffTitle:'اختر مثالًا محددًا مسبقًا',handoffText:'تابع لاستكشاف تقرير المثال الذي تختاره.',reviewNext:'الانتقال إلى اختيار المثال',captured:'اكتمل الالتقاط المُحاكى',aligned:'تمت المحاذاة في المحاكاة',
  finalText:'اختر مثالًا محددًا مسبقًا واستكشف تقريره التوضيحي.',privacyText:demoCopy.ar.saved,local:demoCopy.ar.saved,
  formLeave:'مغادرة العرض؟',leaveDetails:'حركة المحاكاة قيد التشغيل. يمكنك البقاء للمتابعة أو مغادرة العرض.',
 conceptGeometry:'تصوّر لنظارة لم تُصنّع بعد.',
 hotspotText:['بصريات ومحاذاة مقترحتان. لا يزال التصميم والجدوى بحاجة إلى تطوير.','إضاءة مقترحة لتصوير الشبكية، تخضع لمراجعة السلامة والتحقق بإشراف المختصين.','وحدة تصوير مقترحة موجّهة نحو العين. لا يزال نظام الالتقاط الفعلي بحاجة إلى تطوير وتحقق.','قد ينقل اتصال مستقبلي الصور إلى المنصة الرقمية للمراجعة. لا يوجد جهاز متصل بهذا العرض.','نظام طاقة مقترح لنموذج أولي مستقبلي. لم يُتحقق من مواصفاته بعد.'],
  retinalIllustration:demoCopy.ar.illustrationLabel,retinaNote:'رسم للشبكية في مؤخرة العين.',platformLabel:'المنصة الرقمية',
  relationshipDescriptions:[...visualCopy.ar.relationshipDescriptions.slice(0,2),'قد يوفر الاتصال المستقبلي بالجهاز صورًا للمراجعة. يوضح العرض الحالي الرحلة من خلال أمثلة محددة مسبقًا.'],
 }
};
