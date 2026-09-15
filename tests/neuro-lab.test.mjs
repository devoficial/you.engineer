import test from 'node:test';
import assert from 'node:assert/strict';
import {populationSignal,spikeVoltage,cochlearPlace,mechanismFor,labCopy} from '../public/brain-garden/body/lab-models.js';
import {topics} from '../public/brain-garden/topics.js';
import {getJourney} from '../public/brain-garden/body/catalogue.js';

test('alignment controls summation independently of component frequency',()=>{
 for(const f of [.5,2,10,20,40,60])for(let i=0;i<100;i++){
  const t=i*.013,aligned=populationSignal(t,f,1),dispersed=populationSignal(t,f,0);
  assert(Math.abs(aligned.mean-Math.sin(2*Math.PI*f*t))<1e-10);
  assert(Math.abs(dispersed.mean)<1e-10);
  assert.equal(aligned.cells[0],dispersed.cells[0]);
 }
});
test('voltage and cochlear models preserve the intended physical distinction',()=>{
 assert(spikeVoltage(.43)>25);assert(spikeVoltage(.57)<-80);assert(Math.abs(spikeVoltage(0)+70)<.001);
 assert(Math.abs(spikeVoltage(-.57)-spikeVoltage(.43))<1e-10);
 assert(cochlearPlace(250)>cochlearPlace(1000));assert(cochlearPlace(1000)>cochlearPlace(4000));
 for(const hz of [0,100,1000,8000,100000])assert(cochlearPlace(hz)>=0&&cochlearPlace(hz)<=1);
});
test('every mapped lesson stage has bilingual model guidance',()=>{
 let stages=0;const kinds=new Set();
 for(const topic of topics)for(const concept of topic.items){const journey=getJourney(topic,concept);if(!journey)continue;for(const step of journey.steps){const kind=mechanismFor(journey,step);stages++;if(!kind)continue;kinds.add(kind);for(const language of ['en','bn']){assert(labCopy[kind]?.title[language]);assert(labCopy[kind]?.note[language]);assert.equal(labCopy[kind].legend.length,3)}}}
 assert(stages>1500);assert(kinds.has('gap'));assert(kinds.has('spindle'));
});
test('sensory feedback, electrical junctions and EEG are not confused with motor or chemical signaling',()=>{
 const at=(topic,id)=>{const t=topics.find(t=>t.id===topic),c=t.items.find(c=>c.id===id),j=getJourney(t,c);return {j,kind:mechanismFor(j,j.steps[j.initialStep||0])}};
 assert.equal(at('synapses','electrical').kind,'gap');assert.equal(at('synapses','chemical').kind,'synapse');assert.equal(at('sensory','proprioception').kind,'spindle');assert.equal(at('frequencies','delta').kind,'rhythm');assert.equal(at('neurons','glia').kind,null);
 const delta=at('frequencies','delta').j;assert.deepEqual(delta.steps.map(s=>s.id),['population','timing-alignment','volume-field','eeg-record','analyze']);
});
