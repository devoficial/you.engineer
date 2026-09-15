import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {regions,ui,videos,waves} from './content.js';
import {initCurriculum,structureName} from './curriculum.js';
let curriculum=null;
const $=s=>document.querySelector(s);
const state={lang:'en',selected:'frontal',mode:false,arrangement:'assembled',ready:false,error:null,focused:false,pendingFocus:null,meshFilter:null};
try{const saved=localStorage.getItem('brainGarden.lang');if(saved==='en'||saved==='bn')state.lang=saved}catch{}
const viewport=$('#viewport'),tooltip=$('#tooltip');
let focusScene,focusCamera,focusRenderer,focusControls,focusModel;
let scene,camera,renderer,controls,hover=null,parts=[],meshes=[],drag=null,down=null;
const t=k=>ui[state.lang][k];
function selected(){return regions.find(r=>r.id===state.selected)}
function labels(){
 document.documentElement.lang=state.lang;document.title=state.lang==='bn'?'মস্তিষ্কের বাগান · ঘুরে দেখো':'Brain Garden · Explore the brain';
 document.querySelectorAll('[data-i]').forEach(e=>e.textContent=t(e.dataset.i));
 document.querySelectorAll('[data-title]').forEach(e=>{e.title=t(e.dataset.title);e.setAttribute('aria-label',t(e.dataset.title))});
 document.querySelectorAll('[data-lang]').forEach(e=>e.setAttribute('aria-pressed',e.dataset.lang===state.lang));
 $('.languages').setAttribute('aria-label',t('language'));$('#region-list').setAttribute('aria-label',t('regionLabel'));viewport.setAttribute('aria-label',t('viewLabel'));
 $('#arrangement').textContent=t(state.arrangement);$('#gesture-hint').textContent=t(state.mode?'moveHint':'rotateHint');$('#orientation').textContent=t('orientation');$('#drag-mode').setAttribute('aria-pressed',state.mode);
 if(!state.ready)$('#loading').textContent=t(state.error||'loading');
 document.querySelectorAll('[data-region]').forEach(e=>{const r=regions.find(r=>r.id===e.dataset.region);e.querySelector('.region-text').textContent=r[state.lang][0];e.setAttribute('aria-pressed',state.selected===r.id)});
 const r=selected(),text=r[state.lang];$('#notes').style.setProperty('--color',r.color);$('#note-dot').style.background=r.color;$('#note-index').textContent=t('number')+' '+new Intl.NumberFormat(state.lang==='bn'?'bn-BD':'en',{minimumIntegerDigits:2}).format(regions.indexOf(r)+1);$('#region-name').textContent=text[0];$('#region-tag').textContent=text[1];$('#region-location').textContent=text[2];$('#region-function').textContent=text[3];$('#region-tip').textContent=text[4];
 const video=videos[r.id];$('#region-video').href='https://www.youtube.com/watch?v='+video.id;$('#video-title').textContent=video[state.lang];$('#video-meta').textContent=video.author+' · '+t('videoLanguage');$('#focus-title').textContent=state.meshFilter?structureName(state.meshFilter,state.lang):text[0];$('#focus-viewport').setAttribute('aria-label',t('focusLabel'));$('#wave-rows').replaceChildren(...waves[state.lang].map(row=>{const tr=document.createElement('tr');row.forEach(value=>{const td=document.createElement('td');td.textContent=value;tr.append(td)});return tr}));
 if(hover)tooltip.textContent=regions.find(r=>r.id===hover)[state.lang][0];
 curriculum?.setLanguage(state.lang);
}
regions.forEach(r=>{const b=document.createElement('button');b.dataset.region=r.id;b.style.setProperty('--color',r.color);b.innerHTML='<span class="swatch" aria-hidden="true"></span><span class="region-text"></span>';b.onclick=()=>{select(r.id);$('.explorer').scrollIntoView({block:'start',behavior:'instant'})};$('#region-list').append(b)});
function matchesMesh(name,filter){if(!filter)return true;if(!filter.startsWith('group:'))return name===filter;filter=filter.slice(6);return new RegExp('(^|-)'+filter.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(-|$)').test(name.replace(/2$/,''))}
function selectedMesh(m){return m.userData.region===state.selected&&matchesMesh(m.name,state.meshFilter)}
function select(id,extract=true,notify=true,meshFilter=null){
 if(!regions.some(r=>r.id===id))return;
 if(state.ready&&meshFilter&&!meshes.some(m=>m.userData.region===id&&matchesMesh(m.name,meshFilter)))meshFilter=null;
 state.selected=id;state.meshFilter=meshFilter;
 if(!state.ready)state.pendingFocus=extract?{id,meshFilter}:null;
 if(extract&&state.ready){state.focused=true;state.arrangement='focused';state.mode=false;const right=new THREE.Vector3().setFromMatrixColumn(camera.matrix,0);parts.forEach(p=>p.userData.target.copy(p.children.some(selectedMesh)?right.clone().multiplyScalar(3.4):new THREE.Vector3()));zoom(Math.max(1,12*Math.max(1,430/viewport.clientWidth)/camera.position.distanceTo(controls.target)));}
 if(state.focused)showFocus();labels();highlight();if(notify)curriculum?.regionSelected(id,meshFilter);
}
function showFocus(){
 const panel=$('#focus-panel');panel.hidden=false;$('.scene-grid').classList.add('has-focus');
 if(!focusRenderer){
  try{focusRenderer=new THREE.WebGLRenderer({antialias:true,alpha:true})}catch{panel.hidden=true;$('.scene-grid').classList.remove('has-focus');return}
  focusRenderer.setPixelRatio(Math.min(devicePixelRatio,2));focusRenderer.setClearColor(0xffffff,0);focusRenderer.toneMapping=THREE.ACESFilmicToneMapping;focusRenderer.toneMappingExposure=.95;
  $('#focus-viewport').append(focusRenderer.domElement);focusScene=new THREE.Scene();focusScene.add(new THREE.HemisphereLight(0xffffff,0x7e8596,2.4));const light=new THREE.DirectionalLight(0xffffff,2.8);light.position.set(4,6,5);focusScene.add(light);focusCamera=new THREE.PerspectiveCamera(35,1,.1,100);focusControls=new OrbitControls(focusCamera,focusRenderer.domElement);focusControls.enableDamping=true;focusControls.enablePan=false;focusControls.minDistance=3;focusControls.maxDistance=12;
  new ResizeObserver(()=>{const v=$('#focus-viewport');if(!v.clientWidth||!v.clientHeight)return;focusRenderer.setSize(v.clientWidth,v.clientHeight);focusCamera.aspect=v.clientWidth/v.clientHeight;focusCamera.updateProjectionMatrix()}).observe($('#focus-viewport'));
  $('#focus-viewport').addEventListener('keydown',e=>{if(e.target!==$('#focus-viewport'))return;const k=e.key;if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-'].includes(k))return;e.preventDefault();const offset=focusCamera.position.clone().sub(focusControls.target);if(['+','=','-'].includes(k)){offset.setLength(THREE.MathUtils.clamp(offset.length()*(k==='-'?1.1:.9),3,12));focusCamera.position.copy(focusControls.target).add(offset)}else{const sp=new THREE.Spherical().setFromVector3(offset);sp.theta+=k==='ArrowLeft'?.15:k==='ArrowRight'?-.15:0;sp.phi=THREE.MathUtils.clamp(sp.phi+(k==='ArrowUp'?-.15:k==='ArrowDown'?.15:0),.1,Math.PI-.1);focusCamera.position.copy(focusControls.target).add(new THREE.Vector3().setFromSpherical(sp))}focusControls.update()});
 }
 if(focusModel){focusScene.remove(focusModel);focusModel.traverse(o=>{if(o.isMesh)o.material.dispose()})}
 focusModel=new THREE.Group();meshes.filter(selectedMesh).forEach(m=>{const copy=new THREE.Mesh(m.geometry,m.material.clone());copy.material.transparent=false;copy.material.opacity=1;copy.material.depthWrite=true;copy.material.emissiveIntensity=0;focusModel.add(copy)});
 const box=new THREE.Box3().setFromObject(focusModel),center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());focusModel.position.copy(center).negate();const container=new THREE.Group();container.add(focusModel);container.scale.setScalar(2.8/Math.max(size.x,size.y,size.z));focusModel=container;focusScene.add(focusModel);focusCamera.position.copy(home).normalize().multiplyScalar(7);focusControls.target.set(0,0,0);focusControls.update();
}
function clearFocus(){state.focused=false;$('#focus-panel').hidden=true;$('.scene-grid').classList.remove('has-focus');highlight()}

function highlight(){meshes.forEach(m=>{const yes=selectedMesh(m);const h=m.userData.region===hover;m.material.emissive.set(m.material.color);m.material.emissiveIntensity=yes?.18:h?.10:0;m.material.roughness=yes?.63:.78;m.material.transparent=false;m.material.opacity=1;m.material.depthWrite=true})}
function setMode(value){state.mode=value;labels();viewport.style.cursor=value?'grab':'auto'}
document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{state.lang=b.dataset.lang;labels()});$('#drag-mode').onclick=()=>setMode(!state.mode);
function classify(n){
 if(/frontal|precentral/.test(n))return 'frontal';
 if(/parietal|postcentral|supramarginal|angular/.test(n))return 'parietal';
 if(/parahippocampal|hippocampus|cingulate/.test(n))return 'limbic';
 if(/temporal|fusiform/.test(n))return 'temporal';
 if(/occipital/.test(n))return 'occipital';if(/cerebellum/.test(n))return 'cerebellum';
 if(/midbrain|pons|medulla|colliculus/.test(n))return 'brainstem';if(/insula/.test(n))return 'insula';
 if(/thalamus|pineal|pituitary|habenula/.test(n))return 'deep';if(/white-matter|internal-capsule/.test(n))return 'white';
 if(/ventricle|choroid/.test(n))return 'ventricles';return null;
}
const ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),plane=new THREE.Plane(),point=new THREE.Vector3();
function hit(e){const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);return ray.intersectObjects(meshes,false)[0]}
function zoom(f){if(!camera)return;const offset=camera.position.clone().sub(controls.target);offset.setLength(THREE.MathUtils.clamp(offset.length()*f,controls.minDistance,controls.maxDistance));camera.position.copy(controls.target).add(offset);controls.update()}
function orbit(x,y){const s=new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));s.theta+=x;s.phi=THREE.MathUtils.clamp(s.phi+y,.12,Math.PI-.12);camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(s));controls.update()}
function nudge(dx,dy){if(!state.ready)return;const right=new THREE.Vector3().setFromMatrixColumn(camera.matrix,0),up=new THREE.Vector3().setFromMatrixColumn(camera.matrix,1);const delta=right.multiplyScalar(dx).add(up.multiplyScalar(dy));parts.filter(p=>p.children.some(selectedMesh)).forEach(p=>{p.userData.target.add(delta);p.userData.target.clampLength(0,3.8)});state.arrangement='custom';labels()}
document.querySelectorAll('[data-move]').forEach(b=>{b.disabled=true;b.onclick=()=>{const d=b.dataset.move;nudge(d==='left'?-.2:d==='right'?.2:0,d==='up'?.2:d==='down'?-.2:0)}});
$('#zoom-in').onclick=()=>zoom(.86);$('#zoom-out').onclick=()=>zoom(1.16);
function reassemble(reset=false){if(!state.ready){state.pendingFocus=null;return}clearFocus();parts.forEach(p=>p.userData.target.set(0,0,0));state.arrangement='assembled';setMode(false);if(reset){controls.target.set(0,0,0);camera.position.copy(home).multiplyScalar(Math.max(1,390/viewport.clientWidth));select(state.selected,false,false,state.meshFilter);controls.update()}labels()}
$('#reassemble').onclick=()=>reassemble();$('#reset').onclick=()=>reassemble(true);
$('#separate').onclick=()=>{clearFocus();parts.forEach(p=>p.userData.target.copy(p.userData.explode));state.arrangement='separated';setMode(true);const distance=camera.position.distanceTo(controls.target);zoom(Math.max(1,10*Math.max(1,390/viewport.clientWidth)/distance));labels()};
viewport.addEventListener('keydown',e=>{if(e.target!==viewport||!state.ready)return;const k=e.key;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','Escape'].includes(k))e.preventDefault();if(k==='Escape')setMode(false);else if(k==='+'||k==='=')zoom(.9);else if(k==='-')zoom(1.1);else if(k.startsWith('Arrow')){const dx=k==='ArrowLeft'?-.16:k==='ArrowRight'?.16:0,dy=k==='ArrowUp'?.16:k==='ArrowDown'?-.16:0;if(state.mode)nudge(dx,dy);else orbit(-dx,-dy)}});
const home=new THREE.Vector3(5.2,2.0,4.2);
labels();
async function start(){
 try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch(e){state.error='webgl';labels();return}
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.98;viewport.prepend(renderer.domElement);
 scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.copy(home);
 scene.add(new THREE.HemisphereLight(0xd9eeff,0x4c4355,1.8));const key=new THREE.DirectionalLight(0xffecd6,2.7);key.position.set(4,6,5);scene.add(key);const fill=new THREE.DirectionalLight(0x94cfff,2.2);fill.position.set(-5,2,-3);scene.add(fill);const rim=new THREE.DirectionalLight(0xffdac0,1.6);rim.position.set(0,3,-6);scene.add(rim);
 controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.08;controls.enablePan=false;controls.minDistance=4.5;controls.maxDistance=22;controls.rotateSpeed=.6;
 let lastWidth=0;const resize=()=>{const w=viewport.clientWidth,h=viewport.clientHeight;if(!w||!h)return;if(w!==lastWidth&&w<390){const d=camera.position.distanceTo(controls.target);zoom(Math.max(1,home.length()*390/w/d))}lastWidth=w;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()};new ResizeObserver(resize).observe(viewport);resize();
 renderer.domElement.addEventListener('pointerdown',e=>{
 if(!state.ready||e.button!==0)return;if(drag){e.stopImmediatePropagation();return}const h=hit(e);down={x:e.clientX,y:e.clientY,id:e.pointerId};
 if(state.mode&&h){e.stopImmediatePropagation();select(h.object.userData.region,false,true,h.object.name);const p=h.object.parent;plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(new THREE.Vector3()),h.point);ray.ray.intersectPlane(plane,point);drag={part:p,origin:p.position.clone(),anchor:point.clone(),id:e.pointerId};p.userData.target.copy(p.position);renderer.domElement.setPointerCapture(e.pointerId);viewport.style.cursor='grabbing';}
 },true);
 renderer.domElement.addEventListener('pointermove',e=>{if(!state.ready)return;const h=hit(e);if(drag&&e.pointerId===drag.id){e.stopImmediatePropagation();if(ray.ray.intersectPlane(plane,point)){drag.part.position.copy(drag.origin).add(point.clone().sub(drag.anchor)).clampLength(0,3.8);drag.part.userData.target.copy(drag.part.position);state.arrangement='custom';$('#arrangement').textContent=t('custom')}tooltip.hidden=true;return}hover=h?h.object.userData.region:null;highlight();tooltip.hidden=!hover;if(hover){tooltip.textContent=regions.find(r=>r.id===hover)[state.lang][0];const r=viewport.getBoundingClientRect();tooltip.style.left=Math.max(8,Math.min(e.clientX-r.left+15,r.width-tooltip.offsetWidth-10))+'px';tooltip.style.top=Math.max(8,e.clientY-r.top-40)+'px';viewport.style.cursor=state.mode?'grab':'pointer'}else viewport.style.cursor='grab';});
 const finish=e=>{if(drag&&drag.id===e.pointerId){e.stopImmediatePropagation();if(renderer.domElement.hasPointerCapture(e.pointerId))renderer.domElement.releasePointerCapture(e.pointerId);const clicked=down&&e.type==='pointerup'&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<6;drag=null;viewport.style.cursor='grab';if(clicked)select(state.selected,true,true,state.meshFilter);labels()}else if(down&&e.type==='pointerup'&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<6){const h=hit(e);if(h)select(h.object.userData.region,true,true,h.object.name)}down=null};
 renderer.domElement.addEventListener('pointerup',finish,true);renderer.domElement.addEventListener('pointercancel',finish,true);renderer.domElement.addEventListener('pointerleave',()=>{hover=null;tooltip.hidden=true;highlight()});
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();state.ready=false;state.error='webgl';$('#loading').hidden=false;labels()});
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;renderer.setAnimationLoop(()=>{if(document.hidden||!viewport.clientWidth)return;parts.forEach(p=>{if(!drag||drag.part!==p)p.position.lerp(p.userData.target,reduced?1:.14)});controls.update();renderer.render(scene,camera);if(focusRenderer&&state.focused){focusControls.update();focusRenderer.render(focusScene,focusCamera)}});
 try{
 const gltf=await new GLTFLoader().loadAsync('./brain.glb');gltf.scene.updateMatrixWorld(true);const rotation=new THREE.Matrix4().makeRotationX(-Math.PI/2);const groupMap=new Map();
 gltf.scene.traverse(source=>{if(!source.isMesh)return;const id=classify(source.name);if(!id)return;const geo=source.geometry.clone();geo.applyMatrix4(source.matrixWorld);geo.applyMatrix4(rotation);geo.computeVertexNormals();geo.computeBoundingBox();const center=geo.boundingBox.getCenter(new THREE.Vector3());
 // Keep each named surface independently selectable; retain region and hemisphere metadata.
 const side=/^left-/.test(source.name)?'left':/^right-/.test(source.name)?'right':center.x<-.1?'left':center.x>.1?'right':'mid';const groupKey=source.name;
 let p=groupMap.get(groupKey);if(!p){p=new THREE.Group();p.name=groupKey;p.userData={region:id,side,target:new THREE.Vector3()};groupMap.set(groupKey,p);scene.add(p);parts.push(p)}
 const r=regions.find(r=>r.id===id);const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:r.color,roughness:.78,metalness:0,side:THREE.DoubleSide}));m.name=source.name;m.userData.region=id;p.add(m);meshes.push(m);
 });
 parts.forEach(p=>{const c=new THREE.Box3().setFromObject(p).getCenter(new THREE.Vector3());const dir=c.clone().normalize();if(p.userData.side==='left')dir.x=-Math.max(.5,Math.abs(dir.x));if(p.userData.side==='right')dir.x=Math.max(.5,Math.abs(dir.x));p.userData.explode=dir.multiplyScalar(['frontal','parietal','temporal','occipital','cerebellum'].includes(p.userData.region)?1.2:.7)});
 state.ready=true;$('#loading').hidden=true;['separate','reassemble','drag-mode'].forEach(id=>$('#'+id).disabled=false);document.querySelectorAll('[data-move]').forEach(b=>b.disabled=false);highlight();curriculum?.setStructures(meshes);if(state.pendingFocus){const pending=state.pendingFocus;state.pendingFocus=null;select(pending.id,true,false,pending.meshFilter)};
 }catch(e){console.error('Brain load failed',e);state.error='failed';labels()}
}
curriculum=initCurriculum({getLang:()=>state.lang,setLang:value=>{state.lang=value;labels()},selectRegion:(id,extract=false,filter=null)=>select(id,extract,false,filter),reassemble});
start();
