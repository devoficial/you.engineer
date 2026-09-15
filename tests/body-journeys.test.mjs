import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {topics} from '../public/brain-garden/topics.js';
import {getJourney,journeys,branchSteps,pathwaySources,matchesStructure} from '../public/brain-garden/body/catalogue.js';
import {bodyPoints,routes,organSVG} from '../public/brain-garden/body/art.js';
const lesson=(topic,item)=>{const t=topics.find(t=>t.id===topic);return getJourney(t,t.items.find(i=>i.id===item))};
test('optic-nerve detours are limited to the four explicitly visual lessons',()=>{
 const visual=[];
 for(const t of topics)for(const item of t.items){const j=getJourney(t,item);if(j?.steps.some(s=>s.id==='optic'))visual.push(t.id+'/'+item.id);}
 assert.deepEqual(visual.sort(),['cranial/ii','functional/visual','language/reading','sensory/vision']);
 for(const id of ['record','eeg-interface','implants','decoding','prosthetics']){
  const j=lesson('bci',id);assert.equal(j.steps[0].id,'bci-intent');assert(!j.steps.some(s=>s.body==='eye'));assert(j.steps.some(s=>s.id==='decoder'));assert(j.steps.some(s=>s.id==='prosthetic'));assert.equal(j.steps.at(-1).id,'bci-feedback');
 }
 assert.equal(lesson('memory','episodic').steps[0].id,'hippocampal');
 assert.equal(lesson('eeg','generation').steps[0].id,'population');
 assert.equal(lesson('eeg','erp').steps[0].id,'sound');
 assert(!lesson('sleep','nrem').steps.some(s=>s.body==='eye'));
 assert.equal(lesson('hormones','melatonin').steps[0].id,'clock-retina');
});
test('Every non-anatomy concept has a complete bilingual body journey with valid waypoints and sources',()=>{
 let count=0;const b=fs.readFileSync(new URL('../public/brain-garden/brain.glb',import.meta.url));const gltf=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)));const names=gltf.nodes.filter(n=>n.mesh!==undefined).map(n=>n.name);
 for(const t of topics)for(const item of t.items){const j=getJourney(t,item);if(t.id==='anatomy'){assert.equal(j,null);continue}count++;assert(j.steps.length>=2);assert(j.initialStep>=0&&j.initialStep<j.steps.length);for(const key of j.sources){assert(pathwaySources[key],`${t.id}: missing source ${key}`);assert.equal(new URL(pathwaySources[key][1]).protocol,'https:')}
  for(const s of j.steps){assert(s,`${t.id}/${item.id}`);assert(bodyPoints[s.body],`${s.id}: missing body point`);if(s.route)assert(routes[s.route],`${s.id}: missing route`);for(const field of ['name','carrier','process'])for(const lang of ['en','bn'])assert(s[field]?.[lang]?.length>1,`${s.id}/${field}/${lang}`);for(const mesh of s.meshes||[])assert(names.some(n=>matchesStructure(n,mesh)),`${s.id}: missing source mesh ${mesh}`);if(s.loci?.length)assert(s.scope?.en&&s.scope?.bn,`${s.id}: unlabelled schematic locator`)}
 }assert.equal(count,193);
});
test('Hearing follows transduction and named relays, and withholding movement removes motor output',()=>{
 const j=lesson('sensory','hearing'),ids=j.steps.map(s=>s.id);for(const [a,b] of [['sound','ossicles'],['ossicles','hair'],['hair','auditory-nerve'],['auditory-nerve','cochlear-nuclei'],['ic','mgn'],['mgn','auditory-cortex'],['decide','motor']])assert(ids.indexOf(a)<ids.indexOf(b));
 const quiet=branchSteps(j,'listen');assert.equal(quiet.at(-1).id,'listen');assert(!quiet.some(s=>s.phase==='motor'));assert(branchSteps(j,'respond').some(s=>s.id==='turn'));assert.equal(j.steps.length,15);
});
test('Different sensory systems use their corresponding relay and branching explanations',()=>{
 assert(lesson('sensory','taste').steps.some(s=>s.id==='taste-thalamus'));assert(!lesson('sensory','taste').steps.some(s=>s.id==='somatic-thalamus'));
 assert(lesson('cranial','v').steps.some(s=>s.id==='face-thalamus'));assert(!lesson('sensory','smell').steps.some(s=>s.id==='recognize'));
 const p=lesson('sensory','pain'),ids=p.steps.map(s=>s.id);assert(ids.indexOf('withdraw')<ids.indexOf('pain-aware'));assert(p.parallelNote);assert.equal(p.steps.find(s=>s.id==='withdraw').route,'reflex');assert(lesson('sensory','proprioception').parallelNote);
 assert.equal(lesson('learning','classical').steps.at(-1).id,'salivate');assert.equal(lesson('hormones','oxytocin').steps.at(-1).id,'milk-ejection');assert.equal(lesson('sleep','circadian').steps[0].id,'clock-retina');
 assert(!matchesStructure('hypothalamus','thalamus'));assert(matchesStructure('thalamus-1','thalamus'));assert(!matchesStructure('right-precentral-gyrus','left-precentral-gyrus'));
});
test('Transport and recording modalities do not substitute nerve signals for hormones or measurements',()=>{
 assert.equal(lesson('hormones','cortisol').steps.find(s=>s.id==='cortisol').body,'adrenal');
 assert.equal(lesson('autonomic','thirst').steps.find(s=>s.id==='kidney').body,'kidney');
 const high=lesson('autonomic','heart');assert(!high.steps.some(s=>s.id==='sympathetic'));assert(high.steps.some(s=>s.id==='heart-slow'));
 const low=lesson('autonomic','sympathetic');assert(low.steps.some(s=>s.id==='heart-fast'));assert(!low.steps.some(s=>s.id==='vagal'));
 assert(!lesson('bci','eeg-interface').steps.some(s=>s.id==='implant-record'));assert.equal(lesson('bci','prosthetics').steps.find(s=>s.id==='prosthetic').route,'device-hand');
 for(const id of ['mri','ct','dti','pet'])assert(!lesson('imaging',id).steps.some(s=>s.id==='local-flow'));assert(lesson('imaging','fmri').steps.some(s=>s.id==='local-flow'));
 assert(!lesson('synapses','electrical').steps.some(s=>s.id==='synaptic'));
});
test('Every concept-specific focus is reachable and drawings change with physical state',()=>{
 for(const [topic,item,step] of [['sensory','hearing','sound'],['functional','auditory','auditory-cortex'],['reward','vta','dopaminergic'],['cranial','xi','neck-motor'],['hormones','cortisol','cortisol'],['imaging','mri','measurement'],['memory','episodic','hippocampal']]){const j=lesson(topic,item);assert.equal(j.steps[j.initialStep].id,step)}
 assert.notEqual(organSVG('ear',null,'en','low'),organSVG('ear',null,'en','high'));assert(organSVG('ear','hair').includes('Mechanical transduction'));assert.notEqual(organSVG('meninges','dura'),organSVG('meninges','pia'));assert.equal(Object.keys(journeys).length,51);
});
