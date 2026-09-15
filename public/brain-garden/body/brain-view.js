import * as THREE from 'three';
import {OrbitControls} from '../vendor/OrbitControls.js';
import {matchesStructure} from './catalogue.js';
const colors={sense:'#287baf',brain:'#8055ac',motor:'#c57730',regulate:'#238472',blood:'#b94d61',measure:'#587188'};
// Approximate locators only for structures absent from the source mesh; never relabel a nearby surface.
export const loci={
 amygdala:{points:[[.50,-.15,.55],[-.50,-.15,.55]],scale:[.13,.11,.14]},
 striatum:{points:[[.46,.32,.38],[-.46,.32,.38]],scale:[.18,.30,.28]},
 accumbens:{points:[[.27,-.02,.55],[-.27,-.02,.55]],scale:[.09,.08,.1]},
 vta:{points:[[0,-.28,.14]],scale:[.07,.08,.1]},
 'substantia-nigra':{points:[[.15,-.28,.20],[-.15,-.28,.20]],scale:[.1,.06,.12]},
 olfactory:{points:[[.15,-.20,1.15],[-.15,-.20,1.15]],scale:[.06,.05,.18]},
 callosum:{points:[[0,.65,-.3],[0,.77,.15],[0,.63,.65]],scale:[.06,.1,.4]}
};
const matches=(mesh,step)=>mesh.userData.locus?(step.loci||[]).includes(mesh.userData.locus):(step.meshes||[]).some(t=>matchesStructure(mesh.name,t))||(step.regions||[]).includes(mesh.userData.region);
export class PathwayBrain{
 constructor(host,onSelect=()=>{}){
  this.host=host;this.onSelect=onSelect;this.meshes=[];this.locators=[];this.active=false;this.innerOverride=null;this.phase=0;
  try{this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true})}catch{this.failed=true;return}
  host.prepend(this.renderer.domElement);this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.setClearColor(0xffffff,0);this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=.9;
  this.scene=new THREE.Scene();this.scene.add(new THREE.HemisphereLight(0xffffff,0x647789,2.2));const key=new THREE.DirectionalLight(0xffffff,2.3);key.position.set(4,6,5);this.scene.add(key);
  this.camera=new THREE.PerspectiveCamera(35,1,.1,100);this.camera.position.set(5.2,2,4.2);this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.enableDamping=true;this.controls.enablePan=false;this.controls.minDistance=4;this.controls.maxDistance=13;
  this.ray=new THREE.Raycaster();this.pointer=new THREE.Vector2();let down;
  this.renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY]});this.renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>6)return;down=null;const r=this.renderer.domElement.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);this.ray.setFromCamera(this.pointer,this.camera);const h=this.ray.intersectObjects([...this.meshes,...this.locators].filter(m=>m.visible),false)[0];if(h){const index=this.steps.findIndex(s=>matches(h.object,s));if(index>=0)this.onSelect(index)}});
  host.addEventListener('keydown',e=>{if(e.target!==host||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-'].includes(e.key))return;e.preventDefault();const s=new THREE.Spherical().setFromVector3(this.camera.position);if(['+','=','-'].includes(e.key))s.radius=THREE.MathUtils.clamp(s.radius*(e.key==='-'?1.1:.9),4,13);else{s.theta+=e.key==='ArrowLeft'?.15:e.key==='ArrowRight'?-.15:0;s.phi=THREE.MathUtils.clamp(s.phi+(e.key==='ArrowUp'?-.15:e.key==='ArrowDown'?.15:0),.1,Math.PI-.1)}this.camera.position.setFromSpherical(s);this.controls.update()});
  this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(host);this.renderer.setAnimationLoop(now=>this.frame(now));
  this.renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();this.failed=true;host.dispatchEvent(new CustomEvent('body-brain-error'))});
 }
 resize(){if(this.failed||!this.host.clientWidth||!this.host.clientHeight)return;this.renderer.setSize(this.host.clientWidth,this.host.clientHeight);this.camera.aspect=this.host.clientWidth/this.host.clientHeight;this.camera.updateProjectionMatrix()}
 setBrain(source){if(this.failed)return;if(this.group){this.scene.remove(this.group);this.meshes.forEach(m=>m.material.dispose())}this.group=new THREE.Group();this.meshes=source.map(m=>{const c=new THREE.Mesh(m.geometry,new THREE.MeshStandardMaterial({color:'#c6d2dd',roughness:.73,side:THREE.DoubleSide}));c.name=m.name;c.userData={...m.userData};this.group.add(c);return c});this.scene.add(this.group);
  if(!this.locatorGroup){this.locatorGroup=new THREE.Group();for(const [id,def] of Object.entries(loci)){for(const point of def.points){const marker=new THREE.Mesh(new THREE.SphereGeometry(1,16,10),new THREE.MeshBasicMaterial({color:colors.brain,wireframe:true,depthTest:false}));marker.position.set(...point);marker.scale.set(...def.scale);marker.name='schematic:'+id;marker.userData.locus=id;marker.renderOrder=4;marker.visible=false;this.locators.push(marker);this.locatorGroup.add(marker)}}this.scene.add(this.locatorGroup)}
  if(this.steps)this.select(this.steps,this.index||0)}
 select(steps,index){this.steps=steps;this.index=index;this.step=steps[index];if(this.failed)return;const visited=steps.slice(0,index);this.inner=this.innerOverride??Boolean(this.step.inner);this.highlighted=[];
  this.meshes.forEach(m=>{const selected=matches(m,this.step);const was=visited.some(s=>matches(m,s));m.material.color.set(selected?colors[this.step.phase]||colors.brain:was?'#a3bbcf':'#d1dbe4');m.material.emissive.set(selected?'#253c51':'#000000');m.material.emissiveIntensity=selected?.24:0;m.material.transparent=false;m.material.opacity=1;m.visible=!this.inner||selected||!['frontal','parietal','temporal','occipital','white'].includes(m.userData.region);if(selected)this.highlighted.push(m.name)});
  this.locators.forEach(m=>{m.visible=matches(m,this.step);m.material.color.set(colors[this.step.phase]||colors.brain);if(m.visible)this.highlighted.push(m.name)});
  if(this.connection){this.scene.remove(this.connection);this.connection.geometry.dispose();this.connection.material.dispose();this.connection=null}if(this.marker){this.scene.remove(this.marker);this.marker.geometry.dispose();this.marker.material.dispose();this.marker=null}
  const point=idx=>{const list=this.meshes.filter(m=>matches(m,steps[idx]));if(steps[idx].loci?.length){const points=this.locators.filter(m=>matches(m,steps[idx])).map(m=>m.position);if(points.length)return points.reduce((v,p)=>v.add(p),new THREE.Vector3()).divideScalar(points.length)}if(!list.length)return null;const box=new THREE.Box3();list.forEach(m=>{if(!m.geometry.boundingBox)m.geometry.computeBoundingBox();box.union(m.geometry.boundingBox)});return box.getCenter(new THREE.Vector3())};
  const to=point(index);const targetKey=this.step.id+JSON.stringify(this.step.meshes||this.step.regions||this.step.loci||[]);if(to&&targetKey!==this.targetKey&&this.innerOverride===null){const side=to.x<-.08?-1:1;this.camera.position.set(side*5.6,2.5,to.z<-.25?-4.6:to.z>.25?4.6:2.4);this.controls.target.set(0,0,0);this.controls.update()}this.targetKey=to?targetKey:null;let from=null;for(let i=index-1;i>=0&&!from;i--)from=point(i);
  if(to&&from&&to.distanceTo(from)>.06){const mid=from.clone().lerp(to,.5).add(new THREE.Vector3(0,.45,.2));this.curve=new THREE.CatmullRomCurve3([from,mid,to]);this.connection=new THREE.Mesh(new THREE.TubeGeometry(this.curve,30,.014,6,false),new THREE.MeshBasicMaterial({color:colors[this.step.phase]||colors.brain,depthTest:false}));this.connection.renderOrder=2;this.scene.add(this.connection);this.marker=new THREE.Mesh(new THREE.SphereGeometry(.035,12,8),new THREE.MeshBasicMaterial({color:'#173d64',depthTest:false}));this.marker.renderOrder=3;this.scene.add(this.marker)}this.resize();
 }
 toggleInner(){this.innerOverride=!this.inner;if(this.steps)this.select(this.steps,this.index)}
 reset(){if(this.failed)return;this.camera.position.set(5.2,2,4.2);this.controls.target.set(0,0,0);this.controls.update();this.innerOverride=null;if(this.steps)this.select(this.steps,this.index)}
 frame(now){if(!this.active||this.failed||document.hidden||!this.host.clientWidth)return;this.controls.update();if(this.marker)this.marker.position.copy(this.curve.getPoint(this.playing?(now%3000)/3000:1));this.renderer.render(this.scene,this.camera)}
}
export {colors};
