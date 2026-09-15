import {getJourney,T} from './catalogue.js';
export function guideJourney(topic,concept){
 const journey=getJourney(topic,concept);if(journey)return journey;
 if(topic.id!=='anatomy')return null;
 const anatomy={cortex:{regions:['frontal','parietal','temporal','occipital']},amygdala:{loci:['amygdala']},'basal-ganglia':{loci:['striatum']},'corpus-callosum':{loci:['callosum']}};const target=anatomy[concept.id]||(concept.mesh?{meshes:[concept.mesh]}:{regions:[concept.region]});
 return {id:'anatomy-tour',topic,concept,title:T('Find this part inside your body','দেহের ভেতরে এই অংশটি খুঁজে দেখো'),summary:concept.body,sources:['central'],steps:[{id:'brain-home',body:'brain',phase:'brain',name:T('Your brain, inside your head','মাথার ভেতরে তোমার মস্তিষ্ক'),carrier:T('A connected nervous system','যুক্ত স্নায়ুতন্ত্র'),process:T('Your brain is protected inside your skull. Nerves connect it with the rest of your body.','খুলি তোমার মস্তিষ্ককে রক্ষা করে। স্নায়ু তাকে দেহের বাকি অংশের সঙ্গে যুক্ত করে।'),regions:['frontal','parietal','temporal','occipital']},{id:'anatomy-part',body:'brain',phase:'brain',name:concept.title,carrier:T('Working with other brain regions','অন্য অঞ্চলের সঙ্গে কাজ করে'),process:concept.body,...target,scope:target.loci?T('This wireframe is an approximate locator, not a reconstructed surface.'+(concept.id==='basal-ganglia'?' It locates the striatum, one component of the basal ganglia.':''),'এই তারের জাল আনুমানিক অবস্থান দেখায়, পুনর্গঠিত পৃষ্ঠ নয়।'+(concept.id==='basal-ganglia'?' এটি বেসাল গ্যাংলিয়ার একটি অংশ স্ট্রায়াটামের অবস্থান দেখায়।':'')):undefined,inner:['limbic','deep','white','ventricles','insula'].includes(concept.region)}]};
}
const pair=(en,bn)=>({en,bn});
export const places={brain:pair('Brain','মস্তিষ্ক'),ear:pair('Ear','কান'),eye:pair('Eye','চোখ'),nose:pair('Nose','নাক'),mouth:pair('Mouth','মুখ'),neck:pair('Neck','ঘাড়'),spine:pair('Spinal cord','সুষুম্না'),hand:pair('Hand & arm','হাত'),leg:pair('Leg','পা'),heart:pair('Heart','হৃৎপিণ্ড'),lungs:pair('Lungs','ফুসফুস'),gut:pair('Digestive organs','হজমের অঙ্গ'),kidney:pair('Kidneys','বৃক্ক'),adrenal:pair('Adrenal glands','অ্যাড্রিনাল গ্রন্থি'),mammary:pair('Mammary glands','স্তনগ্রন্থি'),blood:pair('Blood circulation','রক্তসঞ্চালন'),device:pair('Recording equipment','মাপার যন্ত্র')};
export const simpleSteps={
 sound:['A sound reaches your ear','শব্দ তোমার কানে পৌঁছায়','A doorbell makes tiny changes in air pressure. These vibrations enter the ear canal.','দরজার ঘণ্টা বাতাসের চাপে ছোট পরিবর্তন তৈরি করে। সেই কম্পন কানের পথে ঢোকে।'],
 ossicles:['Three tiny bones pass it on','তিনটি ছোট হাড় কম্পন পাঠায়','The eardrum vibrates. Three tiny bones carry that movement to the inner ear.','কানের পর্দা কাঁপে। তিনটি ছোট হাড় সেই কম্পন ভেতরের কানে পাঠায়।'],
 hair:['Movement becomes a message','কম্পন থেকে সংকেত','Inside the cochlea, tiny bundles on hair cells bend. This changes their electrical activity and helps them pass a message to a nerve.','ককলিয়ার হেয়ার সেলের ছোট গুচ্ছ বাঁকে। এতে কোষের বৈদ্যুতিক কাজ বদলায় এবং স্নায়ুতে সংকেত যায়।'],
 'auditory-nerve':['The hearing nerve carries it','শ্রবণ স্নায়ু সংকেত বহন করে','Now the message travels as electrical pulses in a nerve, toward the brainstem.','এবার সংকেত স্নায়ুর বৈদ্যুতিক স্পন্দন হয়ে ব্রেনস্টেমের দিকে যায়।'],
 'cochlear-nuclei':['The first brain relay','মস্তিষ্কের প্রথম রিলে','The message reaches groups of cells in the brainstem. They begin sorting its timing and sound features.','সংকেত ব্রেনস্টেমের কোষগুচ্ছে আসে। তারা সময় ও শব্দের বৈশিষ্ট্য আলাদা করতে শুরু করে।'],
 olive:['Compare the two ears','দুই কানের তথ্য তুলনা','The brain compares when a sound reaches each ear and how strong it is. These clues help locate the sound.','শব্দ কখন কোন কানে পৌঁছায় ও কতটা জোরে শোনা যায়, মস্তিষ্ক তা তুলনা করে। এতে শব্দের দিক বোঝা যায়।'],
 lemniscus:['Carry the message upward','সংকেত আরও ওপরে যায়','Bundles of nerve fibers carry hearing information farther through the brainstem.','স্নায়ুতন্তুর গুচ্ছ শ্রবণের তথ্য ব্রেনস্টেম দিয়ে আরও ওপরে নিয়ে যায়।'],
 ic:['Combine sound clues','শব্দের সূত্র একত্র করো','A midbrain relay combines hearing information from several paths.','মধ্যমস্তিষ্কের একটি রিলে কয়েকটি পথের শ্রবণ-তথ্য একত্র করে।'],
 mgn:['A relay before the cortex','কর্টেক্সের আগের রিলে','The thalamus helps route the hearing message to the auditory cortex.','থ্যালামাস শ্রবণের সংকেত অডিটরি কর্টেক্সে পৌঁছাতে সাহায্য করে।'],
 'auditory-cortex':['Make sense of sound patterns','শব্দের ধরন বোঝো','The highlighted cortex helps analyze pitch and timing. Other connected areas help work out what the sound means.','চিহ্নিত কর্টেক্স সুর ও সময়ের ধরন বোঝে। যুক্ত অন্য অঞ্চল শব্দের অর্থ বুঝতে সাহায্য করে।'],
 recognize:['That sounds familiar!','শব্দটি চেনা লাগছে!','Your brain compares this sound with what you have learned before. You recognize the doorbell.','মস্তিষ্ক আগের শেখার সঙ্গে শব্দটি তুলনা করে। তুমি দরজার ঘণ্টা চিনতে পারো।'],
 decide:['Choose what to do','এবার কী করবে ঠিক করো','Your brain considers the situation. You can respond—or choose to keep listening.','মস্তিষ্ক পরিস্থিতি বিবেচনা করে। তুমি সাড়া দিতে বা শুধু শুনতে থাকতে পারো।'],
 motor:['Prepare a movement','চলার নির্দেশ প্রস্তুত','Motor regions help prepare signals that will recruit the right muscles.','মোটর অঞ্চল উপযুক্ত পেশি চালানোর সংকেত প্রস্তুত করতে সাহায্য করে।'],
 'neck-motor':['Send the instruction to the neck','ঘাড়ে নির্দেশ পাঠাও','Motor circuits send signals to the muscles that can turn your head.','মোটর সার্কিট মাথা ঘোরানোর পেশিতে সংকেত পাঠায়।'],
 turn:['Your head turns','মাথা ঘুরে যায়','Neck muscles contract in a coordinated way, turning your head toward the sound.','ঘাড়ের পেশি সমন্বয় করে সংকুচিত হয়। মাথা শব্দের দিকে ঘোরে।'],
 light:['Light enters your eye','আলো চোখে ঢোকে','Light from an object enters the eye. The lens focuses it onto the retina at the back.','বস্তু থেকে আলো চোখে ঢোকে। লেন্স তা পেছনের রেটিনায় ফেলে।'],
 optic:['The eye sends a nerve message','চোখ স্নায়ুতে সংকেত পাঠায়','Retinal cells turn light into electrical changes. The optic nerve carries their output toward the brain.','রেটিনার কোষ আলোকে বৈদ্যুতিক পরিবর্তনে বদলায়। দৃষ্টিস্নায়ু সেই তথ্য মস্তিষ্কে নিয়ে যায়।'],
 lgn:['Pass through a visual relay','দৃষ্টির রিলে দিয়ে যাও','A relay in the thalamus sends visual information onward to the cortex.','থ্যালামাসের একটি রিলে দৃষ্টির তথ্য কর্টেক্সে পাঠায়।'],
 visual:['Find edges, shapes and patterns','ধার, আকার ও ধরন খুঁজে পাও','The visual cortex processes features of the scene. Many areas work together to build useful visual information.','দৃষ্টির কর্টেক্স দৃশ্যের বৈশিষ্ট্য প্রক্রিয়া করে। অনেক অঞ্চল একসঙ্গে দৃষ্টির তথ্য তৈরি করে।'],
 'object-meaning':['Recognize the object','বস্তুটিকে চিনে নাও','Connected visual areas help identify what you are looking at, such as a cup.','যুক্ত দৃষ্টির অঞ্চল তুমি কী দেখছ, যেমন একটি কাপ, তা চিনতে সাহায্য করে।'],
 parietal:['Work out where it is','কোথায় আছে বোঝো','Your brain combines sight and body-position information to locate the object relative to your hand.','মস্তিষ্ক দৃষ্টি ও দেহের অবস্থানের তথ্য মিলিয়ে হাতের তুলনায় বস্তুটি কোথায় আছে বোঝে।'],
 'spinal-motor':['The instruction travels downward','নির্দেশ নিচের দিকে যায়','Motor signals travel down through the spinal cord, then reach the nerves that control muscles.','মোটর সংকেত সুষুম্না দিয়ে নিচে নেমে পেশি নিয়ন্ত্রণের স্নায়ুতে পৌঁছায়।'],
 'hand-muscle':['Your muscles do the work','পেশি কাজ করে','A nerve activates the muscle. Tiny structures inside muscle fibers shorten and create force.','স্নায়ু পেশি সক্রিয় করে। পেশিতন্তুর ছোট গঠন সংকুচিত হয়ে বল তৈরি করে।'],
 population:['Many brain cells work together','অনেক মস্তিষ্ক-কোষ একসঙ্গে কাজ করে','Tiny electrical changes happen across brain-cell membranes. Many cells together can create a signal large enough to measure.','মস্তিষ্কের কোষঝিল্লিতে ছোট বৈদ্যুতিক পরিবর্তন হয়। অনেক কোষ মিলিয়ে মাপার মতো সংকেত তৈরি করতে পারে।'],
 'timing-alignment':['Timing changes the combined signal','সময় বদলালে মোট সংকেত বদলায়','When more cells change together, their signals can add up. Different timing can make some contributions cancel.','বেশি কোষ একসঙ্গে বদলালে সংকেত যোগ হতে পারে। সময় আলাদা হলে কিছু অংশ একে অন্যকে বাতিল করে।'],
 'volume-field':['The electrical field reaches outward','বৈদ্যুতিক ক্ষেত্র বাইরে পৌঁছায়','The combined electrical field spreads through tissues toward the scalp. This is different from a message traveling down a nerve.','সম্মিলিত বৈদ্যুতিক ক্ষেত্র টিস্যু দিয়ে মাথার ত্বকের দিকে ছড়ায়। এটি স্নায়ু দিয়ে সংকেত যাওয়ার থেকে আলাদা।'],
 'eeg-record':['Sensors measure a tiny difference','সেন্সর ছোট পার্থক্য মাপে','Electrodes on the scalp measure voltage differences. An EEG machine draws these changing measurements as waves.','মাথার ত্বকের ইলেকট্রোড ভোল্টেজের পার্থক্য মাপে। ইইজি যন্ত্র পরিবর্তনগুলো তরঙ্গ হিসেবে আঁকে।'],
 analyze:['Read the rhythm carefully','ছন্দটি বুঝে পড়ো','We can count how often a wave repeats. One rhythm alone does not tell us exactly what someone is thinking.','তরঙ্গ কতবার ফিরছে তা গোনা যায়। শুধু একটি ছন্দ দেখে কেউ ঠিক কী ভাবছে জানা যায় না।'],
};
Object.assign(simpleSteps,{
 "skin": [
  "Your skin notices touch",
  "ত্বক স্পর্শ টের পায়",
  "Tiny endings in your skin respond when an object presses or stretches it.",
  "কোনো বস্তু চাপ দিলে বা টানলে ত্বকের ছোট সংবেদী প্রান্ত সাড়া দেয়।"
 ],
 "sensory-axon": [
  "The message leaves your hand",
  "হাত থেকে সংকেত রওনা দেয়",
  "Electrical pulses travel along a sensory nerve toward your spinal cord.",
  "বৈদ্যুতিক স্পন্দন সংবেদী স্নায়ু দিয়ে সুষুম্নার দিকে যায়।"
 ],
 "dorsal-column": [
  "Travel up the spinal cord",
  "সুষুম্না দিয়ে ওপরে যাও",
  "Touch information travels upward and passes through a relay before continuing toward the brain.",
  "স্পর্শের তথ্য ওপরে ওঠে এবং একটি রিলে পেরিয়ে মস্তিষ্কের দিকে যায়।"
 ],
 "somatic-thalamus": [
  "A relay for body feelings",
  "দেহের অনুভবের রিলে",
  "The thalamus passes body-sensation information toward the cortex.",
  "থ্যালামাস দেহের অনুভবের তথ্য কর্টেক্সের দিকে পাঠায়।"
 ],
 "somatic": [
  "Feel where you were touched",
  "কোথায় স্পর্শ হয়েছে বোঝো",
  "This part of the cortex helps work out where a touch happened and what it felt like.",
  "কর্টেক্সের এই অংশ কোথায় স্পর্শ হয়েছে ও কেমন লেগেছে বুঝতে সাহায্য করে।"
 ],
 "membrane": [
  "A cell’s voltage changes",
  "কোষের ভোল্টেজ বদলায়",
  "A nerve cell has an electrical difference across its thin outer membrane. Incoming information can change that difference.",
  "স্নায়ুকোষের পাতলা ঝিল্লির দুই পাশে বৈদ্যুতিক পার্থক্য থাকে। নতুন তথ্য এলে সেই পার্থক্য বদলাতে পারে।"
 ],
 "axon-spike": [
  "An electrical pulse travels",
  "বৈদ্যুতিক স্পন্দন এগিয়ে যায়",
  "The nerve rebuilds the pulse along its length. Myelin wraps around parts of the nerve and helps it carry signals faster.",
  "স্নায়ু তার দৈর্ঘ্য বরাবর স্পন্দন নতুন করে তৈরি করে। মায়েলিনের আবরণ সংকেত দ্রুত বহনে সাহায্য করে।"
 ],
 "synaptic": [
  "Pass a message to another cell",
  "অন্য কোষে সংকেত দাও",
  "One nerve ending releases a chemical across a tiny gap. Receptors on the next cell respond to it.",
  "স্নায়ুর প্রান্ত ছোট ফাঁকে রাসায়নিক ছাড়ে। পরের কোষের রিসেপ্টর তাতে সাড়া দেয়।"
 ],
 "integration": [
  "Combine the incoming messages",
  "আসা সংকেতগুলো একত্র করো",
  "A cell receives many inputs. Their timing and strength help determine what the cell does next.",
  "একটি কোষ অনেক সংকেত পায়। তাদের সময় ও শক্তি কোষের পরের কাজে প্রভাব ফেলে।"
 ],
 "glial-support": [
  "Meet the helper cells",
  "সহায়ক কোষের সঙ্গে পরিচয়",
  "Glial cells help maintain the surroundings of neurons, build myelin and support the brain’s defenses.",
  "গ্লিয়াল কোষ নিউরনের পরিবেশ ঠিক রাখে, মায়েলিন তৈরি করে ও মস্তিষ্কের প্রতিরক্ষায় সাহায্য করে।"
 ],
 "gap-junction": [
  "A direct connection",
  "সরাসরি একটি সংযোগ",
  "Tiny channels connect neighboring cells. Electrical current can pass directly through them.",
  "ছোট চ্যানেল পাশের কোষগুলোকে যুক্ত করে। তাদের দিয়ে বৈদ্যুতিক প্রবাহ সরাসরি যেতে পারে।"
 ],
 "modulator": [
  "A chemical changes the response",
  "রাসায়নিক সাড়া বদলায়",
  "This chemical changes how cells respond. Its effect depends on which receptors receive it.",
  "এই রাসায়নিক কোষের সাড়া বদলায়। কোন রিসেপ্টর সেটি পায়, তার উপর ফল নির্ভর করে।"
 ],
 "striatal": [
  "Help select an action",
  "কাজ বাছাইয়ে সাহায্য",
  "Loops connecting the cortex and basal ganglia help select and adjust actions.",
  "কর্টেক্স ও বেসাল গ্যাংলিয়ার সংযোগ কাজ বাছাই ও বদলাতে সাহায্য করে।"
 ],
 "nociceptor": [
  "Notice potentially harmful heat",
  "ক্ষতিকর হতে পারে এমন তাপ টের পাও",
  "Special nerve endings respond to strong heat. The brain will use this information along with other clues to create the experience of pain.",
  "বিশেষ স্নায়ুর প্রান্ত তীব্র তাপে সাড়া দেয়। মস্তিষ্ক অন্য তথ্যের সঙ্গে এটি মিলিয়ে ব্যথার অনুভব তৈরি করে।"
 ],
 "spinothalamic": [
  "Send information upward",
  "তথ্য ওপরে পাঠাও",
  "Some information travels up from the spinal cord to brainstem and thalamic relays.",
  "কিছু তথ্য সুষুম্না থেকে ব্রেনস্টেম ও থ্যালামাসের রিলেতে ওঠে।"
 ],
 "pain-aware": [
  "Several areas work on pain",
  "কয়েকটি অঞ্চল ব্যথার কাজে অংশ নেয়",
  "Different brain areas help locate the problem, process how unpleasant it feels and consider a response.",
  "বিভিন্ন অঞ্চল সমস্যার স্থান, অস্বস্তির অনুভব ও প্রতিক্রিয়া বুঝতে সাহায্য করে।"
 ],
 "reflex": [
  "A fast spinal response",
  "সুষুম্নার দ্রুত সাড়া",
  "A local circuit can begin pulling the hand away before the brain makes you consciously aware of the heat.",
  "তাপ সচেতনভাবে বোঝার আগেই স্থানীয় সার্কিট হাত সরানো শুরু করতে পারে।"
 ],
 "withdraw": [
  "Move the hand away",
  "হাত সরিয়ে নাও",
  "Muscles pull the hand away. At the same time, other signals continue traveling toward the brain.",
  "পেশি হাত সরিয়ে নেয়। একই সময় অন্য সংকেত মস্তিষ্কের দিকে যেতে থাকে।"
 ],
 "spindle": [
  "Sense a muscle’s stretch",
  "পেশির প্রসারণ টের পাও",
  "Muscle spindles sense length changes. Separate sensors in tendons help detect tension.",
  "মাসল স্পিন্ডল দৈর্ঘ্যের পরিবর্তন বোঝে। টেন্ডনের আলাদা সেন্সর টান শনাক্ত করে।"
 ],
 "leg-dorsal": [
  "Carry position information",
  "অবস্থানের তথ্য বহন করো",
  "Information about your leg travels upward through the spinal cord. Different branches support awareness and movement correction.",
  "পায়ের তথ্য সুষুম্না দিয়ে ওপরে যায়। আলাদা শাখা অবস্থান বোঝা ও চলন সংশোধনে সাহায্য করে।"
 ],
 "posture": [
  "Adjust your posture",
  "দেহের ভঙ্গি বদলাও",
  "Muscles make small adjustments that help you stay balanced. Fresh sensory information keeps coming back.",
  "ভারসাম্য রাখতে পেশি ছোট পরিবর্তন করে। নতুন সংবেদী তথ্য বারবার ফিরে আসে।"
 ],
 "cerebellar": [
  "Compare and fine-tune",
  "তুলনা করে ঠিক করো",
  "The cerebellum helps compare expected movement with incoming feedback and improve coordination.",
  "সেরিবেলাম প্রত্যাশিত চলন ও ফিরতি তথ্য তুলনা করে সমন্বয় উন্নত করতে সাহায্য করে।"
 ],
 "language-meaning": [
  "Understand the words",
  "কথার অর্থ বোঝো",
  "Connected brain areas use sounds, memory and context to help you understand a word.",
  "যুক্ত অঞ্চল শব্দ, স্মৃতি ও পরিস্থিতি মিলিয়ে কথা বুঝতে সাহায্য করে।"
 ],
 "language-plan": [
  "Prepare something to say",
  "বলবার কথা প্রস্তুত করো",
  "Language and movement networks help arrange the sounds and movements needed for speech.",
  "ভাষা ও চলনের জাল কথা বলার শব্দ ও নড়াচড়া সাজাতে সাহায্য করে।"
 ],
 "hypoglossal": [
  "Send a message to the tongue",
  "জিহ্বায় সংকেত পাঠাও",
  "A motor nerve carries commands that control tongue movements.",
  "একটি মোটর স্নায়ু জিহ্বা নাড়ানোর নির্দেশ বহন করে।"
 ],
 "speak": [
  "Muscles make speech possible",
  "পেশি কথা বলা সম্ভব করে",
  "Your tongue, lips, voice box and breathing muscles coordinate to produce speech.",
  "জিহ্বা, ঠোঁট, স্বরযন্ত্র ও শ্বাসের পেশি সমন্বয় করে কথা তৈরি করে।"
 ],
 "working": [
  "Keep useful information in mind",
  "কাজের তথ্য মনে রাখো",
  "Brain networks keep some information available briefly so you can use it for the task.",
  "মস্তিষ্কের জাল কাজের জন্য কিছু তথ্য অল্প সময় ব্যবহারযোগ্য রাখে।"
 ],
 "attention-select": [
  "Pay attention to what matters",
  "দরকারি বিষয়ে মন দাও",
  "Attention changes which information gets more processing for your current goal.",
  "এখনকার লক্ষ্যের জন্য কোন তথ্য বেশি প্রক্রিয়াকরণ পাবে, মনোযোগ তা বদলায়।"
 ],
 "regulation": [
  "Look at the situation again",
  "পরিস্থিতি আবার বিবেচনা করো",
  "Your brain can use context and past learning to adjust an emotional response.",
  "মস্তিষ্ক পরিস্থিতি ও আগের শেখা ব্যবহার করে আবেগের সাড়া বদলাতে পারে।"
 ],
 "hippocampal": [
  "Connect an experience together",
  "অভিজ্ঞতার অংশ জুড়ে নাও",
  "The hippocampus helps link parts of an event with where and when it happened.",
  "হিপোক্যাম্পাস ঘটনার অংশগুলোকে কোথায় ও কখন ঘটেছে তার সঙ্গে জুড়তে সাহায্য করে।"
 ],
 "cortical-memory": [
  "Memories use many connections",
  "স্মৃতিতে অনেক সংযোগ লাগে",
  "Different features of an experience depend on networks spread across the brain.",
  "অভিজ্ঞতার ভিন্ন বৈশিষ্ট্য মস্তিষ্কজুড়ে ছড়ানো জালের উপর নির্ভর করে।"
 ],
 "retrieval": [
  "Use a clue to remember",
  "সূত্র দিয়ে মনে করো",
  "A familiar clue can help reactivate information from an earlier experience.",
  "চেনা কোনো সূত্র আগের অভিজ্ঞতার তথ্য আবার সক্রিয় করতে সাহায্য করে।"
 ],
 "arousal": [
  "Support being awake and alert",
  "জেগে ও সতর্ক থাকতে সাহায্য",
  "Brainstem and other connected systems help maintain the conditions needed for wakefulness.",
  "ব্রেনস্টেম ও অন্য যুক্ত ব্যবস্থা জেগে থাকার প্রয়োজনীয় অবস্থা বজায় রাখতে সাহায্য করে।"
 ],
 "dopaminergic": [
  "Learn from an outcome",
  "ফল থেকে শেখো",
  "Dopamine signals can help learning circuits update after outcomes differ from expectations.",
  "ফল প্রত্যাশার থেকে আলাদা হলে ডোপামিনের সংকেত শেখার সার্কিট বদলাতে সাহায্য করতে পারে।"
 ],
 "plastic-change": [
  "Experience changes connections",
  "অভিজ্ঞতায় সংযোগ বদলায়",
  "Repeated activity can change how strongly cells influence each other. These changes take time.",
  "বারবার কাজ করলে কোষের পারস্পরিক প্রভাবের শক্তি বদলাতে পারে। এতে সময় লাগে।"
 ],
 "development": [
  "Build and refine connections",
  "সংযোগ তৈরি ও পরিমার্জন",
  "As the nervous system develops, cells form connections and many connections are refined. This happens over long periods.",
  "স্নায়ুতন্ত্রের বিকাশে কোষ সংযোগ তৈরি করে এবং অনেক সংযোগ পরিমার্জিত হয়। এতে দীর্ঘ সময় লাগে।"
 ],
 "conditioned-cue": [
  "A sound can become a clue",
  "শব্দ একটি সূত্র হয়ে ওঠে",
  "If a sound has often come with food, learning can make that sound trigger an early body response.",
  "খাবারের সঙ্গে বারবার শব্দ এলে, শেখার ফলে শুধু শব্দেও আগাম দেহের সাড়া হতে পারে।"
 ],
 "hypothalamic": [
  "Help balance the body’s needs",
  "দেহের চাহিদার ভারসাম্য",
  "The hypothalamus helps coordinate signals about things such as water, temperature and energy needs.",
  "হাইপোথ্যালামাস পানি, তাপমাত্রা ও শক্তির চাহিদার মতো তথ্য সমন্বয় করতে সাহায্য করে।"
 ],
 "salivate": [
  "The salivary glands respond",
  "লালাগ্রন্থি সাড়া দেয়",
  "Nerve signals can tell the salivary glands to release saliva, helping prepare for food.",
  "স্নায়ুর সংকেত লালাগ্রন্থিকে লালা ছাড়তে বলে খাবারের প্রস্তুতিতে সাহায্য করতে পারে।"
 ],
 "amygdala": [
  "Consider what the situation means",
  "পরিস্থিতির তাৎপর্য বোঝো",
  "The amygdala works with other regions to evaluate information in the light of experience and context.",
  "অ্যামিগডালা অন্য অঞ্চলের সঙ্গে অভিজ্ঞতা ও পরিস্থিতি অনুযায়ী তথ্য মূল্যায়ন করে।"
 ],
 "sympathetic": [
  "Adjust the body for action",
  "কাজের জন্য দেহ প্রস্তুত করো",
  "Autonomic nerve pathways can change how organs work as the body’s needs change.",
  "দেহের চাহিদা বদলালে স্বায়ত্তশাসিত স্নায়ুপথ অঙ্গের কাজ বদলাতে পারে।"
 ],
 "heart-response": [
  "The heart adjusts",
  "হৃৎপিণ্ড কাজ বদলায়",
  "Nerve and chemical signals can change the heart’s rate and strength of contraction.",
  "স্নায়ু ও রাসায়নিক সংকেত হৃদস্পন্দনের হার ও সংকোচনের শক্তি বদলাতে পারে।"
 ],
 "accumbens": [
  "Connect motivation with action",
  "প্রেরণাকে কাজের সঙ্গে যুক্ত করো",
  "The ventral striatum helps connect information about goals and outcomes with actions.",
  "ভেন্ট্রাল স্ট্রায়াটাম লক্ষ্য ও ফলের তথ্যকে কাজের সঙ্গে যুক্ত করতে সাহায্য করে।"
 ],
 "crh": [
  "Start a hormone message",
  "হরমোনের সংকেত শুরু করো",
  "The hypothalamus releases a chemical messenger that reaches the nearby pituitary gland through special blood vessels.",
  "হাইপোথ্যালামাস রাসায়নিক বার্তাবাহক ছাড়ে। বিশেষ রক্তনালি দিয়ে তা কাছের পিটুইটারি গ্রন্থিতে যায়।"
 ],
 "acth": [
  "The pituitary passes it on",
  "পিটুইটারি সংকেত এগিয়ে দেয়",
  "The pituitary releases ACTH into the blood. This hormone travels to the adrenal glands.",
  "পিটুইটারি রক্তে ACTH ছাড়ে। এই হরমোন অ্যাড্রিনাল গ্রন্থিতে যায়।"
 ],
 "cortisol": [
  "The adrenal glands respond",
  "অ্যাড্রিনাল গ্রন্থি সাড়া দেয়",
  "The adrenal cortex releases cortisol. Blood carries it around the body, and feedback helps regulate the system.",
  "অ্যাড্রিনাল কর্টেক্স কর্টিসল ছাড়ে। রক্ত তা দেহে বহন করে, আর ফিরতি তথ্য ব্যবস্থা নিয়ন্ত্রণে সাহায্য করে।"
 ],
 "awareness": [
  "Information becomes available to report",
  "বলার মতো করে তথ্য উপলব্ধ হয়",
  "Many interacting brain systems contribute to conscious experience. There is no single tiny awareness switch.",
  "অনেক যুক্ত মস্তিষ্ক-ব্যবস্থা সচেতন অভিজ্ঞতায় অংশ নেয়। সচেতনতার একটিমাত্র ছোট সুইচ নেই।"
 ],
 "clock-retina": [
  "Light helps set the body clock",
  "আলো দেহঘড়ি ঠিক করতে সাহায্য করে",
  "Some retinal cells send information about light to the brain’s daily timing system.",
  "রেটিনার কিছু কোষ আলো সম্পর্কে মস্তিষ্কের দৈনিক সময়ব্যবস্থায় তথ্য পাঠায়।"
 ],
 "scn": [
  "Keep track of day and night",
  "দিন-রাতের সময় রাখো",
  "A small region in the hypothalamus helps coordinate daily rhythms, using light as an important cue.",
  "হাইপোথ্যালামাসের ছোট অঞ্চল আলোকে গুরুত্বপূর্ণ সূত্র হিসেবে নিয়ে দৈনিক ছন্দ সমন্বয় করে।"
 ],
 "pineal": [
  "A signal about biological night",
  "দেহের রাত সম্পর্কে সংকেত",
  "The pineal gland releases melatonin in a daily pattern linked with the body clock.",
  "পিনিয়াল গ্রন্থি দেহঘড়ির সঙ্গে যুক্ত দৈনিক ছন্দে মেলাটোনিন ছাড়ে।"
 ],
 "sleep-switch": [
  "Shift between sleep and waking",
  "ঘুম ও জাগরণের মধ্যে বদলাও",
  "Interacting networks help regulate sleep and wakefulness. Sleep changes through different stages.",
  "পরস্পর যুক্ত জাল ঘুম ও জাগরণ নিয়ন্ত্রণে সাহায্য করে। ঘুম বিভিন্ন ধাপে বদলায়।"
 ],
 "sleep-muscles": [
  "The body keeps working during sleep",
  "ঘুমেও দেহ কাজ করে",
  "Breathing continues while muscle activity changes with the stage of sleep. Most muscle tone is strongly reduced in REM sleep.",
  "ঘুমের ধাপ অনুযায়ী পেশির কাজ বদলালেও শ্বাস চলে। REM ঘুমে অধিকাংশ পেশির টান খুব কমে।"
 ],
 "odor": [
  "Smell begins in the nose",
  "নাকে গন্ধের শুরু",
  "Airborne molecules reach receptors in the nose and change the activity of smell-sensing cells.",
  "বাতাসের অণু নাকের রিসেপ্টরে পৌঁছে গন্ধ-সংবেদী কোষের কাজ বদলায়।"
 ],
 "olfactory": [
  "Pass through the smell pathway",
  "গন্ধের পথ দিয়ে যাও",
  "Smell signals reach the olfactory bulb and connected brain areas.",
  "গন্ধের সংকেত অলফ্যাক্টরি বাল্ব ও যুক্ত মস্তিষ্ক-অঞ্চলে পৌঁছায়।"
 ],
 "odor-memory": [
  "A smell can bring back a memory",
  "গন্ধে স্মৃতি ফিরতে পারে",
  "Smell-processing areas interact with networks involved in memory and emotion.",
  "গন্ধ প্রক্রিয়ার অঞ্চল স্মৃতি ও আবেগের জালের সঙ্গে যোগাযোগ করে।"
 ],
 "vagal": [
  "Signals travel through the vagus",
  "ভেগাস দিয়ে সংকেত যায়",
  "The vagus carries messages between the brainstem and several internal organs.",
  "ভেগাস ব্রেনস্টেম ও কয়েকটি ভেতরের অঙ্গের মধ্যে সংকেত বহন করে।"
 ],
 "digest": [
  "Digestive organs adjust their work",
  "হজমের অঙ্গ কাজ বদলায়",
  "Local circuits, nerves and hormones help coordinate movement and secretions in the digestive tract.",
  "স্থানীয় সার্কিট, স্নায়ু ও হরমোন হজমের নালিতে চলন ও রস ছাড়া সমন্বয় করে।"
 ],
 "taste": [
  "Taste cells detect dissolved chemicals",
  "স্বাদের কোষ রাসায়নিক শনাক্ত করে",
  "Taste receptor cells respond to chemicals dissolved in saliva and communicate with nerves.",
  "লালায় মেশা রাসায়নিকে স্বাদের রিসেপ্টর কোষ সাড়া দিয়ে স্নায়ুর সঙ্গে যোগাযোগ করে।"
 ],
 "nts": [
  "The brainstem receives body messages",
  "ব্রেনস্টেম দেহের সংকেত পায়",
  "This brainstem relay receives information from internal organs and taste-related pathways.",
  "ব্রেনস্টেমের এই রিলে ভেতরের অঙ্গ ও স্বাদের পথ থেকে তথ্য পায়।"
 ],
 "taste-thalamus": [
  "A relay for taste information",
  "স্বাদের তথ্যের রিলে",
  "Taste information passes through a thalamic relay on its way to the cortex.",
  "স্বাদের তথ্য কর্টেক্সে যাওয়ার পথে থ্যালামাসের একটি রিলে পেরোয়।"
 ],
 "gustatory": [
  "Build the experience of taste",
  "স্বাদের অভিজ্ঞতা তৈরি হয়",
  "Connected cortical areas process taste information and help evaluate food.",
  "যুক্ত কর্টেক্স অঞ্চল স্বাদের তথ্য প্রক্রিয়া করে ও খাবার মূল্যায়নে সাহায্য করে।"
 ],
 "vestibular-hair": [
  "Sense head movement",
  "মাথার নড়াচড়া টের পাও",
  "Sensors in the inner ear respond to head movement and orientation, helping the body keep its balance.",
  "ভেতরের কানের সেন্সর মাথার চলন ও অবস্থানে সাড়া দিয়ে ভারসাম্যে সাহায্য করে।"
 ],
 "vestibular-nuclei": [
  "Combine balance information",
  "ভারসাম্যের তথ্য মিলিয়ে নাও",
  "Brainstem and cerebellar circuits use balance signals to help adjust the eyes and posture.",
  "ব্রেনস্টেম ও সেরিবেলামের সার্কিট ভারসাম্যের সংকেতে চোখ ও দেহের ভঙ্গি ঠিক করে।"
 ],
 "oculomotor": [
  "Send commands to eye muscles",
  "চোখের পেশিতে নির্দেশ পাঠাও",
  "Motor circuits send commands through cranial nerves to move the eyes.",
  "মোটর সার্কিট করোটীয় স্নায়ু দিয়ে চোখ নাড়ানোর নির্দেশ পাঠায়।"
 ],
 "eye-muscles": [
  "Keep the view steady",
  "দৃষ্টিকে স্থির রাখো",
  "Eye muscles adjust their pull to move the eyes or stabilize the view as the head moves.",
  "চোখের পেশি টান বদলে চোখ নাড়ায় বা মাথা নড়ার সময় দৃষ্টি স্থির রাখে।"
 ],
 "callosal": [
  "Share between the two sides",
  "দুই পাশে তথ্য ভাগ করো",
  "Bundles of fibers connect the brain’s hemispheres so information can pass between them.",
  "তন্তুর গুচ্ছ মস্তিষ্কের দুই গোলার্ধ যুক্ত করে, যাতে তথ্য আদান-প্রদান হয়।"
 ],
 "baroreceptor": [
  "Sense blood-pressure changes",
  "রক্তচাপের পরিবর্তন বোঝো",
  "Stretch-sensitive endings in major arteries detect changes that help the nervous system regulate circulation.",
  "বড় ধমনির প্রসারণসংবেদী প্রান্ত পরিবর্তন শনাক্ত করে রক্তসঞ্চালন নিয়ন্ত্রণে সাহায্য করে।"
 ],
 "heart-fast": [
  "The heartbeat can speed up",
  "হৃদস্পন্দন বাড়তে পারে",
  "Autonomic signals can increase heart rate and contraction strength when needed.",
  "প্রয়োজনে স্বায়ত্তশাসিত সংকেত হৃদস্পন্দনের হার ও সংকোচনের শক্তি বাড়াতে পারে।"
 ],
 "gut-sense": [
  "The gut sends updates",
  "পেট তথ্য পাঠায়",
  "Stretch and chemical signals tell the nervous system about conditions in the digestive tract.",
  "প্রসারণ ও রাসায়নিক সংকেত হজমের নালির অবস্থা স্নায়ুতন্ত্রকে জানায়।"
 ],
 "thirst-sense": [
  "Monitor the body’s fluids",
  "দেহের তরলের অবস্থা দেখো",
  "The body detects changes in fluid concentration and volume. These signals help regulate thirst and water balance.",
  "দেহ তরলের ঘনত্ব ও পরিমাণের পরিবর্তন বোঝে। এই তথ্য তৃষ্ণা ও পানির ভারসাম্য নিয়ন্ত্রণে সাহায্য করে।"
 ],
 "adh": [
  "Send a water-saving hormone",
  "পানি বাঁচানোর হরমোন পাঠাও",
  "Vasopressin enters the blood and can tell the kidneys to keep more water.",
  "ভ্যাসোপ্রেসিন রক্তে মিশে বৃক্ককে বেশি পানি ধরে রাখতে বলতে পারে।"
 ],
 "kidney": [
  "Keep more water when needed",
  "প্রয়োজনে বেশি পানি রাখো",
  "The kidneys adjust how much water returns to the blood and how much leaves in urine.",
  "বৃক্ক কত পানি রক্তে ফিরবে ও কতটা প্রস্রাবে যাবে তা বদলায়।"
 ],
 "temperature": [
  "Notice temperature changes",
  "তাপমাত্রার পরিবর্তন বোঝো",
  "Sensors in the skin and inside the body provide information about temperature.",
  "ত্বক ও দেহের ভেতরের সেন্সর তাপমাত্রার তথ্য দেয়।"
 ],
 "sweat": [
  "Help release extra heat",
  "বাড়তি তাপ ছাড়তে সাহায্য",
  "Sweating and changes in skin blood flow can help the body lose heat.",
  "ঘাম ও ত্বকের রক্তপ্রবাহের পরিবর্তন দেহকে তাপ ছাড়তে সাহায্য করে।"
 ],
 "heart-slow": [
  "The heartbeat can slow down",
  "হৃদস্পন্দন কমতে পারে",
  "Parasympathetic signals can slow the heart’s pacemaker as part of regulating circulation.",
  "রক্তসঞ্চালন নিয়ন্ত্রণে প্যারাসিমপ্যাথেটিক সংকেত হৃৎপিণ্ডের পেসমেকার ধীর করতে পারে।"
 ],
 "oxytocin-release": [
  "Release a hormone into blood",
  "রক্তে হরমোন ছাড়ো",
  "Oxytocin made by hypothalamic neurons can be released into the bloodstream from the posterior pituitary.",
  "হাইপোথ্যালামাসের নিউরনে তৈরি অক্সিটোসিন পেছনের পিটুইটারি থেকে রক্তে ছাড়া হতে পারে।"
 ],
 "milk-ejection": [
  "A hormone helps release milk",
  "হরমোন দুধ বেরোতে সাহায্য করে",
  "During lactation, oxytocin helps small contractile cells push milk toward the ducts.",
  "দুগ্ধদানের সময় অক্সিটোসিন ছোট সংকোচনশীল কোষকে দুধ নালির দিকে ঠেলতে সাহায্য করে।"
 ],
 "breath": [
  "Bring oxygen into the body",
  "দেহে অক্সিজেন আনো",
  "Air reaches the lungs. Oxygen crosses into the blood, where red blood cells carry most of it.",
  "বাতাস ফুসফুসে আসে। অক্সিজেন রক্তে ঢোকে, যার বেশিরভাগ লোহিত কণিকা বহন করে।"
 ],
 "glucose-blood": [
  "Carry fuel in the blood",
  "রক্তে শক্তির উপাদান বহন করো",
  "Glucose enters or is released into the circulation. Blood transports it to tissues that need energy.",
  "গ্লুকোজ রক্তসঞ্চালনে আসে বা ছাড়া হয়। রক্ত তা শক্তি-প্রয়োজনীয় টিস্যুতে নিয়ে যায়।"
 ],
 "arterial": [
  "Blood brings supplies to the brain",
  "রক্ত মস্তিষ্কে উপকরণ আনে",
  "Arteries carry blood toward brain tissue, delivering oxygen and nutrients.",
  "ধমনি মস্তিষ্কের টিস্যুতে রক্ত নিয়ে যায়, অক্সিজেন ও পুষ্টি পৌঁছে দেয়।"
 ],
 "bbb": [
  "A selective boundary",
  "বাছাই করা সীমানা",
  "Special vessel walls carefully control which substances pass between blood and brain tissue.",
  "বিশেষ নালির দেয়াল রক্ত ও মস্তিষ্কের টিস্যুর মধ্যে কী যাবে তা নিয়ন্ত্রণ করে।"
 ],
 "energy": [
  "Cells use fuel to do work",
  "কোষ কাজে শক্তি খরচ করে",
  "Cells use oxygen and nutrients to support energy production. That energy helps maintain signals and many other jobs.",
  "কোষ অক্সিজেন ও পুষ্টি দিয়ে শক্তি উৎপাদন করে। সেই শক্তি সংকেত ও আরও অনেক কাজ চালায়।"
 ],
 "venous": [
  "Blood returns from the brain",
  "মস্তিষ্ক থেকে রক্ত ফেরে",
  "Veins and venous channels collect blood from brain tissue and carry it back toward the heart.",
  "শিরা ও শিরার চ্যানেল মস্তিষ্কের টিস্যু থেকে রক্ত সংগ্রহ করে হৃৎপিণ্ডে ফেরায়।"
 ],
 "local-flow": [
  "Adjust blood supply locally",
  "স্থানীয় রক্ত সরবরাহ বদলাও",
  "Active brain tissue can signal nearby vessels to adjust the supply of blood.",
  "সক্রিয় মস্তিষ্কের টিস্যু কাছের নালিকে রক্ত সরবরাহ বদলাতে সংকেত দিতে পারে।"
 ],
 "choroid": [
  "Make protective fluid",
  "রক্ষাকারী তরল তৈরি করো",
  "Special tissue in the brain’s fluid spaces makes much of the cerebrospinal fluid, or CSF.",
  "মস্তিষ্কের তরলপূর্ণ স্থানের বিশেষ টিস্যু অধিকাংশ সেরিব্রোস্পাইনাল ফ্লুইড বা CSF তৈরি করে।"
 ],
 "ventricular": [
  "Fluid moves through connected spaces",
  "যুক্ত স্থান দিয়ে তরল চলে",
  "CSF moves through the brain’s connected ventricles before reaching spaces around the brain and spinal cord.",
  "CSF যুক্ত ভেন্ট্রিকল দিয়ে মস্তিষ্ক ও সুষুম্নার চারপাশের স্থানে যায়।"
 ],
 "csf-around": [
  "Fluid surrounds brain and cord",
  "তরল মস্তিষ্ক ও সুষুম্না ঘিরে থাকে",
  "CSF surrounds the brain and spinal cord, helping provide cushioning and a controlled environment.",
  "CSF মস্তিষ্ক ও সুষুম্না ঘিরে ধাক্কা থেকে রক্ষা ও পরিবেশ বজায় রাখতে সাহায্য করে।"
 ],
 "csf-covering": [
  "Layers protect the nervous system",
  "আবরণ স্নায়ুতন্ত্রকে রক্ষা করে",
  "Protective tissue layers surround the brain and spinal cord. Each layer has its own structure and role.",
  "রক্ষাকারী টিস্যুর স্তর মস্তিষ্ক ও সুষুম্না ঘিরে থাকে। প্রতিটি স্তরের গঠন ও ভূমিকা আলাদা।"
 ],
 "face-sense": [
  "The face sends sensory messages",
  "মুখ অনুভবের সংকেত পাঠায়",
  "Sensory endings in the face send information through branches of the trigeminal nerve.",
  "মুখের সংবেদী প্রান্ত ট্রাইজেমিনাল স্নায়ুর শাখা দিয়ে তথ্য পাঠায়।"
 ],
 "trigeminal": [
  "A brainstem relay for the face",
  "মুখের জন্য ব্রেনস্টেমের রিলে",
  "Trigeminal pathways relay information about touch and other sensations from the face.",
  "ট্রাইজেমিনাল পথ মুখের স্পর্শ ও অন্য অনুভবের তথ্য পাঠায়।"
 ],
 "face-thalamus": [
  "Pass facial information onward",
  "মুখের তথ্য এগিয়ে দাও",
  "A thalamic relay helps carry facial sensation toward the cortex.",
  "থ্যালামাসের রিলে মুখের অনুভব কর্টেক্সে বহনে সাহায্য করে।"
 ],
 "facial-motor": [
  "Prepare a facial movement",
  "মুখ নাড়ানোর প্রস্তুতি",
  "Motor cells in the brainstem send commands through the facial nerve.",
  "ব্রেনস্টেমের মোটর কোষ ফেসিয়াল স্নায়ু দিয়ে নির্দেশ পাঠায়।"
 ],
 "smile": [
  "Facial muscles respond",
  "মুখের পেশি সাড়া দেয়",
  "Coordinated contractions of facial muscles change your expression.",
  "মুখের পেশির সমন্বিত সংকোচনে অভিব্যক্তি বদলায়।"
 ],
 "aging-change": [
  "The brain changes over time",
  "সময়ের সঙ্গে মস্তিষ্ক বদলায়",
  "Brain structures and connections can change with age. People’s abilities and experiences vary widely.",
  "বয়সের সঙ্গে মস্তিষ্কের গঠন ও সংযোগ বদলাতে পারে। মানুষের ক্ষমতা ও অভিজ্ঞতা অনেক ভিন্ন হয়।"
 ],
 "stroke-flow": [
  "A blood-supply problem",
  "রক্ত সরবরাহে সমস্যা",
  "If a brain region loses its blood supply, the cells may not get the oxygen and fuel they need.",
  "মস্তিষ্কের কোনো অঞ্চলে রক্ত সরবরাহ বন্ধ হলে কোষ প্রয়োজনীয় অক্সিজেন ও শক্তি নাও পেতে পারে।"
 ],
 "weak-movement": [
  "Movement signals can be disrupted",
  "চলনের সংকেত বাধা পেতে পারে",
  "Damage to movement pathways can make it harder to activate the intended muscles.",
  "চলনের পথ ক্ষতিগ্রস্ত হলে নির্দিষ্ট পেশি সক্রিয় করা কঠিন হতে পারে।"
 ],
 "seizure": [
  "Unusual activity spreads in a network",
  "জালে অস্বাভাবিক কাজ ছড়ায়",
  "A seizure involves abnormal electrical activity in brain networks. The effects depend on the networks involved.",
  "খিঁচুনিতে মস্তিষ্কের জালে অস্বাভাবিক বৈদ্যুতিক কাজ হয়। ফল নির্ভর করে কোন জাল যুক্ত তার উপর।"
 ],
 "nigral-change": [
  "A movement circuit loses support",
  "চলনের সার্কিট সহায়তা হারায়",
  "Reduced dopamine input can change how movement-related brain loops work.",
  "ডোপামিনের তথ্য কমলে চলনের সঙ্গে যুক্ত মস্তিষ্কের লুপের কাজ বদলাতে পারে।"
 ],
 "memory-disruption": [
  "Memory connections are affected",
  "স্মৃতির সংযোগ প্রভাবিত হয়",
  "Changes in memory-related networks can make forming or retrieving memories harder.",
  "স্মৃতির জালে পরিবর্তন হলে নতুন স্মৃতি তৈরি বা মনে করা কঠিন হতে পারে।"
 ],
 "migraine-circuit": [
  "Sensory and pain pathways change",
  "সংবেদী ও ব্যথার পথে পরিবর্তন",
  "Migraine involves interacting sensory and pain-related systems. The experience differs between people.",
  "মাইগ্রেনে পরস্পর যুক্ত সংবেদী ও ব্যথার ব্যবস্থা অংশ নেয়। সবার অভিজ্ঞতা এক নয়।"
 ],
 "axonal-injury": [
  "An injury interrupts communication",
  "আঘাতে যোগাযোগে বাধা হয়",
  "Injury can disrupt nerve fibers and the networks that depend on them.",
  "আঘাতে স্নায়ুতন্তু ও তাদের উপর নির্ভরশীল জালের কাজে বাধা হতে পারে।"
 ],
 "tissue": [
  "Look at tissue and fluid",
  "টিস্যু ও তরল দেখো",
  "Different scanning methods respond to different physical properties of the body’s tissues.",
  "ভিন্ন স্ক্যান দেহের টিস্যুর ভিন্ন ভৌত বৈশিষ্ট্য মাপে।"
 ],
 "measurement": [
  "A machine takes a measurement",
  "যন্ত্র মাপ নেয়",
  "The equipment detects a physical signal and turns it into a recording or image. What it shows depends on the method.",
  "যন্ত্র ভৌত সংকেত শনাক্ত করে রেকর্ড বা ছবি তৈরি করে। কী দেখা যাবে তা পদ্ধতির উপর নির্ভর করে।"
 ],
 "implant-record": [
  "A sensor records activity",
  "সেন্সর কাজ রেকর্ড করে",
  "A sensor near brain tissue records electrical activity that can be analyzed by a computer.",
  "মস্তিষ্কের টিস্যুর কাছে সেন্সর বৈদ্যুতিক কাজ রেকর্ড করে, যা কম্পিউটারে বিশ্লেষণ করা যায়।"
 ],
 "decoder": [
  "A computer estimates a command",
  "কম্পিউটার নির্দেশ অনুমান করে",
  "A trained computer model looks for patterns in the recording and estimates an intended command.",
  "প্রশিক্ষিত কম্পিউটার মডেল রেকর্ডের ধরন দেখে সম্ভাব্য নির্দেশ অনুমান করে।"
 ],
 "prosthetic": [
  "A device carries out a command",
  "যন্ত্র নির্দেশ পালন করে",
  "The decoded command can control a device, such as a prosthetic hand. Feedback helps the user adjust.",
  "অনুমিত নির্দেশ কৃত্রিম হাতের মতো যন্ত্র চালাতে পারে। ফিরতি তথ্য ব্যবহারকারীকে মানিয়ে নিতে সাহায্য করে।"
 ],
 "encode-model": [
  "Use a model to explore a question",
  "প্রশ্ন বুঝতে মডেল ব্যবহার করো",
  "A computer model represents selected parts of neural activity. It helps test an idea without reproducing the whole brain.",
  "কম্পিউটার মডেল স্নায়ুর কাজের কিছু অংশ তুলে ধরে। পুরো মস্তিষ্ক না বানিয়েও ধারণা পরীক্ষা করতে সাহায্য করে।"
 ],
 "listen": [
  "Keep listening",
  "শুনতে থাকো",
  "You can keep listening without choosing to turn your head. Recognizing a sound does not require a movement.",
  "মাথা না ঘুরিয়েও শুনতে পারো। শব্দ চিনতে নড়াচড়া করা আবশ্যক নয়।"
 ],
 "brain-home": [
  "Your brain lives inside your head",
  "মাথার ভেতরে তোমার মস্তিষ্ক",
  "Your skull protects your brain. Nerves connect the brain and spinal cord with the rest of your body.",
  "খুলি মস্তিষ্ককে রক্ষা করে। স্নায়ু মস্তিষ্ক ও সুষুম্নাকে দেহের বাকি অংশের সঙ্গে যুক্ত করে।"
 ]
});
export function guideNote(journey,step,lang='en'){
 const custom=step.process===journey.concept.body?null:simpleSteps[step.id];if(custom)return {title:custom[lang==='bn'?1:0],text:custom[lang==='bn'?3:2]};
 const first=step.process?.[lang]?.match(lang==='bn'?/^.*?[।!?](?:\s|$)/:/^.*?[.!?](?:\s|$)/)?.[0]?.trim()||step.process?.[lang]||journey.concept.body[lang];return {title:step.name[lang],text:first};
}
export function guideIntro(journey,lang){const place=places[journey.steps[0]?.body]||places.brain;return lang==='bn'?`প্রথমে পুরো দেহটি দেখো। তারপর ${place.bn} থেকে শুরু করে ধাপে ধাপে “${journey.concept.title.bn}” বুঝব।`:`First, see the whole body. Then we’ll begin at the ${place.en.toLowerCase()} and explore ${journey.concept.title.en.toLowerCase()}, one step at a time.`;}
export function stepSeconds(note){return Math.max(9,Math.min(18,4+note.text.split(/\s+/).length/3))}
