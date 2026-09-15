import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {topics} from '../public/brain-garden/topics.js';
import {guideJourney,guideNote,guideIntro,stepSeconds,simpleSteps} from '../public/brain-garden/body/guide-models.js';
import {bodyLocations as b,bodyRoute} from '../public/brain-garden/body/body-routes.js';

test('every concept has a body-first journey and bilingual, paced guidance',()=>{
 let count=0;
 for(const topic of topics)for(const concept of topic.items){
  count++;const journey=guideJourney(topic,concept);
  assert(journey.steps.length>1,`${topic.id}/${concept.id}`);
  for(const lang of ['en','bn'])assert(guideIntro(journey,lang).length>30);
  for(const step of journey.steps){
   assert(b[step.body],step.id);assert(simpleSteps[step.id]||step.id==='anatomy-part',step.id);
   for(const lang of ['en','bn']){const note=guideNote(journey,step,lang);assert(note.title.trim().length>0,`${topic.id}/${concept.id}/${step.id}`);assert(note.text.length>20);assert(stepSeconds(note)>=9&&stepSeconds(note)<=18);}
   if(step.route){const {points}=bodyRoute(step);assert(points.length>1);assert(points.flat().every(Number.isFinite));assert(points.some(p=>p.some((v,i)=>v!==points[0][i])));}
  }
 }
 assert.equal(count,211);
});

test('body routes distinguish local spinal reflexes, blood signals and external devices',()=>{
 const route=(id,body,phase,extra={})=>bodyRoute({id,body,phase,route:id,...extra});
 const reflex=route('reflex','spine','motor');
 assert(reflex.points.every(p=>p[1]<7),'Withdrawal does not first visit the cortex');
 assert.deepEqual(route('reflex','hand','motor',{id:'withdraw'}).points.at(-1),b.hand);
 assert.deepEqual(route('arm-in','hand','sense').points.at(-1),b.brain);
 assert.deepEqual(route('arm-out','spine','motor').points.at(-1),b.hand);
 assert.deepEqual(route('neck-out','spine','motor').points.at(-1),b.neck);
 for(const gland of ['kidney','adrenal','mammary']){const r=route(gland,'brain','regulate');assert.equal(r.kind,'hormone');assert.deepEqual(r.points[0],b.brain);assert.deepEqual(r.points.at(-1),b[gland]);assert(r.points.includes(b.heart));}
 const venous=route('blood-return','blood','blood');assert.equal(venous.kind,'blood');assert.deepEqual(venous.points.at(-1),b.heart);
 const device=route('device-hand','hand','motor');assert.equal(device.kind,'device');assert.deepEqual(device.points[0],b.device);assert.deepEqual(device.points.at(-1),b.hand);
});

test('anatomy tours identify source surfaces or explicitly approximate missing structures',()=>{
 const topic=topics.find(t=>t.id==='anatomy'),get=id=>guideJourney(topic,topic.items.find(c=>c.id===id)).steps[1];
 assert.deepEqual(get('hippocampus').meshes,['hippocampus']);assert(get('hippocampus').inner);
 assert.deepEqual(get('thalamus').meshes,['thalamus']);
 assert.deepEqual(get('amygdala').loci,['amygdala']);
 assert.deepEqual(get('basal-ganglia').loci,['striatum']);
 assert.deepEqual(get('corpus-callosum').loci,['callosum']);
 assert.equal(get('cortex').regions.length,4);
 assert.deepEqual(get('ventricles').regions,['ventricles']);assert(get('ventricles').inner);
});

test('the full-body asset contains finite indexed anatomical surfaces and redistribution attribution',()=>{
 const buffer=fs.readFileSync(new URL('../public/brain-garden/body/person.glb',import.meta.url));
 assert.equal(buffer.readUInt32LE(0),0x46546c67);assert.equal(buffer.readUInt32LE(8),buffer.length);
 const jsonLength=buffer.readUInt32LE(12),gltf=JSON.parse(buffer.subarray(20,20+jsonLength).toString());
 const binStart=20+jsonLength+8;
 assert.equal(gltf.meshes.length,12);assert.equal(gltf.nodes.filter(m=>m.name==='skin').length,1);
 for(const accessor of gltf.accessors){const view=gltf.bufferViews[accessor.bufferView],offset=binStart+(view.byteOffset||0)+(accessor.byteOffset||0);assert(offset+view.byteLength<=buffer.length);if(accessor.componentType===5126)for(let i=0;i<accessor.count*3;i++)assert(Number.isFinite(buffer.readFloatLE(offset+i*4)));}
 const notice=JSON.parse(fs.readFileSync(new URL('../public/brain-garden/body/BODY-MODEL-NOTICE.json',import.meta.url)));
 assert(notice.copyright.includes('BodyParts3D'));assert(notice.license.includes('ShareAlike'));assert.equal(Object.keys(notice.source_files).length,12);assert.equal(notice.source_commit.length,40);
});

test('concept-specific explanations survive the shared journey template',()=>{
 for(const [id,concept,stage,word] of [['frequencies','delta','analyze','deep non-REM sleep'],['chemistry','dopamine','modulator','motivation'],['imaging','mri','measurement','magnetic']]){const topic=topics.find(t=>t.id===id),item=topic.items.find(c=>c.id===concept),journey=guideJourney(topic,item);assert(guideNote(journey,journey.steps.find(s=>s.id===stage)).text.toLowerCase().includes(word.toLowerCase()));}
});
