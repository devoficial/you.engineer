export const text=(en,bn)=>({en,bn});
export const families=[
 ['structure','Structure & systems','গঠন ও অঙ্গব্যবস্থা'],
 ['cells','Cells & communication','কোষ ও যোগাযোগ'],
 ['signals','Rhythms & measurement','ছন্দ ও পরিমাপ'],
 ['cognition','Learning & cognition','শেখা ও চিন্তা'],
 ['regulation','Regulation & sleep','নিয়ন্ত্রণ ও ঘুম'],
 ['lifespan','Development & health','বিকাশ ও স্বাস্থ্য'],
 ['models','Models & interfaces','মডেল ও ইন্টারফেস']
].map(([id,en,bn])=>({id,...text(en,bn)}));
export const sources={
 anatomy:['Brain anatomy · Johns Hopkins Medicine','https://www.hopkinsmedicine.org/health/conditions-and-diseases/anatomy-of-the-brain'],
 basics:['Brain Basics · NINDS','https://www.ninds.nih.gov/health-information/public-education/brain-basics'],
 cells:['Nervous tissue · OpenStax','https://openstax.org/books/anatomy-and-physiology-2e/pages/12-2-nervous-tissue'],
 electrical:['The action potential · OpenStax','https://openstax.org/books/anatomy-and-physiology-2e/pages/12-4-the-action-potential'],
 synapse:['Communication between neurons · OpenStax','https://openstax.org/books/anatomy-and-physiology-2e/pages/12-5-communication-between-neurons'],
 eeg:['EEG and MEG · NCBI Bookshelf','https://www.ncbi.nlm.nih.gov/books/NBK597471/'],
 waves:['Normal EEG waveforms · NCBI Bookshelf','https://www.ncbi.nlm.nih.gov/books/NBK539805/'],
 memory:['How memory functions · OpenStax','https://openstax.org/books/psychology-2e/pages/8-1-how-memory-functions'],
 learning:['What is learning? · OpenStax','https://openstax.org/books/psychology-2e/pages/6-1-what-is-learning'],
 emotion:['Emotion · OpenStax','https://openstax.org/books/psychology-2e/pages/10-4-emotion'],
 reward:['Drugs and the brain · NIDA','https://nida.nih.gov/publications/drugs-brains-behavior-science-addiction/drugs-brain'],
 consciousness:['What is consciousness? · OpenStax','https://openstax.org/books/psychology-2e/pages/4-1-what-is-consciousness'],
 sleep:['Sleep stages · NHLBI','https://www.nhlbi.nih.gov/health/sleep/stages-of-sleep'],
 sensory:['Sensory perception · OpenStax','https://openstax.org/books/anatomy-and-physiology-2e/pages/14-1-sensory-perception'],
 motor:['Motor responses · OpenStax','https://openstax.org/books/anatomy-and-physiology-2e/pages/14-3-motor-responses'],
 central:['The central nervous system · OpenStax','https://openstax.org/books/anatomy-and-physiology-2e/pages/13-2-the-central-nervous-system'],
 circulation:['Circulation and the CNS · OpenStax','https://openstax.org/books/anatomy-and-physiology-2e/pages/13-3-circulation-and-the-central-nervous-system'],
 nerves:['The peripheral nervous system · OpenStax','https://openstax.org/books/anatomy-and-physiology-2e/pages/13-4-the-peripheral-nervous-system'],
 autonomic:['Autonomic divisions · OpenStax','https://openstax.org/books/anatomy-and-physiology-2e/pages/15-1-divisions-of-the-autonomic-nervous-system'],
 hormone:['Pituitary and hypothalamus · OpenStax','https://openstax.org/books/anatomy-and-physiology-2e/pages/17-3-the-pituitary-gland-and-hypothalamus'],
 development:['The developing nervous system · OpenStax','https://openstax.org/books/anatomy-and-physiology-2e/pages/13-1-the-embryologic-perspective'],
 aging:['How the aging brain affects thinking · NIA','https://www.nia.nih.gov/health/brain-health/how-aging-brain-affects-thinking'],
 mri:['MRI · NIBIB','https://www.nibib.nih.gov/science-education/science-topics/magnetic-resonance-imaging-mri'],
 lateral:['Hemispheric specialization · Society for Neuroscience','https://www.brainfacts.org/archives/2012/left-brained-or-right-brained'],
 models:['Neuronal Dynamics · EPFL','https://neuronaldynamics.epfl.ch/online/Ch1.S3.html']
};
export function item(id,en,bn,bodyEn,bodyBn,extra={}){return {id,title:text(en,bn),body:text(bodyEn,bodyBn),...extra}}
export function topic(number,id,family,en,bn,summaryEn,summaryBn,exampleEn,exampleBn,scene,region,source,items,extra={}){
 return {number,id,family,title:text(en,bn),summary:text(summaryEn,summaryBn),example:text(exampleEn,exampleBn),scene,region,sources:[source],items,...extra};
}
export const path=(...pairs)=>pairs.map(p=>{const [en,bn]=p.split('|');return text(en,bn||en)});
export const lessonUI={
 en:{choose:'Choose a topic',all:'All 34 topics',search:'Search topics or concepts',searchHint:'Try alpha, hippocampus, memory…',topics:'topics',concepts:'concepts',family:'Topic families',subtopic:'Choose a concept',overview:'Overview',brain:'Brain view',mechanism:'Interactive lesson',where:'Brain connection',example:'In everyday life',watch:'Watch the lesson',read:'Read the sources',related:'Explore next',back:'Previous topic',next:'Next topic',step:'Step',previous:'Previous step',nextStep:'Next step',play:'Play',pause:'Pause',restart:'Restart',rotate:'Drag to rotate · Scroll to zoom · Arrow keys rotate',schematic:'Teaching diagram · positions and timing are illustrative',model:'Anatomical surface model',context:'Related brain region',showBrain:'Locate on the brain',showLesson:'Return to lesson',empty:'No matches. Try another name.',share:'Copy lesson link',copied:'Link copied',copyFail:'Copy the link from your address bar',notes:'YOUR LEARNING NOTES',concept:'Selected concept',fullLesson:'Related topic lesson · English',captions:'Opens YouTube. Bengali captions may not be available.',parameter:'Explore the model',progress:'Lesson progress',legend:'Select a labelled component to explore it.',reset:'Reset view',part:'Individual anatomical structure',geometry:'This structure uses the source anatomical mesh.',diagram:'This concept uses a labelled diagram; the brain view shows its wider context.',units:'Illustrative model values',fallback:'The interactive 3D view could not load. Use the labelled steps, chart and notes below.',chart:'Interactive explanatory chart',frequency:'Frequency',amplitude:'Amplitude',phase:'Phase difference',input:'Input strength',time:'Time',signal:'Signal',trial:'Trial',weight:'Connection strength',noise:'Noise level',arousal:'Arousal',stage:'Stage',viewed:'Mark as explored',done:'Explored',clear:'Clear search',menu:'Browse all topics',close:'Close topic browser'},
 bn:{choose:'বিষয় বেছে নাও',all:'সব ৩৪টি বিষয়',search:'বিষয় বা ধারণা খোঁজো',searchHint:'যেমন আলফা, হিপোক্যাম্পাস, স্মৃতি…',topics:'টি বিষয়',concepts:'টি ধারণা',family:'বিষয়ের বিভাগ',subtopic:'একটি ধারণা বেছে নাও',overview:'পরিচিতি',brain:'মস্তিষ্কের দৃশ্য',mechanism:'ইন্টারঅ্যাকটিভ পাঠ',where:'মস্তিষ্কের সঙ্গে সম্পর্ক',example:'দৈনন্দিন জীবনে',watch:'ভিডিও পাঠ দেখো',read:'তথ্যের উৎস পড়ো',related:'এর পরে দেখো',back:'আগের বিষয়',next:'পরের বিষয়',step:'ধাপ',previous:'আগের ধাপ',nextStep:'পরের ধাপ',play:'চালাও',pause:'থামাও',restart:'আবার শুরু',rotate:'টেনে ঘোরাও · স্ক্রলে ছোট-বড় করো · তিরচিহ্ন দিয়েও ঘোরানো যায়',schematic:'শেখার চিত্র · অবস্থান ও সময় সরলীকৃত',model:'মস্তিষ্কের পৃষ্ঠের অঙ্গসংস্থান মডেল',context:'সম্পর্কিত মস্তিষ্ক অঞ্চল',showBrain:'মস্তিষ্কে অবস্থান দেখো',showLesson:'পাঠে ফিরে যাও',empty:'কিছু পাওয়া যায়নি। অন্য নাম দিয়ে খোঁজো।',share:'পাঠের লিংক কপি',copied:'লিংক কপি হয়েছে',copyFail:'ব্রাউজারের ঠিকানা থেকে লিংক কপি করো',notes:'তোমার শেখার নোট',concept:'নির্বাচিত ধারণা',fullLesson:'সম্পর্কিত বিষয়ের পাঠ · ইংরেজি',captions:'ইউটিউবে খুলবে। বাংলা সাবটাইটেল নাও থাকতে পারে।',parameter:'মডেল নিয়ে পরীক্ষা করো',progress:'পাঠের অগ্রগতি',legend:'নামযুক্ত অংশ বেছে নিয়ে দেখো।',reset:'দৃশ্য রিসেট',part:'একটি স্বতন্ত্র অঙ্গসংস্থান',geometry:'এই অংশে মূল অঙ্গসংস্থান মডেলের জ্যামিতি ব্যবহার করা হয়েছে।',diagram:'এই ধারণাটি নামযুক্ত চিত্রে দেখানো; মস্তিষ্কের দৃশ্যে বৃহত্তর অবস্থান দেখা যাবে।',units:'শেখার মডেলের মান',fallback:'ইন্টারঅ্যাকটিভ ত্রিমাত্রিক দৃশ্য লোড হয়নি। নিচের নামযুক্ত ধাপ, চার্ট ও নোট ব্যবহার করো।',chart:'ইন্টারঅ্যাকটিভ ব্যাখ্যার চার্ট',frequency:'কম্পাঙ্ক',amplitude:'বিস্তার',phase:'দশার পার্থক্য',input:'ইনপুটের শক্তি',time:'সময়',signal:'সংকেত',trial:'চেষ্টা',weight:'সংযোগের শক্তি',noise:'নয়েজের মাত্রা',arousal:'জাগরণের মাত্রা',stage:'পর্যায়',viewed:'দেখা হয়েছে চিহ্নিত করো',done:'দেখা হয়েছে',clear:'খোঁজা মুছো',menu:'সব বিষয় দেখো',close:'বিষয়ের তালিকা বন্ধ করো'}
};
