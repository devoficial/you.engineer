import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {clamp} from './simulations.js';
const palette=['#417dbb','#d49b6c','#58a48e','#9b8ac4','#d4869f'];
const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
export class LessonScene{
 constructor(host,{onSelect=()=>{}}={}){
  this.host=host;this.onSelect=onSelect;this.labels=[];this.targets=[];this.paths=[];this.objects=[];this.params={};this.step=0;this.playing=false;this.time=0;this.active=false;this.last=0;
  this.overlay=document.createElement('div');this.overlay.className='scene-labels';host.append(this.overlay);
  try{this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true})}catch{this.failed=true;return}
  this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.setClearColor(0xf7f9fc,0);this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1;
  host.prepend(this.renderer.domElement);this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera(36,1,.1,100);this.camera.position.set(0,1.5,9.5);
  this.scene.add(new THREE.HemisphereLight(0xffffff,0x7b8a9c,2.3));const light=new THREE.DirectionalLight(0xffffff,2.5);light.position.set(4,7,5);this.scene.add(light);
  this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.enableDamping=true;this.controls.enablePan=false;this.controls.minDistance=5;this.controls.maxDistance=18;
  this.ray=new THREE.Raycaster();this.pointer=new THREE.Vector2();let down;
  this.renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY}});
  this.renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>6)return;const r=this.renderer.domElement.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);this.ray.setFromCamera(this.pointer,this.camera);const hit=this.ray.intersectObjects(this.targets,false)[0];if(hit)this.onSelect(hit.object.userData.step);down=null});
  host.addEventListener('keydown',e=>{if(e.target!==host)return;const k=e.key;if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-'].includes(k))return;e.preventDefault();const s=new THREE.Spherical().setFromVector3(this.camera.position.clone().sub(this.controls.target));if(k==='-'||k==='+'||k==='=')s.radius=clamp(s.radius*(k==='-'?1.1:.9),5,18);else{s.theta+=k==='ArrowLeft'?.15:k==='ArrowRight'?-.15:0;s.phi=clamp(s.phi+(k==='ArrowUp'?-.15:k==='ArrowDown'?.15:0),.1,Math.PI-.1)}this.camera.position.copy(this.controls.target).add(new THREE.Vector3().setFromSpherical(s));this.controls.update()});
  this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(host);this.resize();
  this.renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();this.active=false;this.failed=true;host.dispatchEvent(new CustomEvent('lesson-webgl-error'))});
  this.renderer.setAnimationLoop(time=>this.frame(time));
 }
 resize(){if(this.failed||!this.host.clientWidth||!this.host.clientHeight)return;this.w=this.host.clientWidth;this.h=this.host.clientHeight;this.renderer.setSize(this.w,this.h);this.camera.aspect=this.w/this.h;this.camera.updateProjectionMatrix();if(this.w<480)this.camera.position.setLength(Math.max(this.camera.position.length(),12))}
 reset(){if(this.failed)return;this.controls.target.set(0,0,0);this.camera.position.set(0,1.5,this.host.clientWidth<480?12:9.5);this.controls.update()}
 material(color){return new THREE.MeshStandardMaterial({color,roughness:.6})}
 sphere(position,r=.35,color=palette[0],step=0){const m=new THREE.Mesh(new THREE.SphereGeometry(r,24,16),this.material(color));m.position.copy(position);m.userData.step=step;this.group.add(m);this.targets.push(m);return m}
 tube(points,radius=.045,color=palette[0],step=0){const curve=new THREE.CatmullRomCurve3(points);const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,32,radius,8,false),this.material(color));mesh.userData.step=step;this.group.add(mesh);this.targets.push(mesh);return {mesh,curve}}
 label(position,step){const b=document.createElement('button');b.className='scene-node';b.onclick=()=>this.onSelect(step);this.overlay.append(b);this.labels.push({element:b,position:position.clone(),step});return b}
 clear(){if(!this.group)return;this.scene.remove(this.group);this.group.traverse(o=>{o.geometry?.dispose();if(o.material){const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>m.dispose())}});this.overlay.replaceChildren();this.labels=[];this.targets=[];this.paths=[];this.objects=[];this.particles=null;this.shells=null;this.slice=null;this.distractors=null;this.waveLine=null;this.wavePoints=null;this.networkNodes=null}
 set({scene='network',nodes=[],lesson={},params={},lang='en',region='frontal'}){
  this.kind=scene;this.nodes=nodes;this.lesson=lesson;this.params=params;this.lang=lang;this.region=region;this.time=0;this.step=0;
  if(this.failed)return;this.clear();this.group=new THREE.Group();this.scene.add(this.group);
  if(['neuron','potential','computational'].includes(scene))this.neuron();
  else if(scene==='barrier')this.barrier();
  else if(['synapse','plasticity'].includes(scene))this.synapse();
  else if(['wave','eeg'].includes(scene))this.oscillators();
  else if(['layers','imaging'].includes(scene))this.layers();
  else if(scene==='lateral')this.lateral();
  else if(scene==='glia')this.glia();
  else if(scene==='attention')this.attention();
  else this.network();
  this.pulse=this.sphere(V(),.09,'#244d79',-1);this.targets=this.targets.filter(o=>o!==this.pulse);
  this.setStep(0);this.update(params);this.translate(lang);this.updateContext(region);this.resize();
 }
 neuron(){
  const soma=this.sphere(V(-1.15,0,0),.48,palette[0],1);soma.scale.y=1.12;
  for(let i=0;i<6;i++){const angle=(i-2.5)*.5,tip=V(-2.4-Math.cos(angle)*.35,Math.sin(angle)*1.25,(i%2?1:-1)*.25);this.tube([V(-1.5,0),V(-2,tip.y*.6,tip.z),tip],.045,palette[0],0);this.tube([tip,tip.clone().add(V(-.4,.22,.1))],.025,palette[0],0);this.tube([tip,tip.clone().add(V(-.32,-.25,-.12))],.025,palette[0],0)}
  this.tube([V(-.7),V(.3),V(1.8),V(2.4)],.065,palette[1],2);
  for(let i=0;i<5;i++){const m=new THREE.Mesh(new THREE.CylinderGeometry(.15,.15,.34,18),this.material('#9cbab7'));m.rotation.z=Math.PI/2;m.position.x=-.35+i*.48;m.userData.step=2;this.group.add(m);this.targets.push(m)}
  for(let i=0;i<3;i++){const tip=V(2.95,(i-1)*.6,(i-1)*.16);this.tube([V(2.35),V(2.55,tip.y*.7,tip.z),tip],.04,palette[1],3);this.sphere(tip,.15,palette[3],3)}
  [V(-2.35,1.5),V(-1.15,-.85),V(.65,-.55),V(2.7,1.02)].forEach((p,i)=>this.label(p,i));
  this.paths=[new THREE.CatmullRomCurve3([V(-2.8,.6),V(-1.2),V(.7),V(2.85,.6)])];
 }
 barrier(){
  // Cross-section schematic: blood, endothelial wall, transporter, brain tissue.
  this.tube([V(-2.5,-1.2),V(-2.5,1.2)],.3,'#c87980',0);
  for(let i=0;i<5;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(.35,.47,.7),this.material(palette[0]));m.position.set(-.6,(i-2)*.49,0);m.userData.step=1;this.group.add(m);this.targets.push(m)}
  this.tube([V(-.85,0,.5),V(-.35,0,.5)],.13,palette[1],2);
  this.sphere(V(1.8,0),.4,palette[2],3);
  this.particles=Array.from({length:9},(_,i)=>this.sphere(V(-2,(i-4)*.2,.6),.065,palette[1],2));
  [V(-2.35,1.6),V(-.65,-1.65),V(.65,1.5),V(2,-1.2)].forEach((p,i)=>this.label(p,i));
 }
 synapse(){
  const pre=this.sphere(V(-1.35,0),.7,palette[0],0);pre.scale.set(1,1.35,.8);
  const post=this.sphere(V(1.3,0),.7,palette[2],2);post.scale.set(.65,1.55,.8);
  for(let i=0;i<7;i++)this.sphere(V(-1.4+(i%3)*.25,-.55+Math.floor(i/3)*.42,.48),.115,'#e3b070',1);
  for(let i=0;i<5;i++){const receptor=new THREE.Mesh(new THREE.TorusGeometry(.14,.04,8,18,Math.PI*1.4),this.material(palette[3]));receptor.position.set(.78,(i-2)*.32,.45);receptor.userData.step=2;this.group.add(receptor);this.targets.push(receptor)}
  this.particles=Array.from({length:9},(_,i)=>this.sphere(V(-.7,(i-4)*.15,.45),.055,palette[1],1));
  [V(-1.9,1.4),V(-.65,-1.05),V(1.6,1.55),V(1.2,-1.3)].forEach((p,i)=>this.label(p,i));
  this.paths=[new THREE.CatmullRomCurve3([V(-2.1,.1),V(-.65,.1,.4),V(.9,.1,.4),V(1.9,.1)])];
 }
 oscillators(){
  this.wavePoints=[];
  for(let i=0;i<9;i++){const p=V(-2.65+i*.66,0,(i%2?-.2:.2));const m=this.sphere(p,.17,palette[i%3],i%Math.max(1,this.nodes.length));this.wavePoints.push(m)}
  const points=Array.from({length:181},(_,i)=>V(-3+i/30,Math.sin(i/10)*.5,0));this.waveLine=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:'#447fb5'}));this.group.add(this.waveLine);
  this.label(V(-2.1,1.35),0);if(this.nodes.length>1)this.label(V(2.1,1.35),1);
  if(this.kind==='eeg'){for(let i=0;i<5;i++){const p=V((i-2)*.7,-1.25,0);this.sphere(p,.075,palette[3],0);this.tube([p,p.clone().add(V(0,-.4)),V(2.6,-1.8)],.018,'#a8b7c9',0)}}
  this.paths=[new THREE.CatmullRomCurve3([V(-2.8),V(0),V(2.8)])];
 }
 layers(){
  this.shells=[];
  for(let i=0;i<4;i++){const geo=new THREE.SphereGeometry(1.6-i*.17,32,20,0,Math.PI);const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:palette[i],roughness:.72,side:THREE.DoubleSide}));m.rotation.y=Math.PI/2;m.scale.y=.8;m.userData.step=i;this.group.add(m);this.targets.push(m);this.shells.push(m);this.label(V(-2.25+i*1.5,-1.45),i)}
  if(this.kind==='imaging'){this.slice=new THREE.Mesh(new THREE.PlaneGeometry(3.5,2.8),new THREE.MeshBasicMaterial({color:'#3374c6',transparent:true,opacity:.18,side:THREE.DoubleSide,depthWrite:false}));this.slice.rotation.y=Math.PI/2;this.group.add(this.slice)}
 }
 lateral(){
  const left=this.sphere(V(-1.15),.95,palette[0],0),right=this.sphere(V(1.15),.95,palette[3],2);left.scale.set(.8,1,1.2);right.scale.set(.8,1,1.2);
  for(let i=0;i<5;i++){const z=(i-2)*.2;const {curve}=this.tube([V(-.9,.1,z),V(0,.45,z),V(.9,.1,z)],.025,palette[1],1);this.paths.push(curve)}
  [V(-1.4,1.45),V(0,-1.2),V(1.4,1.45)].forEach((p,i)=>this.label(p,i));
 }
 glia(){
  for(let j=0;j<3;j++){
   const x=(j-1)*2.1;this.sphere(V(x),j===2?.18:.3,palette[j],j);
   for(let i=0;i<(j===2?4:6);i++){const a=i*Math.PI*2/(j===2?4:6),tip=V(x+Math.cos(a)*.75,Math.sin(a)*.7,(i%2)*.1);this.tube([V(x),tip],j===2?.02:.035,palette[j],j);if(j!==1)this.tube([tip,tip.clone().add(V(.16,.18))],.016,palette[j],j);else this.tube([tip.clone().add(V(-.2,0)),tip.clone().add(V(.2,0))],.1,'#9cbab7',j)}
   this.label(V(x,-1.35),j);
  }
 }
 attention(){
  this.distractors=[];this.sphere(V(0,0,.3),.22,palette[1],0);
  for(let i=0;i<24;i++){const angle=i*2.39996,r=.65+Math.sqrt(i/24)*1.9;const m=this.sphere(V(Math.cos(angle)*r,Math.sin(angle)*r*.62,-.15),.09,palette[0],1);this.distractors.push(m)}
  this.label(V(0,1.8),0);this.label(V(0,-1.8),1);
 }
 network(){
  const count=Math.max(2,this.nodes.length);this.networkNodes=[];
  for(let i=0;i<count;i++){
   const p=V(-2.6+5.2*i/(count-1),i%2?.55:-.45,(i%3-1)*.35);
   const m=this.sphere(p,this.kind==='development'?.28:.32,palette[i%palette.length],i);this.networkNodes.push(m);this.label(p.clone().add(V(0,i%2?.7:-.7)),i);
   if(i){const a=this.networkNodes[i-1].position,b=p;const {curve}=this.tube([a,a.clone().lerp(b,.5).add(V(0,.12,.2)),b],this.kind==='vascular'?.065:.035,this.kind==='vascular'?(i%2?'#c97579':'#718cc3'):'#a5b9ce',i);this.paths.push(curve);const direction=curve.getTangent(.64);const arrow=new THREE.ArrowHelper(direction,curve.getPoint(.64),.3,'#647f9f',.17,.1);this.group.add(arrow)}
  }
  if(['feedback','reward','metabolism'].includes(this.kind)&&count>2){const a=this.networkNodes[count-1].position,b=this.networkNodes[0].position;this.paths.push(this.tube([a,V(2,1.6,-.5),V(-2,1.6,-.5),b],.023,'#d09b77',count-1).curve)}
 }
 translate(lang){this.lang=lang;this.labels.forEach(l=>{const n=this.nodes[l.step];l.element.textContent=n?.[lang]||String(l.step+1)})}
 setStep(step){this.step=step;if(this.failed)return;for(const m of this.targets){m.material.emissive?.set(m.userData.step===step?'#273f5b':'#000000');if('emissiveIntensity'in m.material)m.material.emissiveIntensity=m.userData.step===step?.35:0}this.labels.forEach(l=>l.element.setAttribute('aria-pressed',String(l.step===step)))}
 update(params){this.params={...params};if(this.failed)return;
  if(this.shells)this.shells.forEach((m,i)=>m.position.x=this.kind==='imaging'?0:(i-1.5)*(params.separation||0)*.8);
  if(this.slice)this.slice.position.x=params.slice||0;
  this.distractors?.forEach((m,i)=>m.visible=i<(params.distractors??24));
  if(this.kind==='development')this.networkNodes?.forEach((m,i)=>m.scale.setScalar(.6+(params.progress||0)*(i+1)*.3));
  if(this.kind==='lateral')this.targets.filter(m=>m.userData.step===1).forEach(m=>m.material.color.set(new THREE.Color('#dfe6ee').lerp(new THREE.Color(palette[1]),params.communication??.6)));
  if(this.kind==='plasticity'){const value=(params.trials||0)*(params.rate||.1);this.targets.filter(m=>m.userData.step===2).forEach(m=>m.scale.setScalar(this.lesson.direction===-1?1/(1+value*.12):1+value*.12))}
  if(this.kind==='aging')this.networkNodes?.forEach((m,i)=>m.scale.setScalar(1-(params.variation||0)*(i%2)*.2));
 }
 setBrain(meshes){
  if(this.failed)return;if(this.contextGroup){this.contextScene.remove(this.contextGroup);this.contextGroup.traverse(m=>{if(m.isMesh)m.material.dispose()})}
  this.contextScene??=new THREE.Scene();if(!this.contextCamera){this.contextCamera=new THREE.PerspectiveCamera(35,1.25,.1,50);this.contextCamera.position.set(5.7,2.6,5);this.contextCamera.lookAt(0,0,0);this.contextScene.add(new THREE.HemisphereLight(0xffffff,0x7d8995,2.2));const key=new THREE.DirectionalLight(0xffffff,2.2);key.position.set(4,5,6);this.contextScene.add(key)}
  this.contextGroup=new THREE.Group();meshes.forEach(m=>{const c=new THREE.Mesh(m.geometry,this.material('#cbd5e1'));c.userData.region=m.userData.region;this.contextGroup.add(c)});this.contextScene.add(this.contextGroup);this.updateContext(this.region);
 }
 updateContext(region){this.contextGroup?.traverse(m=>{if(m.isMesh)m.material.color.set(m.userData.region===region?'#4a82c0':'#d0d9e3')})}
 frame(now){
  const dt=Math.min(.05,Math.max(0,(now-this.last)/1000));this.last=now;if(!this.active||this.failed||document.hidden||!this.host.clientWidth)return;if(this.playing)this.time+=dt;
  const p=this.params;const phase=this.playing?this.time*(p.flow||.6)*.4*this.paths.length:(p.progress||0)/(this.kind==='development'?1:100)*this.paths.length; 
  if(this.pulse&&this.paths.length){const i=Math.min(this.paths.length-1,Math.floor(phase)%this.paths.length);const at=!this.playing&&phase>=this.paths.length?1:phase%1;this.pulse.position.copy(this.paths[i].getPoint(at))}else if(this.pulse)this.pulse.visible=false;
  this.particles?.forEach((m,i)=>{m.position.x=this.kind==='barrier'?-2+((this.time*.4+i/9)%1)*3.6:-.65+((this.time*.4+i/9)%1)*1.45;m.visible=this.kind!=='barrier'||i/9<=(p.transport??.35)});
  if(this.waveLine){const array=this.waveLine.geometry.attributes.position;for(let i=0;i<array.count;i++){const t=i/(array.count-1);array.setY(i,Math.sin(t*Math.PI*2*(p.frequency||10)/3-this.time*2)*(p.amplitude||30)/55)}array.needsUpdate=true;this.wavePoints.forEach((m,i)=>m.position.y=Math.sin(i*.7-this.time*2)*.35)}
  this.controls.update();this.camera.updateMatrixWorld();this.labels.forEach(l=>{const projected=l.position.clone().project(this.camera);l.element.style.left=(projected.x*.5+.5)*this.w+'px';l.element.style.top=(-projected.y*.5+.5)*this.h+'px';l.element.hidden=projected.z>1||projected.z< -1});
  this.renderer.setScissorTest(false);this.renderer.setViewport(0,0,this.w,this.h);this.renderer.render(this.scene,this.camera);
  if(this.contextGroup&&this.w>=400){const w=120,h=96;this.renderer.setScissorTest(true);this.renderer.setScissor(this.w-w-8,8,w,h);this.renderer.setViewport(this.w-w-8,8,w,h);this.renderer.clearDepth();this.renderer.render(this.contextScene,this.contextCamera);this.renderer.setScissorTest(false)}
 }
 dispose(){this.renderer?.setAnimationLoop(null);this.clear();this.contextGroup?.traverse(m=>{if(m.isMesh)m.material.dispose()});this.controls?.dispose();this.observer?.disconnect();this.renderer?.dispose()}
}
