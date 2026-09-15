import {waveSamples,spectrum,potentialSamples,synapseSamples,learningSamples,lifSamples,sleepTimeline,sleepAt,sleepStages,feedbackSamples,decodeSamples,clamp} from './simulations.js';
import {text} from './lessons/shared.js';
const C=(id,en,bn,min,max,step,value,unit='')=>({id,label:text(en,bn),min,max,step,value,unit});
export function controlsFor(scene,lesson={}){
 switch(scene){
  case 'glia':return [];
  case 'wave':return [C('frequency','Frequency','কম্পাঙ্ক',.5,80,.5,lesson.frequency||10,'Hz'),C('amplitude','Amplitude','বিস্তার',5,60,1,30,'µV'),...(lesson.sync?[C('phase','Phase difference','দশার পার্থক্য',0,180,5,0,'°')]:[])];
  case 'eeg':return [C('frequency','Dominant rhythm','প্রধান ছন্দ',1,45,1,lesson.frequency||10,'Hz'),C('noise','Noise amplitude','নয়েজের বিস্তার',0,60,1,20,'µV'),...(lesson.variant==='erp'?[C('trials','Trials averaged','গড় করা ট্রায়াল',1,100,1,1)]:[])];
  case 'potential':return [C('input','Depolarizing input','ডিপোলারাইজিং ইনপুট',0,30,1,20,'mV')];
  case 'synapse':return [C('strength','Excitatory input','উত্তেজক ইনপুট',0,20,1,8,'mV'),C('inhibition','Inhibitory input','নিরোধক ইনপুট',0,20,1,lesson.polarity===-1?16:0,'mV')];
  case 'neuron':return [C('progress','Signal position','সংকেতের অবস্থান',0,100,1,0,'%')];
  case 'plasticity':return [C('rate','Rate of change','পরিবর্তনের হার',.02,.3,.01,.1),C('trials','Repeated activity','পুনরাবৃত্ত কার্যকলাপ',0,30,1,15)];
  case 'learning':return [C('rate','Learning rate','শেখার হার',.02,.6,.02,.16),C('reward','Outcome value','ফলের মান',0,1,.05,1)];
  case 'reward':return [C('expected','Expected outcome','প্রত্যাশিত ফল',0,1,.05,.5),C('reward','Actual outcome','আসল ফল',0,1,.05,1)];
  case 'feedback':return [C('gain','Feedback strength','ফিরতি নিয়ন্ত্রণের শক্তি',.1,1.5,.1,.6)];
  case 'metabolism':return [C('supply','Relative supply','আপেক্ষিক সরবরাহ',.1,1.5,.1,1),C('demand','Relative demand','আপেক্ষিক চাহিদা',.1,1.5,.1,.8)];
  case 'sleep':return [C('hours','Move through the night','রাতের সময় বেছে নাও',0,8,.05,0,'h')];
  case 'imaging':return [C('slice','Section position','কাটার সমতলের অবস্থান',-1,1,.05,0)];
  case 'layers':return [C('separation','Layer separation','স্তরের দূরত্ব',0,1,.05,.7)];
  case 'vascular':return [C('flow','Flow marker speed','প্রবাহচিহ্নের গতি',.1,1,.1,.6)];
  case 'barrier':return [C('transport','Transported fraction','পরিবাহিত অংশ',0,1,.05,.35)];
  case 'development':return [C('progress','Illustrative stage','উদাহরণের পর্যায়',0,1,.05,.4)];
  case 'aging':return [C('variation','Illustrative variation','উদাহরণের ভিন্নতা',0,1,.05,.3)];
  case 'attention':return [C('distractors','Distractor count','বিভ্রান্তিকারীর সংখ্যা',0,24,1,12)];
  case 'bci':return [C('noise','Noise level','নয়েজের মাত্রা',0,1,.05,.2)];
  case 'computational':return [C('input','Input current','ইনপুট প্রবাহ',0,4,.1,2,'nA')];
  case 'lateral':return [C('communication','Connection emphasis','সংযোগের গুরুত্ব',0,1,.05,.6)];
  default:return [C('progress','Follow the pathway','পথ অনুসরণ করো',0,100,1,0,'%')];
 }
}
export function chartModel(scene,lesson,p,lang='en'){
 const T=(en,bn)=>lang==='bn'?bn:en;
 const line=(points,label,color='#2b6fc3')=>({points,label,color});
 const common={xLabel:T('Time','সময়'),yLabel:T('Illustrative value','উদাহরণের মান'),lines:[],note:''};
 if(scene==='wave'||scene==='eeg'){
  const w=waveSamples({frequency:p.frequency,amplitude:p.amplitude||30,phase:p.phase||0,mixed:scene==='eeg'||lesson.mixed,sync:lesson.sync,noise:p.noise||0,variant:lesson.variant,trials:p.trials||1});
  return {...common,xLabel:T('Time (s)','সময় (s)'),yLabel:T('Voltage (µV)','ভোল্টেজ (µV)'),domain:[-200,200],lines:lesson.sync?[line(w.samples,'A'),line(w.secondary,'B','#bd7751'),line(w.sum,T('A + B','A + B'),'#298c77')]:[line(w.samples,T('Synthetic signal','কৃত্রিম সংকেত'))],spectrum:scene==='eeg'?spectrum(w.samples):null,note:lesson.sync?T('Only the phase changes; both waves keep the same frequency and amplitude.','শুধু দশা বদলায়; দুই তরঙ্গের কম্পাঙ্ক ও বিস্তার একই থাকে।'):T('Synthetic signal. Brainwave bands have approximate, convention-dependent boundaries.','কৃত্রিম সংকেত। তরঙ্গের সীমা আনুমানিক এবং সংজ্ঞাভেদে বদলায়।')};
 }
 if(scene==='potential')return {...common,xLabel:T('Time (ms)','সময় (ms)'),yLabel:T('Membrane voltage (mV)','ঝিল্লি ভোল্টেজ (mV)'),domain:[-90,40],lines:[line(potentialSamples(p.input),T('Membrane potential','ঝিল্লি বিভব'))],threshold:-55,note:p.input>=15?T('Threshold crossed: a full illustrative spike is generated.','থ্রেশহোল্ড পেরিয়েছে: পূর্ণ উদাহরণ-স্পাইক তৈরি হয়েছে।'):T('Below threshold: the input produces a graded response.','থ্রেশহোল্ডের নিচে: ইনপুটে গ্রেডেড প্রতিক্রিয়া হয়েছে।')};
 if(scene==='synapse')return {...common,xLabel:T('Time (ms)','সময় (ms)'),yLabel:T('Membrane voltage (mV)','ঝিল্লি ভোল্টেজ (mV)'),domain:[-90,-35],lines:[line(synapseSamples(p.strength,p.inhibition),T('Combined inputs','মিলিত ইনপুট'))],threshold:-55,note:T('A subthreshold summation model. Reaching the dashed reference does not simulate a full spike here.','থ্রেশহোল্ডের নিচের যোগফলের মডেল। ড্যাশরেখায় পৌঁছালেও এখানে পূর্ণ স্পাইক তৈরি করা হয় না।')};
 if(scene==='plasticity'){const initial=lesson.direction===-1?.8:.2,target=lesson.direction===-1?.2:.8;return {...common,xLabel:T('Activity repetitions','কার্যকলাপের পুনরাবৃত্তি'),yLabel:T('Relative connection strength','আপেক্ষিক সংযোগশক্তি'),domain:[0,1],lines:[line(learningSamples(p.rate,target,initial),T('Synaptic weight','সিন্যাপসের ওজন'))],cursor:p.trials,note:T('Illustrative adaptation curve, not a biological learning-rate estimate.','মানিয়ে নেওয়ার উদাহরণরেখা; জৈবিক শেখার হারের অনুমান নয়।')}}
 if(scene==='learning')return {...common,xLabel:T('Trial','ট্রায়াল'),yLabel:T('Predicted outcome','পূর্বানুমিত ফল'),domain:[0,1],lines:[line(learningSamples(p.rate,p.reward),T('Prediction','পূর্বানুমান'))],note:T('Update = learning rate × (outcome − prediction).','পরিবর্তন = শেখার হার × (ফল − পূর্বানুমান)।')};
 if(scene==='reward')return {...common,xLabel:T('Outcome comparison','ফলের তুলনা'),yLabel:T('Relative value','আপেক্ষিক মান'),bars:[[T('Expected','প্রত্যাশা'),p.expected],[T('Actual','আসল'),p.reward],[T('Error','ভুল'),p.reward-p.expected]],domain:[-1,1],note:T('Prediction error = actual − expected. This is a model, not a dopamine measurement.','পূর্বানুমানের ভুল = আসল − প্রত্যাশা। এটি মডেল, ডোপামিনের মাপ নয়।')};
 if(scene==='feedback')return {...common,xLabel:T('Model time','মডেলের সময়'),yLabel:T('Deviation from target','লক্ষ্য থেকে বিচ্যুতি'),domain:[0,1],lines:[line(feedbackSamples(p.gain),T('Deviation','বিচ্যুতি'))],note:T('Stronger negative feedback reduces the deviation faster in this simple model.','এই সরল মডেলে বেশি ঋণাত্মক প্রতিক্রিয়া দ্রুত বিচ্যুতি কমায়।')};
 if(scene==='metabolism')return {...common,bars:[[T('Supply','সরবরাহ'),p.supply],[T('Demand','চাহিদা'),p.demand],[T('Balance','ভারসাম্য'),p.supply-p.demand]],domain:[-1.5,1.5],xLabel:T('Conceptual balance','ধারণাগত ভারসাম্য'),yLabel:T('Relative units','আপেক্ষিক একক'),note:T('An energy-balance illustration; these controls do not predict physiological thresholds.','শক্তির ভারসাম্যের চিত্র; এই নিয়ন্ত্রণে শরীরের থ্রেশহোল্ড অনুমান করা হয় না।')};
 if(scene==='sleep'){const level=[4,2,1,0,3];const points=[];sleepTimeline.forEach((v,i)=>{if(i)points.push([v[0],level[sleepTimeline[i-1][1]]]);points.push([v[0],level[v[1]]])});return {...common,xLabel:T('Hours into an illustrative night','নমুনা রাতের ঘণ্টা'),yLabel:T('Sleep stage','ঘুমের পর্যায়'),domain:[-.5,4.5],lines:[line(points,T('Hypnogram','হিপনোগ্রাম'))],cursor:p.hours,ticks:sleepStages.map((v,i)=>[level[i],v[lang==='bn'?1:0]]),note:T('Selected stage: ','নির্বাচিত পর্যায়: ')+sleepStages[sleepAt(p.hours)][lang==='bn'?1:0]}}
 if(scene==='computational'){const model=lifSamples(p.input);return {...common,xLabel:T('Time (ms)','সময় (ms)'),yLabel:T('Voltage (mV)','ভোল্টেজ (mV)'),domain:[-75,25],lines:[line(model.samples,T('LIF neuron','এলআইএফ নিউরন'))],threshold:-50,note:T(`${model.spikes.length} spikes in 300 ms · ${model.rate.toFixed(1)} spikes/s. LIF event markers are not biological spike shapes.`, `৩০০ ms-এ ${model.spikes.length}টি স্পাইক · ${model.rate.toFixed(1)} স্পাইক/s। এলআইএফের চিহ্ন আসল স্পাইকের আকৃতি নয়।`)}}
 if(scene==='bci')return {...common,xLabel:T('Model time','মডেলের সময়'),yLabel:T('Decoded direction','নির্ণীত দিক'),domain:[-1.2,1.2],lines:[line(decodeSamples(p.noise),T('Noisy decoder output','নয়েজযুক্ত ডিকোডার আউটপুট'))],threshold:0,note:T('Synthetic left/right command. No device, brain recording or personal data is connected.','কৃত্রিম বাম/ডান নির্দেশ। কোনও যন্ত্র, মস্তিষ্কের রেকর্ড বা ব্যক্তিগত তথ্য যুক্ত নেই।')};
 return null;
}
const NS='http://www.w3.org/2000/svg';
function el(name,attrs={},value){const e=document.createElementNS(NS,name);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,String(v)));if(value!==undefined)e.textContent=value;return e}
export function drawChart(host,model,lang='en'){
 host.replaceChildren();host.hidden=!model;if(!model)return;
 const svg=el('svg',{viewBox:'0 0 720 250',role:'img','aria-label':`${model.yLabel} / ${model.xLabel}`});const W=720,H=250,L=66,R=20,B=47,T=26;
 const ys=model.domain||[-1,1],xMax=Math.max(1,...model.lines.flatMap(l=>l.points.map(p=>p[0])));const X=x=>L+x/xMax*(W-L-R),Y=y=>H-B-(y-ys[0])/(ys[1]-ys[0])*(H-B-T);
 const ticks=model.ticks||Array.from({length:5},(_,i)=>{const y=ys[0]+i*(ys[1]-ys[0])/4;return[y,Number(y.toFixed(1))]});
 ticks.forEach(([y,label])=>{svg.append(el('line',{x1:L,y1:Y(y),x2:W-R,y2:Y(y),stroke:'#e1e8f0'}),el('text',{x:L-9,y:Y(y)+4,'text-anchor':'end',class:'chart-label'},label))});
 svg.append(el('text',{x:L,y:15,class:'chart-label'},model.yLabel),el('text',{x:W-R,y:H-6,'text-anchor':'end',class:'chart-label'},model.xLabel));
 if(model.bars){const width=(W-L-R)/model.bars.length;model.bars.forEach(([label,v],i)=>{const x=L+i*width+width*.3;svg.append(el('rect',{x,y:Math.min(Y(0),Y(v)),width:width*.4,height:Math.max(2,Math.abs(Y(0)-Y(v))),rx:3,fill:i===2?'#d59a65':'#3675be'}),el('text',{x:x+width*.2,y:H-B+19,'text-anchor':'middle',class:'chart-label'},label),el('text',{x:x+width*.2,y:Math.min(Y(0),Y(v))-8,'text-anchor':'middle',class:'chart-label'},Number(v.toFixed(2))))})}
 else{
  for(let i=0;i<5;i++){const x=i*xMax/4;svg.append(el('text',{x:X(x),y:H-B+20,'text-anchor':'middle',class:'chart-label'},Number(x.toFixed(2))))}
  model.lines.forEach(l=>svg.append(el('path',{d:l.points.map(([x,y],i)=>`${i?'L':'M'}${X(x).toFixed(2)},${Y(clamp(y,ys[0],ys[1])).toFixed(2)}`).join(' '),stroke:l.color,'stroke-width':2,fill:'none'})));
 }
 if(model.threshold!==undefined)svg.append(el('line',{x1:L,x2:W-R,y1:Y(model.threshold),y2:Y(model.threshold),stroke:'#b97649','stroke-dasharray':'5 5'}));
 if(model.cursor!==undefined)svg.append(el('line',{x1:X(model.cursor),x2:X(model.cursor),y1:T,y2:H-B,stroke:'#b97649','stroke-width':2}));
 host.append(svg);const legend=document.createElement('div');legend.className='chart-legend';for(const l of model.lines){const span=document.createElement('span');span.textContent=l.label;span.style.setProperty('--line-color',l.color);legend.append(span)}host.append(legend);
 if(model.spectrum){const s=document.createElement('div');s.className='spectrum';const max=Math.max(...model.spectrum.map(v=>v[1]),1);for(const [f,power] of model.spectrum){const b=document.createElement('span');b.style.height=Math.max(1,power/max*60)+'px';b.title=`${f} Hz: ${power.toFixed(1)} µV²`;s.append(b)}host.append(s);const cap=document.createElement('small');cap.textContent=lang==='bn'?'পাওয়ার স্পেকট্রাম · ০–৮০ Hz · বার উচ্চতা আপেক্ষিক':'Power spectrum · 0–80 Hz · relative bar heights';host.append(cap)}
 const note=document.createElement('p');note.className='chart-note';note.textContent=model.note;host.append(note);
}
