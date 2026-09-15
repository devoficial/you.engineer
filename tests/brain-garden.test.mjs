import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {topics,resolveLesson,parseRoute,makeRoute,searchTopics} from '../public/brain-garden/topics.js';
import {families,sources,lessonUI} from '../public/brain-garden/lessons/shared.js';
import {videoFor,videoURL} from '../public/brain-garden/lesson-videos.js';
import {structureDescription} from '../public/brain-garden/structures.js';
import {controlsFor,chartModel} from '../public/brain-garden/lesson-charts.js';
import {waveSamples,spectrum,potentialSamples,lifSamples,synapseSamples,learningSamples,feedbackSamples,sleepAt} from '../public/brain-garden/simulations.js';
const root=new URL('../public/brain-garden/',import.meta.url);
test('All 34 groups and 211 concepts have bilingual content, visuals, sources and video links',()=>{
 assert.equal(topics.length,34);assert.deepEqual(topics.map(t=>t.number),Array.from({length:34},(_,i)=>i+1));assert.equal(new Set(topics.map(t=>t.id)).size,34);
 assert.equal(topics.reduce((n,t)=>n+t.items.length,0),211);
 for(const t of topics){assert(families.some(f=>f.id===t.family));assert(t.sources.length);assert.equal(new Set(t.items.map(i=>i.id)).size,t.items.length);
  for(const key of t.sources)assert(new URL(sources[key][1]).protocol==='https:');
  for(const i of t.items){for(const lang of ['en','bn']){assert(t.title[lang]);assert(i.title[lang]);assert(i.body[lang].length>30)}const lesson=resolveLesson(t,i);assert(lesson.nodes.length>=2);for(const node of lesson.nodes)assert(node.en&&node.bn);assert(/^https:\/\/www.youtube.com\/watch\?v=[\w-]{11}/.test(videoURL(videoFor(t,i))));}
 }
 assert.deepEqual(Object.keys(lessonUI.en).sort(),Object.keys(lessonUI.bn).sort());
});
test('Every named source surface has an explanation; filtered anatomical lessons reference existing meshes',()=>{
 const b=fs.readFileSync(new URL('brain.glb',root)),gltf=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)).toString());const names=gltf.nodes.filter(n=>'mesh'in n&&!n.name.startsWith('segment-')).map(n=>n.name);assert.equal(names.length,63);
 for(const name of names){const note=structureDescription(name);assert(note?.en&&note?.bn,name)}
 for(const t of topics)for(const i of t.items)if(i.mesh)assert(names.some(n=>new RegExp('(^|-)'+i.mesh+'(-|$)').test(n.replace(/2$/,''))),i.mesh);
});
test('English/Bengali routes, individual structures, invalid routes and search resolve predictably',()=>{
 for(const t of topics)for(const i of t.items)for(const lang of ['en','bn']){const r=parseRoute(makeRoute(t,i,lang,'left-hippocampus'));assert.equal(r.topic,t);assert.equal(r.item,i);assert.equal(r.lang,lang);assert.equal(r.mesh,'left-hippocampus')}
 assert.equal(parseRoute('#topic=missing&concept=missing&lang=xx').topic.number,1);assert.equal(parseRoute('#topic=memory&concept=invalid').item.id,topics.find(t=>t.id==='memory').items[0].id);
 assert(searchTopics('alpha').some(r=>r.items.some(i=>i.id==='alpha')));assert(searchTopics('হিপোক্যাম্পাস').some(r=>r.topic.id==='anatomy'));assert(searchTopics('','models').every(r=>r.topic.family==='models'));
});
test('All slider extremes generate finite chart coordinates and valid domains',()=>{
 for(const t of topics)for(const i of t.items){const l=resolveLesson(t,i),controls=controlsFor(l.scene,l);for(const field of ['min','value','max']){const p=Object.fromEntries(controls.map(c=>[c.id,c[field]]));const chart=chartModel(l.scene,l,p);if(!chart)continue;assert(chart.domain[1]>chart.domain[0]);for(const line of chart.lines)for(const point of line.points)assert(point.every(Number.isFinite),t.id+'/'+i.id);for(const bar of chart.bars||[])assert(Number.isFinite(bar[1]));}}
});
test('Frequency and amplitude are independent, phase cancellation works, and FFT finds the input frequency',()=>{
 const a=waveSamples({frequency:10,amplitude:30}).samples,b=waveSamples({frequency:10,amplitude:60}).samples;assert(a.every((p,i)=>Math.abs(b[i][1]-p[1]*2)<1e-10));
 assert.equal(spectrum(a).reduce((p,v)=>p[1]>v[1]?p:v)[0],10);
 assert(waveSamples({frequency:10,amplitude:30,phase:180,sync:true}).sum.every(p=>Math.abs(p[1])<1e-10));
});
test('Threshold, inhibition, learning, feedback and spiking models respond in the intended direction',()=>{
 assert(Math.max(...potentialSamples(14).map(p=>p[1]))<0);assert.equal(Math.max(...potentialSamples(15).map(p=>p[1])),30);assert.deepEqual(potentialSamples(15),potentialSamples(30));
 assert(synapseSamples(8,10).every((p,i)=>p[1]<=synapseSamples(8,0)[i][1]));assert.equal(lifSamples(0).spikes.length,0);assert(lifSamples(4).spikes.length>lifSamples(2).spikes.length);
 assert(learningSamples(.3).at(-1)[1]>learningSamples(.02).at(-1)[1]);assert(feedbackSamples(1).at(-1)[1]<feedbackSamples(.1).at(-1)[1]);assert.equal(sleepAt(.8),3);assert.equal(sleepAt(8),0);
});
test('Electrical coupling and cellular development are not depicted as chemical transmitter release',()=>{
 assert.equal(resolveLesson(topics.find(t=>t.id==='synapses'),topics.find(t=>t.id==='synapses').items.find(i=>i.id==='electrical')).scene,'network');
 assert.equal(resolveLesson(topics.find(t=>t.id==='plasticity'),topics.find(t=>t.id==='plasticity').items.find(i=>i.id==='neurogenesis')).scene,'development');
});
