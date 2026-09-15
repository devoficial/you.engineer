// Deterministic teaching models. They are not fitted to an individual or recording.
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function waveSamples({frequency=10,amplitude=30,phase=0,mixed=false,sync=false,noise=0,variant='',trials=1}={}){
 const samples=[],secondary=[],sum=[];
 for(let i=0;i<512;i++){
  const t=i/512,a=amplitude*Math.sin(2*Math.PI*frequency*t),b=amplitude*Math.sin(2*Math.PI*frequency*t+phase*Math.PI/180);
  const n=noise*(Math.sin(i*12.9898)*.48+Math.sin(i*4.133)*.32+Math.cos(i*.733)*.2);
  let y=a+(mixed?amplitude*.35*Math.sin(2*Math.PI*22*t)+amplitude*.2*Math.sin(2*Math.PI*6*t):0)+n;
  if(variant==='artifact')y+=65*Math.exp(-Math.pow((t-.3)/.04,2));
  if(variant==='seizure')y=amplitude*Math.sin(2*Math.PI*3*t)+80*Math.exp(-Math.pow((t%(.333)-.08)/.01,2));
  if(variant==='erp')y=18*Math.exp(-Math.pow((t-.32)/.055,2))-8*Math.exp(-Math.pow((t-.16)/.04,2))+n/Math.sqrt(trials);
  samples.push([t,y]);secondary.push([t,b]);sum.push([t,a+b]);
 }
 return {samples,secondary,sum,sync};
}
export function spectrum(samples,maxHz=80){
 return Array.from({length:maxHz+1},(_,f)=>{let re=0,im=0;for(const [t,v] of samples){re+=v*Math.cos(2*Math.PI*f*t);im-=v*Math.sin(2*Math.PI*f*t)}return [f,2*(re*re+im*im)/samples.length**2]});
}
export function potentialSamples(input=20){
 const knots=[[0,-70],[1,-70],[2,-70+Math.min(input,15)],[2.6,30],[3.5,-78],[4.5,-80],[7,-70],[10,-70]];
 return Array.from({length:301},(_,i)=>{const t=i/30;if(input<15)return[t,-70+input*Math.exp(-Math.pow((t-2)/.7,2))];let j=0;while(j<knots.length-2&&t>knots[j+1][0])j++;const a=knots[j],b=knots[j+1];return [t,a[1]+(b[1]-a[1])*clamp((t-a[0])/(b[0]-a[0]),0,1)]});
}
export function synapseSamples(strength=8,inhibition=0){
 const psp=(t,start)=>t<start?0:(1-Math.exp(-(t-start)/2))*Math.exp(-(t-start)/14);
 return Array.from({length:301},(_,i)=>{const t=i/5;return[t,-70+strength*(psp(t,5)+psp(t,12)+psp(t,19))-inhibition*psp(t,15)]});
}
export function learningSamples(rate=.15,reward=1,initial=0){let prediction=initial;return Array.from({length:31},(_,trial)=>{const row=[trial,prediction];prediction+=rate*(reward-prediction);return row})}
export function lifSamples(input=2,{duration=300,dt=.5,tau=20,resistance=10,rest=-65,threshold=-50,reset=-65,refractory=2}={}){
 let v=rest,refractoryUntil=0;const samples=[],spikes=[];
 for(let t=0;t<=duration;t+=dt){if(t<refractoryUntil){samples.push([t,reset]);continue}v+=dt*(-(v-rest)+resistance*input)/tau;if(v>=threshold){samples.push([t,20]);spikes.push(t);v=reset;refractoryUntil=t+refractory}else samples.push([t,v])}
 return {samples,spikes,rate:spikes.length/(duration/1000)};
}
export const sleepStages=[['Wake','জাগরণ'],['N1','এন১'],['N2','এন২'],['N3','এন৩'],['REM','রেম']];
export const sleepTimeline=[[0,0],[.15,1],[.35,2],[.6,3],[1.0,2],[1.25,4],[1.5,2],[1.9,3],[2.3,2],[2.7,4],[3,2],[3.6,3],[4,2],[4.4,4],[4.8,2],[5.4,4],[5.8,2],[6.3,4],[6.8,2],[7.2,4],[7.7,0],[8,0]];
export function sleepAt(hours){return sleepTimeline.reduce((last,p)=>p[0]<=hours?p:last,sleepTimeline[0])[1]}
export function feedbackSamples(gain=.6){return Array.from({length:101},(_,i)=>{const t=i/10;return [t,Math.exp(-gain*t)]})}
export function decodeSamples(noise=.2){return Array.from({length:81},(_,i)=>{const t=i/10,target=t<4?-.65:.65;return[t,clamp(target+noise*(Math.sin(i*2.8)+Math.cos(i*1.72))*.6,-1,1)]})}
