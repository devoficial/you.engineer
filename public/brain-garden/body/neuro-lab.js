import * as THREE from 'three';
import {OrbitControls} from '../vendor/OrbitControls.js';
import {mergeGeometries} from '../vendor/BufferGeometryUtils.js';
import {TAU,bandNames,populationSignal,spikeVoltage,cochlearPlace,mechanismFor,labCopy} from './lab-models.js';
const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
const C={cell:'#cf7665',input:'#c58b43',signal:'#157f8c',inhibit:'#7562ad',tissue:'#e9cbc4',myelin:'#dfccb0',ink:'#284c60',blood:'#ad4257'};
const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.48,metalness:.02,...extra});
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const ns='http://www.w3.org/2000/svg';
const text=(en,bn,lang)=>lang==='bn'?bn:en;

// A single renderer is reused across cellular/organ scales. Meshes are merged
// and moving particles instanced so the close-ups remain usable on a phone.
export class NeuroLab{
 constructor(host){
  this.host=host;this.active=false;this.running=!matchMedia('(prefers-reduced-motion: reduce)').matches;this.clock=0;this.last=0;this.lang='en';this.kind=null;this.frequency=2;this.alignment=.85;this.source=[];this.labels=[];this.flows=[];this.animations=[];this.cells=[];this.objects=[];
  host.innerHTML='<div class="lab-heading"><div><span class="lab-scale"></span><h3 class="lab-title"></h3></div><button class="lab-motion"></button></div><div class="lab-focusbar"></div><div class="lab-stage" tabindex="0" role="group"><div class="lab-light"></div><svg class="lab-leaders" aria-hidden="true"></svg><div class="lab-labels"></div><button class="lab-reset" hidden></button><div class="lab-status"></div><span class="lab-context-caption"></span><p class="lab-fallback" hidden></p></div><div class="lab-key"></div><div class="lab-observation" aria-live="polite"></div><div class="lab-trace"><div class="lab-trace-title"><strong></strong><span></span></div><svg viewBox="0 0 760 146" role="img" preserveAspectRatio="none"></svg><div class="trace-key"><span></span><span></span></div></div><details class="lab-experiments"><summary></summary><div class="lab-parameters"><label><span class="lab-frequency-label"></span><output class="lab-frequency-value"></output><input class="lab-frequency" type="range"></label><label><span class="lab-align-label"></span><output class="lab-align-value"></output><input class="lab-align" type="range" min="0" max="100" step="1"></label></div><p class="lab-model-note"></p></details>';
  this.$=s=>host.querySelector(s);this.stage=this.$('.lab-stage');this.overlay=this.$('.lab-labels');this.leaders=this.$('.lab-leaders');
  this.$('.lab-motion').onclick=()=>{this.running=!this.running;this.translate(this.lang);this.updateParameters()};
  this.$('.lab-reset').onclick=()=>this.reset();
  this.$('.lab-frequency').oninput=e=>{this.frequency=Number(e.target.value);this.updateParameters();this.host.dispatchEvent(new CustomEvent('lab-frequency-changed',{bubbles:true,detail:{kind:this.kind,value:this.frequency}}))};
  this.$('.lab-align').oninput=e=>{this.alignment=Number(e.target.value)/100;this.updateParameters()};
  try{this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true})}catch{this.failed=true;return}
  this.stage.prepend(this.renderer.domElement);this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));this.renderer.setClearColor(0xf8fafb,0);this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.15;
  this.scene=new THREE.Scene();this.scene.add(new THREE.HemisphereLight(0xffffff,0x8393a0,2.0));
  for(const [p,intensity,color] of [[[4,7,8],3.2,0xfff7ec],[[-5,1,4],1.2,0xd4e9ff],[[1,5,-4],2,0xffffff]]){const light=new THREE.DirectionalLight(color,intensity);light.position.set(...p);this.scene.add(light)}
  this.camera=new THREE.PerspectiveCamera(33,1,.1,100);this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.enableDamping=true;this.controls.enablePan=false;this.controls.minDistance=5;this.controls.maxDistance=22;
  this.controls.addEventListener?.('change',()=>this.changed());this.controls.addEventListener?.('start',()=>{this.cameraGoal=null;this.targetGoal=null});
  this.ray=new THREE.Raycaster();this.pointer=new THREE.Vector2();let down;
  this.renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY]});
  this.renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;down=null;const r=this.stage.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);this.ray.setFromCamera(this.pointer,this.camera);const hit=this.ray.intersectObjects(this.objects,false)[0];if(hit?.object.userData.feature!==undefined)this.selectFeature(hit.object.userData.feature,true)});
  this.stage.addEventListener('keydown',e=>{if(e.target!==this.stage||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-'].includes(e.key))return;e.preventDefault();this.cameraGoal=null;this.targetGoal=null;const s=new THREE.Spherical().setFromVector3(this.camera.position.clone().sub(this.controls.target));s.theta+=e.key==='ArrowLeft'?.12:e.key==='ArrowRight'?-.12:0;s.phi=clamp(s.phi+(e.key==='ArrowUp'?-.12:e.key==='ArrowDown'?.12:0),.2,Math.PI-.2);if(['+','=','-'].includes(e.key))s.radius=clamp(s.radius*(e.key==='-'?1.1:.9),5,22);this.camera.position.copy(this.controls.target).add(new THREE.Vector3().setFromSpherical(s));this.controls.update();this.changed()});
  this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(this.stage);
  this.renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();this.failed=true;this.$('.lab-fallback').hidden=false;this.$('.lab-fallback').textContent=text('3D is unavailable. The signal trace and lesson explanation remain available.','ত্রিমাত্রিক দৃশ্য পাওয়া যাচ্ছে না। সংকেতের রেখা ও পাঠের ব্যাখ্যা দেখা যাবে।',this.lang)});
  this.renderer.setAnimationLoop(now=>this.frame(now));
 }
 setBrain(source){this.source=source;if(this.kind&&this.available&&!this.failed)this.contextBrain()}
 set(journey,step,lang){
  const requested=mechanismFor(journey,step),kind=typeof this[requested]==='function'?requested:null,lessonChanged=this.lessonKey!==journey?.topic.id+'/'+journey?.concept.id;
  const stageChanged=this.step?.id!==step?.id||lessonChanged;this.journey=journey;this.step=step;this.lang=lang;this.available=Boolean(kind);this.host.hidden=!this.available;
  if(!kind)return;
  this.lessonKey=journey.topic.id+'/'+journey.concept.id;
  if(lessonChanged){this.frequency=kind==='hearing'?1000:journey.concept.frequency||journey.topic.frequency||2;this.alignment=journey.concept.id==='synchronization'?.3:.85;this.$('.lab-experiments').open=false;this.clock=0;this.feature=0;this.viewFocus=null}
  const changed=kind!==this.kind||(kind==='bci'&&lessonChanged);this.kind=kind;
  if(changed&&!this.failed){this.clear();this.group=new THREE.Group();this.scene.add(this.group);this[kind]();this.contextBrain();this.reset()}
  if(!this.failed)this.highlightContext();
  this.translate(lang);this.updateParameters();if(stageChanged){const focus={'implant-record':0,decoder:1,prosthetic:2,'bci-feedback':2,population:0,'timing-alignment':0,'volume-field':1,'eeg-record':2,analyze:2,sound:0,ossicles:0,hair:1,'auditory-nerve':2,membrane:0,'axon-spike':1,'sensory-axon':1,synaptic:0,integration:2,modulator:1,'plastic-change':2,light:0,optic:2,'clock-retina':1,'hand-muscle':1,'neck-motor':0,turn:2,arterial:0,venous:0,bbb:2,crh:1,acth:1,cortisol:1};this.selectFeature(focus[step.id]??0,true)}
 }
 setActive(value){this.active=value&&this.available;if(value)this.resize();else this.last=0}
 clear(){
  if(this.group){this.scene.remove(this.group);this.group.traverse(o=>{o.geometry?.dispose();if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose())})}
  this.overlay.replaceChildren();this.leaders.replaceChildren();this.labels=[];this.flows=[];this.animations=[];this.cells=[];this.objects=[];this.feature=0;this.viewFocus=null;
 }
 mesh(geometry,material,position=V(),feature=0,group=this.group){const m=new THREE.Mesh(geometry,material);m.position.copy(position);m.userData.feature=feature;group.add(m);this.objects.push(m);return m}
 ellipsoid(p,scale,color,feature=0,extra={}){const m=this.mesh(new THREE.SphereGeometry(1,32,20),mat(color,extra),p,feature);m.scale.set(...scale);return m}
 tube(points,radius,color,feature=0,extra={}){const curve=typeof points.getPoint==='function'?points:new THREE.CatmullRomCurve3(points);const m=this.mesh(new THREE.TubeGeometry(curve,48,radius,8,false),mat(color,extra),V(),feature);return {mesh:m,curve}}
 line(points,color,opacity=.5){const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color,transparent:true,opacity}));this.group.add(l);return l}
 flow(curve,{count=7,color=C.signal,radius=.045,speed=.3,offset=0}={}){const m=new THREE.InstancedMesh(new THREE.SphereGeometry(radius,10,8),new THREE.MeshBasicMaterial({color}),count);m.frustumCulled=false;this.group.add(m);this.flows.push({mesh:m,curve,count,speed,offset});return m}
 annotate(en,bn,position,feature,detailEn,detailBn){const e=document.createElement('button');e.className='lab-annotation';e.onclick=()=>this.selectFeature(feature,true);this.overlay.append(e);const line=document.createElementNS(ns,'line');this.leaders.append(line);this.labels.push({element:e,line,position,feature,en,bn,detailEn,detailBn});return e}
 selectFeature(feature,focus=false){this.feature=feature;if(focus)this.focus(feature);this.$('.lab-focusbar').querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i-1===feature)));for(const l of this.labels)l.element.setAttribute('aria-pressed',String(l.feature===feature));const label=this.labels.find(l=>l.feature===feature);if(label)this.$('.lab-observation').textContent=this.lang==='bn'?label.detailBn:label.detailEn;else this.$('.lab-observation').textContent=labCopy[this.kind].note[this.lang]}
 neuronalTree(p,scale=1,feature=0){
  const parts=[],segments=[];let seed=47+Math.round((p.x+8)*100);const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
  const branch=(start,direction,length,width,depth)=>{const end=start.clone().addScaledVector(direction,length),mid=start.clone().lerp(end,.5).add(V((rand()-.5)*.12,0,(rand()-.5)*.1));const curve=new THREE.CatmullRomCurve3([start,mid,end]);parts.push(new THREE.TubeGeometry(curve,8,width,5,false));segments.push(curve);if(depth)for(let k=0;k<2;k++){const dir=direction.clone().add(V((k?1:-1)*(.3+rand()*.45),(rand()-.35)*.3,(rand()-.5)*.65)).normalize();branch(end,dir,length*.62,width*.61,depth-1)}};
  branch(V(),V(0,1,0),.73,.035,3);
  for(let j=0;j<4;j++){const angle=j*TAU/4;branch(V(0,-.02,0),V(Math.cos(angle),-.32,Math.sin(angle)).normalize(),.42,.028,2)}
  const geometry=mergeGeometries(parts);parts.forEach(g=>g.dispose());const material=mat(C.cell,{emissive:C.input,emissiveIntensity:.03});const dendrites=this.mesh(geometry,material,p,feature);dendrites.scale.setScalar(scale);
  const soma=this.ellipsoid(p.clone().add(V(0,-.04*scale,0)),[.13*scale,.22*scale,.12*scale],C.cell,feature);const nucleus=this.ellipsoid(p.clone().add(V(0,-.05*scale,.08*scale)),[.064*scale,.084*scale,.052*scale],'#8d4d65',feature);
  const axon=this.tube([p.clone().add(V(0,-.2*scale,0)),p.clone().add(V(.04,-.6*scale,0)),p.clone().add(V(.18,-1.0*scale,-.06))],.018*scale,C.signal,feature);
  this.cells.push({dendrites,soma,nucleus,material,p,scale,axon});return this.cells.at(-1);
 }
 rhythm(){
  for(let row=0;row<2;row++)for(let i=0;i<6;i++)this.neuronalTree(V(-2.8+i*.57,-.12+(i%2)*.10,-.42+row*.8),.72,0);
  // The open volume exposes aligned apical dendrites; layers are landmarks,
  // not a segmentation or a literal twelve-cell generator of scalp EEG.
  for(let i=0;i<6;i++){
   const plane=this.mesh(new THREE.BoxGeometry(3.6,.025,1.65),mat(i%2?'#b7c7cf':'#e2b6a8',{transparent:true,opacity:.16,depthWrite:false}),V(-1.35,-1.1+i*.47,-.05),0);
   this.line([V(-3.18,plane.position.y,.79),V(.48,plane.position.y,.79)],'#a7b6c2',.42);
  }
  const scaffold=new THREE.EdgesGeometry(new THREE.BoxGeometry(3.65,2.7,1.65));const edges=new THREE.LineSegments(scaffold,new THREE.LineBasicMaterial({color:'#aab9c5',transparent:true,opacity:.28}));edges.position.set(-1.35,.15,-.05);this.group.add(edges);
  for(let layer=0;layer<2;layer++)this.mesh(new THREE.BoxGeometry(3.7,.11,1.7),mat(layer?'#dac6b3':'#e6c4b9',{transparent:true,opacity:.55,depthWrite:false}),V(-1.35,1.7+layer*.18,-.05),1);
  const electrodes=[V(-2.35,2.03,.15),V(-.4,2.03,.15)];
  electrodes.forEach((p,i)=>{this.mesh(new THREE.CylinderGeometry(.14,.17,.08,28),mat(i?C.ink:C.signal,{metalness:.65,roughness:.25}),p,2);this.tube([p,p.clone().add(V(0,.35,0)),V(1.45,2.25-i*.15,.1),V(2.15,1.43-i*.24,.1)],.018,i?C.ink:C.signal,2)});
  for(let i=0;i<5;i++){const x=-2.8+i*.65;const points=Array.from({length:40},(_,j)=>{const u=j/39;return V(x+Math.sin(u*Math.PI)*.3,.08+u*1.85,.23+Math.sin(u*Math.PI)*.13)});const f=this.line(points,C.signal,.3);this.animations.push(t=>{f.material.opacity=.13+.26*(.5+.5*Math.sin(TAU*this.frequency*t/8))})}
  const localCurrents=new THREE.InstancedMesh(new THREE.SphereGeometry(.025,8,6),new THREE.MeshBasicMaterial({color:'#168692'}),this.cells.length*3);localCurrents.frustumCulled=false;this.group.add(localCurrents);
  this.animations.push(t=>{const dummy=new THREE.Object3D();this.cells.forEach((cell,i)=>{const phase=TAU*this.frequency*t/8+TAU*i/this.cells.length*(1-this.alignment),direction=Math.sin(phase)>=0?1:-1;for(let j=0;j<3;j++){let u=(t*.65+j/3)%1;if(direction<0)u=1-u;dummy.position.copy(cell.p).add(V(0,.13+u*.95,.04));dummy.scale.setScalar(.45+.55*Math.abs(Math.sin(phase)));dummy.updateMatrix();localCurrents.setMatrixAt(i*3+j,dummy.matrix)}});localCurrents.instanceMatrix.needsUpdate=true});
  const amplifier=this.mesh(new THREE.BoxGeometry(.82,.6,.36),mat('#d3dde2',{metalness:.25}),V(2.4,1.4,0),2);
  this.mesh(new THREE.BoxGeometry(.68,.39,.02),mat('#24475a'),V(2.4,1.4,.19),2);
  const wave=Array.from({length:65},(_,i)=>V(2.08+i*.01,1.4+Math.sin(i*.32)*.1,.211));this.line(wave,'#68d0c5',1);
  this.annotate('Pyramidal-cell population','পিরামিডাল কোষসমষ্টি',V(-2.4,.7,.8),0,'Many aligned dendrites contribute postsynaptic currents. The cells here represent a much larger cortical population.','অনেক একই দিকে থাকা ডেনড্রাইট পোস্টসিন্যাপটিক প্রবাহে অংশ নেয়। এখানকার কোষ অনেক বড় কোষসমষ্টির প্রতিনিধি।');
  this.annotate('Fields through tissue','টিস্যু দিয়ে বৈদ্যুতিক ক্ষেত্র',V(-.55,1.78,.7),1,'The electric field spreads through brain tissue, CSF, skull and scalp. The arcs indicate field coupling, not axons or flowing transmitter.','বৈদ্যুতিক ক্ষেত্র মস্তিষ্কের টিস্যু, সিএসএফ, খুলি ও ত্বক দিয়ে ছড়ায়। রেখাগুলো ক্ষেত্র বোঝায়, অ্যাক্সন বা রাসায়নিকের প্রবাহ নয়।');
  this.annotate('A − reference','A − রেফারেন্স',V(2.4,1.7,.2),2,'An amplifier records a voltage difference between electrodes. Synchrony and geometry affect the summed signal; frequency alone does not determine its size.','অ্যামপ্লিফায়ার ইলেকট্রোডের ভোল্টেজের পার্থক্য মাপে। সমলয়তা ও গঠন যোগফলে প্রভাব ফেলে; শুধু কম্পাঙ্ক দিয়ে আকার নির্ধারিত হয় না।');
 }
 bci(){
  const eeg=this.journey.concept.id==='eeg-interface';this.bciSensor=eeg?'scalp':'implanted';
  this.mesh(new THREE.BoxGeometry(1.85,.16,1.1),mat('#dfb8ac'),V(-2.25,-.47,0),0);
  for(let i=0;i<5;i++)this.neuronalTree(V(-2.95+i*.34,-.16,(i%2-.5)*.4),.38,0);
  if(eeg){
   this.mesh(new THREE.BoxGeometry(1.95,.13,1.15),mat('#e5d9c7',{transparent:true,opacity:.65}),V(-2.25,.63,0),0);
   for(const x of [-2.8,-2.25,-1.7])this.mesh(new THREE.CylinderGeometry(.12,.15,.09,24),mat('#338f9f',{metalness:.5}),V(x,.75,.10),0);
  }else{
   this.mesh(new THREE.BoxGeometry(1.2,.09,.72),mat('#2f7483',{metalness:.45}),V(-2.25,.68,0),0);
   for(let x=0;x<4;x++)for(let z=0;z<3;z++)this.mesh(new THREE.CylinderGeometry(.018,.011,.54,10),mat('#c9d8e0',{metalness:.7,roughness:.24}),V(-2.7+x*.30,.38,-.25+z*.25),0);
  }
  const lead=this.tube([V(-1.68,.73,0),V(-1.1,.94,0),V(-.76,.53,.05),V(-.43,.50,.06)],.025,C.signal,0);this.flow(lead.curve,{count:5,radius:.04,speed:.23});
  this.mesh(new THREE.BoxGeometry(1.1,1.22,.44),mat('#a8bdca',{metalness:.35}),V(.1,.15,0),1);
  this.mesh(new THREE.BoxGeometry(.93,.82,.025),mat('#214354'),V(.1,.24,.235),1);
  const bars=[];for(let i=0;i<3;i++)bars.push(this.mesh(new THREE.BoxGeometry(.65,.09,.03),mat(['#66c4ca','#e0b86d','#b6a7dd'][i],{emissive:'#163c45',emissiveIntensity:.2}),V(.07,.48-i*.23,.27),1));
  for(const x of [-.25,0,.25])this.mesh(new THREE.SphereGeometry(.035,12,8),mat('#65c9bc',{emissive:'#208779',emissiveIntensity:.4}),V(x,-.33,.245),1);
  const output=this.tube([V(.65,.16,0),V(1.15,.1,.05),V(1.55,-.9,.1),V(2.4,-.9,0)],.029,'#d99e4c',1);this.flow(output.curve,{count:4,radius:.045,speed:.18,color:'#d99e4c'});
  const hand=new THREE.Group();hand.position.set(2.4,-.15,0);hand.rotation.y=-.3;this.group.add(hand);
  this.mesh(new THREE.BoxGeometry(.75,.9,.28),mat('#c7d5df',{metalness:.45,roughness:.3}),V(0,0,0),2,hand);
  this.mesh(new THREE.BoxGeometry(.59,.62,.035),mat('#477b8e',{metalness:.4}),V(0,0,.16),2,hand);
  this.mesh(new THREE.CylinderGeometry(.24,.22,.30,28),mat('#718fa1',{metalness:.5}),V(0,-.60,0),2,hand);
  const joints=[];for(let finger=0;finger<5;finger++){
   let parent=hand;const lengths=finger===4?[.30,.25]:[.37+(finger===1?.06:0),.27,.19];
   for(let segment=0;segment<lengths.length;segment++){
    const joint=new THREE.Group();parent.add(joint);joint.position.copy(segment?V(0,lengths[segment-1],0):finger===4?V(-.39,-.12,.04):V(-.27+finger*.18,.45,0));if(finger===4&&segment===0)joint.rotation.z=.85;
    this.mesh(new THREE.SphereGeometry(.075,16,12),mat('#456575',{metalness:.55}),V(),2,joint);
    this.mesh(new THREE.CapsuleGeometry(.068,Math.max(.02,lengths[segment]-.14),5,12),mat('#c9d8e1',{metalness:.55,roughness:.27}),V(0,lengths[segment]/2,0),2,joint);
    joints.push({joint,segment});parent=joint;
   }
  }
  this.animations.push(t=>{
   // Fixed toy weights make the connection between input features and motion visible.
   const features=[.5+.5*Math.sin(t*.75),.5+.5*Math.sin(t*.75-.7),.5+.5*Math.sin(t*.75+.45)];
   const command=clamp(.65*features[0]-.2*features[1]+.55*features[2],0,1);this.bciState={features,command};
   bars.forEach((m,i)=>{m.scale.x=.1+.9*features[i];m.position.x=-.26+.325*m.scale.x});
   for(const {joint,segment} of joints)joint.rotation.x=command*(segment===0?1.0:1.25);
  });
  this.annotate(eeg?'Scalp recording electrodes':'Cortical recording array',eeg?'মাথার ত্বকের ইলেকট্রোড':'কর্টেক্সের রেকর্ডিং অ্যারে',V(-2.3,.99,.2),0,eeg?'Scalp electrodes measure voltage differences. The signals mix population activity and require careful processing.':'An implanted electrode array samples local neural activity. This example shows recording rather than stimulation.',eeg?'ত্বকের ইলেকট্রোড ভোল্টেজের পার্থক্য মাপে। এতে কোষসমষ্টির কাজ মেশে এবং যত্ন করে প্রক্রিয়া করতে হয়।':'প্রতিস্থাপিত ইলেকট্রোড স্থানীয় স্নায়ুর কাজ মাপে। এখানে রেকর্ডিং দেখানো, উদ্দীপনা দেওয়া নয়।');
  this.annotate('Patterns → a device command','ধরন → যন্ত্রের নির্দেশ',V(.1,.89,.3),1,'A decoder combines selected features into a command. In real systems it is calibrated from examples; the three bars and fixed weights here are illustrative.','ডিকোডার বৈশিষ্ট্য মিলিয়ে নির্দেশ তৈরি করে। আসল ব্যবস্থায় উদাহরণ দিয়ে ক্যালিব্রেট করা হয়; এই তিন বার ও স্থির ওজন বোঝানোর জন্য।');
  this.annotate('Electronics move the robotic hand','ইলেকট্রনিক নির্দেশে রোবট হাত নড়ে',V(2.4,1.45,.2),2,'An electronic controller drives the robotic fingers. Their motion follows this model’s decoded command; it does not travel through an arm motor nerve.','ইলেকট্রনিক কন্ট্রোলার রোবটের আঙুল চালায়। চলন মডেলের ডিকোড করা নির্দেশ অনুসরণ করে; বাহুর মোটর স্নায়ু দিয়ে যায় না।');
 }
 neuron(){
  const cell=this.neuronalTree(V(-2.05,.32,0),1.1,0);this.group.remove(cell.axon.mesh);this.objects=this.objects.filter(o=>o!==cell.axon.mesh);cell.axon.mesh.geometry.dispose();cell.axon.mesh.material.dispose();
  const {curve}=this.tube([V(-2.05,.12),V(-1.7,-.52),V(-1.1,-.62),V(.7,-.62),V(2.55,-.52),V(3,.15)],.055,C.cell,1);
  const nodes=[];
  for(let i=0;i<6;i++){
   const x=-1.12+i*.56;const sheath=this.mesh(new THREE.CylinderGeometry(.19,.19,.43,28,1,false),mat(C.myelin,{roughness:.38}),V(x,-.62,0),1);sheath.rotation.z=Math.PI/2;
   for(const side of [-1,1]){const ring=this.mesh(new THREE.TorusGeometry(.17,.025,8,28),mat('#b9a68a'),V(x+side*.21,-.62,0),1);ring.rotation.y=Math.PI/2}
   nodes.push(this.ellipsoid(V(x+.27,-.62,0),[.055,.077,.077],C.signal,1,{emissive:C.signal}));
  }
  const pulse=this.flow(curve,{count:1,radius:.075,speed:.23,color:'#39b6bc'});
  for(let i=0;i<4;i++){const end=V(3.45,(i-1.5)*.31+.3,(i%2-.5)*.36);this.tube([V(2.65,-.4),V(3.02,end.y*.7),end],.028,C.cell,2);this.ellipsoid(end,[.13,.1,.13],C.input,2)}
  this.animations.push(t=>{const resting=this.step.id==='membrane';pulse.visible=!resting;nodes.forEach((n,i)=>{const phase=(t*.23)%1;const lit=!resting&&Math.abs(phase-(.30+i*.073))<.065;n.material.emissiveIntensity=lit?1.8:.08})});
  this.annotate('Dendrites & cell body','ডেনড্রাইট ও কোষদেহ',V(-2.05,.9,.4),0,'Dendrites receive local synaptic inputs. Their effects combine across the cell; sufficient excitation near the axon initial segment can initiate an action potential.','ডেনড্রাইট স্থানীয় সিন্যাপটিক তথ্য পায়। কোষে তার ফল যোগ হয়; অ্যাক্সনের শুরুর কাছে যথেষ্ট উত্তেজনায় অ্যাকশন পোটেনশিয়াল তৈরি হতে পারে।');
  this.annotate('Myelin · node of Ranvier','মায়েলিন · র‍্যানভিয়ের নোড',V(.55,-.4,.2),1,'The pale sleeves are myelin. Between them, voltage-gated channels regenerate the action potential; the illuminated sites show this sequence in slow motion.','হালকা আবরণটি মায়েলিন। ফাঁকের ভোল্টেজনির্ভর চ্যানেলে অ্যাকশন পোটেনশিয়াল নতুন করে তৈরি হয়; আলোকিত স্থানগুলো ধীরে সেই ক্রম দেখায়।');
  this.annotate('Axon terminals','অ্যাক্সনের টার্মিনাল',V(3.35,.6,.2),2,'The axon branches into terminals. At a chemical synapse, terminal depolarization opens calcium channels and can trigger vesicle release.','অ্যাক্সন টার্মিনালে শাখা হয়। রাসায়নিক সিন্যাপসে টার্মিনালের ডিপোলারাইজেশন ক্যালসিয়াম চ্যানেল খুলে ভেসিকল ছাড়তে পারে।');
 }
 synapse(){
  // Open hemispheres expose organelles without fading away the whole object.
  const pre=this.mesh(new THREE.SphereGeometry(1.4,40,28,Math.PI,Math.PI),mat('#dca99a',{side:THREE.DoubleSide}),V(-1.65,0,0),0);pre.scale.set(.94,1.1,.75);
  const post=this.mesh(new THREE.SphereGeometry(1.4,40,28,Math.PI,Math.PI),mat('#a0c5c5',{side:THREE.DoubleSide}),V(1.7,0,0),2);post.scale.set(.94,1.1,.65);
  this.tube([V(-.32,-1.26,.04),V(-.22,-.5,.04),V(-.22,.5,.04),V(-.32,1.26,.04)],.06,'#bd766a',0);
  this.tube([V(.34,-1.26,.04),V(.24,-.5,.04),V(.24,.5,.04),V(.34,1.26,.04)],.06,'#468e93',2);
  for(let i=0;i<13;i++){const x=-2.25+(i%3)*.46,y=-.92+Math.floor(i/3)*.48;const vesicle=this.ellipsoid(V(x,y,.1),[.16,.16,.14],C.input,0,{roughness:.3});this.ellipsoid(V(x,y,.23),[.075,.075,.045],'#ecd294',0);if(i===5)this.animations.push(t=>{const u=(t*.18)%1;vesicle.position.x=x+(1.12+x*-1)*Math.sin(u*Math.PI)*.4})}
  for(let i=0;i<5;i++){const y=(i-2)*.44;this.tube([V(.41,y-.12,.15),V(.31,y-.1,.15),V(.30,y+.1,.15),V(.41,y+.12,.15)],.043,C.inhibit,2);
   const {curve}=this.tube([V(-.16,y,.15),V(0,y+.06,.2),V(.3,y,.15)],.006,'#d9c6a7',1,{transparent:true,opacity:.2});
   this.flow(curve,{count:3,radius:.035,color:C.input,speed:.18,offset:i*.12});
  }
  for(let i=0;i<4;i++)this.mesh(new THREE.CylinderGeometry(.07,.07,.18,12),mat(C.signal),V(-.28,(i-1.5)*.45,.25),0).rotation.z=Math.PI/2;
  const response=this.ellipsoid(V(1.12,0,.1),[.65,1.05,.05],C.signal,2,{transparent:true,opacity:.10,depthWrite:false,emissive:C.signal});
  this.animations.push(t=>{response.material.opacity=.05+.12*(.5+.5*Math.sin(t*TAU*.18-1));response.material.color.set(this.journey.concept.id==='gaba'||this.journey.concept.id==='inhibition'?C.inhibit:C.signal)});
  this.annotate('Vesicles in the terminal','টার্মিনালের ভেসিকল',V(-1.9,.9,.3),0,'Calcium entry promotes vesicle fusion with the presynaptic membrane. Transmitter is released from the terminal into the synaptic cleft.','ক্যালসিয়াম ঢুকলে ভেসিকল প্রিসিন্যাপটিক ঝিল্লির সঙ্গে মিশতে সাহায্য করে। টার্মিনাল থেকে ফাঁকে নিউরোট্রান্সমিটার ছাড়া হয়।');
  this.annotate('Transmitter in the cleft','ফাঁকে নিউরোট্রান্সমিটার',V(.02,-.55,.2),1,'Gold particles represent transmitter diffusing across the cleft. The gap is enlarged for visibility; it is not the distance between entire neurons.','সোনালি কণা ফাঁক দিয়ে নিউরোট্রান্সমিটারের বিস্তার বোঝায়। দেখার জন্য ফাঁক বড় করা; এটি সম্পূর্ণ নিউরনের মধ্যেকার দূরত্ব নয়।');
  this.annotate('Postsynaptic receptors','পোস্টসিন্যাপটিক রিসেপ্টর',V(.52,.7,.3),2,'Receptor binding changes the cell’s conductance or intracellular signaling. The response can be excitatory, inhibitory or modulatory, depending on the receptor.','রিসেপ্টরে বাঁধলে কোষের পরিবাহিতা বা ভেতরের সংকেত বদলায়। রিসেপ্টর অনুযায়ী ফল উত্তেজক, নিরোধক বা নিয়ন্ত্রক হতে পারে।');
 }
 gap(){
  this.ellipsoid(V(-1.65,0,-.2),[1.25,1.48,.55],'#dca99a',0);this.ellipsoid(V(1.65,0,-.2),[1.25,1.48,.55],'#a0c5c5',2);
  for(let i=0;i<7;i++){const y=(i-3)*.3;const {curve}=this.tube([V(-.52,y,.08),V(0,y,.08),V(.52,y,.08)],.075,i%2?C.myelin:'#a7bdc3',1);this.flow(curve,{count:2,radius:.026,speed:.25,offset:i*.2})}
  this.annotate('First cell','প্রথম কোষ',V(-1.7,.9,.2),0,'Changes in the first cell’s voltage can drive ionic current through channels connecting the two cells.','প্রথম কোষের ভোল্টেজের পরিবর্তনে দুই কোষের সংযোগকারী চ্যানেল দিয়ে আয়নের প্রবাহ যেতে পারে।');
  this.annotate('Gap-junction channels','গ্যাপ জাংশন চ্যানেল',V(0,0,.2),1,'Connexon channels bridge neighboring cell interiors. No vesicles or chemical-transmitter release are shown in this electrical synapse.','কনেক্সন চ্যানেল পাশের কোষের ভেতর যুক্ত করে। এই বৈদ্যুতিক সিন্যাপসে ভেসিকল বা রাসায়নিকের মুক্তি দেখানো হয় না।');
  this.annotate('Coupled neighboring cell','সংযুক্ত পাশের কোষ',V(1.7,.9,.2),2,'Electrical coupling can transmit a voltage change rapidly. Many gap junctions conduct in both directions; this animation illustrates one direction at a time.','বৈদ্যুতিক সংযোগ দ্রুত ভোল্টেজের পরিবর্তন পাঠাতে পারে। অনেক গ্যাপ জাংশনে দুই দিকেই প্রবাহ যায়; এখানে একবারে এক দিক দেখানো।');
 }
 haircell(){
  const cell=this.ellipsoid(V(-.45,-.05,0),[.72,1.25,.62],'#d1a995',1,{transparent:true,opacity:.50,depthWrite:false});
  this.ellipsoid(V(-.45,-.48,.05),[.34,.39,.32],'#9b7d99',1);
  const bundle=new THREE.Group();bundle.position.set(-.45,1.1,0);this.group.add(bundle);
  for(let row=0;row<3;row++)for(let i=0;i<7;i++){const height=.4+row*.21,p=V((i-3)*.125,height/2,row*.17-.16);const c=this.mesh(new THREE.CylinderGeometry(.035,.043,height,12),mat('#5a9da5'),p,0,bundle);if(row<2){const link=this.tube([V(p.x,height,p.z),V(p.x,height+.17,p.z+.17)],.009,C.input,0);bundle.add(link.mesh)}}
  const ions=[];for(let i=0;i<12;i++)ions.push(this.ellipsoid(V(-.8+i*.06,1.6,.45),[.028,.028,.028],C.input,1,{emissive:C.input,emissiveIntensity:.6}));
  const terminal=this.ellipsoid(V(-.45,-1.45,.1),[.52,.19,.4],C.signal,2);
  for(let i=0;i<9;i++)this.ellipsoid(V(-.75+(i%3)*.28,-.82-Math.floor(i/3)*.11,.25),[.055,.055,.055],'#d4a047',1);
  const {curve}=this.tube([V(-.1,-1.45,.1),V(.75,-1.5,.1),V(1.9,-.8,.05),V(3.1,-.15,0)],.07,C.signal,2);const flow=this.flow(curve,{count:3,radius:.058,color:'#3ab4bc',speed:.21});
  this.animations.push(t=>{const input=Math.sin(t*1.7);bundle.rotation.x=input*.14;cell.material.emissive.set(C.input);cell.material.emissiveIntensity=.12+.25*Math.max(0,input);terminal.material.emissive.set(C.signal);terminal.material.emissiveIntensity=.1+.45*Math.max(0,Math.sin(t*1.7-.4));flow.visible=input>-.4;ions.forEach((ion,i)=>{ion.position.y=1.95-((t*.6+i/12)%1)*1.1;ion.visible=input>0})});
  this.annotate('Stereocilia & tip links','স্টেরিওসিলিয়া ও টিপ লিংক',V(-.55,2.1,.2),0,'Sound-driven fluid motion bends the bundle. Tip-link tension helps regulate the mechanotransduction channels.','শব্দে তরল নড়ে গুচ্ছ বাঁকায়। টিপ লিংকের টান যান্ত্রিক-সংবেদী চ্যানেল নিয়ন্ত্রণে সাহায্য করে।');
  this.annotate('Graded receptor potential','ক্রমাগত রিসেপ্টর বিভব',V(-.7,.2,.6),1,'Ion entry changes hair-cell membrane potential. Calcium-dependent transmitter release at the base couples that response to the nerve ending.','আয়ন প্রবেশে হেয়ার সেলের ঝিল্লির বিভব বদলায়। গোড়ায় ক্যালসিয়ামনির্ভর রাসায়নিক মুক্তি সেই সাড়া স্নায়ুর প্রান্তে দেয়।');
  this.annotate('Spikes in auditory nerve','শ্রবণ স্নায়ুর স্পাইক',V(2,-.4,.2),2,'The postsynaptic auditory neuron generates action potentials. These travel through CN VIII toward the cochlear nuclei.','পরের শ্রবণ নিউরন অ্যাকশন পোটেনশিয়াল তৈরি করে। তা CN VIII দিয়ে ককলিয়ার নিউক্লিয়াসে যায়।');
 }
 hearing(){
  const drum=this.mesh(new THREE.CylinderGeometry(.67,.67,.025,40),mat('#d5bba7',{transparent:true,opacity:.8,side:THREE.DoubleSide}),V(-2.8,0,0),0);drum.rotation.z=Math.PI/2;
  const bones=[V(-2.68,.22,0),V(-2.3,.58,0),V(-1.9,.35,0),V(-1.55,.10,0)];
  for(let i=1;i<bones.length;i++){this.tube([bones[i-1],bones[i]],i===1?.095:.065,'#dfd0b7',0);this.ellipsoid(bones[i],[.12,.10,.12],'#e4d9c5',0)}
  const spiral=[];for(let i=0;i<=200;i++){const u=i/200,a=u*TAU*2.55,r=1.2*(1-u)+.16;spiral.push(V(.45+Math.cos(a)*r,Math.sin(a)*r,.25-u*.4))}
  const curve=new THREE.CatmullRomCurve3(spiral);this.tube(curve,.16,'#93bfc2',1,{transparent:true,opacity:.28,depthWrite:false,roughness:.28});
  const membrane=this.tube(curve,.037,'#3893a0',1);this.tube([V(-1.55,.1),V(-1.15,-.15),spiral[0]],.09,'#83acb8',1);
  const segments=[];for(let i=0;i<50;i++){const u=i/49,p=curve.getPoint(u);const m=this.ellipsoid(p,[.043,.043,.043],C.signal,1,{emissive:C.signal});segments.push({m,u})}
  for(let i=0;i<7;i++){const p=curve.getPoint(.1+i*.11);const {curve:nerve}=this.tube([p,p.clone().add(V(.35,.25,-.2)),V(2.5,.25+(i-3)*.06,-.4),V(3.1,.5,-.2)],.016,C.input,2);this.flow(nerve,{count:2,radius:.03,speed:.18,offset:i*.1,color:'#ce963d'})}
  const fronts=[];for(let i=0;i<4;i++){const ring=this.mesh(new THREE.TorusGeometry(.44,.011,6,40),mat(C.input,{transparent:true,opacity:.4}),V(-3.4,0,0),0);ring.rotation.y=Math.PI/2;fronts.push(ring)}
  this.animations.push(t=>{drum.position.x=-2.8+Math.sin(t*7)*.035;fronts.forEach((f,i)=>{const u=(t*.5+i/4)%1;f.position.x=-3.85+u;f.material.opacity=.55*Math.sin(u*Math.PI)});const peak=cochlearPlace(this.frequency);segments.forEach(({m,u})=>{const envelope=Math.exp(-(((u-peak)/.15)**2)),motion=.5+.5*Math.sin(t*8-u*16);m.material.emissiveIntensity=.1+envelope*motion*2;m.scale.setScalar(.035+envelope*motion*.032)})});
  this.annotate('Eardrum & ossicles','কানের পর্দা ও অস্থি',V(-2.28,.7,.1),0,'Air-pressure changes move the eardrum. The malleus, incus and stapes transmit this mechanical vibration to the cochlear entrance.','বায়ুচাপের পরিবর্তনে কানের পর্দা নড়ে। ম্যালিয়াস, ইনকাস ও স্টেপিস এই কম্পন ককলিয়ার প্রবেশপথে পাঠায়।');
  this.annotate('Tonotopic cochlea','ককলিয়ায় সুরের বিন্যাস',V(.8,.55,.4),1,'Change sound pitch in the experiment. The response maximum shifts along the basilar membrane: high frequency toward the base, low frequency toward the apex.','পরীক্ষায় সুর বদলাও। বেসিলার ঝিল্লির সর্বাধিক সাড়ার স্থান বদলাবে: উঁচু কম্পাঙ্ক বেসের দিকে, নিচু কম্পাঙ্ক অ্যাপেক্সের দিকে।');
  this.annotate('Hair cells → CN VIII','হেয়ার সেল → CN VIII',V(2.5,.4,.1),2,'Hair cells convert mechanical movement into electrical changes and release transmitter onto auditory nerve fibers. CN VIII carries the neural signal toward the brainstem.','হেয়ার সেল কম্পনকে বৈদ্যুতিক পরিবর্তনে বদলে শ্রবণ স্নায়ুতন্তুতে নিউরোট্রান্সমিটার ছাড়ে। CN VIII সংকেত ব্রেনস্টেমের দিকে বহন করে।');
 }
 vision(){
  this.mesh(new THREE.SphereGeometry(1.48,48,32,Math.PI,Math.PI),mat('#e3ddd8',{side:THREE.DoubleSide}),V(-.35,0,0),0);
  this.mesh(new THREE.SphereGeometry(1.37,48,32,Math.PI,Math.PI),mat('#bf766c',{side:THREE.DoubleSide}),V(-.35,0,.045),1);
  this.ellipsoid(V(-1.2,0,.18),[.25,.70,.6],'#b6dce0',0,{transparent:true,opacity:.58,roughness:.14,depthWrite:false});
  this.tube([V(1.03,0,-.15),V(1.7,-.15,-.3),V(2.8,-.45,-.2)],.20,'#dcccad',2);
  for(let i=0;i<13;i++){const a=-1.15+i*.19,p=V(-.35+1.29*Math.cos(a),1.29*Math.sin(a),.05);this.ellipsoid(p,[.06,.13,.07],i%3?'#739eaa':'#baad6d',1)}
  for(const offset of [-.45,0,.45]){const {curve}=this.tube([V(-3.5,offset,.18),V(-1.2,offset,.18),V(1.0,0,.15)],.008,'#ccaf62',0);this.flow(curve,{count:3,color:'#c5a54d',radius:.035,speed:.25,offset})}
  const {curve}=this.tube([V(1,.0,.16),V(1.7,-.15,.15),V(2.8,-.45,.05)],.018,C.signal,2);this.flow(curve,{count:5,color:C.signal,speed:.26});
  this.annotate('Lens & optical path','লেন্স ও আলোর পথ',V(-1.35,.6,.25),0,'The cornea and lens focus incoming light. Gold rays indicate an optical path; these are photons, not nerve impulses.','কর্নিয়া ও লেন্স আলো ফোকাস করে। সোনালি রেখা আলোর পথ বোঝায়; এটি স্নায়ুর সংকেত নয়।');
  this.annotate('Retinal receptors','রেটিনার রিসেপ্টর',V(.68,.95,.25),1,'Rods and cones transduce light. Bipolar and other retinal circuits shape the signal before ganglion cells send spiking output.','রড ও কোন আলো থেকে সংকেত তৈরি করে। বাইপোলার ও অন্যান্য রেটিনার সার্কিট সংকেত বদলায়, তারপর গ্যাংলিয়ন কোষ স্পাইক পাঠায়।');
  this.annotate('Optic nerve','দৃষ্টিস্নায়ু',V(2.3,-.2,.1),2,'Axons of retinal ganglion cells form CN II. The pathway continues through central relays; light itself does not travel along the optic nerve.','রেটিনার গ্যাংলিয়ন কোষের অ্যাক্সন CN II গড়ে। পথ কেন্দ্রীয় রিলে দিয়ে চলে; আলো নিজে দৃষ্টিস্নায়ুতে যায় না।');
 }
 receptor(){
  for(let i=0;i<3;i++)this.mesh(new THREE.BoxGeometry(4.9,.25+i*.15,1.25),mat(['#d7b09e','#dfbdad','#e8d4b4'][i]),V(-.2,.7-i*.5,-.45),0);
  const ending=this.ellipsoid(V(-1.2,-.65,.22),[.56,.42,.35],'#9dafa6',1,{transparent:true,opacity:.16,depthWrite:false});
  const rings=[];for(let i=0;i<7;i++){const r=this.mesh(new THREE.TorusGeometry(.13+i*.06,.012,5,36),mat('#7e9997'),V(-1.2,-.65,.25),1);r.scale.y=.7;rings.push(r)}
  const {curve}=this.tube([V(-1.2,-.65,.28),V(-.6,-.8,.28),V(.8,-.9,.25),V(2.7,-.35,.25)],.036,C.signal,2);this.flow(curve,{count:4,radius:.05,color:C.signal,speed:.25});
  const endings=[];for(let i=0;i<5;i++){const p=V(-1.2+(i-2)*.3,.52,.26);endings.push(this.tube([V(-1.2,-.6,.25),V(p.x,.0,.25),p],.021,C.cell,1).mesh)}
  const probe=this.mesh(new THREE.CylinderGeometry(.13,.18,.65,24),mat('#6c8390'),V(-1.2,1.5,.1),0);
  this.animations.push(t=>{probe.position.y=1.35+.18*(.5+.5*Math.cos(t*2));const pain=this.step.id==='nociceptor';ending.visible=!pain;rings.forEach(m=>m.visible=!pain);endings.forEach(m=>m.material.emissive.set(C.input));endings.forEach(m=>m.material.emissiveIntensity=.2+.25*Math.sin(t*2))});
  this.annotate('Skin layers','ত্বকের স্তর',V(-2,.9,.3),0,'Physical deformation reaches sensory endings embedded at different depths. This open section makes the normally hidden receptor visible.','বিভিন্ন গভীরতার সংবেদী প্রান্তে বিকৃতি পৌঁছায়। খোলা অংশে সাধারণত লুকিয়ে থাকা রিসেপ্টর দেখা যায়।');
  this.annotate('Receptor ending','রিসেপ্টরের প্রান্ত',V(-1.2,-.55,.4),1,'A mechanoreceptor changes its electrical state when tissue is deformed. Free endings participate in other sensations, including nociception.','টিস্যু বিকৃত হলে মেকানোরিসেপ্টরের বৈদ্যুতিক অবস্থা বদলায়। মুক্ত প্রান্ত ব্যথাসহ অন্য অনুভবে অংশ নেয়।');
  this.annotate('Sensory axon','সংবেদী অ্যাক্সন',V(1.8,-.55,.3),2,'The sensory fiber carries action potentials toward the spinal cord. Central pathways then distribute the information for perception and action.','সংবেদী তন্তু অ্যাকশন পোটেনশিয়াল সুষুম্নার দিকে পাঠায়। কেন্দ্রীয় পথ অনুভব ও কাজের জন্য তথ্য বিতরণ করে।');
 }
 spindle(){
  const working=new THREE.Group();this.group.add(working);
  for(let i=0;i<6;i++){const f=this.mesh(new THREE.CylinderGeometry(.09,.09,4.6,16),mat(C.cell),V(0,-.60+i*.15,-.32),0,working);f.rotation.z=Math.PI/2}
  const capsule=new THREE.Group();this.group.add(capsule);
  this.ellipsoid(V(0,.38,.16),[1.9,.32,.40],'#bdcbc7',1,{transparent:true,opacity:.16,depthWrite:false});
  for(let i=0;i<4;i++){const f=this.mesh(new THREE.CylinderGeometry(.035,.035,3.4,12),mat('#d8af8c'),V(0,.34+i*.06,.19),1,capsule);f.rotation.z=Math.PI/2}
  const coil=Array.from({length:180},(_,i)=>{const u=i/179;return V(-.72+u*1.44,.44+Math.sin(u*TAU*8)*.19,.19+Math.cos(u*TAU*8)*.19)});const ending=this.tube(coil,.018,C.signal,1);capsule.add(ending.mesh);
  const {curve}=this.tube([V(.70,.44,.38),V(1.25,1.1,.35),V(2.35,1.45,.2),V(3.25,1.65,.1)],.036,C.signal,2);this.flow(curve,{count:5,radius:.047,speed:.22});
  this.animations.push(t=>{const stretch=1+.10*Math.sin(t*1.1);working.scale.x=stretch;capsule.scale.x=stretch;ending.mesh.material.emissive.set(C.signal);ending.mesh.material.emissiveIntensity=.25+.45*(.5+.5*Math.sin(t*1.1))});
  this.annotate('Working muscle fibers','কর্মরত পেশিতন্তু',V(-1.5,-.2,.1),0,'The spindle sits alongside the force-producing fibers. When the muscle lengthens, the spindle also stretches.','বল তৈরির তন্তুর পাশে স্পিন্ডল থাকে। পেশি লম্বা হলে স্পিন্ডলও প্রসারিত হয়।');
  this.annotate('Spindle · sensory winding','স্পিন্ডল · সংবেদী প্যাঁচ',V(0,.75,.4),1,'The sensory ending wraps around specialized intrafusal fibers. Stretch-sensitive channels change its electrical activity.','বিশেষ ইন্ট্রাফিউসাল তন্তুর চারপাশে সংবেদী প্রান্ত প্যাঁচায়। প্রসারণসংবেদী চ্যানেলে বৈদ্যুতিক কাজ বদলায়।');
  this.annotate('Afferent to spinal cord','সুষুম্নার দিকে সংবেদী তন্তু',V(2.4,1.55,.2),2,'The afferent carries feedback toward spinal circuits. Parallel ascending pathways support conscious position sense and cerebellar coordination.','সংবেদী তন্তু সুষুম্নার সার্কিটে ফিরতি তথ্য দেয়। সমান্তরাল ঊর্ধ্বমুখী পথে অবস্থান বোঝা ও সেরিবেলামের সমন্বয় হয়।');
 }
 muscle(){
  const fibers=new THREE.Group();this.group.add(fibers);
  for(let row=0;row<3;row++)for(let i=0;i<5;i++){const p=V(0,(i-2)*.18,(row-1)*.22);const m=this.mesh(new THREE.CylinderGeometry(.081,.081,4.7,14),mat(i%2?'#c27c70':'#b76865'),p,2,fibers);m.rotation.z=Math.PI/2;for(let j=0;j<12;j++){const stripe=this.mesh(new THREE.TorusGeometry(.083,.014,5,12),mat('#e4a590'),V(-2.1+j*.38,p.y,p.z),2,fibers);stripe.rotation.y=Math.PI/2}}
  const shell=this.mesh(new THREE.CylinderGeometry(.69,.60,5.0,36,1,true,0,Math.PI*1.15),mat('#dba79a',{transparent:true,opacity:.20,side:THREE.DoubleSide,depthWrite:false}),V(),2);shell.rotation.z=Math.PI/2;
  for(const side of [-1,1]){const tendon=this.mesh(new THREE.CylinderGeometry(.30,.48,.65,24),mat('#dfd9c9'),V(side*2.6,0,0),2);tendon.rotation.z=Math.PI/2}
  const {curve}=this.tube([V(-3.1,1.8),V(-1.8,1.65),V(-.65,1.1),V(-.25,.52,.15)],.047,C.signal,0);this.flow(curve,{count:3,color:'#4aaeba',radius:.055,speed:.2});
  for(let i=0;i<5;i++){this.tube([V(-.3,.64,.15),V((i-2)*.23,.48,.21),V((i-2)*.25,.32,.25)],.023,C.signal,1);this.ellipsoid(V((i-2)*.25,.32,.25),[.10,.08,.12],C.input,1)}
  this.animations.push(t=>{fibers.scale.x=1-.10*Math.pow(Math.max(0,Math.sin(t*1.4-1)),2);fibers.scale.y=1+(1-fibers.scale.x)*.5});
  this.annotate('Motor axon','মোটর অ্যাক্সন',V(-1.8,1.55,.1),0,'A motor-neuron action potential arrives at the muscle’s end plate. The arriving signal is electrical within the axon.','মোটর নিউরনের অ্যাকশন পোটেনশিয়াল পেশির এন্ড প্লেটে আসে। অ্যাক্সনের ভেতর সংকেত বৈদ্যুতিক।');
  this.annotate('Motor end plate','মোটর এন্ড প্লেট',V(0,.5,.4),1,'Acetylcholine is released across the neuromuscular junction. Receptor activation initiates an electrical response in the muscle fiber.','স্নায়ু-পেশির সংযোগে অ্যাসিটাইলকোলিন মুক্ত হয়। রিসেপ্টর সক্রিয় হলে পেশিতন্তুতে বৈদ্যুতিক সাড়া তৈরি হয়।');
  this.annotate('Striated muscle fibers','ডোরাকাটা পেশিতন্তু',V(1.7,.0,.3),2,'Calcium inside the fiber permits actin and myosin to interact. Sarcomere shortening creates force; the animation exaggerates shortening to show it.','তন্তুর ক্যালসিয়াম অ্যাকটিন-মায়োসিনের যোগাযোগ সম্ভব করে। সারকোমিয়ার ছোট হয়ে বল তৈরি করে; বোঝাতে ছোট হওয়া বাড়িয়ে দেখানো।');
 }
 vascular(){
  const wall=this.mesh(new THREE.CylinderGeometry(.78,.78,6.4,48,1,true,0,Math.PI*1.32),mat('#d59a9f',{side:THREE.DoubleSide,roughness:.44}),V(),2);wall.rotation.z=Math.PI/2;
  for(let i=0;i<9;i++){const ring=this.mesh(new THREE.TorusGeometry(.78,.012,5,36,Math.PI*1.32),mat('#b26c79'),V(-3+i*.75,0,0),2);ring.rotation.y=Math.PI/2}
  const geometry=new THREE.SphereGeometry(1,20,14),pos=geometry.attributes.position;for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i),r=Math.sqrt(x*x+z*z);pos.setY(i,y*(.38+.58*r*r))}geometry.computeVertexNormals();
  const cells=new THREE.InstancedMesh(geometry,mat(C.blood,{roughness:.5}),18);cells.frustumCulled=false;this.group.add(cells);
  this.animations.push(t=>{const dummy=new THREE.Object3D();for(let i=0;i<18;i++){dummy.position.set(-3.2+((t*.12+i/18)%1)*6.4,Math.sin(i*2.4)*.34,Math.cos(i*1.7)*.34);dummy.scale.set(.25,.14,.24);dummy.rotation.set(i*.7,t*.3+i*.4,i*.51);dummy.updateMatrix();cells.setMatrixAt(i,dummy.matrix)}cells.instanceMatrix.needsUpdate=true});
  for(let i=0;i<3;i++){const {curve}=this.tube([V(-3.2,(i-1)*.3,.4),V(0,(i-1)*.3,.4),V(3.2,(i-1)*.3,.4)],.006,'#d2b380',1,{transparent:true,opacity:.18});this.flow(curve,{count:7,color:'#bf963f',radius:.028,speed:.13,offset:i*.17})}
  this.annotate('Blood flow','রক্তপ্রবাহ',V(-2,.55,.4),0,'Red blood cells carry oxygen bound to hemoglobin. Their movement here represents circulation, not an electrical signal traveling down a neuron.','লোহিত কণিকার হিমোগ্লোবিনে অক্সিজেন থাকে। তাদের চলন রক্তসঞ্চালন বোঝায়, নিউরনের বৈদ্যুতিক সংকেত নয়।');
  this.annotate('Molecules in plasma','প্লাজমায় অণু',V(.1,.15,.6),1,'Plasma carries dissolved nutrients and chemical signals such as hormones. Transport and arrival depend on circulation and receptor or transporter properties.','প্লাজমা পুষ্টি ও হরমোনের মতো রাসায়নিক সংকেত বহন করে। পৌঁছানো ও পরিবহন রক্তসঞ্চালন এবং রিসেপ্টর বা পরিবাহকের উপর নির্ভর করে।');
  this.annotate('Vessel wall','রক্তনালির দেয়াল',V(2.15,.65,.2),2,'Endothelial cells separate blood from tissue. At the blood–brain barrier, tight junctions and selective transport strongly restrict exchange.','এন্ডোথেলিয়াল কোষ রক্তকে টিস্যু থেকে আলাদা করে। ব্লাড-ব্রেন ব্যারিয়ারে টাইট জাংশন ও বাছাই করা পরিবহন বিনিময় নিয়ন্ত্রণ করে।');
 }
 contextBrain(){
  if(this.context){this.scene.remove(this.context);this.context.traverse(m=>m.material?.dispose())}
  this.context=new THREE.Group();this.context.position.set(2.3,-.64,-.1);this.context.scale.setScalar(.40);
  this.source.forEach(s=>{const m=new THREE.Mesh(s.geometry,mat('#c5d2d8',{roughness:.65}));m.name=s.name;m.userData={...s.userData};this.context.add(m)});this.scene.add(this.context);this.highlightContext();
 }
 highlightContext(){if(!this.context)return;this.context.visible=this.kind==='rhythm';const surfaces=['frontal','parietal','temporal','occipital'];this.context.children.forEach(m=>{const selected=this.kind==='rhythm'?surfaces.includes(m.userData.region):(this.step.regions||[]).includes(m.userData.region);m.material.color.set(selected?'#8ab8ba':'#d6dce1');m.material.emissive.set(selected?'#18424c':'#000000');m.material.emissiveIntensity=selected?.10:0})}
 translate(lang){
  this.lang=lang;if(!this.kind)return;const copy=labCopy[this.kind];if(this.failed){this.$('.lab-fallback').hidden=false;this.$('.lab-fallback').textContent=text('3D is unavailable. The signal trace and lesson explanation remain available.','ত্রিমাত্রিক দৃশ্য পাওয়া যাচ্ছে না। সংকেতের রেখা ও পাঠের ব্যাখ্যা দেখা যাবে।',lang)}
  this.$('.lab-title').textContent=copy.title[lang];this.$('.lab-scale').textContent=copy.scale[lang];
  this.$('.lab-motion').textContent=text(this.running?'Ⅱ Pause animation':'▶ Play animation',this.running?'Ⅱ অ্যানিমেশন থামাও':'▶ অ্যানিমেশন চালাও',lang);this.$('.lab-motion').setAttribute('aria-pressed',String(this.running));
  this.$('.lab-reset').textContent=text('↺ Reset view','↺ দৃশ্য রিসেট',lang);
  this.stage.setAttribute('aria-label',copy.title[lang]+'. '+text('Drag to rotate. Arrow keys rotate; plus and minus zoom.','টেনে বা তিরচিহ্ন দিয়ে ঘোরাও; যোগ-বিয়োগ চিহ্নে জুম।',lang));
  this.$('.lab-status').textContent=text('3D motion slowed · illustrative geometry','ত্রিমাত্রিক চলন ধীর · গঠন সরলীকৃত',lang);
  this.$('.lab-key').replaceChildren(...copy.legend.map((value,i)=>{const s=document.createElement('span');s.style.setProperty('--key-color',[C.cell,C.input,C.signal][i]);s.textContent=value[lang];return s}));
  this.labels.forEach(l=>l.element.textContent=lang==='bn'?l.bn:l.en);this.$('.lab-focusbar').replaceChildren(...copy.legend.map((value,i)=>{const b=document.createElement('button');b.textContent=String(i+1).padStart(2,'0')+' · '+value[lang];b.setAttribute('aria-pressed',String(i===this.feature));b.onclick=()=>this.selectFeature(i,true);return b}));
  this.$('.lab-experiments summary').textContent=['rhythm','hearing'].includes(this.kind)?text('Experiment with the mechanism','প্রক্রিয়াটি নিয়ে পরীক্ষা করো',lang):text('How this model works','এই মডেল যেভাবে কাজ করে',lang);this.$('.lab-model-note').textContent=copy.note[lang];
  this.$('.lab-trace').hidden=this.kind!=='rhythm'&&this.kind!=='neuron'&&this.kind!=='synapse';
  this.$('.lab-trace-title strong').textContent=text(this.kind==='rhythm'?'Synthetic scalp signal':this.kind==='neuron'?'Membrane potential at one node':'Postsynaptic response',this.kind==='rhythm'?'মাথার বাইরের শিক্ষামূলক সংকেত':this.kind==='neuron'?'একটি নোডে ঝিল্লির বিভব':'পোস্টসিন্যাপটিক সাড়া',lang);
  this.$('.lab-trace-title span').textContent=this.kind==='rhythm'?text('2 seconds · µV','২ সেকেন্ড · µV',lang):text(this.kind==='neuron'?'10 milliseconds · mV':'100 milliseconds · mV',this.kind==='neuron'?'১০ মিলিসেকেন্ড · mV':'১০০ মিলিসেকেন্ড · mV',lang);
  this.$('.lab-frequency-label').textContent=text(this.kind==='hearing'?'Sound pitch':'Rhythm frequency',this.kind==='hearing'?'শব্দের সুর':'ছন্দের কম্পাঙ্ক',lang);
  this.$('.lab-align-label').textContent=text('Timing alignment','সময়ের সমলয়তা',lang);
  this.$('.lab-frequency').setAttribute('aria-label',this.$('.lab-frequency-label').textContent);this.$('.lab-align').setAttribute('aria-label',this.$('.lab-align-label').textContent);
  this.$('.trace-key').hidden=this.kind!=='rhythm';this.$('.trace-key span:first-child').textContent=text('One population component','একটি উপাদান',lang);this.$('.trace-key span:last-child').textContent=text('Combined scalp signal','সম্মিলিত সংকেত',lang);
  this.$('.lab-context-caption').hidden=this.kind!=='rhythm';this.$('.lab-context-caption').textContent=text('Cortical context · enlarged above','কর্টেক্সের অবস্থান · ওপরে বড় করে',lang);
  this.$('.lab-parameters').hidden=!['rhythm','hearing'].includes(this.kind);this.$('.lab-align').closest('label').hidden=this.kind!=='rhythm';this.$('.lab-frequency').min=this.kind==='hearing'?100:.5;this.$('.lab-frequency').max=this.kind==='hearing'?8000:60;this.$('.lab-frequency').step=this.kind==='hearing'?50:.5;
  const all=document.createElement('button');all.className='lab-overview';all.textContent=text('Overview','সম্পূর্ণ দৃশ্য',lang);all.onclick=()=>this.selectFeature(-1,true);this.$('.lab-focusbar').prepend(all);this.drawTrace();this.selectFeature(this.feature??0);
 }
 updateParameters(){this.$('.lab-frequency').value=this.frequency;this.$('.lab-align').value=this.alignment*100;this.$('.lab-frequency-value').textContent=this.frequency+' Hz';this.$('.lab-frequency').setAttribute('aria-valuetext',this.frequency+' Hz');this.$('.lab-align').setAttribute('aria-valuetext',Math.round(this.alignment*100)+'%');this.$('.lab-align-value').textContent=Math.round(this.alignment*100)+'%';if(this.kind==='rhythm'){const band=this.frequency===(this.journey.concept.frequency||this.journey.topic.frequency||2)?bandNames[this.journey.concept.id]:null;this.$('.lab-title').textContent=band?band[this.lang==='bn'?1:0]+text(': cells → field → EEG',': কোষ → ক্ষেত্র → ইইজি',this.lang):labCopy.rhythm.title[this.lang]}this.drawTrace()}
 resize(){if(this.failed||!this.stage.clientWidth||!this.stage.clientHeight||this.w===this.stage.clientWidth&&this.h===this.stage.clientHeight)return;this.w=this.stage.clientWidth;this.h=this.stage.clientHeight;this.renderer.setSize(this.w,this.h);this.camera.aspect=this.w/this.h;this.camera.updateProjectionMatrix();this.reset()}
 focus(feature){if(this.failed)return;const before=this.camera.position.clone(),target=this.controls.target.clone();this.viewFocus=feature<0?'all':feature;this.reset();if(this.active&&!matchMedia('(prefers-reduced-motion: reduce)').matches){this.cameraGoal=this.camera.position.clone();this.targetGoal=this.controls.target.clone();this.camera.position.copy(before);this.controls.target.copy(target)}}
 reset(){if(this.failed)return;this.cameraGoal=null;this.targetGoal=null;this.settingView=true;const narrow=this.stage.clientWidth<540,focus=this.viewFocus??(narrow?0:null);const views=this.kind==='rhythm'?[[[-1.3,1.9,8.1],[-1.3,.45,0]],[[-1.2,3.2,8],[-1.2,1.3,0]],[[1.5,2.7,7.2],[1.25,1.4,0]]]:null;if(views&&typeof focus==='number'){this.camera.position.set(...views[focus][0]);this.controls.target.set(...views[focus][1])}else if(!views&&typeof focus==='number'&&this.labels[focus]){const p=this.labels[focus].position;this.controls.target.copy(p);this.camera.position.copy(p).add(V(0,1.5,7));}else{this.camera.position.set(0,2.4,narrow?11.8:9.7);this.controls.target.set(0,.35,0)}this.camera.lookAt(this.controls.target);this.controls.update();this.home={position:this.camera.position.clone(),target:this.controls.target.clone()};this.$('.lab-reset').hidden=true;this.settingView=false}
 changed(){if(!this.home||this.settingView||this.cameraGoal)return;this.$('.lab-reset').hidden=this.camera.position.distanceTo(this.home.position)<.02&&this.controls.target.distanceTo(this.home.target)<.02}
 drawTrace(){
  if(!this.kind||this.$('.lab-trace').hidden)return;const svg=this.$('.lab-trace svg'),rhythm=this.kind==='rhythm',y=value=>rhythm?72-value*.82:116-(value+85)*(this.kind==='synapse'?2.8:.83),ticks=rhythm?[60,0,-60]:this.kind==='synapse'?[-55,-70,-85]:[30,-20,-70];
  let html='';for(let row=0;row<5;row++)html+='<line x1="39" y1="'+(16+row*25)+'" x2="747" y2="'+(16+row*25)+'" class="trace-grid"/>';
  for(let i=0;i<=8;i++)html+='<line x1="'+(40+i*88)+'" y1="12" x2="'+(40+i*88)+'" y2="121" class="trace-grid"/>';
  const build=(component=false)=>Array.from({length:355},(_,i)=>{const t=i/354*2+this.clock/8;let value;if(rhythm){const signal=populationSignal(t,this.frequency,this.alignment);value=(component?signal.cells[0]:signal.mean)*55}else if(this.kind==='neuron')value=this.step.id==='membrane'?-70:spikeVoltage(t);else{const inhibitory=this.journey.concept.id==='gaba'||this.journey.concept.id==='inhibition';value=-70+(inhibitory?-8:12)*Math.exp(-((((t%1)-.55)/.14)**2))}return (i?'L':'M')+(40+i*2).toFixed(1)+','+y(value).toFixed(2)}).join(' ');
  if(rhythm)html+='<path d="'+build(true)+'" class="trace-component"/>';
  html+='<path d="'+build()+'" class="trace-signal"/><text x="2" y="'+(y(ticks[0])+4)+'">'+(ticks[0]>0?'+':'')+ticks[0]+'</text><text x="7" y="'+(y(ticks[1])+4)+'">'+ticks[1]+'</text><text x="2" y="'+(y(ticks[2])+4)+'">'+ticks[2]+'</text><text x="40" y="141">0</text><text x="385" y="141">'+(rhythm?'1 s':this.kind==='neuron'?'5 ms':'50 ms')+'</text><text x="724" y="141">'+(rhythm?'2 s':this.kind==='neuron'?'10 ms':'100 ms')+'</text>';
  svg.innerHTML=html;svg.setAttribute('aria-label',text(rhythm?'Synthetic EEG trace; frequency '+this.frequency+' hertz and timing alignment '+Math.round(this.alignment*100)+' percent.':'Illustrative membrane-voltage trace.',rhythm?'শিক্ষামূলক ইইজি রেখা; কম্পাঙ্ক '+this.frequency+' হার্টজ।':'ঝিল্লির বিভবের শিক্ষামূলক রেখা।',this.lang));
 }
 advance(dt,running=this.running){if(running)this.clock+=dt;const t=this.clock;
  this.cells.forEach((cell,i)=>{const phase=this.kind==='rhythm'?TAU*this.frequency*t/8+TAU*i/Math.max(1,this.cells.length)*(1-this.alignment):t*2-i*.4;const intensity=.1+.55*(.5+.5*Math.sin(phase));cell.material.emissiveIntensity=intensity;cell.soma.material.emissive.set(C.input);cell.soma.material.emissiveIntensity=intensity*.45});
  this.animations.forEach(fn=>fn(t));const dummy=new THREE.Object3D();
  this.flows.forEach(f=>{for(let i=0;i<f.count;i++){const u=((t*f.speed+i/f.count+f.offset)%1+1)%1;dummy.position.copy(f.curve.getPoint(u));dummy.scale.setScalar(.65+.35*Math.sin(u*Math.PI));dummy.updateMatrix();f.mesh.setMatrixAt(i,dummy.matrix)}f.mesh.instanceMatrix.needsUpdate=true});
 }
 frame(now){
  if(!this.active||this.failed||document.hidden||!this.stage.clientWidth){this.last=0;return}const dt=this.last?Math.min(.05,(now-this.last)/1000):0;this.last=now;
  if(this.cameraGoal){const amount=1-Math.exp(-dt*6);this.camera.position.lerp(this.cameraGoal,amount);this.controls.target.lerp(this.targetGoal,amount);if(this.camera.position.distanceTo(this.cameraGoal)<.012){this.camera.position.copy(this.cameraGoal);this.controls.target.copy(this.targetGoal);this.cameraGoal=null;this.targetGoal=null}}this.controls.update();this.camera.updateMatrixWorld();this.group?.updateMatrixWorld();
  this.advance(dt);
  this.renderer.render(this.scene,this.camera);this.projectLabels();
  if(!this.lastTrace||now-this.lastTrace>66){this.drawTrace();this.lastTrace=now}
 }
 projectLabels(){
  const w=this.stage.clientWidth,h=this.stage.clientHeight,boxes=[];this.leaders.setAttribute('viewBox','0 0 '+w+' '+h);
  for(const l of this.labels){const p=l.position.clone().project(this.camera);const visible=p.z>-1&&p.z<1&&p.x>-.96&&p.x<.96&&p.y>-.94&&p.y<.94&&(this.stage.clientWidth>=540||this.feature===-1||l.feature===this.feature); l.element.hidden=!visible;l.line.style.display=visible?'':'none';if(!visible)continue;let x=(p.x*.5+.5)*w,y=(-p.y*.5+.5)*h,top=y-48;const width=Math.min(w<540?145:190,l.element.offsetWidth||150);let left=clamp(x-width/2,8,w-width-8);top=clamp(top,12,h-56);for(const b of boxes)if(left<b.right+7&&left+width>b.left-7&&Math.abs(top-b.top)<38)top=clamp(b.top+43,12,h-46);boxes.push({left,right:left+width,top});l.element.style.left=left+'px';l.element.style.top=top+'px';l.line.setAttribute('x1',left+width/2);l.line.setAttribute('y1',top+30);l.line.setAttribute('x2',x);l.line.setAttribute('y2',y)}
 }
}
