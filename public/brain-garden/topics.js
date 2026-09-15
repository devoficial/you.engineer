import {foundations} from './lessons/foundations.js';
import {cognition} from './lessons/cognition.js';
import {systems} from './lessons/systems.js';
import {advanced} from './lessons/advanced.js';
import {path,text} from './lessons/shared.js';
export const topics=[...foundations,...cognition,...systems,...advanced].sort((a,b)=>a.number-b.number);
const genericNodes=path('Input|ইনপুট','Processing|প্রক্রিয়া','Output|আউটপুট','Feedback|ফিরতি তথ্য');
export function resolveLesson(topic,item){
 const scene=item.scene||topic.scene;
 let nodes=item.nodes||topic.nodes||genericNodes;
 if(['neuron','potential','computational'].includes(scene))nodes=path('Dendrites|ডেনড্রাইট','Soma|সোমা','Axon + myelin|অ্যাক্সন + মায়েলিন','Terminals|টার্মিনাল');
 if(['wave','eeg'].includes(scene))nodes=path('Population activity|কোষসমষ্টির কাজ','Measured signal|মাপা সংকেত');
 if(['synapse','plasticity'].includes(scene))nodes=path('Presynaptic terminal|প্রিসিন্যাপটিক টার্মিনাল','Synaptic cleft|সিন্যাপটিক ফাঁক','Postsynaptic receptors|পোস্টসিন্যাপটিক রিসেপ্টর','Signal clearance|সংকেত পরিষ্কার');
 if(scene==='imaging')nodes=path('Outer layers|বাইরের স্তর','Cortical tissue|কর্টিক্যাল টিস্যু','White matter|শ্বেত পদার্থ','Inner spaces|ভেতরের স্থান');
 if(scene==='attention')nodes=path('Target|লক্ষ্য','Distractors|বিভ্রান্তিকারী');
 return {...topic,...item,topicId:topic.id,scene,nodes,region:item.region||topic.region,frequency:item.frequency||topic.frequency||10,location:item.location||text('Explore the highlighted study region for anatomical context. The lesson may involve other regions too.','অবস্থান বোঝার জন্য চিহ্নিত অঞ্চল দেখো। এই পাঠে অন্য অঞ্চলও জড়িত থাকতে পারে।')};
}
export function parseRoute(hash){const p=new URLSearchParams(hash.replace(/^#/,''));const topic=topics.find(t=>t.id===p.get('topic'))||topics[0];const item=topic.items.find(i=>i.id===p.get('concept'))||topic.items[0];return{topic,item,lang:p.get('lang')==='bn'?'bn':'en',mesh:p.get('mesh')||null}}
export function makeRoute(topic,item,lang,mesh){const p=new URLSearchParams({topic:topic.id,concept:item.id,lang});if(mesh)p.set('mesh',mesh);return '#'+p.toString()}
export function searchTopics(query='',family='all'){
 const q=query.trim().toLocaleLowerCase();return topics.filter(t=>family==='all'||t.family===family).map(t=>({topic:t,items:t.items.filter(i=>!q||[i.title.en,i.title.bn,i.id,t.title.en,t.title.bn,t.id].some(v=>v.toLocaleLowerCase().includes(q)))})).filter(r=>r.items.length);
}
