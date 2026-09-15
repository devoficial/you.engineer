import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {buildBrainPWA} from '../scripts/build-brain-pwa.mjs';
import {topics} from '../public/brain-garden/topics.js';

const temp=await mkdtemp(path.join(tmpdir(),'brain-pwa-test-'));
const build=await buildBrainPWA(path.join(temp,'app'));
const worker=await readFile(path.join(build.destination,'sw.js'),'utf8');
const entries=JSON.parse(worker.match(/const PRECACHE = (\[.*\]);/)[1]);
const origin='https://brain-test.netlify.app/';
const stores=new Map();let online=true,failURL='',claims=0,skips=0;
const network=async request=>{
 if(!online||request.url.endsWith(failURL)&&failURL)throw new Error('Network unavailable');
 const url=new URL(request.url);const name=url.pathname.slice(1)||'index.html';
 const body=await readFile(path.join(build.destination,name));
 if(request.integrity)assert.equal(request.integrity,'sha256-'+createHash('sha256').update(body).digest('base64'));
 return new Response(body);
};
const cacheStorage={
 async open(name){if(!stores.has(name))stores.set(name,new Map());const store=stores.get(name);return {
  async addAll(requests){const loaded=await Promise.all(requests.map(async r=>[r.url,await network(r)]));for(const [url,res] of loaded)store.set(url,res)},
  async match(key){return store.get(typeof key==='string'?key:key.url)?.clone()},
  async put(key,response){store.set(typeof key==='string'?key:key.url,response)}
 }},
 async keys(){return [...stores.keys()]},async delete(name){return stores.delete(name)}
};
function load(code=worker,scope=origin){
 const events={};const self={registration:{scope},addEventListener:(type,fn)=>events[type]=fn,skipWaiting:async()=>{skips++},clients:{claim:async()=>{claims++},matchAll:async()=>[]}};
 vm.runInNewContext(code,{self,caches:cacheStorage,Request,Response,URL,fetch:network,Map,Promise});
 return events;
}
async function event(handler,extra={}){let result;handler({...extra,waitUntil:p=>result=p});return result}
async function respond(handler,request){let result;handler({request,respondWith:p=>result=p});return result}

test('standalone shell, manifest, shortcuts and icons resolve at the new root',async()=>{
 const html=await readFile(path.join(build.destination,'index.html'),'utf8');
 assert(html.includes('<base href="./">'));assert(!html.includes('<base href="/brain-garden/">'));
 assert(html.includes('rel="manifest"'));assert(html.includes('aria-controls="pwa-dialog"'));assert(html.includes('src="pwa.js"'));
 const manifest=JSON.parse(await readFile(path.join(build.destination,'manifest.webmanifest')));
 assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');assert.equal(manifest.id,'./');assert.equal(manifest.display,'standalone');
 for(const icon of [...manifest.icons,{src:'icons/apple-touch-icon.png',sizes:'180x180'}]){const png=await readFile(path.join(build.destination,icon.src));const [width,height]=icon.sizes.split('x').map(Number);assert.equal(png.readUInt32BE(16),width);assert.equal(png.readUInt32BE(20),height)}
 for(const shortcut of manifest.shortcuts){const params=new URLSearchParams(new URL(shortcut.url,origin).hash.slice(1));assert(topics.find(t=>t.id===params.get('topic'))?.items.some(i=>i.id===params.get('concept')))}
 assert((await readFile(path.join(build.destination,'_headers'),'utf8')).includes('/sw.js\n  Cache-Control: no-cache'));
});
test('every shipped lesson, script and model has a verified offline entry',async()=>{
 const files=[];async function walk(dir){for(const item of await readdir(dir,{withFileTypes:true})){const full=path.join(dir,item.name);if(item.isDirectory())await walk(full);else files.push(path.relative(build.destination,full))}}await walk(build.destination);
 assert.equal(entries.length,files.filter(f=>!['index.html','sw.js','_headers','_redirects'].includes(f)).length);
 const shell=JSON.parse(await readFile(path.join(build.destination,'app-shell.json'),'utf8'));
 assert.equal(shell.html,await readFile(path.join(build.destination,'index.html'),'utf8'));
 assert(entries.some(e=>e.url==='./brain.glb'));assert(entries.some(e=>e.url==='./body/person.glb'));
 for(const asset of entries){assert.equal(new URL(asset.url,origin).origin,new URL(origin).origin);const blob=await readFile(path.join(build.destination,asset.url));assert.equal(asset.integrity,'sha256-'+createHash('sha256').update(blob).digest('base64'))}
 const second=await buildBrainPWA(path.join(temp,'again'));assert.equal(second.version,build.version,'Unchanged assets produce an unchanged worker version');
});
test('all precached assets and a cold deep-link navigation work without a network',async()=>{
 const events=load();await event(events.install);assert.equal(skips,0,'Installing never silently replaces an active release');await event(events.activate);assert.equal(claims,1);online=false;
 for(const entry of entries){const response=await respond(events.fetch,new Request(new URL(entry.url,origin)));assert(response?.ok,entry.url);assert((await response.arrayBuffer()).byteLength>0)}
 const page=await respond(events.fetch,{method:'GET',mode:'navigate',url:origin+'?launch=1#topic=bci&concept=record'});assert.equal(page.headers.get('Content-Type'),'text/html; charset=utf-8');assert.equal(await page.text(),await readFile(path.join(build.destination,'index.html'),'utf8'));
 const status=[];await event(events.message,{data:{type:'GET_STATUS'},ports:[{postMessage:value=>status.push(value)}]});assert.equal(status[0].ready,true);
 assert.equal(await respond(events.fetch,new Request('https://www.youtube.com/watch?v=video')),undefined);
 assert.equal(await respond(events.fetch,new Request(origin+'missing.js')),undefined);
 assert.equal(await respond(events.fetch,new Request(origin+'app.js',{method:'POST'})),undefined);
 online=true;
});
test('failed updates retain the current cache; activation only removes this app’s old releases',async()=>{
 const cacheName=(await cacheStorage.keys())[0];
 await cacheStorage.open('other-app:release');await cacheStorage.open('brain-garden:/another-app/:release');
 const next=load(worker.replace(build.version,'new-release'));failURL='brain.glb';
 await assert.rejects(event(next.install));failURL='';assert(stores.has(cacheName));assert(!stores.has('brain-garden:/:new-release'));
 await event(next.install);assert(stores.has(cacheName));assert.equal(skips,0);
 await event(next.message,{data:{type:'SKIP_WAITING'}});assert.equal(skips,1);
 await event(next.activate);assert(!stores.has(cacheName));assert(stores.has('other-app:release'));assert(stores.has('brain-garden:/another-app/:release'));
 const current=stores.get('brain-garden:/:new-release');current.delete(origin+'body/person.glb');
 const status=[];await event(next.message,{data:{type:'GET_STATUS'},ports:[{postMessage:value=>status.push(value)}]});assert.equal(status[0].ready,false,'Partial eviction does not claim offline readiness');
});
test.after(async()=>{await rm(temp,{recursive:true,force:true})});
